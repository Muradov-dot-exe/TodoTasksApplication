import { useState, useEffect } from 'react'
import AppHeader from '../components/AppHeader'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    IconButton,
    Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosConfig'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useUserAuth } from '../context/useAuthContext'
import { ROLE_EMPLOYEE } from '../constants/roles'
import AssignedUsersGroup from '../components/AsignedUsersGroup'
import StorageIcon from '@mui/icons-material/Storage'
import EditIcon from '@mui/icons-material/Edit'
import { neutral, sunriseYellow } from '@impulse-ui/colours'
import TASK_STATUS from '../constants/taskStatus'

const TasksView = () => {
    const [tasks, setTasks] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const navigate = useNavigate()
    const { user } = useUserAuth()

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axiosInstance.get(
                    `/tasks?page=${page}&pageSize=15`
                )
                setTasks(response.data.tasks)
                setTotalPages(response.data.totalPages)
            } catch (error) {
                console.error('Error fetching tasks:', error)
            }
        }

        fetchTasks()
    }, [page])

    const handleTaskClick = (taskId) => {
        navigate(`/edit-task/${taskId}`)
    }

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1)
        }
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString()
    }

    return (
        <>
            <AppHeader />
            <Box sx={{ paddingBottom: '60px', px: 4, paddingTop: 2 }}>
                {tasks.length === 0 && (
                    <Box
                        sx={{
                            margin: '32px auto',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 2,
                            flexDirection: 'column',
                        }}
                    >
                        <StorageIcon sx={{ fontSize: 48 }} />
                        <Typography fontSize={24}>
                            You don't have assigned tasks!
                        </Typography>
                    </Box>
                )}
                {tasks.map((task) => (
                    <Accordion key={task.id}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3-content"
                            id="task"
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    alignItems: 'center',
                                }}
                            >
                                {user.role_name !== ROLE_EMPLOYEE && (
                                    <IconButton
                                        disabled={
                                            task.current_status ===
                                                TASK_STATUS.DONE ||
                                            task.current_status ===
                                                TASK_STATUS.UNFULFILLED
                                        }
                                        onClick={() => handleTaskClick(task.id)}
                                    >
                                        <EditIcon
                                            sx={{
                                                color:
                                                    task.current_status ===
                                                        TASK_STATUS.DONE ||
                                                    task.current_status ===
                                                        TASK_STATUS.UNFULFILLED
                                                        ? neutral[40]
                                                        : sunriseYellow[60],
                                            }}
                                        />
                                    </IconButton>
                                )}
                                <Typography
                                    sx={{ color: neutral[70], fontSize: '8px' }}
                                >
                                    TASK TITLE:
                                </Typography>
                                <Typography
                                    sx={{
                                        color: neutral[90],
                                        fontSize: '12px',
                                    }}
                                >
                                    {task.title}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    marginLeft: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <Typography>{task.current_status}</Typography>
                                <AssignedUsersGroup
                                    avatarSize={25}
                                    avatarFontSize={12}
                                    personnels={task.Personnel}
                                />
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: neutral[70],
                                            fontSize: '8px',
                                        }}
                                    >
                                        TASK DESCRIPTION:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: neutral[90],
                                            fontSize: '12px',
                                        }}
                                    >
                                        {task.description}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: neutral[70],
                                            fontSize: '8px',
                                        }}
                                    >
                                        START DATE:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: neutral[90],
                                            fontSize: '12px',
                                        }}
                                    >
                                        {formatDate(task.start_date)}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: neutral[70],
                                            fontSize: '8px',
                                        }}
                                    >
                                        END DATE:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: neutral[90],
                                            fontSize: '12px',
                                        }}
                                    >
                                        {formatDate(task.end_date)}
                                    </Typography>
                                </Box>
                            </Box>
                        </AccordionDetails>
                        {task.Subtasks?.map((subtask) => (
                            <Accordion key={subtask.id}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3-content"
                                    id="subtask"
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: neutral[70],
                                                fontSize: '8px',
                                            }}
                                        >
                                            SUBTASK TITLE:
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: neutral[90],
                                                fontSize: '12px',
                                            }}
                                        >
                                            {subtask.title}
                                        </Typography>{' '}
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: neutral[70],
                                                fontSize: '8px',
                                            }}
                                        >
                                            SUBTASK DESCRIPTION:
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: neutral[90],
                                                fontSize: '12px',
                                            }}
                                        >
                                            {subtask.description}
                                        </Typography>{' '}
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Accordion>
                ))}
            </Box>
            {tasks.length > 0 && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        backgroundColor: '#fff',
                        borderTop: '1px solid #ddd',
                        padding: '10px 0',
                    }}
                >
                    <IconButton
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                    <Box display="flex" alignItems="center" mx={2}>
                        Page {page} of {totalPages}
                    </Box>
                    <IconButton
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
            )}
        </>
    )
}

export default TasksView
