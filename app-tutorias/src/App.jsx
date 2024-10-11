import Layout from './components/Layout'
import Login from './components/Login'
import {Routes , Route, Outlet } from 'react-router-dom'
import './App.css'
import './output.css'
import Calendar_Page from './components/Calendar_Page'
import Events_Page from './components/Events_Page'
import MyProfile_Page from './components/MyProfile_Page'
import NavBar from './components/NavBar'

function App() {


  return (
        <Routes>
          <Route path='/' element={<Layout/>} >
            <Route index path="login" element={<Login/>} />
            <Route path="content" element={(
              <>
                <Outlet/>
              </>
            )}>
              <Route path="calendar" element={<Calendar_Page/>} />
              <Route path="events" element={<Events_Page/>} />
              <Route path="profile" element={<MyProfile_Page/>} />
            </Route>
          </Route>
        </Routes>
  )
}

export default App
