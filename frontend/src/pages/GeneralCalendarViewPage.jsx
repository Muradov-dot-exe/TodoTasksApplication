import AppHeader from '../components/AppHeader'
import GeneralCalendarView from '../components/GeneralCalendarView'
import CalendarContextProvider from '../context/CalendarContext'

const GeneralCalendarViewPage = () => {
    return (
        <>
            <AppHeader />
            <CalendarContextProvider>
                <GeneralCalendarView />
            </CalendarContextProvider>
        </>
    )
}

export default GeneralCalendarViewPage
