import React from 'react'
import ReactDOM from 'react-dom/client'
import MatriculaApp from './MatriculaApp'
import '@uniportal/design-system/tokens.css'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ padding: 24 }}>
      <MatriculaApp token="demo" />
    </div>
  </React.StrictMode>
)
