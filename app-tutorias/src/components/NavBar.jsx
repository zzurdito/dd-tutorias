

function NavBar() {
  return (
<div className="flex">
      {/* Navbar vertical */}
      <nav className="bg-gray-800 w-64 min-h-screen flex flex-col space-y-2 p-4">
        {/* Enlaces principales */}
        <h3 className="py-2 px-4 bg-gray-700 text-xl rounded-md hover:bg-gray-600">Dashboard</h3>
        <a href="#" className="py-2 px-5 text-white text-center bg-blue-600 rounded-md hover:bg-gray-500">Calendar</a>
        <a href="#" className="py-2 px-5 text-white text-center bg-blue-600 rounded-md hover:bg-gray-500">Events</a>
        <a href="#" className="py-2 px-5 bg-gray-700 text-white text-center bg-blue-600 rounded-md hover:bg-gray-600">Buy tokens</a>
        <a href="#" className="py-2 px-5 bg-gray-700 text-white text-center bg-blue-600 rounded-md hover:bg-gray-600">My profile</a>
      </nav>
    </div>
  )
}

export default NavBar