# KeySaver

KeySaver 是一个基于 Tauri 和 React 构建的跨平台本地密钥管理工具。它可以帮助你安全、便捷地存储和管理各种 API Key、Access Key ID & Secret 等敏感信息。

## ✨ 主要功能

- **双模式支持**：支持存储单一 API Key 或 Access Key ID/Secret 组合。
- **安全存储**：数据完全本地存储，不上传云端，确保隐私安全。
- **便捷操作**：一键复制密钥，支持快速搜索和管理。
- **防重检测**：智能检测重复添加的密钥，避免冗余。
- **即时排序**：按创建时间倒序排列，最新添加的密钥置顶显示。
- **现代化 UI**：简洁美观的用户界面，良好的交互体验。

## 🛠️ 技术栈

- **Core**: [Tauri](https://tauri.app/) (Rust)
- **Frontend**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 🚀 开发指南

### 环境要求

- Node.js (建议 v16+)
- Rust (最新稳定版)
- 包管理器 (npm/yarn/pnpm)

### 安装依赖

```bash
npm install
```

### 启动开发环境

Web 预览模式（仅前端，使用 localStorage 模拟存储）：
```bash
npm run dev
```

Tauri 桌面应用模式：
```bash
npm run tauri dev
```

## 📦 打包构建

构建生产环境的应用程序（Windows .exe / macOS .app / Linux .deb）：

```bash
npm run tauri build
```

构建产物位于 `src-tauri/target/release/bundle/` 目录下。

## 📝 许可证

MIT License
