const YT_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'

const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY

if (!youtubeApiKey) {
  // eslint-disable-next-line no-console
  console.warn(
    'VITE_YOUTUBE_API_KEY is not set. Track playback search will not work until you add it.',
  )
}

const searchRequest = async (params) => {
  if (!youtubeApiKey) {
    throw new Error('YouTube API key is missing.')
  }

  const url = new URL(YT_SEARCH_URL)
  url.search = new URLSearchParams({
    key: youtubeApiKey,
    part: 'snippet',
    type: 'video',
    maxResults: '1',
    ...params,
  }).toString()

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`YouTube search failed with status ${response.status}`)
  }

  return response.json()
}

export const youtubeClient = {
  async findVideoIdForTrack(artistName, trackName) {
    const query = `${artistName} - ${trackName} official audio`

    const data = await searchRequest({
      q: query,
    })

    const item = data.items?.[0]

    return item?.id?.videoId ?? null
  },
}

