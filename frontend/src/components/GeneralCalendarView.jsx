import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import '../css/react-big-calendar.css'
import { Box, Button } from '@mui/material'
import { useMemo, useState } from 'react'
import { geekBlue, neutral } from '@impulse-ui/colours'
import { DateCalendar } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useNavigate } from 'react-router'
import CalendarEventWrapper from './CalendarEventWrapper'
import { useUserAuth } from '../context/useAuthContext'
import { ROLE_EMPLOYEE } from '../constants/roles'
import useCalendarContext from '../hooks/useCalendarContext'

const localizer = dayjsLocalizer(dayjs)

const GeneralCalendarView = () => {
    const { tasks } = useCalendarContext()
    const [date, setDate] = useState(dayjs(new Date()))
    const navigate = useNavigate()
    const { user } = useUserAuth()

    const navigateToAddTaskPage = () => {
        navigate('/add-task')
    }

    const components = useMemo(
        () => ({
            eventWrapper: CalendarEventWrapper,
        }),
        []
    )

    const endAccessorFn = (event) => {
        if (
            event.start.getFullYear() === event.end.getFullYear() &&
            event.start.getMonth() === event.end.getMonth() &&
            event.start.getDay() === event.end.getDay()
        ) {
            return event.end
        }

        const endDate = new Date(event.end)
        endDate.setDate(endDate.getDate() + 1)

        return endDate
    }

    return (
        <Box
            sx={{
                height: 'calc(100vh - 70px)',
                width: '100%',
                display: 'flex',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 1,
                }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        views={['year', 'month', 'day']}
                        onChange={(newDate) => setDate(newDate)}
                        value={date}
                    />
                </LocalizationProvider>
                {user.role_name !== ROLE_EMPLOYEE && (
                    <Button
                        sx={{
                            display: 'flex',
                            width: '100%',
                            backgroundColor: geekBlue[50],
                            color: neutral[20],
                            border: `2px solid ${neutral[20]}  `,

                            '&:hover': {
                                backgroundColor: neutral[20], // Променете цвета при ховър
                                color: geekBlue[50], // Променете цвета на текста при ховър
                                border: `2px solid ${geekBlue[50]}  `,
                            },
                        }}
                        onClick={navigateToAddTaskPage}
                    >
                        Add Task
                    </Button>
                )}
            </Box>

            <Calendar
                components={components}
                localizer={localizer}
                events={tasks}
                endAccessor={endAccessorFn}
                dayLayoutAlgorithm="no-overlap"
                date={date}
                onNavigate={(newDate) => setDate(dayjs(newDate))}
                style={{
                    height: '100%',
                    width: '100%',
                    padding: 8,
                }}
            />
        </Box>
    )
}

export default GeneralCalendarView
