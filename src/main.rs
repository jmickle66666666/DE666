use std::path::PathBuf;

use http::Request;
use tao::{
  event::{Event, WindowEvent},
  event_loop::{ControlFlow, EventLoop},
  window::{WindowBuilder, Fullscreen},
  dpi::LogicalSize,
};
use wry::{
  http::{header::CONTENT_TYPE, Response},
  WebViewBuilder,
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

    let builder = WebViewBuilder::new(window);

    let _webview = builder
    .with_custom_protocol("wry".into(), move |request| {
        
        match get_wry_response(request) {
            Ok(r) => r.map(Into::into),
            Err(e) => {
                http::Response::builder()
                .header(CONTENT_TYPE, "text/plain")
                .status(500)
                .body(e.to_string().as_bytes().to_vec())
                .unwrap()
                .map(Into::into)
            },
        }
    })
    .with_document_title_changed_handler(|title| {
        window.set_title(&title.as_str());
    })
    .with_ipc_handler(|message| {
        let seperator = message.find(' ').unwrap();
        let ident = &message[..seperator];
        let body = &message[seperator+1..];
        match ident {
            "ECHO" => println!("{}", body),
            "WINDOW" => {
                if body == "fullscreen" { 
                    if window.fullscreen() == None {
                        window.set_fullscreen(Some(Fullscreen::Borderless(None)));
                    } else {
                        window.set_fullscreen(None);
                    }
                } else if body.starts_with("title") {
                    window.set_title(&body[6..]);
                } else if body.starts_with("size") {
                    let res: Vec<&str> = body[5..].split(' ').collect();
                    let width = res[0].parse::<i32>().unwrap();
                    let height = res[1].parse::<i32>().unwrap();
                    let new_size = LogicalSize::new(width, height);
                    window.set_inner_size(new_size);
                } else if body.starts_with("resizable") {
                    window.set_resizable(body.ends_with("true"));
                }
            },
            &_ => println!("unhandled: {}", message),
        }
    })
    .with_devtools(true)
    .with_url("wry://localhost")?
    .build()?;
    //_webview.open_devtools();

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