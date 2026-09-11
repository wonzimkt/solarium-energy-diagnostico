import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Landing from './pages/Landing'
import PanelLogin from './pages/panel/PanelLogin'
import PanelDashboard from './pages/panel/PanelDashboard'
import PanelLeadDetail from './pages/panel/PanelLeadDetail'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/painel" element={<PanelLogin />} />
        <Route path="/painel/leads" element={<PanelDashboard />} />
        <Route path="/painel/leads/:id" element={<PanelLeadDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
