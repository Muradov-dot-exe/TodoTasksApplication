import { useContext } from 'react'
import { CalendarContext } from '../context/CalendarContext'

const useCalendarContext = () => {
    const context = useContext(CalendarContext)

    if (!context)
        throw new Error(
            'useCalendarContext should be used inside CalendarContext provider'
        )

    return context
}

export default useCalendarContext
