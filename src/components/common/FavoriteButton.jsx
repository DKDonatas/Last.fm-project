import { useFavorites } from '../../context/FavoritesContext.jsx'

export function FavoriteTrackButton({ track }) {
  const { isTrackFav, toggleTrack } = useFavorites()
  const fav = isTrackFav(track)

  return (
    <button
      className={`fav-btn${fav ? ' fav-btn--active' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        toggleTrack(track)
      }}
      title={fav ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
    >
      {fav ? '♥' : '♡'}
    </button>
  )
}

export function FavoriteArtistButton({ artist }) {
  const { isArtistFav, toggleArtist } = useFavorites()
  const fav = isArtistFav(artist)

  return (
    <button
      className={`fav-btn${fav ? ' fav-btn--active' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        toggleArtist(artist)
      }}
      title={fav ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
    >
      {fav ? '♥' : '♡'}
    </button>
  )
}
