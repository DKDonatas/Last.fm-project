const API_BASE_URL = 'https://ws.audioscrobbler.com/2.0/'

const apiKey = import.meta.env.VITE_LASTFM_API_KEY

if (!apiKey) {
  // eslint-disable-next-line no-console
  console.warn('VITE_LASTFM_API_KEY is not set. Last.fm requests will fail.')
}

const buildUrl = (params) => {
  const searchParams = new URLSearchParams({
    api_key: apiKey ?? '',
    format: 'json',
    ...params,
  })

  return `${API_BASE_URL}?${searchParams.toString()}`
}

const request = async (params) => {
  const url = buildUrl(params)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Last.fm request failed with status ${response.status}`)
  }

  return response.json()
}

export const lastfmClient = {
  searchArtists(query) {
    if (!query.trim()) {
      return Promise.resolve({ results: null })
    }

    return request({
      method: 'artist.search',
      artist: query,
      limit: 10,
    })
  },
  getArtistTopTracks(artistName, limit = 10) {
    if (!artistName.trim()) {
      return Promise.resolve({ toptracks: { track: [] } })
    }

    return request({
      method: 'artist.getTopTracks',
      artist: artistName,
      limit,
    })
  },
  getChartTopArtists(limit = 10) {
    return request({ method: 'chart.getTopArtists', limit })
  },
  getChartTopTracks(limit = 10) {
    return request({ method: 'chart.getTopTracks', limit })
  },
  getUserTopArtists(username, period = '7day', limit = 10) {
    if (!username.trim()) {
      return Promise.resolve({ topartists: { artist: [] } })
    }

    return request({
      method: 'user.getTopArtists',
      user: username,
      period,
      limit,
    })
  },
  getUserTopTracks(username, period = '7day', limit = 10) {
    if (!username.trim()) {
      return Promise.resolve({ toptracks: { track: [] } })
    }

    return request({
      method: 'user.getTopTracks',
      user: username,
      period,
      limit,
    })
  },
  getUserRecentTracks(username, limit = 10) {
    if (!username.trim()) {
      return Promise.resolve({ recenttracks: { track: [] } })
    }

    return request({
      method: 'user.getRecentTracks',
      user: username,
      limit,
    })
  },
}

