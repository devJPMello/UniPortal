import React from 'react'
import ReactDOM from 'react-dom/client'
import FinanceiroApp from './FinanceiroApp'

const params = new URLSearchParams(location.search)
const token  = params.get('token') ?? undefined

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FinanceiroApp token={token} />
  </React.StrictMode>
)
