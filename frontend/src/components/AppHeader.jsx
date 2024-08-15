import React, { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import ApiIcon from '@mui/icons-material/Api'
import { useNavigate } from 'react-router'
import { useUserAuth } from '../context/useAuthContext'
import { geekBlue } from '@impulse-ui/colours'
import UserCard from './UserCardComponent'
import { ROLE_ADMIN, ROLE_EMPLOYEE, ROLE_MANAGER } from '../constants/roles'
import { AvatarGroup } from '@mui/material'
import { stringAvatar, stringToColor } from '../utils/utils'

const settings = ['Profile', 'Logout']

function AppHeader() {
    const [pages, setPages] = useState([])
    const [anchorElNav, setAnchorElNav] = useState(null)
    const [anchorElUser, setAnchorElUser] = useState(null)

    const navigate = useNavigate()
    const { signOut, user } = useUserAuth()
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        if (user) {
            if (
                user.role_name === ROLE_ADMIN ||
                user.role_name === ROLE_MANAGER
            ) {
                setPages([
                    { pageName: 'Calendar', link: '/general-calendar-view' },
                    { pageName: 'Tasks', link: '/admin-tasks-view' },
                    { pageName: 'Users', link: '/admin-users-view' },
                ])
            }

            if (user && user.role_name === ROLE_EMPLOYEE) {
                setPages([
                    { pageName: 'Calendar', link: '/general-calendar-view' },
                    { pageName: 'Tasks', link: '/admin-tasks-view' },
                ])
            }
        } else {
            setPages([])
        }
    }, [user])

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget)
    }

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    const handleProfile = () => {
        setIsModalOpen(true)
    }

    const handleNavClick = (link) => {
        navigate(link)
    }

    const handleClose = () => {
        setIsModalOpen(false)
    }

    const handleLogout = () => {
        signOut()
        navigate('/')
    }

    return (
        <AppBar position="static">
            <UserCard open={isModalOpen} handleClose={handleClose} />

            <Container maxWidth={'100%'} sx={{ backgroundColor: geekBlue[50] }}>
                <Toolbar disableGutters>
                    <ApiIcon
                        sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/general-calendar-view"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'roboto',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        TEAM API
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => {
                                return (
                                    <MenuItem
                                        key={page.pageName}
                                        onClick={() =>
                                            handleNavClick(page.link)
                                        }
                                    >
                                        <Typography
                                            fontSize={18}
                                            textAlign="center"
                                        >
                                            {page.pageName}
                                        </Typography>
                                    </MenuItem>
                                )
                            })}
                        </Menu>
                    </Box>
                    <ApiIcon
                        sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
                    />
                    <Typography
                        variant="h5"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'roboto',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        TEAM API
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                        }}
                    >
                        {pages.map((page) => (
                            <Button
                                key={page.pageName}
                                onClick={() => handleNavClick(page.link)}
                                sx={{
                                    my: 2,
                                    fontSize: 16,
                                    color: 'white',
                                    display: 'block',
                                }}
                            >
                                {page.pageName}
                            </Button>
                        ))}
                    </Box>
                    {user && (
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{ p: 0 }}
                                >
                                    <AvatarGroup
                                        sx={{
                                            '.MuiAvatarGroup-avatar': {
                                                width: 40,
                                                height: 40,
                                                fontSize: 20,
                                            },
                                        }}
                                        max={3}
                                        renderSurplus={(surplus) => (
                                            <span>+{surplus.toString()}</span>
                                        )}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: stringToColor(
                                                    `${user.first_name} ${user.last_name}`
                                                ),
                                            }}
                                            key={user.id}
                                            {...stringAvatar(
                                                `${user.first_name} ${user.last_name}`
                                            )}
                                        />
                                    </AvatarGroup>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem
                                        key={setting}
                                        onClick={
                                            setting === 'Logout'
                                                ? handleLogout
                                                : setting === 'Profile'
                                                  ? handleProfile
                                                  : handleCloseUserMenu
                                        }
                                    >
                                        <Typography textAlign="center">
                                            {setting}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default AppHeader
