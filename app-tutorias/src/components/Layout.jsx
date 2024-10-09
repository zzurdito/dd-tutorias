
import {Outlet} from 'react-router-dom'
import SignUpBtn from './SignUpBtn'

function Body() {
  return (
    <div className="w-screen h-dvh flex flex-col justify-between items-center">
      <header className="w-full flex justify-between items-center bg-blue-600 p-4 shadow-md">
        <div className="flex-shrink-0"><div className="text-3xl logo">Logo</div><SignUpBtn/></div>
      </header>

      <main className="w-full p-4 flex-grow bg-blue">
        <Outlet />
      </main>

      <footer className="w-full bg-gray-200 text-center p-4">
        © 2024 My Application
      </footer>
    </div>
  )
}

export default Body