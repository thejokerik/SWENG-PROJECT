import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
      <header>
        <a className="nonlink" href="/">
          <div className="logo">
            <h1>the superhero database</h1>
          </div>
        </a>
        <pre>Rudrajit Sengupta (Z23751380)</pre>
        <div className="hamburger-menu">
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>

      <nav className="mobile-nav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/About">About</a></li>
        </ul>
      </nav>

      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout