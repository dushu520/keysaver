import type { ApiKey } from "../types";
import { KeyCard } from "./KeyCard";

interface KeyListProps {
  keys: ApiKey[];
  onEdit: (key: ApiKey) => void;
  onDelete: (id: string) => void;
}

export function KeyList({ keys, onEdit, onDelete }: KeyListProps) {
  if (keys.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted p-8 empty-state">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 9.536 10 11l-2 2-2-2-2 2-2-2 2 2-2 2m0 0l2 2 4 4" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-white mb-2">还没有保存任何密钥</h3>
        <p className="text-sm text-center max-w-xs mb-6">
          点击上方的「添加密钥」按钮，开始安全存储您的 API 密钥
        </p>
        <div className="flex items-center gap-6 text-xs text-muted/70">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            本地存储
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            快速复制
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            隐私安全
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {keys.map((key, index) => (
        <div key={key.id} className="mb-3" style={{ animationDelay: `${index * 50}ms` }}>
          <KeyCard
            apiKey={key}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
