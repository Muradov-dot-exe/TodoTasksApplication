import React, { useState, useEffect } from 'react'
import {
    Box,
    TextField,
    Button,
    Typography,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Modal,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const CreateSubtask = ({
    onSave,
    onClose,
    subtaskData,
    isEditMode,
    assignedSubtasks,
}) => {
    const [subtaskName, setSubtaskName] = useState('')
    const [subtaskDescription, setSubtaskDescription] = useState('')
    const [requiredImages, setRequiredImages] = useState(1)
    const [requiredNotes, setRequiredNotes] = useState(1)

    useEffect(() => {
        if (subtaskData) {
            setSubtaskName(subtaskData.title || '')
            setSubtaskDescription(subtaskData.description || '')
            setRequiredImages(subtaskData.number_of_required_images || 1)
            setRequiredNotes(subtaskData.number_of_required_notes || 1)
        }
    }, [subtaskData])

    const handleSaveSubtask = () => {
        const newSubtaskData = {
            title: subtaskName,
            description: subtaskDescription,
            number_of_required_images: requiredImages,
            number_of_required_notes: requiredNotes,
            is_completed: false,
            images: subtaskData?.images ?? [],
            notes: subtaskData?.notes ?? [],
        }
        onSave(newSubtaskData)
    }

    const incrementRequiredImages = () => {
        setRequiredImages((prev) => prev + 1)
    }

    const decrementRequiredImages = () => {
        if (requiredImages > 1) {
            setRequiredImages((prev) => prev - 1)
        }
    }

    const incrementRequiredNotes = () => {
        setRequiredNotes((prev) => prev + 1)
    }

    const decrementRequiredNotes = () => {
        if (requiredNotes > 1) {
            setRequiredNotes((prev) => prev - 1)
        }
    }

    const shouldDisableImagesButton = () => {
        if (requiredImages <= 1) return true
        if (!subtaskData?.images) return false

        return subtaskData.images.length === requiredImages
    }

    const shouldDisableNotesButton = () => {
        if (requiredNotes <= 1) return true
        if (!subtaskData?.notes) return false

        return subtaskData.notes.length === requiredNotes
    }

    const parseInputValue = (value) => {
        if (isNaN(Number(value))) return 1

        if (Number(value) <= 0) return 1

        return Number(value)
    }

    return (
        <Modal open={true} onClose={onClose}>
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
                    borderRadius: 4,
                }}
            >
                <Typography variant="h6" component="h2">
                    {isEditMode ? 'Edit Subtask' : 'Create Subtask'}
                </Typography>
                <Typography variant="body1" component="div">
                    <TextField
                        id="subtask-name"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        value={subtaskName}
                        onChange={(e) => setSubtaskName(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        id="subtask-description"
                        label="Description"
                        variant="outlined"
                        fullWidth
                        value={subtaskDescription}
                        onChange={(e) => setSubtaskDescription(e.target.value)}
                        sx={{ mt: 2 }}
                    />

                    <FormControl variant="outlined" fullWidth sx={{ mt: 2 }}>
                        <InputLabel htmlFor="outlined-adornment-images">
                            Required Images
                        </InputLabel>
                        <OutlinedInput
                            type={'number'}
                            id="outlined-adornment-images"
                            value={requiredImages}
                            onChange={(e) =>
                                setRequiredImages(
                                    parseInputValue(e.target.value)
                                )
                            }
                            startAdornment={
                                <InputAdornment position="start">
                                    <IconButton
                                        aria-label="decrease images"
                                        onClick={decrementRequiredImages}
                                        edge="start"
                                        disabled={shouldDisableImagesButton()}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="increase images"
                                        onClick={incrementRequiredImages}
                                        edge="end"
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Required Images"
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth sx={{ mt: 2 }}>
                        <InputLabel htmlFor="outlined-adornment-notes">
                            Required Notes
                        </InputLabel>
                        <OutlinedInput
                            type={'number'}
                            id="outlined-adornment-notes"
                            value={requiredNotes}
                            onChange={(e) =>
                                setRequiredNotes(
                                    parseInputValue(e.target.value)
                                )
                            }
                            startAdornment={
                                <InputAdornment position="start">
                                    <IconButton
                                        aria-label="decrease notes"
                                        onClick={decrementRequiredNotes}
                                        edge="start"
                                        disabled={shouldDisableNotesButton()}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="increase notes"
                                        onClick={incrementRequiredNotes}
                                        edge="end"
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Required Notes"
                        />
                    </FormControl>
                    {isEditMode &&
                        assignedSubtasks &&
                        assignedSubtasks.map((subtask, index) => (
                            <Box key={index} sx={{ mt: 2 }}>
                                <Typography variant="body1" gutterBottom>
                                    Assigned Subtask: {subtask.title}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Description: {subtask.description}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Required Images:{' '}
                                    {subtask.number_of_required_images}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Required Notes:{' '}
                                    {subtask.number_of_required_notes}
                                </Typography>
                            </Box>
                        ))}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleSaveSubtask}
                            sx={{ mr: 2 }}
                            disabled={!subtaskDescription || !subtaskName}
                        >
                            {isEditMode ? 'Update' : 'Save'}
                        </Button>
                        <Button variant="contained" onClick={onClose}>
                            Cancel
                        </Button>
                    </Box>
                </Typography>
            </Box>
        </Modal>
    )
}

export default CreateSubtask
