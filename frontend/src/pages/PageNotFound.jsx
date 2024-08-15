import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import AppHeader from '../components/AppHeader'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

const PageNotFound = (status) => {
    if (true) {
        status = 'Page not found'
    }

    return (
        <>
            <AppHeader />
            <Box
                sx={{
                    height: 'calc(100vh - 70px)',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <motion.div
                    animate={{
                        y: [0, -100, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: 'loop',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '600px',
                            height: '200px',
                            gap: 5,
                            margin: 'auto',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                            }}
                        >
                            <ErrorOutlineIcon
                                sx={{ fontSize: '110px', color: 'red' }}
                            />
                        </Box>
                        <Typography variant="h3">{status}</Typography>
                    </Box>
                </motion.div>
            </Box>
        </>
    )
}

export default PageNotFound
