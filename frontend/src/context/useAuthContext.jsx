import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { axiosInstance } from '../axiosConfig'
import { toast } from 'react-toastify'

const signUpEndpoint = '/auth/sign-up'
const signInEndpoint = '/auth/sign-in'
const userInfoEndpoint = '/currentUser'
const signOutEndpoint = '/auth/sign-out'

const UserAuthContext = createContext(null)

export const UserAuthContextProvider = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(false)
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user')
        return storedUser ? JSON.parse(storedUser) : null
    })

    const signUp = async (first_name, last_name, email, password) => {
        try {
            await axiosInstance.post(signUpEndpoint, {
                first_name,
                last_name,
                email,
                password,
            })

            toast.info('Successful sign up! Please sign in.')
        } catch (error) {
            console.error('Error during signup:', error)
            throw error
        }
    }

    const signIn = async (email, password) => {
        try {
            const response = await axiosInstance.post(signInEndpoint, {
                email,
                password,
            })
            localStorage.setItem('user', JSON.stringify(response.data))
            sessionStorage.setItem('user', JSON.stringify(response.data))
            setIsSignedIn(true)
            setUser(response.data)

            toast.info('Successful sign in!')
        } catch (error) {
            console.error('Error during signin:', error)
            throw error
        }
    }

    const updateLocalStorage = useCallback((user) => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
            sessionStorage.setItem('user', JSON.stringify(user))
        }
    }, [])

    useEffect(() => {
        updateLocalStorage(user)
    }, [user, updateLocalStorage])

    const signOut = async () => {
        try {
            await axiosInstance.post(signOutEndpoint)
            sessionStorage.removeItem('user')
            localStorage.removeItem('user')
            setUser(null)
            setIsSignedIn(false)

            toast.info('Successful sign out!')
        } catch (error) {
            console.error('Error during signout:', error)
            throw error
        }
    }

    const checkTokenExpiration = async () => {
        try {
            const response = await axiosInstance.get(userInfoEndpoint, {
                withCredentials: true,
            })

            if (response.data) {
                sessionStorage.setItem('user', JSON.stringify(response.data))
                setUser(response.data)
            } else {
                sessionStorage.removeItem('user')
                setUser(null)
            }
        } catch (error) {
            console.error('Error checking token expiration:', error)

            sessionStorage.removeItem('user')
            setUser(null)
        }
    }

    useEffect(() => {
        let intervalId

        if (isSignedIn) {
            intervalId = setInterval(checkTokenExpiration, 3600000)
        }

        return () => {
            clearInterval(intervalId)
        }
    }, [isSignedIn])

    return (
        <UserAuthContext.Provider
            value={{ user, setUser, signUp, signIn, signOut }}
        >
            {children}
        </UserAuthContext.Provider>
    )
}

export const useUserAuth = () => {
    return useContext(UserAuthContext)
}
