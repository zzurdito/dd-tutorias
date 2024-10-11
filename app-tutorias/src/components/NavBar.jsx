import './styles/NavBar.css'
import LogOutBtn from './LogOutBtn'
import {Link} from 'react-router-dom'

function NavBar() {
  return (
<div className="navbar h-full flex bg-blue-500 w-64">
      {/* Navbar vertical */}
      <nav className="w-64 flex flex-col">
        {/* Enlaces principales */}
        <div className="principal-ref">
          <Link to="/content/calendar" className="btn-navbar bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">Calendar</Link>
          <Link to="/content/events" className="btn-navbar bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">Events</Link>
         <Link to="/content/profile" className="btn-navbar bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">My profile</Link>
        </div>
        <div className="info">
          <div className="tokens text-white font-bold">14 tokens</div>
          <a href="#" className="btn-navbar bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">Buy tokens</a>
          <LogOutBtn />
        </div>
      </nav>
    </div>
  )
}

export default NavBar