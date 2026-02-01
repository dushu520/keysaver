import { useState, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExport = () => {
    try {
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
    } catch (err) {
      console.error("Export failed:", err);
      alert("导出失败，请重试");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm("确定要导入此备份文件吗？这将覆盖当前的所有密钥数据！")) {
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        await importData(data);
        alert("备份导入成功！");
      } catch (err) {
        console.error("Import failed:", err);
        alert("导入失败：无效的备份文件");
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
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
        onImport={handleImportClick}
      />

      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".json"
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
