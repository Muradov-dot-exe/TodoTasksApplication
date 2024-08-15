import { useState } from 'react'
import {
    Box,
    CardContent,
    Typography,
    TextField,
    Button,
    Avatar,
    Modal,
    CircularProgress,
} from '@mui/material'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import { useUserAuth } from '../context/useAuthContext'
import { stringAvatar, stringToColor } from '../utils/utils'
import { saveUserRequest } from '../api/userCardComponent.requests'
import { dustRed, neutral, polarGreen } from '@impulse-ui/colours'
import { axiosInstance } from '../axiosConfig'
import { toast } from 'react-toastify'

const UserCard = ({ open, handleClose, updateUser }) => {
    const [loading, setLoading] = useState(false)
    const { user: activeUser, setUser } = useUserAuth()

    const [userInfo, setUserInfo] = useState({
        first_name: activeUser?.first_name || [],
        last_name: activeUser?.last_name || [],
        email: activeUser?.email || [],
        role_name: activeUser?.role_name || [],
        is_available: activeUser?.is_available || [],
    })

    const handleSave = async () => {
        setLoading(true)
        try {
            await saveUserRequest({ ...userInfo, id: activeUser.id })
            updateUser?.(activeUser.id, userInfo)
            const newUser = (await axiosInstance.get(`/currentUser`)).data
            setUser(newUser.user)
            toast.success('Account information updated!')
            handleClose()
        } catch (error) {
            console.error('Error updating personnel:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUserInfoChange = (event) => {
        setUserInfo((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }))
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="user-modal-title"
            aria-describedby="user-modal-description"
        >
            <Box
                sx={{
                    height: '600px',
                    width: 400,
                    position: 'relative',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: neutral[40],
                    boxShadow: 24,
                    borderRadius: '16px',
                    textAlign: 'center',
                }}
            >
                <Box
                    sx={{
                        bgcolor: 'primary.main',
                        height: '70px',
                        width: '100%',
                        borderRadius: '10px 10px 0 0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                />
                <Avatar
                    {...stringAvatar(
                        `${userInfo.first_name} ${userInfo.last_name}`
                    )}
                    alt={`${userInfo.first_name} ${userInfo.last_name}`}
                    sx={{
                        width: 100,
                        height: 100,
                        fontSize: 50,
                        margin: '-50px auto 0 auto',
                        border: '5px solid white',
                        bgcolor: stringToColor(
                            `${userInfo.first_name} ${userInfo.last_name}`
                        ),
                    }}
                />
                <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                    {userInfo.first_name} {userInfo.last_name}
                </Typography>
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '32px',
                        gap: 1.5,
                        alignItems: 'center',
                    }}
                >
                    <TextField
                        name={'first_name'}
                        label="First Name"
                        value={userInfo.first_name}
                        onChange={handleUserInfoChange}
                        variant="standard"
                        size="small"
                        fullWidth
                    />
                    <TextField
                        name={'last_name'}
                        label="Last Name"
                        value={userInfo.last_name}
                        onChange={handleUserInfoChange}
                        variant="standard"
                        size="small"
                        fullWidth
                    />
                    <TextField
                        name={'email'}
                        label="Email"
                        value={userInfo.email}
                        disabled
                        onChange={handleUserInfoChange}
                        variant="standard"
                        size="small"
                        fullWidth
                    />
                    <TextField
                        name={'role_name'}
                        value={userInfo.role_name}
                        label="Role"
                        size="small"
                        variant="standard"
                        disabled
                        fullWidth
                    ></TextField>
                    {activeUser.is_available ? (
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                color: polarGreen[80],
                            }}
                        >
                            <EventAvailableIcon />
                            <Typography>Available</Typography>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                color: dustRed[80],
                            }}
                        >
                            <EventBusyIcon />
                            <Typography>Not Available</Typography>
                        </Box>
                    )}
                </CardContent>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSave}
                    disabled={loading}
                    sx={{ marginBottom: 4, borderRadius: '8px', width: '50%' }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
            </Box>
        </Modal>
    )
}

export default UserCard
