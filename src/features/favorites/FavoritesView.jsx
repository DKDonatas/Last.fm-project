import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useQueue } from '../../context/QueueContext.jsx'
import { FavoriteArtistButton, FavoriteTrackButton } from '../../components/common/FavoriteButton.jsx'
import { PlayerPanel } from '../../components/player/PlayerPanel.jsx'

export function FavoritesView({ onArtistSelect }) {
  const { favTracks, favArtists } = useFavorites()
  const { play } = useQueue()

  return (
    <div className="dashboard-grid">
      <section className="panel">
        <div className="panel-header">
          <h3>Favorite Artists</h3>
          {favArtists.length > 0 && (
            <span className="panel-count">{favArtists.length}</span>
          )}
        </div>

        {favArtists.length === 0 && (
          <p className="panel-empty">
            No favorite artists yet. Click ♡ on any artist to save them here.
          </p>
        )}

        {favArtists.length > 0 && (
          <ul className="track-list">
            {favArtists.map((artist, index) => (
              <li
                key={artist.name}
                className="track-row"
                onClick={() => onArtistSelect?.(artist)}
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
          <h3>Favorite Tracks</h3>
          {favTracks.length > 0 && (
            <span className="panel-count">{favTracks.length}</span>
          )}
        </div>

        {favTracks.length === 0 && (
          <p className="panel-empty">
            No favorite tracks yet. Click ♡ on any track to save it here.
          </p>
        )}

        {favTracks.length > 0 && (
          <>
            {favTracks.length > 1 && (
              <button className="btn-play-all" onClick={() => play(favTracks, 0)}>
                ▶ Play All
              </button>
            )}
            <ul className="track-list">
              {favTracks.map((track, index) => (
                <li
                  key={`${track.artist}-${track.name}`}
                  className="track-row"
                  onClick={() => play(favTracks, index)}
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
                    <FavoriteTrackButton track={track} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <PlayerPanel />
    </div>
  )
}
