import { createContext, useCallback, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const FavoritesContext = createContext(null)

const trackKey = (t) => `${t.artist}|||${t.name}`

export function FavoritesProvider({ children }) {
  const [favTracks, setFavTracks] = useLocalStorage('lastfm_fav_tracks', [])
  const [favArtists, setFavArtists] = useLocalStorage('lastfm_fav_artists', [])

  const toggleTrack = useCallback(
    (track) => {
      setFavTracks((prev) => {
        const key = trackKey(track)
        const exists = prev.some((t) => trackKey(t) === key)
        return exists
          ? prev.filter((t) => trackKey(t) !== key)
          : [...prev, { name: track.name, artist: track.artist }]
      })
    },
    [setFavTracks],
  )

  const toggleArtist = useCallback(
    (artist) => {
      setFavArtists((prev) => {
        const exists = prev.some((a) => a.name === artist.name)
        return exists
          ? prev.filter((a) => a.name !== artist.name)
          : [...prev, { name: artist.name, listeners: artist.listeners }]
      })
    },
    [setFavArtists],
  )

  const isTrackFav = useCallback(
    (track) => favTracks.some((t) => trackKey(t) === trackKey(track)),
    [favTracks],
  )

  const isArtistFav = useCallback(
    (artist) => favArtists.some((a) => a.name === artist.name),
    [favArtists],
  )

  return (
    <FavoritesContext.Provider
      value={{ favTracks, favArtists, toggleTrack, toggleArtist, isTrackFav, isArtistFav }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)
