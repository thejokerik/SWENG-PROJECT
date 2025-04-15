import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Layout from './components/Layout.jsx'
import DetailView from './routes/DetailView.jsx'
import NotFound from './routes/NotFound.jsx'
import About from './routes/About.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} /> 
          <Route path="about" element={<About />} /> 
          <Route path="character/:id" element={<DetailView />} />
          <Route path="*" element={<NotFound />} /> 
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
)