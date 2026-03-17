import { useEffect, useState } from 'react'
import { lastfmClient } from '../../api/lastfmClient.js'
import { PlayerPanel } from '../../components/player/PlayerPanel.jsx'
import { FavoriteArtistButton, FavoriteTrackButton } from '../../components/common/FavoriteButton.jsx'
import { useQueue } from '../../context/QueueContext.jsx'

export function HomeView({ onArtistSelect }) {
  const [chartArtists, setChartArtists] = useState([])
  const [chartTracks, setChartTracks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { play, currentTrack } = useQueue()

  useEffect(() => {
    setIsLoading(true)

    Promise.all([
      lastfmClient.getChartTopArtists(10),
      lastfmClient.getChartTopTracks(10),
    ])
      .then(([artistsData, tracksData]) => {
        const artists = artistsData?.artists?.artist ?? []
        setChartArtists(Array.isArray(artists) ? artists : [artists].filter(Boolean))

        const tracks = tracksData?.tracks?.track ?? []
        const normalized = Array.isArray(tracks) ? tracks : [tracks].filter(Boolean)
        setChartTracks(
          normalized.map((t) => ({
            name: t.name,
            artist: t.artist?.name ?? '',
            playcount: t.playcount,
          })),
        )
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <h3>Trending Artists</h3>
          </div>
          <p className="panel-status">Loading charts…</p>
        </section>
        <section className="panel">
          <div className="panel-header">
            <h3>Trending Tracks</h3>
          </div>
          <p className="panel-status">Loading charts…</p>
        </section>
        <PlayerPanel />
      </div>
    )
  }

  return (
    <div className="dashboard-grid">
      <section className="panel">
        <div className="panel-header">
          <h3>Trending Artists</h3>
          <span className="panel-badge">This Week</span>
        </div>

        <ul className="track-list">
          {chartArtists.map((artist, index) => (
            <li
              key={artist.mbid || artist.name}
              className="track-row"
              onClick={() => onArtistSelect(artist)}
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
      </section>

      <section className="panel panel-tracks">
        <div className="panel-header">
          <h3>Trending Tracks</h3>
          <span className="panel-badge">This Week</span>
        </div>

        <ul className="track-list">
          {chartTracks.map((track, index) => {
            const isActive =
              currentTrack?.name === track.name && currentTrack?.artist === track.artist

            return (
              <li
                key={`${track.artist}-${track.name}`}
                className={`track-row${isActive ? ' is-active' : ''}`}
                onClick={() => play(chartTracks, index)}
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
      </section>

      <PlayerPanel />
    </div>
  )
}
