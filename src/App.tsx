import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { DocsLayout } from './pages/docs/DocsLayout'
import { GettingStarted } from './pages/docs/GettingStarted'
import { Installation } from './pages/docs/Installation'
import { ComponentsOverview } from './pages/docs/ComponentsOverview'
import { ComponentPage } from './pages/docs/ComponentPage'
import { Changelog } from './pages/docs/Changelog'
import { DesignLanguage } from './pages/docs/DesignLanguage'
import { AIIntegration } from './pages/docs/AIIntegration'
import { TemplatePage } from './pages/TemplatePage'
import { PlaygroundPage } from './pages/PlaygroundPage'
import { TermsPage } from './pages/TermsPage'
import { CreatePage } from './pages/CreatePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/docs" element={<DocsLayout />}>
            <Route index element={<GettingStarted />} />
            <Route path="getting-started" element={<GettingStarted />} />
            <Route path="installation" element={<Installation />} />
            <Route path="design-language" element={<DesignLanguage />} />
            <Route path="components" element={<ComponentsOverview />} />
            <Route path="components/:componentId" element={<ComponentPage />} />
            <Route path="ai-integration" element={<AIIntegration />} />
            <Route path="changelog" element={<Changelog />} />
          </Route>
          <Route path="/blocks" element={<TemplatePage />} />
          <Route path="/templates" element={<Navigate to="/blocks" replace />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
