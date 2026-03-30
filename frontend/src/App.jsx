import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Landing from './pages/Landing.jsx'
import Pricing from './pages/Pricing.jsx'
import FAQ from './pages/FAQ.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LegalPage from './pages/LegalPage.jsx'

export default function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/offer" element={<LegalPage documentKey="offer" />} />
          <Route path="/privacy" element={<LegalPage documentKey="privacy" />} />
          <Route path="/safety" element={<LegalPage documentKey="safety" />} />
        </Routes>
      </main>
      <Footer />
    </LanguageProvider>
  )
}
