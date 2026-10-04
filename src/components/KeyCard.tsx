import { useState } from "react";
import type { ApiKey } from "../types";
import { copyToClipboard } from "../lib/storage";

interface KeyCardProps {
  apiKey: ApiKey;
  onEdit: (key: ApiKey) => void;
  onDelete: (id: string) => void;
}

export function KeyCard({ apiKey, onEdit, onDelete }: KeyCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [noteExpanded, setNoteExpanded] = useState(false);

  const isIdSecret = apiKey.type === 'idSecret';

  // Display value for the card preview
  const displayValue = isIdSecret
    ? (apiKey.accessKeyId || '')
    : (apiKey.key || '');

  const maskedValue = displayValue.length > 8
    ? "••••••••••••" + displayValue.slice(-4)
    : "••••••••";

  const noteLines = apiKey.note ? apiKey.note.split('\n') : [];

  const handleCopy = async (text: string, id: string) => {
    await copyToClipboard(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      onDelete(apiKey.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className="key-card bg-card rounded-lg p-3 animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
              {isIdSecret ? (
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .884.384 1.626 1 2.122A2.001 2.001 0 0014 8h1" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 9.536 10 11l-2 2-2-2-2 2-2-2 2 2-2 2m0 0l2 2 4 4" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-white font-medium text-base">{apiKey.name}</h3>
              <span className="text-xs text-muted flex items-center gap-2">
                {formatDate(apiKey.createdAt)}
                <span className="w-1 h-1 rounded-full bg-muted/50"></span>
                <span className="uppercase">{isIdSecret ? 'ID & Secret' : 'API Key'}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(apiKey);
              }}
              className="icon-btn text-muted hover:text-white"
              title="编辑"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className={`icon-btn ${showDeleteConfirm ? 'danger-btn' : 'text-muted hover:text-white'}`}
              title={showDeleteConfirm ? "确认删除" : "删除"}
            >
              {showDeleteConfirm ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Key Display (Click to open modal) */}
        <div
          onClick={() => setShowDetailModal(true)}
          className="flex items-center gap-2 mb-4 cursor-pointer group"
        >
          <div className="flex-1 key-display px-5 py-3 rounded-lg text-sm text-muted overflow-hidden group-hover:border-primary/50 transition-colors border border-transparent bg-background/50">
            <div className="flex items-center justify-between">
              <span className="font-mono">{maskedValue}</span>
              <span className="text-xs bg-white/5 px-2 py-1 rounded text-muted group-hover:text-white transition-colors">
                点击查看详情
              </span>
            </div>
          </div>
        </div>

        {/* Note (hover a line to reveal its copy button) */}
        {apiKey.note && (
          <div className="px-1">
            <NoteLines
              lines={noteExpanded ? noteLines : noteLines.slice(0, 2)}
              apiKeyId={apiKey.id}
              copiedId={copiedId}
              onCopy={handleCopy}
              textClass="text-muted"
            />
            {noteLines.length > 2 && (
              <button
                onClick={() => setNoteExpanded((v) => !v)}
                className="mt-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {noteExpanded ? '收起' : `展开全部 ${noteLines.length} 行`}
              </button>
            )}
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="mt-3 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg animate-fade-in">
            <p className="text-red-400 text-sm text-center">再次点击删除按钮确认删除</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <div
          className="fixed inset-0 modal-backdrop flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="modal-card rounded-lg p-3 w-full max-w-lg border border-border animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{apiKey.name}</h3>
                <p className="text-muted text-sm">查看完整密钥信息</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-muted hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {isIdSecret ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted">AccessKey ID</label>
                    <div className="flex gap-2">
                      <code className="flex-1 p-3 bg-black/30 rounded-lg border border-white/10 font-mono text-sm break-all text-blue-300">
                        {apiKey.accessKeyId}
                      </code>
                      <button
                        onClick={() => handleCopy(apiKey.accessKeyId || '', 'id')}
                        className="p-3 rounded-lg border border-white/10 hover:bg-white/5 text-muted hover:text-white transition-colors"
                        title="复制"
                      >
                        {copiedId === 'id' ? (
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted">AccessKey Secret</label>
                    <div className="flex gap-2">
                      <code className="flex-1 p-3 bg-black/30 rounded-lg border border-white/10 font-mono text-sm break-all text-green-300">
                        {apiKey.accessKeySecret}
                      </code>
                      <button
                        onClick={() => handleCopy(apiKey.accessKeySecret || '', 'secret')}
                        className="p-3 rounded-lg border border-white/10 hover:bg-white/5 text-muted hover:text-white transition-colors"
                        title="复制"
                      >
                        {copiedId === 'secret' ? (
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">API Key</label>
                  <div className="flex gap-2">
                    <code className="flex-1 p-3 bg-black/30 rounded-lg border border-white/10 font-mono text-sm break-all text-green-300">
                      {apiKey.key}
                    </code>
                    <button
                      onClick={() => handleCopy(apiKey.key || '', 'key')}
                      className="p-3 rounded-lg border border-white/10 hover:bg-white/5 text-muted hover:text-white transition-colors"
                      title="复制"
                    >
                      {copiedId === 'key' ? (
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {apiKey.note && (
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <label className="text-sm font-medium text-muted">备注</label>
                  <NoteLines
                    lines={noteLines}
                    apiKeyId={apiKey.id}
                    copiedId={copiedId}
                    onCopy={handleCopy}
                    textClass="text-gray-300"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-colors font-medium text-sm"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NoteLines({ lines, apiKeyId, copiedId, onCopy, textClass }: {
  lines: string[];
  apiKeyId: string;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  textClass: string;
}) {
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => (
        <div key={i} className="group/line flex items-start gap-1 -mx-1 px-1 rounded hover:bg-white/5">
          <p className={`flex-1 text-sm leading-relaxed whitespace-pre-wrap break-all ${textClass}`}>
            {line || '\u00A0'}
          </p>
          {line.trim() !== '' && (
            <button
              onClick={() => onCopy(line, `${apiKeyId}-note-${i}`)}
              className={`shrink-0 p-1 mt-0.5 rounded text-muted hover:text-white hover:bg-white/10 transition-opacity ${
                copiedId === `${apiKeyId}-note-${i}`
                  ? 'opacity-100'
                  : 'opacity-0 group-hover/line:opacity-100'
              }`}
              title="复制本行"
            >
              {copiedId === `${apiKeyId}-note-${i}` ? (
                <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
