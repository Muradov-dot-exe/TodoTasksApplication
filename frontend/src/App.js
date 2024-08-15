import './reset.css'
import './style/general-style.css'
import { RouterProvider } from 'react-router'
import routes from './app.routes'
import { UserAuthContextProvider } from './context/useAuthContext'
import CustomizedSnackbars from './components/toastifyStyle'

function App() {
    return (
        <UserAuthContextProvider>
            <CustomizedSnackbars />
            <RouterProvider router={routes} />
        </UserAuthContextProvider>
    )
}

export default App
