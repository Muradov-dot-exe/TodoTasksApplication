import { createBrowserRouter } from 'react-router-dom'
import AuthenticationPage from './pages/AuthenticationPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import CreateTask from './admin-panels/CreateTask'
import TasksView from './admin-panels/TasksView'
import GeneralCalendarViewPage from './pages/GeneralCalendarViewPage'
import AuthVerification from './pages/AuthenticationVerificationPage'
import PageNotFound from './pages/PageNotFound'
import { ProtectedRoute } from './components/RoleRouteProtection'
import { ROLE_ADMIN, ROLE_EMPLOYEE, ROLE_MANAGER } from './constants/roles'
import UsersPage from './pages/UsersPage'

const routes = createBrowserRouter([
    {
        path: '/',
        element: <AuthenticationPage />,
    },
    {
        path: 'auth/sign-in',
        element: <SignInPage />,
    },
    {
        path: 'auth/sign-up',
        element: <SignUpPage />,
    },
    {
        path: '/',
        element: <AuthVerification />,
        children: [
            {
                path: 'add-task',
                element: (
                    <ProtectedRoute
                        element={CreateTask}
                        allowedRoles={[ROLE_MANAGER, ROLE_ADMIN]}
                    />
                ),
            },
            {
                path: 'admin-tasks-view',
                element: (
                    <ProtectedRoute
                        element={TasksView}
                        allowedRoles={[ROLE_MANAGER, ROLE_ADMIN, ROLE_EMPLOYEE]}
                    />
                ),
            },
            {
                path: 'general-calendar-view',
                element: <GeneralCalendarViewPage />,
            },
            {
                path: 'admin-users-view',
                element: (
                    <ProtectedRoute
                        element={UsersPage}
                        allowedRoles={[ROLE_ADMIN, ROLE_MANAGER]}
                    />
                ),
            },
            {
                path: 'edit-task/:id',
                element: (
                    <ProtectedRoute
                        element={CreateTask}
                        allowedRoles={[ROLE_MANAGER, ROLE_ADMIN]}
                    />
                ),
            },
        ],
    },
    {
        path: '*',
        element: <PageNotFound />,
    },
])

export default routes
