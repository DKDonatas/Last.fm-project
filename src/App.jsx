import { useState } from 'react'
import './App.css'
import { AppShell } from './components/layout/AppShell.jsx'
import { HomeView } from './features/home/HomeView.jsx'
import { MusicDashboard } from './features/dashboard/MusicDashboard.jsx'
import { FavoritesView } from './features/favorites/FavoritesView.jsx'
import { UserDashboard } from './features/user/UserDashboard.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('home')
  const [username, setUsername] = useLocalStorage('lastfm_username', '')
  const [searchHistory, setSearchHistory] = useLocalStorage('lastfm_search_history', [])

  const view = searchQuery.trim() ? 'search' : activeTab

  const addToHistory = (query) => {
    if (!query.trim()) return
    setSearchHistory((prev) => {
      const filtered = prev.filter((h) => h.toLowerCase() !== query.toLowerCase())
      return [query, ...filtered].slice(0, 6)
    })
  }

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    if (!value.trim() && view === 'search') setActiveTab('home')
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSearchQuery('')
  }

  const handleArtistSelect = (artist) => {
    setSearchQuery(artist.name)
    addToHistory(artist.name)
  }

  const handleHistorySelect = (query) => {
    setSearchQuery(query)
  }

  const handleSearchBlur = () => {
    if (searchQuery.trim()) addToHistory(searchQuery.trim())
  }

  const subtitle = {
    search: `Search · "${searchQuery.trim()}"`,
    favorites: 'Your saved tracks & artists',
    user: username ? `My Stats · ${username}` : 'My Stats',
    home: 'Global charts · This week',
  }[view]

  const intro = {
    search: 'Search for an artist to explore their top tracks and play them instantly.',
    favorites: 'Your hand-picked artists and tracks, ready to play anytime.',
    user: username
      ? `Showing ${username}'s top artists, top tracks, and recent listening activity this week.`
      : 'Enter your Last.fm username to see your personal stats.',
    home: 'Discover what the Last.fm community is listening to right now and play the tracks instantly.',
  }[view]

  return (
    <AppShell
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      onSearchBlur={handleSearchBlur}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      username={username}
      onUsernameSubmit={setUsername}
      subtitle={subtitle}
      intro={intro}
      searchHistory={searchHistory}
      onHistorySelect={handleHistorySelect}
    >
      {view === 'home' && <HomeView onArtistSelect={handleArtistSelect} />}
      {view === 'search' && <MusicDashboard searchQuery={searchQuery} />}
      {view === 'favorites' && <FavoritesView onArtistSelect={handleArtistSelect} />}
      {view === 'user' && <UserDashboard username={username} />}
    </AppShell>
  )
}

export default App
