import React, { useState } from 'react'

function CrawlerForm({ setIsCrawling, setCrawlStatus }) {
  const [url, setUrl] = useState('')
  const [depth, setDepth] = useState(1)

  const handleCrawl = async () => {
    setIsCrawling(true)
    setCrawlStatus('Crawling...')
    try {
      await fetch(
        `http://localhost:8080/api/crawl?url=${encodeURIComponent(
          url
        )}&depth=${depth}`
      )
      setCrawlStatus('Crawl complete')
      setTimeout(() => setIsCrawling(false), 1000)
    } catch (err) {
      setCrawlStatus('Crawl failed')
      setTimeout(() => setIsCrawling(false), 1000)
    }
  }

  return (
    <div className="form-group">
      <label>Description</label>
      <p>Enter a starting URL and choose depth to crawl linked pages.</p>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
      />
      <input
        type="number"
        min={1}
        value={depth}
        onChange={(e) => setDepth(e.target.value)}
      />
      <button onClick={handleCrawl}>Submit</button>
    </div>
  )
}

export default CrawlerForm
