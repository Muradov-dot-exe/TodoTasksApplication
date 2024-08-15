import { Typography, Box } from '@mui/material'
import { useNavigate } from 'react-router'

const Task = ({ taskName }) => {
    const navigation = useNavigate()

    const NavigateToAddTask = () => {
        navigation('/add-task')
    }
    return (
        <>
            <Box
                onClick={NavigateToAddTask}
                sx={{
                    margin: '15px 10px',
                    display: 'flex',
                    flexDirection: 'row',
                    width: '90%',
                }}
            >
                <Typography
                    sx={{ fontSize: '26px', padding: '12px 10px 12px 20px' }}
                >
                    {taskName}
                </Typography>
            </Box>
        </>
    )
}

export default Task
