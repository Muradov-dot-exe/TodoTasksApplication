import { Avatar, AvatarGroup } from '@mui/material'
import { stringAvatar, stringToColor } from '../utils/utils'
import React, { forwardRef } from 'react'

const AssignedUsersGroup = forwardRef((props, ref) => {
    const { personnels, avatarSize, avatarFontSize } = props

    return (
        <AvatarGroup
            sx={{
                '.MuiAvatarGroup-avatar': {
                    width: avatarSize,
                    height: avatarSize,
                    fontSize: avatarFontSize,
                },
            }}
            max={3}
            renderSurplus={(surplus) => <span>+{surplus.toString()}</span>}
        >
            {personnels.map((personnel) => (
                <Avatar
                    sx={{
                        bgcolor: stringToColor(
                            `${personnel.first_name} ${personnel.last_name}`
                        ),
                    }}
                    key={personnel.id}
                    {...stringAvatar(
                        `${personnel.first_name} ${personnel.last_name}`
                    )}
                />
            ))}
        </AvatarGroup>
    )
})

export default AssignedUsersGroup
