import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { geekBlue, neutral } from '@impulse-ui/colours'

const UserSubtasksList = ({ subtasks, task, handleSelect }) => {
    return (
        <>
            <Typography
                sx={{ mt: 4, mb: 2, color: geekBlue[50], fontSize: '36px' }}
                component="div"
            >
                SUBTASKS OF {task.title}
            </Typography>
            <List>
                {subtasks.map((subtask) => (
                    <ListItem
                        key={subtask.id}
                        secondaryAction={
                            <IconButton
                                onClick={() => handleSelect(subtask)}
                                edge="end"
                                aria-label="delete"
                            >
                                <KeyboardArrowRightIcon
                                    sx={{
                                        fontSize: '32px',
                                        color: geekBlue[50],
                                    }}
                                />
                            </IconButton>
                        }
                    >
                        <ListItemAvatar>
                            <Avatar sx={{ backgroundColor: geekBlue[50] }}>
                                <AssignmentIcon sx={{ color: neutral[20] }} />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography
                                    sx={{
                                        color: neutral[90],
                                        fontSize: '18px',
                                    }}
                                >
                                    {subtask.title}
                                </Typography>
                            }
                            secondary={
                                <Typography
                                    sx={{
                                        color: neutral[70],
                                        fontSize: '12px',
                                    }}
                                >
                                    {subtask.description}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </>
    )
}

export default UserSubtasksList
