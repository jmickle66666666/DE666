use std::path::PathBuf;

use http::Request;
use tao::{
    dpi::LogicalSize,
    event::{Event, WindowEvent},
    event_loop::{ControlFlow, EventLoop},
    platform::unix::WindowExtUnix,
    window::{Fullscreen, WindowBuilder},
};
use wry::{
    http::{header::CONTENT_TYPE, Response},
    WebViewBuilder, WebViewBuilderExtUnix,
};

fn main() -> wry::Result<()> {
    let event_loop = EventLoop::new();
    // let window = Arc::new(WindowBuilder::new().build(&event_loop).unwrap());
    let window = Box::leak(Box::new(WindowBuilder::new().build(&event_loop).unwrap()));
    // let weak_window = Arc::downgrade(&window);
    // let weak_window2 = Arc::downgrade(&window);

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

            // let seperator = message.find(' ').unwrap();
            // let ident = &message[..seperator];
            // let body = &message[seperator+1..];

            match parsed["type"].as_str() {
                Some("echo") => println!("{}", parsed["message"]),
                Some("window") => {
                    if parsed.has_key("fullscreen") {
                        if (parsed["fullscreen"] == "toggle") {
                            if window.fullscreen() == None {
                                window.set_fullscreen(Some(Fullscreen::Borderless(None)));
                            } else {
                                window.set_fullscreen(None);
                            }
                        } else {
                            if (parsed["fullscreen"] == true) {
                                window.set_fullscreen(Some(Fullscreen::Borderless(None)));
                            }

                            if (parsed["fullscreen"] == false) {
                                window.set_fullscreen(None);
                            }
                        }
                    }
                    if parsed.has_key("title") {
                        window.set_title(parsed["title"].as_str().unwrap());
                    }
                    if parsed.has_key("size") {
                        let width = parsed["size"]["x"].as_i32().unwrap();
                        let height = parsed["size"]["y"].as_i32().unwrap();
                        let new_size = LogicalSize::new(width, height);
                        window.set_inner_size(new_size);
                    }
                    if parsed.has_key("resizable") {
                        window.set_resizable(parsed["resizable"] == true);
                    }
                }
                _ => println!("unhandled: {}", message),
            }
        })
        .with_devtools(true)
        .with_url("wry://localhost")?
        .build()?;

    _webview.open_devtools();

    event_loop.run(move |event, _, control_flow| {
        *control_flow = ControlFlow::Wait;

        if let Event::WindowEvent {
            event: WindowEvent::CloseRequested,
            ..
        } = event
        {
            *control_flow = ControlFlow::Exit
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
