import { axiosInstance } from '../axiosConfig'

export const uploadImage = async (formData, id) => {
    return await axiosInstance.post(`/subtasks/upload-image/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export const addNote = async (note, id) => {
    await axiosInstance.post(`/subtasks/add-note/${id}`, { note })
}

export const deleteImage = async (name, id) => {
    return await axiosInstance.delete(
        `/subtasks/delete-image/${id}/${encodeURIComponent(name)}`
    )
}

export const deleteNote = async (note, id) => {
    return await axiosInstance.delete(
        `/subtasks/delete-note/${id}/${encodeURIComponent(note)}`
    )
}
