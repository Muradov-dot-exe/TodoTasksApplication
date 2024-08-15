import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import AppHeader from '../components/AppHeader'
import Subtask from '../components/Subtask'
import {
    Typography,
    Box,
    TextField,
    Button,
    Modal,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Grid,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router'
import Stack from '@mui/material/Stack'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import CloseIcon from '@mui/icons-material/Close'
import CreateSubtask from './CreateSubTask'
import DeleteSubtaskModal from '../components/DeleteTaskSubtaskModal'
import { axiosInstance } from '../axiosConfig'
import { toast } from 'react-toastify'
import { DateTimePicker } from '@mui/x-date-pickers'
import { neutral } from '@impulse-ui/colours'
import { ROLE_EMPLOYEE } from '../constants/roles'

const CreateTask = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [taskName, setTaskName] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [subtasks, setSubtasks] = useState([])
    const [assignedUsers, setAssignedUsers] = useState([])
    const [availableUsers, setAvailableUsers] = useState([])
    const [userModalOpen, setUserModalOpen] = useState(false)
    const [createSubtaskModalOpen, setCreateSubtaskModalOpen] = useState(false)
    const [taskToEdit, setTaskToEdit] = useState(null)
    const [subtaskToEdit, setSubtaskToEdit] = useState(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [subtaskToDelete, setSubtaskToDelete] = useState(null)
    const [isSubtaskToDelete, setIsSubtaskToDelete] = useState(false)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get(`/personnel`)
                const available = response.data.filter(
                    (user) => user.is_available
                )
                setAvailableUsers(available)
            } catch (error) {
                console.error('Error fetching users:', error)
            }
        }
        fetchUsers()

        const fetchTask = async () => {
            try {
                if (id) {
                    const response = await axiosInstance.get(`/tasks/${id}`)
                    setTaskToEdit(response.data)
                }
            } catch (error) {
                console.error('Error fetching task:', error)
            }
        }
        fetchTask()
    }, [id])

    useEffect(() => {
        if (taskToEdit) {
            setTaskName(taskToEdit.title || '')
            setTaskDescription(taskToEdit.description || '')
            setStartDate(
                taskToEdit.start_date ? dayjs(taskToEdit.start_date) : null
            )
            setEndDate(taskToEdit.end_date ? dayjs(taskToEdit.end_date) : null)
            setSubtasks(taskToEdit.Subtasks || [])
            setAssignedUsers(taskToEdit.Personnel || [])
        } else {
            setTaskName('')
            setTaskDescription('')
            setStartDate(null)
            setEndDate(null)
            setSubtasks([])
            setAssignedUsers([])
        }
    }, [taskToEdit])

    const handleAddUser = (user) => {
        setAssignedUsers([...assignedUsers, user])
        setAvailableUsers(availableUsers.filter((u) => u.id !== user.id))
    }

    const handleRemoveUser = (user) => {
        setAssignedUsers(assignedUsers.filter((u) => u.id !== user.id))
        setAvailableUsers([...availableUsers, user])
    }

    const handleAddSubtask = () => {
        setCreateSubtaskModalOpen(true)
    }

    const handleCloseCreateSubtaskModal = () => {
        setCreateSubtaskModalOpen(false)
        setSubtaskToEdit(null)
    }

    const handleOpenDeleteModal = (subtask) => {
        setSubtaskToDelete(subtask)
        setDeleteModalOpen(true)
    }

    const handleDeleteTask = () => {
        setDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        try {
            if (taskToEdit && !isSubtaskToDelete) {
                await axiosInstance.delete(`/tasks/delete/${taskToEdit.id}`)
                navigate('/admin-tasks-view')
                toast.error('Task deleted !')
            } else if (subtaskToDelete && isSubtaskToDelete) {
                let tempSubtaskHolder

                if (subtaskToDelete.id === undefined) {
                    tempSubtaskHolder = subtasks.filter((x) => {
                        return x.title !== subtaskToDelete.title
                    })
                    return setSubtasks(tempSubtaskHolder)
                }

                await axiosInstance.delete(
                    `/subtasks/delete/${subtaskToDelete.id}`
                )
                const updatedSubtasks = subtasks.filter(
                    (subtask) => subtask.id !== subtaskToDelete.id
                )
                setSubtasks(updatedSubtasks)
                setIsSubtaskToDelete(false)
            }
        } catch (error) {
            console.error('Error deleting:', error)
            toast.error('Error deleting task !' + error.response?.data?.error)
        } finally {
            setDeleteModalOpen(false)
        }
    }
    const handleSaveOrUpdateSubtask = (subtaskData) => {
        if (subtaskToEdit) {
            if (taskToEdit) {
                subtaskData.task_id = taskToEdit.id
                const updatedSubtasks = subtasks.map((subtask) =>
                    subtask.id === subtaskToEdit.id ? subtaskData : subtask
                )
                setSubtasks(updatedSubtasks)
            } else {
                setSubtasks([subtaskData])
            }
        } else {
            setSubtasks([...subtasks, subtaskData])
        }
        handleCloseCreateSubtaskModal()
    }

    const handleCreateTask = async () => {
        const taskData = {
            title: taskName,
            description: taskDescription,
            start_date: startDate ? startDate.toISOString() : null,
            end_date: endDate ? endDate.toISOString() : null,
            is_active: true,
            current_status: '',
            personnelIds: assignedUsers.map((user) => user.id),
            subtasks: subtasks,
            task_id: taskToEdit ? taskToEdit.id : null,
        }

        try {
            if (taskToEdit) {
                await axiosInstance.put(
                    `/tasks/edit/${taskToEdit.id}`,
                    taskData
                )
                toast.warning('Task edited !')
            } else {
                await axiosInstance.post(`/tasks/add`, taskData)
                toast.success('Task created !')
            }
            navigate('/admin-tasks-view')
        } catch (error) {
            console.error('Error creating/updating task:', error)
            toast.error(
                'Error creating/updating task: ' + error.response?.data?.error
            )
        }
    }

    const openUserModal = () => setUserModalOpen(true)
    const closeUserModal = () => setUserModalOpen(false)

    const openEditSubtaskModal = (subtask) => {
        if (subtask && subtask.title) {
            setSubtaskToEdit(subtask)
            setCreateSubtaskModalOpen(true)
        }
    }

    return (
        <>
            <AppHeader />
            <Modal
                open={createSubtaskModalOpen}
                onClose={handleCloseCreateSubtaskModal}
            >
                <Box>
                    <CreateSubtask
                        onSave={handleSaveOrUpdateSubtask}
                        onClose={handleCloseCreateSubtaskModal}
                        subtaskData={subtaskToEdit}
                        isEditMode={!!subtaskToEdit}
                    />
                </Box>
            </Modal>
            <DeleteSubtaskModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleConfirmDelete}
            />
            <Box
                sx={{
                    padding: 4,
                    width: '100%',
                    margin: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Box sx={{ borderRight: '1px solid black' }}>
                    <Box>
                        <Typography
                            sx={{
                                fontSize: '20px',
                                margin: '0 20px',
                            }}
                        >
                            Task Name
                        </Typography>
                        <TextField
                            id="standard-basic-name"
                            label="Name"
                            variant="standard"
                            required
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            sx={{
                                padding: '0 0 30px 0',
                                margin: '-7px 20px',
                                width: '90%',
                            }}
                        />
                        <Typography sx={{ fontSize: '20px', margin: '0 20px' }}>
                            Task Description
                        </Typography>
                        <TextField
                            id="standard-basic-description"
                            label="Description"
                            variant="standard"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            sx={{ margin: '-7px 20px', width: '90%' }}
                        />

                        <Box
                            sx={{
                                margin: '25px 20px',
                            }}
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Stack direction="row" spacing={3}>
                                    <DateTimePicker
                                        disablePast
                                        sx={{ width: '200px' }}
                                        label="Start Date"
                                        inputFormat="MM/DD/YYYY"
                                        ampm={false}
                                        value={
                                            startDate ? dayjs(startDate) : null
                                        }
                                        minDate={dayjs()}
                                        maxDate={
                                            endDate ? dayjs(endDate) : null
                                        }
                                        onChange={(newDate) => {
                                            setStartDate(newDate)
                                            if (
                                                !endDate ||
                                                dayjs(newDate).isAfter(
                                                    dayjs(endDate)
                                                )
                                            ) {
                                                setEndDate(newDate)
                                            }
                                        }}
                                    />
                                    <DateTimePicker
                                        sx={{ width: '200px' }}
                                        label="End Date"
                                        minDateTime={
                                            startDate ? dayjs(startDate) : null
                                        }
                                        inputFormat="MM/DD/YYYY"
                                        ampm={false}
                                        value={endDate ? dayjs(endDate) : null}
                                        minDate={
                                            startDate ? dayjs(startDate) : null
                                        }
                                        disabled={!startDate}
                                        disablePast
                                        onChange={(newDate) =>
                                            setEndDate(newDate)
                                        }
                                    />
                                </Stack>
                            </LocalizationProvider>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            borderTop: '1px solid black',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            paddingBottom: 2,
                        }}
                    >
                        <Typography
                            sx={{ margin: '20px 200px' }}
                            variant="h5"
                            gutterBottom
                        >
                            Subtasks
                        </Typography>
                        {subtasks.map((subtask, index) => (
                            <Grid
                                direction="row"
                                container
                                key={`${subtask.id}-${index}`}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                    }}
                                >
                                    <Box
                                        sx={{ flexGrow: 1 }}
                                        onClick={() =>
                                            openEditSubtaskModal(subtask)
                                        }
                                    >
                                        <Subtask subtaskName={subtask.title} />
                                    </Box>

                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleOpenDeleteModal(subtask)
                                            setIsSubtaskToDelete(true)
                                        }}
                                        sx={{
                                            marginRight: '10px',
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </Grid>
                        ))}

                        <Button
                            sx={{ width: '135px', margin: '0 70%' }}
                            variant="contained"
                            onClick={handleAddSubtask}
                        >
                            Add Subtask
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            position: 'sticky',
                            bottom: 0,
                            backgroundColor: neutral[10],
                            borderTop: `1px solid ${neutral[300]}`,
                            padding: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleCreateTask}
                            disabled={
                                !taskName ||
                                !taskDescription ||
                                !startDate ||
                                !endDate ||
                                subtasks.length === 0
                            }
                        >
                            Done
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleDeleteTask}
                            disabled={!taskToEdit}
                            sx={{ marginLeft: '15px' }}
                        >
                            Delete
                        </Button>
                    </Box>
                </Box>
                <Box
                    sx={{
                        height: '510px',
                        width: '30%',
                    }}
                >
                    <Typography variant="h5" sx={{ marginLeft: '30px' }}>
                        Assigned Users
                    </Typography>
                    <List>
                        {assignedUsers.map((user) => (
                            <ListItem key={user.id}>
                                <ListItemText
                                    sx={{ marginLeft: '20px' }}
                                    primary={`${user.first_name} ${user.last_name}`}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleRemoveUser(user)}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                    <Button
                        variant="contained"
                        onClick={openUserModal}
                        sx={{ marginLeft: '20px' }}
                    >
                        Assign User
                    </Button>
                </Box>
            </Box>

            <Modal open={userModalOpen} onClose={closeUserModal}>
                <Box
                    sx={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        overflow: 'scroll',
                        height: '80%',
                        p: 4,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Select a User to Assign
                    </Typography>
                    <List>
                        {availableUsers
                            ?.filter((user) => user.role_name === ROLE_EMPLOYEE)
                            .map((user) => (
                                <ListItem
                                    sx={{
                                        ':hover': {
                                            backgroundColor: neutral[50],
                                            cursor: 'pointer',
                                        },
                                    }}
                                    key={user.id}
                                    onClick={() => handleAddUser(user)}
                                >
                                    <ListItemText
                                        primary={`${user.first_name} ${user.last_name}`}
                                    />
                                </ListItem>
                            ))}
                    </List>
                </Box>
            </Modal>
        </>
    )
}

export default CreateTask
