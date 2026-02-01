import { useState } from "react";
import { save, open } from "@tauri-apps/plugin-dialog";
import { writeTextFile, readTextFile } from "@tauri-apps/plugin-fs";
import { Header } from "./components/Header";
import { KeyList } from "./components/KeyList";
import { KeyForm } from "./components/KeyForm";
import { useKeys } from "./hooks/useKeys";
import type { ApiKey, AppData } from "./types";

function App() {
  const { keys, isLoading, addKey, updateKey, deleteKey, importData } = useKeys();
  const [showForm, setShowForm] = useState(false);
  const [editKey, setEditKey] = useState<ApiKey | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const sortedKeys = [...keys].sort((a, b) => b.createdAt - a.createdAt);

  const filteredKeys = sortedKeys.filter(key => {
    const query = searchQuery.toLowerCase();
    return (
      key.name.toLowerCase().includes(query) ||
      (key.note && key.note.toLowerCase().includes(query)) ||
      (key.key && key.key.toLowerCase().includes(query)) ||
      (key.accessKeyId && key.accessKeyId.toLowerCase().includes(query))
    );
  });

  const handleAdd = () => {
    setEditKey(null);
    setShowForm(true);
  };

  const handleEdit = (key: ApiKey) => {
    setEditKey(key);
    setShowForm(true);
  };

  const handleSubmit = async (data: Omit<ApiKey, "id" | "createdAt" | "updatedAt">) => {
    if (editKey) {
      await updateKey(editKey.id, data);
    } else {
      await addKey(data);
    }
    setShowForm(false);
    setEditKey(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditKey(null);
  };

  const handleExport = async () => {
    try {
      const filePath = await save({
        defaultPath: `keysaver-backup-${new Date().toISOString().split('T')[0]}.json`,
        filters: [{
          name: 'JSON File',
          extensions: ['json']
        }]
      });

      if (!filePath) return; // User cancelled

      const data: AppData = {
        version: "1.0.0",
        keys: keys
      };

      await writeTextFile(filePath, JSON.stringify(data, null, 2));
      alert("导出成功！");
    } catch (err) {
      console.error("Export failed:", err);
      // Fallback for browser mode
      if (typeof window !== 'undefined' && !(window as any).__TAURI_INTERNALS__) {
        const data: AppData = {
          version: "1.0.0",
          keys: keys
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `keysaver-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert("导出失败：" + String(err));
      }
    }
  };

  const handleImport = async () => {
    try {
      const filePath = await open({
        multiple: false,
        directory: false,
        filters: [{
          name: 'JSON File',
          extensions: ['json']
        }]
      });

      if (!filePath) return; // User cancelled

      if (!confirm("确定要导入此备份文件吗？这将覆盖当前的所有密钥数据！")) {
        return;
      }

      const content = await readTextFile(filePath as string);
      const data = JSON.parse(content);
      await importData(data);
      alert("备份导入成功！");
    } catch (err) {
      console.error("Import failed:", err);
      // Fallback for browser mode
      if (typeof window !== 'undefined' && !(window as any).__TAURI_INTERNALS__) {
        alert("浏览器预览模式请使用文件选择框导入");
      } else {
        alert("导入失败：无效的备份文件或权限不足");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center text-muted">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 animate-pulse">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 9.536 10 11l-2 2-2-2-2 2-2-2 2 2-2 2m0 0l2 2 4 4" />
          </svg>
        </div>
        <p className="text-sm">加载中...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col p-2">
      <Header
        onAddClick={handleAdd}
        keyCount={filteredKeys.length}
        onSearch={setSearchQuery}
        onExport={handleExport}
        onImport={handleImport}
      />

      <KeyList keys={filteredKeys} onEdit={handleEdit} onDelete={deleteKey} />
      {showForm && (
        <KeyForm
          editKey={editKey}
          existingKeys={keys}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default App;
