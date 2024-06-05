import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Locations from './Components/LocationList'
import LocationsList from './Components/LocationList'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
<h1>POKÉMON</h1>
<LocationsList/>
  </React.StrictMode>,
)
