import Layout from './components/Layout'
import Login from './components/Login'
import {Routes , Route } from 'react-router-dom'
import './App.css'
import './output.css'

function App() {


  return (
    <div className='h-screen'>
        <Routes>
          <Route path='/' element={<Layout/>} >
            <Route path="login" element={<Login/>} />
          </Route>
        </Routes>
    </div>
  )
}

export default App
