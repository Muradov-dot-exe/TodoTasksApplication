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
import '../style/general-style.css'
import { useState } from 'react'
import SignInButton from '../components/SignInButton'
import { useNavigate } from 'react-router'
import { useUserAuth } from '../context/useAuthContext'
import { validateEmail, validatePassword } from '../appRegex'

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const { signUp } = useUserAuth()
    const [emailAlert, setEmailAlert] = useState(null)
    const [passwordError, setPasswordError] = useState(null)
    const [passLengthError, setPassLengthError] = useState(undefined)

    const [credentials, setCredentials] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        passwordConfirm: '',
    })

    const { email, password, first_name, last_name, passwordConfirm } =
        credentials

    const handleClickShowPassword = () => {
        setShowPassword((prevState) => !prevState)
    }

    const navigateToSignIn = () => {
        navigate('/auth/sign-in')
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!email || !password) {
            return
        }

        if (!validatePassword(password)) {
            setPasswordError(null)
            setEmailAlert(null)
            return setPassLengthError(
                <Alert severity="error">
                    Password must be at least 10 characters long, with 1 higher
                    case character, 1 number and 1 special character
                </Alert>
            )
        } else {
            setPassLengthError(null)
        }

        if (password !== passwordConfirm) {
            setPassLengthError(null)
            setEmailAlert(null)
            return setPasswordError(
                <Alert severity="error">Passwords do not match!</Alert>
            )
        } else if (password === passwordConfirm) {
            setPasswordError(null)
        }

        if (validateEmail(email)?.input === undefined) {
            setPassLengthError(null)
            setPasswordError(null)
            return setEmailAlert(
                <Alert severity="error">Bad Email Format!</Alert>
            )
        } else if (validateEmail(email)?.input !== undefined) {
            setEmailAlert(null)
        }

        try {
            await signUp(first_name, last_name, email, password)
            navigate('/auth/sign-in')
        } catch (error) {
            return setEmailAlert(
                <Alert severity="error">This user already exists!</Alert>
            )
            console.error(error)
        }
    }

    const handleCredential = (event) => {
        const { name, value } = event.target
        setCredentials({ ...credentials, [name]: value })
    }

    return (
        <>
            <Box className={'view-port'}>
                <SignInButton onClick={navigateToSignIn} />
                <Box
                    sx={{
                        margin: 'auto',
                        padding: '16px',
                        width: '500px',
                        height: '600px',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #0277bd',
                        borderRadius: '16px',
                        boxShadow: '10px 5px 5px #0277bd',
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
                            color: '#0277bd',
                        }}
                    >
                        Sign up
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
                            id="first_name"
                            name="first_name"
                            label="First Name"
                            variant="standard"
                            type="text"
                            value={first_name}
                            onChange={handleCredential}
                        />
                        <TextField
                            required
                            name="last_name"
                            id="last_name"
                            label="Last Name"
                            variant="standard"
                            type="text"
                            value={last_name}
                            onChange={handleCredential}
                        />
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
                        <TextField
                            required
                            name="passwordConfirm"
                            id="inputRePassword"
                            label="Confirm Password"
                            variant="standard"
                            value={passwordConfirm}
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
                        <br />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: '#0277bd',
                                color: '#f8f9fa',
                                height: '40px',
                                boxSizing: 'border-box',
                                ':hover': {
                                    backgroundColor: '#f8f9fa',
                                    color: '#0277bd',
                                    height: '40px',
                                    border: '2px solid #0277bd',
                                },
                            }}
                        >
                            SIGN UP
                        </Button>
                        {emailAlert !== null && (
                            <>
                                <br />
                                {emailAlert}
                            </>
                        )}
                        {passwordError !== null && (
                            <>
                                <br />
                                {passwordError}
                            </>
                        )}
                        {passLengthError !== undefined && (
                            <>
                                <br />
                                {passLengthError}
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default SignUpPage
