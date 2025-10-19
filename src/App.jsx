import './App.css'

function App() {
  return (
    <div className="app-root">
      <header className="top-bar">
        <div className="brand">Abhyasi</div>
      </header>

      <main className="content">
        <div className="card">
          <div className="icon" aria-hidden>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M2 20h20" stroke="#FFB020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 20V9a7 7 0 0 1 14 0v11" stroke="#FFB020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 11h6" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="5" r="2" fill="#FFB020" />
            </svg>
          </div>

          <h1>We&rsquo;re building something great</h1>
          <p className="lead">This site is under construction. We&rsquo;re working hard to bring you an improved experience. Check back soon.</p>

          <div className="progress" aria-hidden>
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
