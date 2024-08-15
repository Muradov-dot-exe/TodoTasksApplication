const TASK_STATUS = require('../constants/taskStatus')
const Task = require('../models/Task')
const Subtask = require('../models/Subtask')
const Personnel = require('../models/Personnel')

exports.updateTaskStatus = async (task) => {
    const subtasks = task.Subtasks

    if (task.Personnel.length === 0 && !isTaskDone(task)) {
        if (isPastTime(task)) {
            return await task.update({
                current_status: TASK_STATUS.UNFULFILLED,
            })
        }

        return await task.update({ current_status: TASK_STATUS.PENDING })
    }

    if (
        isUpcoming(task) &&
        !subtasks.every((subtask) => subtaskIsDone(subtask, task))
    ) {
        await task.update({ current_status: TASK_STATUS.UPCOMING })
    }

    if (
        isInProgress(task) &&
        !subtasks.every((subtask) => subtaskIsDone(subtask, task))
    ) {
        return await task.update({ current_status: TASK_STATUS.IN_PROGRESS })
    }

    if (
        subtasks.every((subtask) => subtaskIsDone(subtask, task)) &&
        !isTaskDone(task)
    ) {
        const currentPersonnel = await task.getPersonnel()
        await Personnel.update(
            { is_available: true },
            { where: { id: currentPersonnel.map((p) => p.id) } }
        )
        task.setPersonnel([])

        return await task.update({ current_status: TASK_STATUS.DONE })
    }

    if (
        !subtasks.every((subtask) => subtaskIsDone(subtask, task)) &&
        isPastTime(task) &&
        !isTaskDone(task)
    ) {
        const currentPersonnel = await task.getPersonnel()
        await Personnel.update(
            { is_available: true },
            { where: { id: currentPersonnel.map((p) => p.id) } }
        )

        task.setPersonnel([])

        return await task.update({ current_status: TASK_STATUS.UNFULFILLED })
    }
}

const subtaskIsDone = (subtask, task) =>
    subtask.notes.length === subtask.number_of_required_notes &&
    subtask.images.length === subtask.number_of_required_images &&
    new Date(subtask.updatedAt).valueOf() < new Date(task.end_date).valueOf()

const isInProgress = (task) =>
    new Date(task.start_date).valueOf() < Date.now().valueOf() &&
    new Date(task.end_date).valueOf() > Date.now().valueOf()

const isUpcoming = (task) =>
    new Date(task.start_date).valueOf() > Date.now().valueOf()

const isPastTime = (task) =>
    new Date(task.end_date).valueOf() < Date.now().valueOf()

const isTaskDone = (task) =>
    task.current_status === TASK_STATUS.DONE ||
    task.current_status === TASK_STATUS.UNFULFILLED

exports.updateAllTasks = async () => {
    const tasks = await Task.findAll({
        include: [
            { model: Subtask, as: 'Subtasks' },
            {
                model: Personnel,
                as: 'Personnel',
                through: { attributes: [] },
            },
        ],
    })

    await Promise.all(
        tasks.map(
            (task) =>
                new Promise(async (resolve, reject) => {
                    try {
                        await this.updateTaskStatus(task)
                        resolve()
                    } catch {
                        reject()
                    }
                })
        )
    )
}
