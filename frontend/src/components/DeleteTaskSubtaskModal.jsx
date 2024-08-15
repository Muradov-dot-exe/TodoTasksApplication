import React from 'react'
import { Modal, Typography, Button, Box } from '@mui/material'

const DeleteSubtaskModal = ({ open, onClose, onDelete }) => {
    const handleDelete = () => {
        onDelete()
        onClose()
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    {'Are you sure you want to delete the selected field?'}
                </Typography>
                <Button variant="contained" onClick={handleDelete}>
                    Yes
                </Button>
                <Button
                    variant="contained"
                    sx={{ marginLeft: '50px' }}
                    onClick={onClose}
                >
                    No
                </Button>
            </Box>
        </Modal>
    )
}

export default DeleteSubtaskModal
