import React from 'react'
import ReactDOM from 'react-dom/client'
import BibliotecaApp from './BibliotecaApp'

const params = new URLSearchParams(location.search)
const token  = params.get('token') ?? undefined

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BibliotecaApp token={token} />
  </React.StrictMode>
)
