interface HeaderProps {
  onAddClick: () => void;
  keyCount?: number;
  onSearch: (query: string) => void;
  onExport: () => void;
  onImport: () => void;
}

export function Header({ onAddClick, keyCount = 0, onSearch, onExport, onImport }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-3 py-2 border-b border-border header-shadow bg-card/50 backdrop-blur-sm gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 9.536 10 11l-2 2-2-2-2 2-2-2 2 2-2 2m0 0l2 2 4 4" />
          </svg>
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-white tracking-tight">KeySaver</h1>
          {keyCount > 0 && (
            <span className="stat-badge">{keyCount} 个密钥</span>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-md mx-2">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-muted group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-1.5 bg-background/50 border border-border/50 rounded-lg leading-5 text-white placeholder-muted/70 focus:outline-none focus:bg-background focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 sm:text-sm transition-all"
            placeholder="搜索密钥..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onImport}
          className="p-2 bg-background border border-border text-muted hover:text-white rounded-lg transition-colors flex items-center gap-2"
          title="导入备份"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="hidden sm:inline text-xs">导入</span>
        </button>

        <button
          onClick={onExport}
          className="p-2 bg-background border border-border text-muted hover:text-white rounded-lg transition-colors flex items-center gap-2"
          title="导出备份"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline text-xs">导出</span>
        </button>

        <button
          onClick={onAddClick}
          className="p-2 primary-btn text-white rounded-lg font-medium flex items-center gap-2 flex-shrink-0 ml-2"
          title="添加密钥"
        >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="hidden sm:inline">添加密钥</span>
      </button>
    </header>
  );
}
