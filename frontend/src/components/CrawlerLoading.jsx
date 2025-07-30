import React from 'react'

function CrawlerLoading({ crawlStatus }) {
  return (
    <div className="loading-screen">
      <p className="snake">🟢 🟢 🟢 crawling through URLs...</p>
      <p>{crawlStatus}</p>
    </div>
  )
}

export default CrawlerLoading
