import {
    dustRed,
    geekBlue,
    neutral,
    orange,
    polarGreen,
} from '@impulse-ui/colours'
import TASK_STATUS from '../constants/taskStatus'
import { ROLE_ADMIN } from '../constants/roles'

export const backgroundTaskStatus = (props) => {
    if (props?.event?.currentStatus === TASK_STATUS.UPCOMING) {
        return orange[40]
    }
    if (props?.event?.currentStatus === TASK_STATUS.IN_PROGRESS) {
        return polarGreen[40]
    }
    if (props?.event?.currentStatus === TASK_STATUS.DONE) {
        return geekBlue[40]
    }
    if (props?.event?.currentStatus === TASK_STATUS.UNFULFILLED) {
        return dustRed[40]
    }

    return neutral[50]
}

export const borderTaskStatus = (props) => {
    if (props?.event?.currentStatus === TASK_STATUS.UPCOMING) {
        return orange[50]
    }
    if (props?.event?.currentStatus === TASK_STATUS.IN_PROGRESS) {
        return polarGreen[50]
    }
    if (props?.event?.currentStatus === TASK_STATUS.DONE) {
        return geekBlue[50]
    }
    if (props?.event?.currentStatus === TASK_STATUS.UNFULFILLED) {
        return dustRed[50]
    }

    return neutral[50]
}

export const stringToColor = (name) => {
    let hash = 0
    let i

    for (i = 0; i < name.toString().length; i += 1) {
        hash = name.toString().charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff
        color += `00${value.toString(16)}`.slice(-2)
    }

    return color
}

export const stringAvatar = (name) => {
    return {
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    }
}

export const isAdmin = (activeUser) => {
    if (activeUser) {
        if (
            activeUser.user !== undefined &&
            activeUser.user.role_name === ROLE_ADMIN
        ) {
            return true
        } else if (activeUser.role_name === ROLE_ADMIN) {
            return true
        }
    }

    return false
}
