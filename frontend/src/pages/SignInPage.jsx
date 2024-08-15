import { useState } from 'react'
import {
    Alert,
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import SignUpButton from '../components/SignUpButton'
import { useUserAuth } from '../context/useAuthContext'

const SignInPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const { signIn } = useUserAuth()
    const [wrongCredentialAlert, setWrongCredentialsAlert] = useState(null)

    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    })

    const { email, password } = credentials

    const handleClickShowPassword = () => {
        setShowPassword((prevState) => !prevState)
    }

    const navigateToSignUp = () => {
        navigate('/auth/sign-up')
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!email || !password) {
            return
        }

        try {
            await signIn(email, password)
            navigate('/general-calendar-view')
        } catch (error) {
            return setWrongCredentialsAlert(
                <Alert severity="error">Wrong email or password!</Alert>
            )
        }
    }

    const handleCredential = (event) => {
        const { name, value } = event.target
        setCredentials({ ...credentials, [name]: value })
    }

    return (
        <>
            <Box className={'view-port'}>
                <Box
                    sx={{
                        margin: 'auto',
                        padding: '16px',
                        width: '500px',
                        height: '600px',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #C21F24',
                        borderRadius: '16px',
                        boxShadow: '10px 5px 5px #C21F24',
                    }}
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <Typography
                        sx={{
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            paddingTop: '32px',
                            fontSize: '28px',
                            color: '#C21F24',
                        }}
                    >
                        Sign in
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            margin: 'auto',
                            padding: '16px',
                            flexDirection: 'column',
                            width: '50%',
                            height: '75%',
                            gap: 1,
                        }}
                    >
                        <TextField
                            required
                            id="email"
                            name="email"
                            label="Email"
                            variant="standard"
                            type="email"
                            value={email}
                            onChange={handleCredential}
                        />
                        <TextField
                            required
                            name="password"
                            label="Password"
                            variant="standard"
                            id="password"
                            value={password}
                            onChange={handleCredential}
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box
                            sx={{
                                marginTop: '8px',
                                marginBottom: '8px',
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 0.5,
                                alignItems: 'center',
                                justifyContent: 'right',
                            }}
                        >
                            <Typography
                                style={{
                                    color: '#495057',
                                    fontSize: '12px',
                                }}
                            >
                                Forget your
                            </Typography>
                            <Typography
                                style={{
                                    cursor: 'pointer',
                                    color: '#C21F24',
                                    textDecoration: 'underline',
                                    fontSize: '12px',
                                }}
                            >
                                Password?
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                backgroundColor: '#C21F24',
                                color: '#f8f9fa',
                                height: '40px',
                                boxSizing: 'border-box',

                                ':hover': {
                                    backgroundColor: '#f8f9fa',
                                    color: '#C21F24',
                                    height: '40px',

                                    border: '2px solid #C21F24',
                                },
                            }}
                        >
                            SIGN IN
                        </Button>
                        {wrongCredentialAlert !== null && (
                            <>
                                <br />
                                {wrongCredentialAlert}
                            </>
                        )}
                    </Box>
                </Box>
                <SignUpButton onClick={navigateToSignUp} />
            </Box>
        </>
    )
}

export default SignInPage
