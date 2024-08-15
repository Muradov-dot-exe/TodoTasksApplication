import { ROLE_ADMIN, ROLE_EMPLOYEE, ROLE_MANAGER } from '../constants/roles'
import { Select } from '@impulse-ui/input'
import { useState } from 'react'
import { Typography } from '@mui/material'
import { geekBlue } from '@impulse-ui/colours'
import { saveUserRequest } from '../api/userCardComponent.requests'
import { useUserAuth } from '../context/useAuthContext'

const UsersTableRoleSelect = (props) => {
    const { user } = useUserAuth()
    const [value, setValue] = useState({
        value: props.getValue(),
        label: props.getValue(),
    })

    const getCellContent = () => {
        if (props.getValue() === ROLE_ADMIN && user.role_name === ROLE_ADMIN) {
            return (
                <Typography height={38} display="flex" alignItems="center">
                    Admin
                </Typography>
            )
        }

        if (user.role_name === ROLE_ADMIN) {
            return (
                <Select
                    iStyle={{
                        mainContainerStyle: {
                            iCss: {
                                borderColor: geekBlue[50],
                            },
                        },
                    }}
                    value={value}
                    onOptionSelect={async (value) => {
                        setValue({ value, label: value })
                        await saveUserRequest({
                            ...props.row.original,
                            role_name: value,
                        })
                    }}
                    options={[
                        { value: ROLE_EMPLOYEE, label: ROLE_EMPLOYEE },
                        { value: ROLE_MANAGER, label: ROLE_MANAGER },
                    ]}
                />
            )
        }

        return (
            <Typography height={38} display="flex" alignItems="center">
                {props.getValue()}
            </Typography>
        )
    }

    return getCellContent()
}

export default UsersTableRoleSelect
