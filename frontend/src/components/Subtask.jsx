import { Typography, Box } from '@mui/material'
import { geekBlue } from '@impulse-ui/colours'

const Subtask = ({ subtaskName }) => {
    return (
        <>
            <Box
                sx={{
                    margin: '16px',
                    border: `2px solid ${geekBlue[50]}`,
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '8px',
                    height: '35px',
                    width: '80%',
                }}
            >
                <Typography sx={{ fontSize: '18px' }}>{subtaskName}</Typography>
            </Box>
        </>
    )
}

export default Subtask
