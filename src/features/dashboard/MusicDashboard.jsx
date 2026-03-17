import { useEffect, useState } from 'react'
import { lastfmClient } from '../../api/lastfmClient.js'
import { PlayerPanel } from '../../components/player/PlayerPanel.jsx'
import { FavoriteArtistButton, FavoriteTrackButton } from '../../components/common/FavoriteButton.jsx'
import { useQueue } from '../../context/QueueContext.jsx'

export function MusicDashboard({ searchQuery }) {
  const [artists, setArtists] = useState([])
  const [selectedArtist, setSelectedArtist] = useState(null)
  const [topTracks, setTopTracks] = useState([])
  const [isLoadingArtists, setIsLoadingArtists] = useState(false)
  const [artistError, setArtistError] = useState(null)
  const { play, currentTrack } = useQueue()

  useEffect(() => {
    let isCancelled = false

    if (!searchQuery.trim()) {
      setArtists([])
      setArtistError(null)
      setIsLoadingArtists(false)
      return
    }

    const handle = setTimeout(() => {
      setIsLoadingArtists(true)
      setArtistError(null)

      lastfmClient
        .searchArtists(searchQuery)
        .then((data) => {
          if (isCancelled) return
          const matches = data?.results?.artistmatches?.artist ?? []
          setArtists(Array.isArray(matches) ? matches : [matches].filter(Boolean))
        })
        .catch((err) => {
          if (isCancelled) return
          setArtistError(err.message ?? 'Failed to fetch artists.')
          setArtists([])
        })
        .finally(() => {
          if (isCancelled) return
          setIsLoadingArtists(false)
        })
    }, 400)

    return () => {
      isCancelled = true
      clearTimeout(handle)
    }
  }, [searchQuery])

  useEffect(() => {
    let isCancelled = false

    if (!selectedArtist) {
      setTopTracks([])
      return
    }

    lastfmClient
      .getArtistTopTracks(selectedArtist.name, 10)
      .then((data) => {
        if (isCancelled) return
        const tracks = data?.toptracks?.track ?? []
        const normalized = Array.isArray(tracks) ? tracks : [tracks].filter(Boolean)
        const mapped = normalized.map((track) => ({
          name: track.name,
          artist: track.artist?.name ?? selectedArtist.name,
          playcount: track.playcount,
        }))
        setTopTracks(mapped)
        if (mapped.length > 0) play(mapped, 0)
      })
      .catch(() => {
        if (isCancelled) return
        setTopTracks([])
      })

    return () => {
      isCancelled = true
    }
  }, [selectedArtist, play])

  return (
    <div className="dashboard-grid">
      <section className="panel">
        <div className="panel-header">
          <h3>Artists</h3>
          {artists.length > 0 && <span className="panel-count">{artists.length}</span>}
        </div>

        {!searchQuery && (
          <p className="panel-empty">Search for an artist above to get started.</p>
        )}
        {isLoadingArtists && <p className="panel-status">Searching…</p>}
        {artistError && (
          <p className="panel-status" style={{ color: 'var(--red)' }}>
            {artistError}
          </p>
        )}
        {searchQuery && !isLoadingArtists && artists.length === 0 && !artistError && (
          <p className="panel-empty">No artists found for "{searchQuery}".</p>
        )}

        {artists.length > 0 && (
          <ul className="track-list">
            {artists.map((artist, index) => (
              <li
                key={`${artist.mbid || artist.name}-${artist.listeners}`}
                className={`track-row${selectedArtist?.name === artist.name ? ' is-active' : ''}`}
                onClick={() => setSelectedArtist(artist)}
              >
                <div className="track-index-cell">
                  <span className="track-index">{index + 1}</span>
                  <span className="track-play-icon">▶</span>
                </div>
                <div className="track-info">
                  <span className="track-name">{artist.name}</span>
                  {artist.listeners && (
                    <span className="track-sub">
                      {Number(artist.listeners).toLocaleString()} listeners
                    </span>
                  )}
                </div>
                <div className="track-row-right">
                  <FavoriteArtistButton artist={artist} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel panel-tracks">
        <div className="panel-header">
          <h3>Top Tracks</h3>
          {topTracks.length > 0 && <span className="panel-count">{topTracks.length}</span>}
        </div>

        {!selectedArtist && (
          <p className="panel-empty">Select an artist to see their top tracks.</p>
        )}
        {selectedArtist && topTracks.length === 0 && (
          <p className="panel-status">Loading tracks…</p>
        )}

        {topTracks.length > 0 && (
          <ul className="track-list">
            {topTracks.map((track, index) => {
              const isActive =
                currentTrack?.name === track.name && currentTrack?.artist === track.artist

              return (
                <li
                  key={`${track.artist}-${track.name}`}
                  className={`track-row${isActive ? ' is-active' : ''}`}
                  onClick={() => play(topTracks, index)}
                >
                  <div className="track-index-cell">
                    <span className="track-index">{index + 1}</span>
                    <span className="track-play-icon">▶</span>
                  </div>
                  <div className="track-info">
                    <span className="track-name">{track.name}</span>
                    <span className="track-sub">{track.artist}</span>
                  </div>
                  <div className="track-row-right">
                    {track.playcount && (
                      <span className="track-plays">
                        {Number(track.playcount).toLocaleString()}
                      </span>
                    )}
                    <FavoriteTrackButton track={track} />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <PlayerPanel />
    </div>
  )
}
