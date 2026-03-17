import { useEffect, useRef, useState } from 'react'
import { useQueue } from '../../context/QueueContext.jsx'
import { youtubeClient } from '../../api/youtubeClient.js'

export function PlayerPanel() {
  const { currentTrack, next, prev, hasNext, hasPrev } = useQueue()
  const [videoId, setVideoId] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)
  const lastTrackRef = useRef(null)

  useEffect(() => {
    let isCancelled = false

    if (!currentTrack) {
      setVideoId(null)
      setError(null)
      setIsSearching(false)
      lastTrackRef.current = null
      return
    }

    const isSameTrack =
      lastTrackRef.current?.name === currentTrack.name &&
      lastTrackRef.current?.artist === currentTrack.artist

    if (isSameTrack) return

    lastTrackRef.current = currentTrack
    setIsSearching(true)
    setError(null)
    setVideoId(null)

    youtubeClient
      .findVideoIdForTrack(currentTrack.artist, currentTrack.name)
      .then((id) => {
        if (isCancelled) return
        setVideoId(id)
        if (!id) setError('No matching video found on YouTube.')
      })
      .catch((err) => {
        if (isCancelled) return
        setError(err.message ?? 'Something went wrong.')
        setVideoId(null)
      })
      .finally(() => {
        if (isCancelled) return
        setIsSearching(false)
      })

    return () => {
      isCancelled = true
    }
  }, [currentTrack])

  const isActive = Boolean(currentTrack && (isSearching || videoId))

  return (
    <section className={`panel player-panel${isActive ? ' player-panel--active' : ''}`}>
      <div className="panel-header">
        <h3>Now Playing</h3>
        {currentTrack && !isSearching && videoId && (
          <div className="player-indicator">
            <span className="now-playing-dot" />
            <span className="eq-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </div>
        )}
      </div>

      {!currentTrack && (
        <div className="player-idle">
          <span className="player-idle-icon">♪</span>
          <span>Pick an artist, then click a track to start playing</span>
        </div>
      )}

      {currentTrack && (
        <div className="player-now-playing">
          <div>
            <div className="player-track-name">{currentTrack.name}</div>
            <div className="player-artist-name">{currentTrack.artist}</div>
          </div>
        </div>
      )}

      {isSearching && <div className="player-searching">Finding on YouTube…</div>}
      {error && !isSearching && <div className="player-error">{error}</div>}

      {videoId && (
        <div className="player-frame">
          <iframe
            key={videoId}
            title={`${currentTrack.name} — ${currentTrack.artist}`}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}

      {(hasPrev || hasNext) && (
        <div className="player-controls">
          <button
            className="player-ctrl-btn"
            onClick={prev}
            disabled={!hasPrev}
            aria-label="Previous track"
            title="Previous track"
          >
            ⏮
          </button>
          <button
            className="player-ctrl-btn"
            onClick={next}
            disabled={!hasNext}
            aria-label="Next track"
            title="Next track"
          >
            ⏭
          </button>
        </div>
      )}
    </section>
  )
}
