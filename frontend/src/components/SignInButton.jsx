import { Box } from '@mui/material'
import SignInIcon from '../images/SignIn'

const SignInButton = (props) => {
    return (
        <Box
            component="button"
            sx={{
                width: '500px',
                height: '400px',
                position: 'relative',
                margin: 'auto',
                padding: '16px',
                fontSize: '40px',
                color: '#f8f9fa',
            }}
            {...props}
        >
            <span
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                SIGN IN
            </span>
            <SignInIcon />
        </Box>
    )
}

export default SignInButton
