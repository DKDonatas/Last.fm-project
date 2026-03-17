import { createContext, useCallback, useContext, useState } from 'react'

const QueueContext = createContext(null)

export function QueueProvider({ children }) {
  const [queue, setQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentTrack = queue[currentIndex] ?? null

  const play = useCallback((tracks, startIndex = 0) => {
    setQueue(tracks)
    setCurrentIndex(startIndex)
  }, [])

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, queue.length - 1))
  }, [queue.length])

  const prev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0))
  }, [])

  return (
    <QueueContext.Provider
      value={{
        queue,
        currentIndex,
        currentTrack,
        play,
        next,
        prev,
        hasNext: currentIndex < queue.length - 1,
        hasPrev: currentIndex > 0,
      }}
    >
      {children}
    </QueueContext.Provider>
  )
}

export const useQueue = () => useContext(QueueContext)
