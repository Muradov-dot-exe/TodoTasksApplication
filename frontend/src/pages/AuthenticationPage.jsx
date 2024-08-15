import { Box } from '@mui/material'
import SignInButton from '../components/SignInButton'
import SignUpButton from '../components/SignUpButton'
import { useNavigate } from 'react-router'
import '../style/general-style.css'

const AuthenticationPage = () => {
    const navigate = useNavigate()

    const navigateToSignIn = () => {
        navigate('/auth/sign-in')
    }

    const navigateToSignUp = () => {
        navigate('/auth/sign-up')
    }
    return (
        <Box className={'view-port'}>
            <SignInButton onClick={navigateToSignIn} />
            <SignUpButton onClick={navigateToSignUp} />
        </Box>
    )
}

export default AuthenticationPage
