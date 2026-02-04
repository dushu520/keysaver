use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ApiKey {
    pub id: String,
    pub name: String,
    #[serde(default = "default_type")]
    pub r#type: String,
    pub key: Option<String>,
    #[serde(rename = "accessKeyId")]
    pub access_key_id: Option<String>,
    #[serde(rename = "accessKeySecret")]
    pub access_key_secret: Option<String>,
    #[serde(default)]
    pub note: String,
    #[serde(rename = "createdAt")]
    pub created_at: u64,
    #[serde(rename = "updatedAt")]
    pub updated_at: u64,
}

fn default_type() -> String {
    "apiKey".to_string()
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AppData {
    pub version: String,
    pub keys: Vec<ApiKey>,
}

impl Default for AppData {
    fn default() -> Self {
        AppData {
            version: "1.0.0".to_string(),
            keys: Vec::new(),
        }
    }
}

fn get_data_path() -> PathBuf {
    let app_dir = dirs::data_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("keysaver");

    if !app_dir.exists() {
        fs::create_dir_all(&app_dir).ok();
    }

    app_dir.join("keys.json")
}

#[tauri::command]
fn load_keys() -> Result<AppData, String> {
    let path = get_data_path();

    if !path.exists() {
        return Ok(AppData::default());
    }

    let content = fs::read_to_string(&path).map_err(|e| format!("Failed to read file: {}", e))?;

    serde_json::from_str(&content).map_err(|e| format!("Failed to parse JSON: {}", e))
}

#[tauri::command]
fn save_keys(data: AppData) -> Result<(), String> {
    let path = get_data_path();

    let content =
        serde_json::to_string_pretty(&data).map_err(|e| format!("Failed to serialize: {}", e))?;

    fs::write(&path, content).map_err(|e| format!("Failed to write file: {}", e))
}

#[tauri::command]
fn generate_uuid() -> String {
    Uuid::new_v4().to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            // 当第二个实例启动时，聚焦主窗口
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
                // 如果窗口被最小化，恢复它
                let _ = window.unminimize();
            }
        }))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            load_keys,
            save_keys,
            generate_uuid
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
