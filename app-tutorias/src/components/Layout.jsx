
import {Outlet} from 'react-router-dom'
import SignUpBtn from './SignUpBtn'
import headerLogo from '../images/InterfazHome/HeaderWebUniversae.png'

function Body() {
  return (
    <div className="w-screen h-screen flex flex-col justify-between items-center">
      
      <header className=" w-full grow-0 flex items-center bg-blue-600 p-4 shadow-md">
        <div className="header w-full flex-shrink-0 flex flex-row justify-between">
          <div className="text-3xl logo"><img src={headerLogo} alt="Header logo" /></div>
            
        </div>
      </header>

      <main className="w-full grow">
        <Outlet />
      </main>

      <footer className="w-full grow-0 bg-gray-200 text-center p-4">
        © 2024 Tutorías Universae | Alejandro Gomez | Bryan Salazar

      </footer>
    </div>
  )
}

export default Body