import React, { useState } from 'react'
import { Search, Globe, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export default function WebCrawlerApp() {
  const [crawlUrl, setCrawlUrl] = useState('')
  const [depth, setDepth] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [crawling, setCrawling] = useState(false)
  const [searching, setSearching] = useState(false)
  const [crawlMessage, setCrawlMessage] = useState('')
  const [crawlSuccess, setCrawlSuccess] = useState(false)

  const API_BASE_URL = 'https://web-crawler-backend-4x3vdz77ea-uc.a.run.app/api'

  const handleCrawl = async () => {
    if (!crawlUrl) {
      setCrawlMessage('Please enter a URL')
      setCrawlSuccess(false)
      return
    }

    setCrawling(true)
    setCrawlMessage('')
    setCrawlSuccess(false)

    try {
      const response = await fetch(`${API_BASE_URL}/crawl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: crawlUrl,
          depth: depth,
        }),
      })

      const data = await response.text()

      if (response.ok) {
        setCrawlMessage(data)
        setCrawlSuccess(true)
      } else {
        setCrawlMessage(data || 'Failed to crawl website')
        setCrawlSuccess(false)
      }
    } catch (error) {
      setCrawlMessage('Error connecting to backend: ' + error.message)
      setCrawlSuccess(false)
    } finally {
      setCrawling(false)
    }
  }

  const handleSearch = async () => {
    if (!searchKeyword) {
      return
    }

    setSearching(true)

    try {
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: searchKeyword,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('Error searching:', error)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const handleCrawlKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCrawl()
    }
  }

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Globe className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Web Crawler</h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={crawlUrl}
                onChange={(e) => setCrawlUrl(e.target.value)}
                onKeyPress={handleCrawlKeyPress}
                placeholder="https://en.wikipedia.org/wiki/Paris"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crawl Depth
              </label>
              <input
                type="text"
                value={depth}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  setDepth(isNaN(val) ? 0 : val)
                }}
                onKeyPress={handleCrawlKeyPress}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <button
              onClick={handleCrawl}
              disabled={crawling}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {crawling ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Crawling...
                </>
              ) : (
                <>Start</>
              )}
            </button>
          </div>

          {crawlMessage && (
            <div
              className={`mt-4 p-4 rounded-lg flex items-start ${
                crawlSuccess
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {crawlSuccess ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              )}
              <p className={crawlSuccess ? 'text-green-800' : 'text-red-800'}>
                {crawlMessage}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Search className="w-6 h-6 mr-2 text-indigo-600" />
            Search Keywords
          </h2>

          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="Enter keyword to search..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleSearch}
                disabled={searching}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 flex items-center"
              >
                {searching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            {searchResults.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Found {searchResults.length} result
                  {searchResults.length !== 1 ? 's' : ''}
                </h3>
                <div className="space-y-3">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <h4 className="font-semibold text-indigo-600 mb-1">
                        {result.title}
                      </h4>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-indigo-600 break-all"
                      >
                        {result.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ) : searchKeyword && !searching ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No results found for "{searchKeyword}"</p>
                <p className="text-sm mt-2">
                  Try crawling a website first or search for different keywords
                </p>
              </div>
            ) : !searchKeyword ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Enter a keyword to search indexed content</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
