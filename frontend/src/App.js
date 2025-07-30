import React, { useState } from 'react'
import './App.css'
import CrawlerForm from './components/CrawlerForm'
import CrawlerLoading from './components/CrawlerLoading'
import SearchSection from './components/SearchSection'

function App() {
  const [isCrawling, setIsCrawling] = useState(false)
  const [crawlStatus, setCrawlStatus] = useState('')

  return (
    <div className="app-container">
      <h1>Web Crawler</h1>
      {!isCrawling ? (
        <>
          <CrawlerForm
            setIsCrawling={setIsCrawling}
            setCrawlStatus={setCrawlStatus}
          />
          <SearchSection />
        </>
      ) : (
        <CrawlerLoading crawlStatus={crawlStatus} />
      )}
    </div>
  )
}

export default App
