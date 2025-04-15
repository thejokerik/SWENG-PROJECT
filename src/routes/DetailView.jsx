import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import './DetailView.css'

function DetailView() {
  const { id } = useParams()
  const [character, setCharacter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [delayedLoading, setDelayedLoading] = useState(true) // State for delayed loading
  const apiUrl = 'https://akabab.github.io/superhero-api/api'

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(`${apiUrl}/id/${id}.json`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setCharacter(data)
      } catch (error) {
        console.error('Error fetching character details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCharacter()
  }, [id, apiUrl])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedLoading(false)
    }, 50) // animation delay

    return () => clearTimeout(timer)
  }, [])

  if (loading || delayedLoading) {
    return <p className="loading-message">Loading character details...</p>
  }

  if (!character) {
    return <p className="error-message">Character not found.</p>
  }

  const convertHeightToFeetInches = (heightCm) => {
    if (!heightCm || heightCm === '0') return 'N/A'
    const totalInches = Math.round(heightCm * 0.393701)
    const feet = Math.floor(totalInches / 12)
    const inches = totalInches % 12
    return `${feet} ft ${inches} in`
  }

  const convertWeightToPounds = (weightKg) => {
    if (!weightKg || weightKg === '0') return 'N/A'
    const pounds = Math.round(weightKg * 2.20462)
    return `${pounds} lb`
  }

  const getAlignmentLabel = (alignment) => {
    if (alignment === 'good') return 'Hero'
    if (alignment === 'bad') return 'Villain'
    if (alignment === 'neutral') return 'Anti-Hero'
    return 'Unknown'
  }

  const powerStatsData = Object.entries(character.powerstats).map(([key, value]) => ({
    category: key.charAt(0).toUpperCase() + key.slice(1),
    value: value || 0, 
  }))

  return (
    <div className="character-detail-container">
      {/* Header Section: Image and Chart */}
      <div className="character-header">
        {/* Character Image */}
        <div className="character-image-container">
          <img className="character-image" src={character.images.md} alt={character.name} />
          <h1 className="character-name">{character.name}</h1>
        </div>

        {/* Power Stats Chart */}
        <div className="character-chart">
          <h2>Power Stats</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={powerStatsData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} /> 
              <YAxis type="category" dataKey="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#e63946">
                <LabelList dataKey="value" position="insideRight" style={{ fill: '#fff', fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Details Section */}
      <div className="character-details">
        <p><strong>Alter Ego:</strong> {character.biography.fullName || 'N/A'}</p>
        <p><strong>Alignment:</strong> {getAlignmentLabel(character.biography.alignment)}</p>
        <p><strong>Publisher:</strong> {character.biography.publisher}</p>
        <p><strong>Height:</strong> {convertHeightToFeetInches(character.appearance.height[1]?.replace(' cm', ''))}</p>
        <p><strong>Weight:</strong> {convertWeightToPounds(character.appearance.weight[1]?.replace(' kg', ''))}</p>
        <p><strong>Group Affiliations:</strong> {character.connections.groupAffiliation || 'N/A'}</p>
        <p><strong>Place of Birth:</strong> {character.biography.placeOfBirth || 'N/A'}</p>
        <p><strong>First Appearance:</strong> {character.biography.firstAppearance || 'N/A'}</p>
        <p><strong>Occupation:</strong> {character.work.occupation || 'N/A'}</p>
        <p><strong>Base:</strong> {character.work.base || 'N/A'}</p>
        <p><strong>Aliases:</strong> {character.biography.aliases.length > 0 ? character.biography.aliases.join(', ') : 'N/A'}</p>
        <p><strong>Relatives:</strong> {character.connections.relatives || 'N/A'}</p>
      </div>
    </div>
  )
}

export default DetailView