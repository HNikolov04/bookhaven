import { Outlet, ScrollRestoration } from 'react-router'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

export function MainLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
