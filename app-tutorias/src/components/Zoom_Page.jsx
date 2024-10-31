
import NavBar from './NavBar'
import ZoomMeeting from './hooks/useZoomMeeting'

function Zoom_Page() {
  return (
    <div className="h-full flex">
        <NavBar/>
        <ZoomMeeting />
    </div>
  )
}

export default Zoom_Page