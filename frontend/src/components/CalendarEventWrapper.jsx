import { Box, Typography } from '@mui/material'
import { backgroundTaskStatus, borderTaskStatus } from '../utils/utils'
import { neutral } from '@impulse-ui/colours'
import AssignedUsersGroup from './AsignedUsersGroup'
import { useState } from 'react'
import UserSubtasksModal from './UserSubtasksModal'

const CalendarEventWrapper = (props) => {
    const [open, setOpen] = useState(false)

    const generalCalendarStyleConverter = (styleProp, fallBackProp) => {
        if (typeof styleProp === 'string') {
            return styleProp
        }

        return fallBackProp
    }

    const handleClose = (event) => {
        event.stopPropagation()
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    return (
        <Box
            onClick={() => {
                props?.onClick?.()
                handleOpen()
            }}
            onDoubleClick={props?.onDoubleClick}
            onKeyDown={props?.onKeyPress}
            role="button"
            style={{
                backgroundColor: backgroundTaskStatus(props),
                border: `1px solid ${borderTaskStatus(props)}`,
                color: neutral[150],
                height: generalCalendarStyleConverter(
                    props.style?.height,
                    `${props.style?.height}%`
                ),
                top: generalCalendarStyleConverter(
                    props.style?.top,
                    `${props.style?.top}%`
                ),
                left: generalCalendarStyleConverter(
                    props.style?.xOffset,
                    `calc(${props.style?.left}% + 38px)`
                ),
                width: generalCalendarStyleConverter(
                    props.style?.width,
                    `calc(${props.style?.width}% - 38px)`
                ),
            }}
            className={`rbc-event ${props?.selected ? 'rbc-selected' : ''}`}
        >
            <UserSubtasksModal
                open={open}
                handleClose={handleClose}
                subtasks={props.event.subtasks}
                task={props.event}
            />
            <Box
                height={'100%'}
                display={'flex'}
                alignItems={'center'}
                gap={0.5}
            >
                <Typography
                    noWrap
                    textOverflow={'ellipsis'}
                    overflow={'hidden'}
                >
                    {props.event.title}
                </Typography>
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    flexWrap={'wrap'}
                >
                    {props.type === 'time' && (
                        <AssignedUsersGroup
                            avatarSize={20}
                            avatarFontSize={10}
                            personnels={props?.event?.personnel ?? []}
                        />
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default CalendarEventWrapper
