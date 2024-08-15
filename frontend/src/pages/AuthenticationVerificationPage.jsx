import React from 'react'
import { Outlet } from 'react-router-dom'
import { useUserAuth } from '../context/useAuthContext'
import AuthenticationPage from './AuthenticationPage'

const AuthVerification = () => {
    const { user } = useUserAuth()

    return user ? <Outlet /> : <AuthenticationPage />
}

export default AuthVerification
