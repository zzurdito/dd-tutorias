import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

function Calendar() {
  return (
    <div className='grow m-2'>
      <FullCalendar 
        plugins={[ dayGridPlugin ]}
        initialView='dayGridMonth'
        startParam='monday'
        height={700}
        firstDay={1}
        />
    </div>
  )
}

export default Calendar