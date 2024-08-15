import { axiosInstance } from '../axiosConfig'

export const saveUserRequest = async (personnel) => {
    await axiosInstance.put(`/personnel/edit/${personnel.id}`, {
        first_name: personnel.first_name,
        last_name: personnel.last_name,
        email: personnel.email,
        role_name: personnel.role_name,
        is_available: personnel.is_available,
    })
}
