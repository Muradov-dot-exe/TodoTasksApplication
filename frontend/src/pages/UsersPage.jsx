import { useEffect, useState } from 'react'
import { axiosInstance } from '../axiosConfig'
import { createColumnHelper } from '@tanstack/react-table'
import { ImpulseTable } from '@impulse-ui/table'
import AppHeader from '../components/AppHeader'
import { Box, Typography } from '@mui/material'
import { geekBlue, neutral } from '@impulse-ui/colours'
import { IThemeProvider } from '@impulse-ui/core'
import UsersTableRoleSelect from '../components/UsersTableRoleSelect'

const columnHelper = createColumnHelper()

const colDefs = [
    columnHelper.accessor('first_name', {
        header: 'First name',
    }),
    columnHelper.accessor('last_name', {
        header: 'Last name',
    }),
    columnHelper.accessor('email', {
        header: 'Email',
    }),
    columnHelper.accessor('role_name', {
        header: 'Role',
        cell: UsersTableRoleSelect,
    }),
    columnHelper.accessor('is_available', {
        header: 'Status',
        cell: (props) => (props.getValue() ? 'Available' : 'Not available'),
    }),
]

const UsersPage = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        axiosInstance.get('/personnel').then((response) => {
            setUsers(response.data)
        })
    }, [])

    return (
        <>
            <AppHeader />
            <Box display={'flex'} justifyContent={'center'} p={2}>
                <IThemeProvider>
                    <ImpulseTable
                        initialState={{
                            pagination: { pageIndex: 0, pageSize: 10 },
                        }}
                        tableHeaderProps={{
                            showTableSearch: true,
                            tableName: (
                                <Typography
                                    component="span"
                                    color={geekBlue[50]}
                                >
                                    USERS
                                </Typography>
                            ),
                        }}
                        iStyle={{
                            tableStyle: {
                                iCss: {
                                    width: '100%',
                                    maxWidth: 1280,
                                },
                            },
                            tbodyStyle: {
                                tdataStyle: {
                                    iCss: {
                                        paddingTop: 16,
                                        paddingBottom: 16,
                                        wordBreak: 'break-all',
                                    },
                                },
                            },
                            theadStyle: {
                                theaderStyle: {
                                    iColorTheme: {
                                        light: {
                                            backgroundColor: geekBlue[50],
                                        },
                                    },
                                },
                                theaderTypographyStyle: {
                                    iColorTheme: {
                                        light: {
                                            color: neutral[20],
                                        },
                                    },
                                },
                            },
                            tableFooterStyle: {
                                paginationStyle: {
                                    pageInputStyle: {
                                        inputContainerStyle: {
                                            iColorTheme: {
                                                light: {
                                                    borderColor: geekBlue[50],
                                                },
                                            },
                                        },
                                    },
                                    pageChangeButtonStyle: {
                                        buttonStyle: {
                                            iColorTheme: {
                                                light: {
                                                    backgroundColor:
                                                        geekBlue[50],
                                                    ':disabled': {
                                                        backgroundColor:
                                                            geekBlue[10],
                                                    },
                                                },
                                            },
                                        },
                                        iconStyle: {
                                            iColorTheme: {
                                                light: {
                                                    ':disabled': {
                                                        color: geekBlue[50],
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            tableHeaderStyle: {
                                searchInputStyle: {
                                    inputContainerStyle: {
                                        iColorTheme: {
                                            light: {
                                                borderColor: geekBlue[50],
                                            },
                                        },
                                    },
                                },
                            },
                        }}
                        data={users}
                        columns={colDefs}
                        getRowId={(row) => row.id}
                    />
                </IThemeProvider>
            </Box>
        </>
    )
}

export default UsersPage
