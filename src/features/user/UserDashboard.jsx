import { useEffect, useState } from 'react'
import { lastfmClient } from '../../api/lastfmClient.js'
import { PlayerPanel } from '../../components/player/PlayerPanel.jsx'
import { FavoriteArtistButton, FavoriteTrackButton } from '../../components/common/FavoriteButton.jsx'
import { useQueue } from '../../context/QueueContext.jsx'

export function UserDashboard({ username }) {
  const [topArtists, setTopArtists] = useState([])
  const [topTracks, setTopTracks] = useState([])
  const [recentTracks, setRecentTracks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { play, currentTrack } = useQueue()

  useEffect(() => {
    if (!username.trim()) {
      setTopArtists([])
      setTopTracks([])
      setRecentTracks([])
      setError(null)
      return
    }

    let isCancelled = false
    setIsLoading(true)
    setError(null)

    Promise.all([
      lastfmClient.getUserTopArtists(username, '7day', 10),
      lastfmClient.getUserTopTracks(username, '7day', 10),
      lastfmClient.getUserRecentTracks(username, 10),
    ])
      .then(([artistsData, tracksData, recentData]) => {
        if (isCancelled) return

        const artists = artistsData?.topartists?.artist ?? []
        setTopArtists(Array.isArray(artists) ? artists : [artists].filter(Boolean))

        const tracksRaw = tracksData?.toptracks?.track ?? []
        const tracks = Array.isArray(tracksRaw) ? tracksRaw : [tracksRaw].filter(Boolean)
        const mappedTracks = tracks.map((t) => ({
          name: t.name,
          artist: t.artist?.name ?? '',
          playcount: t.playcount,
        }))
        setTopTracks(mappedTracks)
        if (mappedTracks.length) play(mappedTracks, 0)

        const recentRaw = recentData?.recenttracks?.track ?? []
        const recent = Array.isArray(recentRaw) ? recentRaw : [recentRaw].filter(Boolean)
        setRecentTracks(
          recent.map((t) => ({
            name: t.name,
            artist: t.artist?.['#text'] ?? '',
            album: t.album?.['#text'] ?? '',
            date: t.date?.uts,
            nowPlaying: t['@attr']?.nowplaying === 'true',
          })),
        )
      })
      .catch((err) => {
        if (isCancelled) return
        setError(err.message ?? 'Failed to load user data. Is the username correct?')
      })
      .finally(() => {
        if (isCancelled) return
        setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [username, play])

  if (!username) {
    return (
      <div className="user-empty">
        <div className="user-empty-icon">👤</div>
        <p>Enter your Last.fm username in the bar above and press Go.</p>
      </div>
    )
  }

  return (
    <div className="dashboard-grid">
      <section className="panel">
        <div className="panel-header">
          <h3>{username}'s Top Artists</h3>
          {topArtists.length > 0 && <span className="panel-count">{topArtists.length}</span>}
        </div>

        {isLoading && <p className="panel-status">Loading…</p>}
        {error && (
          <p className="panel-status" style={{ color: 'var(--red)' }}>
            {error}
          </p>
        )}
        {!isLoading && !error && topArtists.length === 0 && (
          <p className="panel-empty">No top artists found yet for this user.</p>
        )}

        {topArtists.length > 0 && (
          <ul className="track-list">
            {topArtists.map((artist, index) => (
              <li key={artist.mbid || artist.name} className="track-row">
                <div className="track-index-cell">
                  <span className="track-index">{index + 1}</span>
                </div>
                <div className="track-info">
                  <span className="track-name">{artist.name}</span>
                  {artist.playcount && (
                    <span className="track-sub">
                      {Number(artist.playcount).toLocaleString()} plays
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
          <h3>{username}'s Top Tracks</h3>
          {topTracks.length > 0 && <span className="panel-count">{topTracks.length}</span>}
        </div>

        {!isLoading && !error && topTracks.length === 0 && (
          <p className="panel-empty">No top tracks found yet for this user.</p>
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

      <section className="panel">
        <div className="panel-header">
          <h3>Recent Scrobbles</h3>
          {recentTracks.length > 0 && (
            <span className="panel-count">{recentTracks.length}</span>
          )}
        </div>

        {!isLoading && !error && recentTracks.length === 0 && (
          <p className="panel-empty">No recent tracks found.</p>
        )}

        {recentTracks.length > 0 && (
          <ul className="track-list">
            {recentTracks.map((track, index) => (
              <li
                key={`${track.artist}-${track.name}-${track.date ?? index}`}
                className={`track-row${track.nowPlaying ? ' is-active' : ''}`}
                onClick={() => play([{ name: track.name, artist: track.artist }], 0)}
              >
                <div className="track-index-cell">
                  <span className="track-index">{index + 1}</span>
                  <span className="track-play-icon">▶</span>
                </div>
                <div className="track-info">
                  <span className="track-name">{track.name}</span>
                  <span className="track-sub">
                    {track.artist}
                    {track.album && ` • ${track.album}`}
                  </span>
                </div>
                <div className="track-row-right">
                  {track.nowPlaying && <span className="live-badge">Live</span>}
                  <FavoriteTrackButton track={{ name: track.name, artist: track.artist }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <PlayerPanel />
    </div>
  )
}
