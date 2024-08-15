import { Box, Button, TextField, Typography, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import SendIcon from '@mui/icons-material/Send'
import { useRef, useState } from 'react'
import {
    addNote,
    deleteImage,
    deleteNote,
    uploadImage,
} from '../api/userSubtaskForm.requests'
import { toast } from 'react-toastify'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import useCalendarContext from '../hooks/useCalendarContext'
import { dustRed, geekBlue, neutral } from '@impulse-ui/colours'

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
})

const UserSubtaskForm = ({ subtask, setSubtask }) => {
    const { fetchTasks } = useCalendarContext()
    const formRef = useRef()
    const [inputValue, setInputValue] = useState('')
    const [imagesCount, setImagesCount] = useState(subtask.images.length)
    const [notes, setNotes] = useState(subtask.notes)
    const [images, setImages] = useState(subtask.images ?? [])

    const onSubmitUploadImage = async (event) => {
        event.preventDefault()
        const formData = new FormData(formRef.current)
        try {
            const imageData = (await uploadImage(formData, subtask.id)).data
            setImagesCount((prevState) => prevState + 1)
            setImages((prevState) => [...prevState, imageData.path])
            toast.success('Image uploaded!')
        } catch {
            toast.error('This image already exists.')
        }
    }

    const handleCloseAction = () => {
        setSubtask(null)
        fetchTasks()
    }

    const handleAddNoteClick = async () => {
        if (inputValue.length < 4) {
            toast.error('Please write at least three characters.')
            return
        }
        await addNote(inputValue, subtask.id)
        setNotes((prevValue) => [inputValue, ...prevValue])
        toast.success('Notes uploaded!')
        setInputValue('')
    }

    const handleDelete = async (name) => {
        try {
            await deleteImage(name, subtask.id)
            setImagesCount((prevState) => prevState - 1)
            setImages((prevState) =>
                prevState.filter((image) => image !== name)
            )
            toast.success('Successfully deleted image!')
        } catch {
            toast.error('Could not delete image')
        }
    }

    const handleDeleteNote = async (note) => {
        try {
            await deleteNote(note, subtask.id)
            setNotes((prevState) =>
                prevState.filter((noteText) => noteText !== note)
            )
            toast.success('Successfully deleted note!')
        } catch {
            toast.error('Could not delete note!')
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                margin: 'auto',
            }}
        >
            <IconButton
                onClick={handleCloseAction}
                sx={{ position: 'absolute', top: 1, left: 1 }}
                aria-label="back"
            >
                <ArrowBackIcon />
            </IconButton>
            <Box sx={{ marginTop: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            color: neutral[70],
                            fontSize: '20px',
                        }}
                    >
                        SUBTASK TITLE:
                    </Typography>
                    <Typography
                        sx={{
                            color: neutral[90],
                            fontSize: '20px',
                        }}
                    >
                        {subtask.title}
                    </Typography>
                </Box>
                <Typography
                    sx={{
                        color: neutral[70],
                        fontSize: '20px',
                    }}
                >
                    SUBTASK DESCRIPTION:
                </Typography>
                <Typography
                    sx={{
                        color: neutral[90],
                        fontSize: '20px',
                    }}
                >
                    {subtask.description}
                </Typography>
            </Box>
            <Box
                onSubmit={onSubmitUploadImage}
                ref={formRef}
                component="form"
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <Button
                    sx={{ height: '40px' }}
                    component="label"
                    variant="contained"
                    tabIndex={-1}
                    disabled={
                        imagesCount - subtask.number_of_required_images >= 0
                    }
                    startIcon={<CloudUploadIcon />}
                >
                    Upload files
                    <VisuallyHiddenInput
                        name={'file'}
                        onChange={() => {
                            formRef.current.dispatchEvent(
                                new Event('submit', {
                                    cancelable: true,
                                    bubbles: true,
                                })
                            )
                        }}
                        type="file"
                    />
                </Button>
                <Typography
                    sx={{
                        color: neutral[90],
                        fontSize: '20px',
                    }}
                >
                    {imagesCount}/{subtask.number_of_required_images}
                </Typography>
            </Box>
            <Box
                sx={{ display: 'flex', overflow: 'scroll', width: 400, gap: 1 }}
            >
                {images.map((image) => (
                    <Box key={image} sx={{ position: 'relative' }}>
                        <IconButton
                            onClick={() => handleDelete(image)}
                            sx={{ position: 'absolute', top: 1, left: 1 }}
                            aria-label="back"
                        >
                            <DeleteIcon sx={{ color: dustRed[50] }} />
                        </IconButton>
                        <img
                            style={{
                                height: 128,
                                aspectRatio: 16 / 9,
                            }}
                            src={`http://localhost:9001/${image}`}
                            alt={'work image'}
                        />
                    </Box>
                ))}
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <TextField
                    size="small"
                    id="standard-basic"
                    label="Upload Notes"
                    value={inputValue}
                    variant="outlined"
                    onChange={(event) => setInputValue(event.target.value)}
                />
                <Button
                    disabled={
                        notes.length - subtask.number_of_required_notes >= 0
                    }
                    onClick={handleAddNoteClick}
                    sx={{ height: '40px' }}
                    variant="contained"
                    endIcon={<SendIcon />}
                >
                    Comment
                </Button>
            </Box>
            <Typography>
                Notes {notes.length}/{subtask.number_of_required_notes}
            </Typography>
            <Box
                sx={{
                    overflow: 'scroll',
                    height: 128,
                    display: 'flex',
                    gap: 1,
                    flexDirection: 'column',
                }}
            >
                {notes.map((note, index) => (
                    <Box
                        sx={{
                            px: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            borderRadius: 8,
                            border: `1px solid ${geekBlue[50]}`,
                        }}
                        key={index}
                    >
                        <Typography>{note}</Typography>
                        <IconButton
                            sx={{ marginLeft: 'auto' }}
                            onClick={() => handleDeleteNote(note)}
                            aria-label="back"
                        >
                            <DeleteIcon sx={{ color: dustRed[50] }} />
                        </IconButton>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default UserSubtaskForm
