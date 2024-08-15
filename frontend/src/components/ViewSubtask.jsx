import { Box, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const ViewSubtask = ({ subtask, handleCloseAction }) => {
    return (
        <Box>
            <IconButton
                onClick={handleCloseAction}
                sx={{ position: 'absolute', top: 1, left: 1 }}
                aria-label="back"
            >
                <ArrowBackIcon />
            </IconButton>
            <Box sx={{ marginTop: 2 }}>
                <Typography fontSize={20}>Subtask title</Typography>
                <Typography>{subtask.title}</Typography>
                <Typography fontSize={20}>Subtask description</Typography>
                <Typography>{subtask.description}</Typography>
            </Box>
            <Typography fontSize={'24px'}>
                Images {subtask.images.length}/
                {subtask.number_of_required_images}
            </Typography>
            <Typography>
                Notes {subtask.notes.length}/{subtask.number_of_required_notes}
            </Typography>
        </Box>
    )
}

export default ViewSubtask
