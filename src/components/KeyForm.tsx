import { useState, useEffect } from "react";
import type { ApiKey, KeyType } from "../types";

interface KeyFormProps {
  editKey: ApiKey | null;
  onSubmit: (data: Omit<ApiKey, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export function KeyForm({ editKey, onSubmit, onCancel }: KeyFormProps) {
  const [type, setType] = useState<KeyType>("apiKey");
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [accessKeySecret, setAccessKeySecret] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (editKey) {
      setType(editKey.type || "apiKey");
      setName(editKey.name);
      setKey(editKey.key || "");
      setAccessKeyId(editKey.accessKeyId || "");
      setAccessKeySecret(editKey.accessKeySecret || "");
      setNote(editKey.note);
    } else {
      setType("apiKey");
      setName("");
      setKey("");
      setAccessKeyId("");
      setAccessKeySecret("");
      setNote("");
    }
  }, [editKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    if (type === 'apiKey') {
      if (!key.trim()) return;
      onSubmit({
        type,
        name: name.trim(),
        key: key.trim(),
        note: note.trim()
      });
    } else {
      if (!accessKeyId.trim() || !accessKeySecret.trim()) return;
      onSubmit({
        type,
        name: name.trim(),
        accessKeyId: accessKeyId.trim(),
        accessKeySecret: accessKeySecret.trim(),
        note: note.trim()
      });
    }
  };

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center p-4 z-50 animate-fade-in">
      <div
        className="modal-card rounded-lg p-3 w-full max-w-md border border-border animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            {editKey ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {editKey ? "编辑密钥" : "添加新密钥"}
            </h2>
            <p className="text-sm text-muted">
              {editKey ? "修改密钥信息" : "安全存储您的 API 密钥"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Key Type Toggle */}
          <div className="p-1 bg-background border border-border rounded-lg flex gap-1">
            <button
              type="button"
              onClick={() => setType('apiKey')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                type === 'apiKey'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              API Key
            </button>
            <button
              type="button"
              onClick={() => setType('idSecret')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                type === 'idSecret'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              ID & Secret
            </button>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              名称 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === 'apiKey' ? "例如: OpenAI API Key" : "例如: AWS Access Key"}
              className="w-full p-2 bg-background border border-border rounded-lg text-white placeholder-muted/50 focus:outline-none focus:border-primary transition-colors"
              required
              autoFocus
            />
          </div>

          {/* Conditional Fields */}
          {type === 'apiKey' ? (
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                API Key <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="sk-xxxxxxxxxxxxxxxx"
                className="w-full p-2 bg-background border border-border rounded-lg text-white placeholder-muted/50 focus:outline-none focus:border-primary font-mono text-sm transition-colors"
                required
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">
                  AccessKey ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={accessKeyId}
                  onChange={(e) => setAccessKeyId(e.target.value)}
                  placeholder="AKIAxxxxxxxxxxxxxxxx"
                  className="w-full p-2 bg-background border border-border rounded-lg text-white placeholder-muted/50 focus:outline-none focus:border-primary font-mono text-sm transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">
                  AccessKey Secret <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={accessKeySecret}
                  onChange={(e) => setAccessKeySecret(e.target.value)}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full p-2 bg-background border border-border rounded-lg text-white placeholder-muted/50 focus:outline-none focus:border-primary font-mono text-sm transition-colors"
                  required
                />
              </div>
            </>
          )}

          {/* Note Input */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              备注 <span className="text-muted/50">(可选)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="添加一些说明，帮助你记住这个密钥的用途..."
              rows={3}
              className="w-full p-2 bg-background border border-border rounded-lg text-white placeholder-muted/50 focus:outline-none focus:border-primary resize-none transition-colors"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-5 py-4 border border-border text-muted hover:text-white hover:border-border-light rounded-lg transition-all font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-5 py-4 primary-btn text-white rounded-lg font-medium flex items-center justify-center gap-2"
            >
              {editKey ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  保存更改
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  添加密钥
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
