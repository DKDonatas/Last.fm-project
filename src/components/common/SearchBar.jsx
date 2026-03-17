import { useState } from 'react'

export function SearchBar({ value, onChange, placeholder, suggestions = [], onSuggestionSelect }) {
  const [focused, setFocused] = useState(false)

  const showSuggestions = focused && suggestions.length > 0 && !value.trim()

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">⌕</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="search-input"
          type="search"
          autoComplete="off"
          spellCheck={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
        />
      </div>

      {showSuggestions && (
        <div className="search-suggestions">
          <div className="search-suggestions-label">Recent searches</div>
          {suggestions.map((s) => (
            <button
              key={s}
              className="search-suggestion-item"
              onMouseDown={() => {
                onSuggestionSelect?.(s)
                setFocused(false)
              }}
            >
              <span className="search-suggestion-icon">↩</span>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
