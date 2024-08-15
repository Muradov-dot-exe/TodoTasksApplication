import { Navigate } from 'react-router-dom'
import { useUserAuth } from '../context/useAuthContext'

export const ProtectedRoute = ({ element: Element, allowedRoles }) => {
    const { user } = useUserAuth()
    const hasAccess = allowedRoles.includes(user?.role_name)

    return (
        <>
            {hasAccess ? (
                <Element />
            ) : (
                <Navigate to="/general-calendar-view" replace />
            )}
        </>
    )
}
