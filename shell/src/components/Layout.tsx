import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="layout">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-main" id="main-content" role="main" aria-label="Conteúdo principal">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
