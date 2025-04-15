import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import './App.css'

function App() {
  const [characters, setCharacters] = useState([])
  const [totalCharacters, setTotalCharacters] = useState(0)
  const [totalHeroes, setTotalHeroes] = useState(0)
  const [totalVillains, setTotalVillains] = useState(0)
  const [totalAntiHeroes, setTotalAntiHeroes] = useState(0)
  const [totalMarvel, setTotalMarvel] = useState(0)
  const [totalDC, setTotalDC] = useState(0)
  const [totalOthers, setTotalOthers] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'All',
    comic: 'All',
    affiliation: 'All',
    minWeight: 0,
    maxWeight: 2204
  })
  const [showImages, setShowImages] = useState(true)
  const limit = 15
  const apiUrl = 'https://akabab.github.io/superhero-api/api'

  const filterOptions = {
    type: ['All', 'good', 'bad', 'neutral'],
    comic: ['All', 'Marvel Comics', 'DC Comics'],
    affiliation: ['All', 'Avengers', 'Justice League', 'Fantastic Four', 'X-Men']
  }

  const typeSliderValues = ['All', 'good', 'bad', 'neutral']

  useEffect(() => {
    const fetchTotalCounts = async () => {
      try {
        const response = await fetch(`${apiUrl}/all.json`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setTotalCharacters(data.length)
        setTotalHeroes(data.filter(character => character.biography.alignment === 'good').length)
        setTotalVillains(data.filter(character => character.biography.alignment === 'bad').length)
        setTotalAntiHeroes(data.filter(character => character.biography.alignment === 'neutral' || character.biography.alignment === '-').length)
        setTotalMarvel(data.filter(character => character.biography.publisher === 'Marvel Comics').length)
        setTotalDC(data.filter(character => character.biography.publisher === 'DC Comics').length)
        setTotalOthers(data.filter(character => character.biography.publisher !== 'Marvel Comics' && character.biography.publisher !== 'DC Comics').length)
      } catch (error) {
        console.error('Error fetching total counts:', error)
      }
    }

    fetchTotalCounts()
  }, [apiUrl])

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${apiUrl}/all.json`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        const filteredData = data.filter(character => 
          character.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (selectedFilters.type === 'All' || selectedFilters.type === character.biography.alignment) &&
          (selectedFilters.comic === 'All' || selectedFilters.comic === character.biography.publisher) &&
          (selectedFilters.affiliation === 'All' || character.connections.groupAffiliation.includes(selectedFilters.affiliation)) &&
          (parseInt(character.appearance.weight[1]) * 2.20462 >= selectedFilters.minWeight && parseInt(character.appearance.weight[1]) * 2.20462 <= selectedFilters.maxWeight)
        )
        setCharacters(filteredData.slice(0, (page + 1) * limit))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCharacters()
  }, [page, searchQuery, selectedFilters, apiUrl])

  const loadMoreCharacters = () => {
    setPage(prevPage => prevPage + 1)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setPage(0)
    setCharacters([])
  }

  const handleFilterChange = (category, value) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [category]: value
    }))
    setPage(0)
    setCharacters([])
  }

  const handleTypeSliderChange = (e) => {
    const value = typeSliderValues[e.target.value]
    handleFilterChange('type', value)
  }

  const handleWeightChange = (e, type) => {
    const value = parseInt(e.target.value)
    handleFilterChange(type, value)
  }

  const alignmentData = [
    { category: 'Heroes', value: totalHeroes },
    { category: 'Villains', value: totalVillains },
    { category: 'Anti-Hero', value: totalAntiHeroes }
  ]

  const comicData = [
    { category: 'Marvel', value: totalMarvel },
    { category: 'DC', value: totalDC },
    { category: 'Others', value: totalOthers }
  ]

  return (
    <div>
      <main className="container">
        <div className="search-filter-container">
          <div className="filters">
            <h3>Search</h3>
            <div className="search-bar">
              <input type="text" placeholder="Search for a character..." onChange={handleSearchChange}></input>
            </div>
            
            <div className="info-bar">
              <p>Total Characters: <strong> {totalCharacters}</strong></p>
              <p>Total Heroes:<strong> {totalHeroes}</strong></p>
              <p>Total Villains:<strong>{totalVillains}</strong></p>
              <p>Total Anti-Heroes:<strong> {totalAntiHeroes}</strong></p>
              <div className="toggle-images">
              <label>
                <input
                  type="checkbox"
                  checked={showImages}
                  onChange={() => setShowImages(!showImages)}
                />
              </label><p>Show Images <h6>(Use this only if your internet is slow)</h6></p>
              </div>
              <h6>Learn more about the API used at <a href="https://www.superheroapi.com" target='blank'>SuperHeroAPI</a></h6>
            </div>
          </div>

          <div className="filters">
            <h3>Filter Characters</h3>
            <div className="filter-group">
              <h4>Type<h6>(Use this filter to sort by alignment)</h6></h4>
              
              <div id="sldr" className="filter-options">
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={typeSliderValues.indexOf(selectedFilters.type)}
                  onChange={handleTypeSliderChange}
                />
                <div className="slider-labels">
                  {typeSliderValues.map((option, index) => (
                    <span key={option} className={selectedFilters.type === option ? 'active' : ''}>
                      {option === 'good' ? 'Hero' : option === 'bad' ? 'Villain' : option === 'neutral' ? 'Anti-Hero' : 'All'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="filter-group">
              <h4>Comic<h6>(Use this filter to sort by publisher)</h6></h4>
              <div className="filter-options">
                {filterOptions.comic.map(option => (
                  <label key={option}>
                    <input
                      type="radio"
                      name="comic"
                      value={option}
                      checked={selectedFilters.comic === option}
                      onChange={() => handleFilterChange('comic', option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <h4>Affiliations<h6>(Use this filter to sort by team affiliation)</h6></h4>
              <div className="filter-options">
                {filterOptions.affiliation.map(option => (
                  <label key={option}>
                    <input
                      type="radio"
                      name="affiliation"
                      value={option}
                      checked={selectedFilters.affiliation === option}
                      onChange={() => handleFilterChange('affiliation', option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <h4>Weight (lb)</h4>
              <div className="filter-options">
                <label>
                  Min Weight:
                  <input
                    type="number"
                    min="0"
                    max="2204"
                    value={selectedFilters.minWeight}
                    onChange={(e) => handleWeightChange(e, 'minWeight')}
                  />
                </label>
                <label>
                  Max Weight:
                  <input
                    type="number"
                    min="0"
                    max="2204"
                    value={selectedFilters.maxWeight}
                    onChange={(e) => handleWeightChange(e, 'maxWeight')}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="filters">
            <div className="alignment-chart">
              <h3>Character Alignments</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={alignmentData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#e62429">
                    <LabelList dataKey="value" position="inside" style={{ fill: '#fff', fontWeight: 'bold' }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="comic-chart">
              <h3>Comics</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={comicData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1e88e5">
                    <LabelList dataKey="value" position="inside" style={{ fill: '#fff', fontWeight: 'bold' }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="characters-grid">
          {characters.length === 0 && !loading && (
            <p>No characters found. Please adjust your search or filters.</p>
          )}
          {characters.map(character => (
            <Link to={`/character/${character.id}`} key={character.id} className="character-card">
              {showImages && (
                <img src={character.images.md || 'placeholder-image-url'} alt={character.name || 'Unknown Character'}></img>
              )}
              <div className="character-info">
                <h3>{character.name || 'N/A'}</h3>
                <p>Alter Ego: {character.biography.fullName || 'N/A'}</p>
                <p>
                  Type: {character.biography.alignment === 'good' ? 'Hero' : 
                        character.biography.alignment === 'bad' ? 'Villain' : 
                        character.biography.alignment === 'neutral' ? 'Anti-Hero' : 'N/A'}
                </p>
                <p>Comic: {character.biography.publisher || 'N/A'}</p>
                <p>
                  Weight: {character.appearance.weight && character.appearance.weight[1] && character.appearance.weight[1] !== '0 kg'
                    ? `${(parseFloat(character.appearance.weight[1].replace(' kg', '')) * 2.20462).toFixed(2)} lb`
                    : 'N/A'}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {loading && <p>Loading...</p>}
        {!loading && characters.length >= limit && <button className="apply-filters" id="lmore" onClick={loadMoreCharacters}>Load More</button>}
      </main>
    </div>
  )
}

export default App