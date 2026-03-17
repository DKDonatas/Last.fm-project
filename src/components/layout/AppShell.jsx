import { useRef } from 'react'
import { SearchBar } from '../common/SearchBar.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'

export function AppShell({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  username,
  onUsernameSubmit,
  subtitle,
  intro,
  searchHistory,
  onHistorySelect,
  children,
}) {
  const { theme, toggleTheme } = useTheme()
  const usernameInputRef = useRef(null)

  const handleUsernameSubmit = (e) => {
    e.preventDefault()
    const value = usernameInputRef.current?.value?.trim() ?? ''
    onUsernameSubmit(value)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-brand">
          <span className="app-logo">♫</span>
          <div className="app-header-text">
            <h1 className="app-title">Last.fm Dashboard</h1>
            {subtitle && <span className="app-subtitle">{subtitle}</span>}
          </div>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search artists…"
          suggestions={searchHistory}
          onSuggestionSelect={onHistorySelect}
        />

        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
          {theme === 'dark' ? '☀' : '🌙'}
        </button>
      </header>

      <nav className="app-nav">
        <div className="nav-tabs">
          <button
            className={`nav-tab${activeTab === 'home' ? ' nav-tab--active' : ''}`}
            onClick={() => onTabChange('home')}
          >
            Home
          </button>
          <button
            className={`nav-tab${activeTab === 'favorites' ? ' nav-tab--active' : ''}`}
            onClick={() => onTabChange('favorites')}
          >
            ♥ Favorites
          </button>
          <button
            className={`nav-tab${activeTab === 'user' ? ' nav-tab--active' : ''}`}
            onClick={() => onTabChange('user')}
          >
            My Stats
          </button>
        </div>

        {activeTab === 'user' && (
          <form className="username-form" onSubmit={handleUsernameSubmit}>
            <input
              ref={usernameInputRef}
              defaultValue={username}
              placeholder="Last.fm username…"
              className="username-input"
              spellCheck={false}
              autoComplete="off"
            />
            <button type="submit" className="username-submit">
              Go
            </button>
          </form>
        )}
      </nav>

      <main className="app-main">
        {intro && <p className="app-intro">{intro}</p>}
        {children}
      </main>

      <footer className="app-footer">
        Powered by{' '}
        <a href="https://www.last.fm/api" target="_blank" rel="noreferrer">
          Last.fm API
        </a>{' '}
        & YouTube
      </footer>
    </div>
  )
}
