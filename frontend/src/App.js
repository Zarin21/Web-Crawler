import React, { useState, useEffect } from 'react'
import { Search, Globe, ArrowDown, Loader } from 'lucide-react'

// Snake Game Component for loading state
const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [direction, setDirection] = useState({ x: 1, y: 0 })

  useEffect(() => {
    const gameInterval = setInterval(() => {
      setSnake((currentSnake) => {
        const newSnake = [...currentSnake]
        const head = { ...newSnake[0] }

        // Random direction change occasionally
        if (Math.random() < 0.1) {
          const directions = [
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
          ]
          const newDir =
            directions[Math.floor(Math.random() * directions.length)]
          setDirection(newDir)
          head.x += newDir.x
          head.y += newDir.y
        } else {
          head.x += direction.x
          head.y += direction.y
        }

        // Wrap around edges
        if (head.x < 0) head.x = 19
        if (head.x >= 20) head.x = 0
        if (head.y < 0) head.y = 19
        if (head.y >= 20) head.y = 0

        newSnake[0] = head

        // Keep snake length between 3-8 segments
        if (newSnake.length > 8) {
          newSnake.pop()
        } else if (Math.random() < 0.3 && newSnake.length < 8) {
          // Sometimes grow
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }, 200)

    return () => clearInterval(gameInterval)
  }, [direction])

  return (
    <div className="w-64 h-64 border-2 border-red-500 bg-white relative">
      <div className="w-64 h-64 border-2 border-red-500 bg-white relative grid grid-cols-20 grid-rows-20">
        {Array.from({ length: 400 }).map((_, i) => {
          const x = i % 20
          const y = Math.floor(i / 20)
          const isSnake = snake.some(
            (segment) => segment.x === x && segment.y === y
          )

          return (
            <div
              key={i}
              className={`border border-gray-100 ${
                isSnake ? 'bg-red-500' : 'bg-white'
              }`}
            />
          )
        })}
      </div>
      <div className="absolute bottom-2 left-2 text-blue-600 text-sm font-medium">
        Crawling through URLs
      </div>
    </div>
  )
}

// Main Crawler Form Component
const CrawlerForm = ({ onCrawl, isLoading }) => {
  const [url, setUrl] = useState('')
  const [depth, setDepth] = useState(2)

  const handleSubmit = () => {
    if (url.trim()) {
      onCrawl(url.trim(), depth)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 border-2 border-red-500 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-red-600 mb-6 text-center">
        Web Crawler
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block text-red-600 font-medium mb-2">
            Enter a link:
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border-2 border-red-300 rounded focus:border-red-500 focus:outline-none"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-red-600 font-medium mb-2">
            Pick a depth:
          </label>
          <input
            type="number"
            value={depth}
            onChange={(e) => setDepth(parseInt(e.target.value) || 1)}
            min="1"
            max="5"
            className="w-full px-3 py-2 border-2 border-red-300 rounded focus:border-red-500 focus:outline-none"
            disabled={isLoading}
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-2 px-4 bg-red-500 text-white font-medium rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        />
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Loader className="animate-spin mr-2 h-4 w-4" />
            Crawling...
          </span>
        ) : (
          'Submit'
        )}
      </div>

      <div className="mt-6 flex items-center justify-center text-red-600">
        <Globe className="mr-2 h-5 w-5" />
        <span className="font-medium">Links</span>
      </div>
    </div>
  )
}

// Loading Screen Component
const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">
          Crawling in Progress...
        </h2>
        <SnakeGame />
      </div>

      <div className="flex items-center text-blue-600 font-medium">
        <ArrowDown className="mr-2 h-5 w-5" />
        <span>A snake "crawling" through URLs</span>
      </div>

      <div className="mt-4 text-gray-600 text-center">
        <div className="animate-pulse">
          Discovering and indexing web pages...
        </div>
      </div>
    </div>
  )
}

// Search Component
const SearchComponent = ({ results, onSearch, isSearching }) => {
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 border-2 border-red-500 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-red-600 mb-4">Search:</h2>

      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search terms..."
            className="flex-1 px-3 py-2 border-2 border-red-300 rounded focus:border-red-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-gray-700">Results:</h3>

        {isSearching ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="animate-spin h-6 w-6 text-red-500" />
            <span className="ml-2 text-gray-600">Searching...</span>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded border">
                <div className="font-medium text-blue-600 break-all">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {result.url}
                  </a>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Keyword: <span className="font-medium">{result.keyword}</span>
                </div>
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-8 text-gray-500">
            No results found for "{query}"
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            Enter a search term to find indexed pages
          </div>
        )}
      </div>
    </div>
  )
}

// Main App Component
const WebCrawlerApp = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isCrawled, setIsCrawled] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleCrawl = async (url, depth) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `http://localhost:8080/api/crawl?url=${encodeURIComponent(
          url
        )}&depth=${depth}`
      )
      if (response.ok) {
        setIsCrawled(true)
      } else {
        alert('Crawling failed. Please try again.')
      }
    } catch (error) {
      console.error('Crawl error:', error)
      alert('Error connecting to server. Make sure the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (query) => {
    setIsSearching(true)
    try {
      const response = await fetch(
        `http://localhost:8080/api/search?query=${encodeURIComponent(query)}`
      )
      if (response.ok) {
        const results = await response.json()
        setSearchResults(results)
      } else {
        alert('Search failed. Please try again.')
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('Error connecting to server. Make sure the backend is running.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleReset = () => {
    setIsCrawled(false)
    setSearchResults([])
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {!isCrawled ? (
          <div className="flex justify-center">
            <CrawlerForm onCrawl={handleCrawl} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                New Crawl
              </button>
            </div>

            <div className="flex justify-center">
              <SearchComponent
                results={searchResults}
                onSearch={handleSearch}
                isSearching={isSearching}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WebCrawlerApp
