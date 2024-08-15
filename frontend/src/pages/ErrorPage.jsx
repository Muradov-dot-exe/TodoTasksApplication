import { Box, Typography } from '@mui/material'

const ErrorPage = ({ statusCode }) => {
    const getStatusMessage = () => {
        if (statusCode === 500) {
            return 'Internal Server Error'
        }
        if (statusCode === 404) {
            return 'That page does not exist'
        }
        return `Error: ${statusCode}`
    }

    const status = getStatusMessage()
    return (
        <Box className={'view-port'}>
            <Box
                sx={{
                    display: 'flex',
                    margin: 'auto',
                    gap: 2,
                }}
            >
                <Typography variant="h3">{status}</Typography>
            </Box>
        </Box>
    )
}

export default ErrorPage
