import Image from "next/image";
import "./style.css"

export default function Home() {
  return (
    <div>
     <header>
      <nav className="navbar">
        <div className="nav-left">
          <a href="/" className="logo">
            <svg
              height="26"
              viewBox="0 0 284 65"
              fill="var(--geist-foreground)"
              aria-label="Vercel Logotype"
            >
              <path
                d="M141.68 16.25c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm117.14-14.5c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm-39.03 3.5c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9v-46h9zM37.59.25l36.95 64H.64l36.95-64zm92.38 5l-27.71 48-27.71-48h10.39l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10v14.8h-9v-34h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"
              ></path>
            </svg>
          </a>
          {/* <... 在 nav-menu 部分添加以下代码 ... */}
          <div className="nav-menu">
            <div className="menu-wrapper">
              <button className="menu-item" data-dropdown="products">
                Products
              </button>
              <div className="dropdown-menu products-menu">
                <div className="dropdown-section">
                  <h3>DX Platform</h3>
                  <div className="dropdown-items">
                    <a href="#" className="dropdown-item">
                      <span className="item-icon">📋</span>
                      <div className="item-content">
                        <h4>Previews</h4>
                        <p>Helping teams ship 6x faster</p>
                      </div>
                    </a>
                    <a href="#" className="dropdown-item">
                      <span className="item-icon">🤖</span>
                      <div className="item-content">
                        <h4>AI</h4>
                        <p>Powering breakthroughs</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="menu-wrapper">
              <button className="menu-item" data-dropdown="solutions">
                Solutions
              </button>
              <div className="dropdown-menu solutions-menu">
                <div className="dropdown-section">
                  <h3>Managed Infrastructure</h3>
                  <div className="dropdown-items">
                    <a href="#" className="dropdown-item">
                      <span className="item-icon">⚡</span>
                      <div className="item-content">
                        <h4>Fluid compute</h4>
                        <p>Servers, in serverless form</p>
                      </div>
                    </a>
                    <a href="#" className="dropdown-item">
                      <span className="item-icon">🎨</span>
                      <div className="item-content">
                        <h4>Rendering</h4>
                        <p>Fast, scalable, and reliable</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="menu-wrapper">
              <button className="menu-item" data-dropdown="resources">
                Resources
              </button>
              <div className="dropdown-menu resources-menu">
                <div className="dropdown-section">
                  <h3>Open Source</h3>
                  <div className="dropdown-items">
                    <a href="#" className="dropdown-item">
                      <span className="item-icon">⚛️</span>
                      <div className="item-content">
                        <h4>Next.js</h4>
                        <p>The native Next.js platform</p>
                      </div>
                    </a>
                    <a href="#" className="dropdown-item">
                      <span className="item-icon">🚀</span>
                      <div className="item-content">
                        <h4>Turborepo</h4>
                        <p>Speed with Enterprise scale</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <a href="#" className="menu-item">Enterprise</a>
            <a href="#" className="menu-item">Docs</a>
            <a href="#" className="menu-item">Pricing</a>
          </div>
        </div>
        <div className="nav-right">
          <a href="#" className="login">Log In</a>
          <a href="#" className="contact">Contact</a>
          <button className="signup">Sign Up</button>
        </div>
      </nav>
    </header>
    <main>
      <section className="hero">
        <h1>The platform for the web.</h1>
        <p className="hero-description">
          Vercel provides the developer tools and cloud infrastructure to build,
          scale, and secure a faster, more personalized web.
        </p>
        <div className="hero-buttons">
          <button className="start-deploying">
            <svg width="16" height="16" viewBox="0 0 76 76" fill="none">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="#000000" />
            </svg>
            Start Deploying
          </button>
          <button className="get-demo">Get a Demo</button>
        </div>
      </section>

      <section className="features">
        <div className="feature-columns">
          <div className="feature-column">
            <h2>DX Platform</h2>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"
                  />
                </svg>
              </div>
              <div className="feature-content">
                <h3>Previews</h3>
                <p>Helping teams ship 6x faster</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M13 9h8L11 24v-9H4l9-15v9z" />
                </svg>
              </div>
              <div className="feature-content">
                <h3>AI</h3>
                <p>Powering breakthroughs</p>
              </div>
            </div>
          </div>

          <div className="feature-column">
            <h2>Managed Infrastructure</h2>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"
                  />
                </svg>
              </div>
              <div className="feature-content">
                <h3>Fluid compute</h3>
                <p>Servers, in serverless form</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"
                  />
                </svg>
              </div>
              <div className="feature-content">
                <h3>Rendering</h3>
                <p>Fast, scalable, and reliable</p>
              </div>
            </div>
          </div>

          <div className="feature-column">
            <h2>Open Source</h2>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"
                  />
                </svg>
              </div>
              <div className="feature-content">
                <h3>Next.js</h3>
                <p>The native Next.js platform</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"
                  />
                </svg>
              </div>
              <div className="feature-content">
                <h3>Turborepo</h3>
                <p>Speed with Enterprise scale</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </div>
  );
}
