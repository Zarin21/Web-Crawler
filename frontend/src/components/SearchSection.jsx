import React, { useState } from 'react'

function SearchSection() {
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/search?query=${encodeURIComponent(search)}`
      )
      const data = await response.json()
      setSearchResults(data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="search-section">
      <label>Search</label>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="e.g. machine"
      />
      <button onClick={handleSearch}>Search</button>

      <div className="results">
        {searchResults.length === 0 ? (
          <p>No results</p>
        ) : (
          <ul>
            {searchResults.map((item, index) => (
              <li key={index}>
                <strong>{item.keyword}</strong> —{' '}
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.url}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default SearchSection
