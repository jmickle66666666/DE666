use std::path::PathBuf;
use std::fs::File;
use std::fs::read_dir;
use std::io::prelude::*;
use base64::prelude::*;

use http::Request;
use tao::{
    dpi::LogicalSize,
    event::{Event, WindowEvent},
    event_loop::{ControlFlow, EventLoopBuilder},
    window::{Fullscreen, WindowBuilder, Icon},
};
use wry::{
    http::{header::CONTENT_TYPE, Response},
    WebViewBuilder,
};
use image::io::Reader as ImageReader;

#[cfg(target_os = "linux")]
use {tao::platform::unix::WindowExtUnix, wry::WebViewBuilderExtUnix};

#[derive(Debug)]
struct EventMessage {
    message_type : String,
    data : String
}

fn event_message(message_type: &str, data: &str) -> EventMessage {
    return EventMessage {
        message_type: message_type.to_string(),
        data: data.to_string(),
    }
}

fn main() -> wry::Result<()> {
    let event_loop = EventLoopBuilder::with_user_event().build();
    let window = Box::leak(Box::new(WindowBuilder::new().build(&event_loop).unwrap()));

    use std::env;

    match env::current_exe() {
        Ok(exe_path) => window.set_title(exe_path.file_name().unwrap().to_str().unwrap()),
        Err(e) => println!("failed to get current exe path: {e}"),
    };

    #[cfg(not(target_os = "linux"))]
    let builder = WebViewBuilder::new(window);
    #[cfg(target_os = "linux")]
    let builder = {
        let vbox = window.default_vbox().unwrap();
        WebViewBuilder::new_gtk(vbox)
    };

    let event_proxy = Box::leak(Box::new(event_loop.create_proxy()));

    // let _webview : &mut wry::WebView;
    let _webview = builder
        .with_custom_protocol("wry".into(), move |request| {
            match get_wry_response(request) {
                Ok(r) => r.map(Into::into),
                Err(e) => http::Response::builder()
                    .header(CONTENT_TYPE, "text/plain")
                    .status(500)
                    .body(e.to_string().as_bytes().to_vec())
                    .unwrap()
                    .map(Into::into),
            }
        })
        .with_document_title_changed_handler(|title| {
            window.set_title(&title.as_str());
        })
        .with_ipc_handler(|message| {
            let parsed = json::parse(&message).unwrap();

            if parsed.has_key("message") {

                match parsed["message"].as_str().unwrap() {
                    "echo" => {
                        println!("{}", parsed["data"].as_str().unwrap());
                    }

                    "fullscreen" => {
                        if parsed["fullscreen"] == "toggle" {
                            if window.fullscreen() == None {
                                window.set_fullscreen(Some(Fullscreen::Borderless(None)));
                            } else {
                                window.set_fullscreen(None);
                            }
                        } else {
                            if parsed["fullscreen"] == true {
                                window.set_fullscreen(Some(Fullscreen::Borderless(None)));
                            }
        
                            if parsed["fullscreen"] == false {
                                window.set_fullscreen(None);
                            }
                        }
                    }

                    "title" => {
                        window.set_title(parsed["title"].as_str().unwrap());
                    }

                    "icon" => {
                        let img = match ImageReader::open(parsed["icon"].as_str().unwrap()) {
                            Ok(image) => image,
                            Err(_e) => panic!(),
                        };
                        let img_out = img.decode().expect("");
                        let w = img_out.width();
                        let h = img_out.height();
                        window.set_window_icon(Some(Icon::from_rgba(img_out.into_bytes(), w, h).unwrap()));
                    }

                    "size" => {
                        let width = parsed["size"]["x"].as_i32().unwrap();
                        let height = parsed["size"]["y"].as_i32().unwrap();
                        let new_size = LogicalSize::new(width, height);
                        window.set_inner_size(new_size);
                    }

                    "resizable" => {
                        window.set_resizable(parsed["resizable"] == true);
                    }

                    "quit" => {
                        event_proxy.send_event(
                            event_message("quit", "none")
                        ).unwrap();
                    }

                    "file_write" => {
                        let path = parsed["path"].as_str().unwrap();
                        let data = parsed["data"].as_str().unwrap();
                        
                        let file = File::create(path);
                        match file {
                            Ok(mut f) => { 
                                if let Err(e) = f.write_all(data.as_bytes()) {
                                    println!("error writing data: {e:?}")
                                }
                            }
                            Err(e) => {
                                println!("error opening file: {e:?}")
                            }
                        }
                    }

                    "file_read" => {
                        let path = parsed["path"].as_str().unwrap();
                        
                        let return_event = parsed["return"].as_str().unwrap();

                        let mut file = match File::open(path) {
                            Err(_e) => {
                                println!("Cannot find the path: {}", path); 
                                event_proxy.send_event(
                                    event_message(
                                        "eval", 
                                        format!("window.dispatchEvent(new CustomEvent('{return_event}', {{ error:'can't find that path!' }}));").as_str()
                                    )
                                ).unwrap();
                                return;
                            },
                            Ok(f) => f,
                        };

                        let mut data = String::new();
                        file.read_to_string(&mut data).unwrap();

                        
                        let new_data = str::replace(data.as_str(), "$", "\\$");

                        event_proxy.send_event(
                            event_message(
                                "eval", 
                                format!("window.dispatchEvent(new CustomEvent('{return_event}', {{ detail:String.raw`{new_data}` }}));").as_str()
                            )
                        ).unwrap();
                    }

                    "file_read_bytes" => {
                        let path = parsed["path"].as_str().unwrap();
                        let return_event = parsed["return"].as_str().unwrap();
                        let data = match std::fs::read(path) {
                            Err(_e) => {
                                println!("Cannot find the path: {}", path);
                                event_proxy.send_event(
                                    event_message(
                                        "eval", 
                                        format!("window.dispatchEvent(new CustomEvent('{return_event}', {{ error:'can't find that path!' }}));").as_str()
                                    )
                                ).unwrap();
                                return;
                            },
                            Ok(f) => f,
                        };
                        let base64 = BASE64_STANDARD.encode(data);

                        event_proxy.send_event(
                            event_message(
                                "eval", 
                                format!("window.dispatchEvent(new CustomEvent('{return_event}', {{ detail:String.raw`{base64}` }}));").as_str()
                            )
                        ).unwrap();
                    }

                    "file_exists" => {
                        let path = parsed["path"].as_str().unwrap();
                        let return_event = parsed["return"].as_str().unwrap();
                        
                        if std::path::Path::new(path).is_file() {
                            event_proxy.send_event(
                                event_message(
                                    "eval", 
                                    format!("window.dispatchEvent(new CustomEvent('{return_event}', {{ detail:'true' }}));").as_str()
                                )
                            ).unwrap();
                        } else {
                            event_proxy.send_event(
                                event_message(
                                    "eval", 
                                    format!("window.dispatchEvent(new CustomEvent('{return_event}', {{ detail:'false' }}));").as_str()
                                )
                            ).unwrap();
                        }
                    }

                    "path_list" => {
                        let return_event = parsed["return"].as_str().unwrap();
                        let path = parsed["path"].as_str().unwrap();
                        let paths = match read_dir(path){
                            Err(e) => {
                                println!("Cannot find the path: {}", path); 
                                event_proxy.send_event(
                                    event_message(
                                        "eval", 
                                        format!("window.dispatchEvent(new CustomEvent('{return_event}', {{ error:'can't find that path!' }}));").as_str()
                                    )
                                ).unwrap();
                                return;
                            },
                            Ok(f) => f,
                        };
                        let mut output = Vec::new();
                        for dir_entry in paths {
                            // these unwraps are fine honest
                            output.push(dir_entry.unwrap().path().into_os_string().into_string().unwrap());
                        } 
                        let output_string = output.join(",");
                        event_proxy.send_event(
                            event_message(
                                "eval", 
                                format!("window.dispatchEvent(new CustomEvent('{return_event}', {{ detail:'{output_string}' }}));").as_str()
                            )
                        ).unwrap();
                    }

                    _ => {
                        println!("unknown message: {}", parsed["message"].as_str().unwrap())
                    }
                }
            }
        })
        .with_devtools(true)
        .with_url("wry://localhost")?
        .build()?;

    #[cfg(debug_assertions)]
    _webview.open_devtools();

    _webview.evaluate_script("let test = 'hello';").unwrap();

    event_loop.run(move |event, _, control_flow| {
        *control_flow = ControlFlow::Wait;

        if let Event::WindowEvent {
            event: WindowEvent::CloseRequested,
            ..
        } = event
        {
            *control_flow = ControlFlow::Exit
        }

        if let Event::UserEvent(message) = event
        {
            match message.message_type.as_str() {
                "quit" => {
                    *control_flow = ControlFlow::Exit
                }
                "eval" => {
                    //println!("{}", message.data);
                    _webview.evaluate_script(&message.data).unwrap();
                }
                _ => {
                    println!("unknown event type: {}", message.message_type)   
                }
            }


        }
    });
}

fn get_wry_response(
    request: Request<Vec<u8>>,
) -> Result<http::Response<Vec<u8>>, Box<dyn std::error::Error>> {
    let path = request.uri().path();
    // Read the file content from file path
    let root = PathBuf::from("");
    let path = if path == "/" {
        "index.html"
    } else {
        //  removing leading slash
        &path[1..]
    };

    let content = std::fs::read(std::fs::canonicalize(root.join(path.replace("%20", " ")))?)?;

    let mut mimetype = if path.ends_with(".html") || path == "/" {
        "text/html"
    } else if path.ends_with(".js") {
        "text/javascript"
    } else if path.ends_with(".css") {
        "text/css"
    } else if path.ends_with(".txt") {
        "text/plain"
    } else if path.ends_with(".ini") {
        "text/plain"
    } else if path.ends_with(".json") {
        "text/plain"
    } else {
        "unknown"
    };

    if mimetype == "unknown" {
        match infer::get_from_path(path) {
            Ok(Some(info)) => {
                mimetype = info.mime_type();
            }
            Ok(None) => {
                eprintln!("Unknown file type {}", path);
                eprintln!("If you think infer should be able to recognize this file type open an issue on GitHub!");
                // exit!(1);
            }
            Err(e) => {
                eprintln!("Looks like something went wrong 😔");
                eprintln!("{}", e);
                // exit!(1);
            }
        }
    }

    // let mimetype = if path.ends_with(".html") || path == "/" {
    //     "text/html"
    // } else if path.ends_with(".js") {
    //     "text/javascript"
    // } else if path.ends_with(".css") {
    //     "text/css"
    // } else if path.ends_with(".ogg") {
    //     "audio/ogg"
    // } else if path.ends_with(".png") {
    //     "image/png"
    // } else if path.ends_with(".wasm") {
    //     "application/wasm"
    // } else if path.ends_with(".ico") {
    //     "image/x-icon"
    // } else if path.ends_with(".ttf") {
    //     "application/octet-stream"
    // } else if path.ends_with(".txt") {
    //     "text/plain"
    // } else {
    //     "unknown/unknown"
    // };
    // if mimetype == "unknown/unknown" {
    //     println!("uknown type{}", path);
    // }

    Response::builder()
        .header(CONTENT_TYPE, mimetype)
        .body(content)
        .map_err(Into::into)
}

