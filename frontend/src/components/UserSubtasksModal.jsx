import { Box, Modal } from '@mui/material'
import UserSubtasksList from './UserSubtasksList'
import { neutral } from '@impulse-ui/colours'
import { useState } from 'react'
import UserSubtaskForm from './UserSubtaskForm'
import { useUserAuth } from '../context/useAuthContext'
import { ROLE_EMPLOYEE } from '../constants/roles'
import ViewSubtask from './ViewSubtask'

const UserSubtasksModal = ({ open, handleClose, subtasks, task }) => {
    const { user } = useUserAuth()
    const [subtask, setSubtask] = useState()

    return (
        <Modal
            onClose={(event) => {
                handleClose(event)
                setSubtask(null)
            }}
            open={open}
        >
            <Box
                sx={{
                    height: '600px',
                    width: 400,
                    padding: '16px',
                    position: 'fixed',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: neutral[40],
                    boxShadow: 24,
                    borderRadius: '16px',
                    textAlign: 'center',
                }}
            >
                {subtask ? (
                    user.role_name === ROLE_EMPLOYEE ? (
                        <UserSubtaskForm
                            subtask={subtask}
                            setSubtask={setSubtask}
                        />
                    ) : (
                        <ViewSubtask
                            subtask={subtask}
                            handleCloseAction={() => setSubtask(null)}
                        />
                    )
                ) : (
                    <UserSubtasksList
                        subtasks={subtasks}
                        task={task}
                        handleSelect={setSubtask}
                    />
                )}
            </Box>
        </Modal>
    )
}

export default UserSubtasksModal
