// Entrada standalone — usada só para npm run dev:standalone
import React from 'react'
import ReactDOM from 'react-dom/client'
import AcademicoApp from './AcademicoApp'
import '@uniportal/design-system/tokens.css'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ padding: 24 }}>
      <AcademicoApp token="demo" />
    </div>
  </React.StrictMode>
)
