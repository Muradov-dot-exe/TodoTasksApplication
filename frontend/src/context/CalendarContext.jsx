import { createContext, useCallback, useEffect, useState } from 'react'
import { axiosInstance } from '../axiosConfig'

export const CalendarContext = createContext(null)

const CalendarContextProvider = ({ children }) => {
    const [tasks, setTasks] = useState([])

    const fetchTasks = useCallback(() => {
        axiosInstance
            .get('/tasks')
            .then((response) => {
                let responseData = response.data.tasks.map((data) => ({
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    start: new Date(data.start_date),
                    end: new Date(data.end_date),
                    isActive: data.is_active,
                    currentStatus: data.current_status,
                    subtasks: data.Subtasks,
                    personnel: data.Personnel,
                }))
                setTasks(responseData)
            })
            .catch((error) => {
                console.error('Could not fetch tasks:', error)
            })
    }, [])

    useEffect(() => {
        fetchTasks()
    }, [fetchTasks])

    return (
        <CalendarContext.Provider value={{ tasks, fetchTasks }}>
            {children}
        </CalendarContext.Provider>
    )
}

export default CalendarContextProvider
