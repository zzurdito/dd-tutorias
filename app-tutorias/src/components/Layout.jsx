
import {Outlet} from 'react-router-dom'

function Body() {
  return (
    <div className="grid grid-cols-1 grid-rows-5 gap-10">
      <header className="bg-blue-600 text-white p-4 b-1">
        <h1 className="text-center text-3xl">My Application</h1>
      </header>

      <main className="p-4 row-span-3">
        <Outlet />
      </main>

      <footer className="row-start-5 bg-gray-200 text-center p-4">
        © 2024 My Application
      </footer>
    </div>
  )
}

export default Body