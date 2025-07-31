import { prisma } from '../../helpers/db'

interface TaskInput {
    title: string
    description?: string
    status: boolean
    date: string
}

type UpdatTaskParams = {
    taskId: number
    title?: string
    description?: string
    status?: boolean
    date?: string
}

export async function getAllTasks({
    dueDate,
    completed,
}: {
    dueDate?: string
    completed?: boolean | undefined
}) {
    const taskList = await prisma.todo.findMany({
        where: {
            AND: [
                completed ? { completed: completed } : {},
                dueDate
                    ? {
                          date: {
                              gte: new Date(dueDate),
                              lt: new Date(
                                  new Date(dueDate).setDate(new Date(dueDate).getDate() + 1)
                              ),
                          },
                      }
                    : {},
            ],
        },
        select: {
            taskId: true,
            title: true,
            description: true,
            completed: true,
            date: true,
        },
    })
    return {
        content: [{ type: 'text' as const, text: JSON.stringify(taskList) }],
    }
}

export async function createNewTask({ title, description, status, date }: TaskInput) {
    const taskId = await getNextId()
    const createdTask = await prisma.todo.create({
        data: {
            taskId,
            title: title,
            description: description ?? '',
            completed: status,
            date: new Date(date),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        select: {
            taskId: true,
            title: true,
            description: true,
            completed: true,
            date: true,
        },
    })
    return {
        content: [
            {
                type: 'text' as const,
                text: JSON.stringify(createdTask),
            },
        ],
    }
}

export async function updateTaskbyId({
    taskId,
    title,
    description,
    status,
    date,
}: UpdatTaskParams) {
    const dataToUpdate: any = {}
    if (title) dataToUpdate.title = title
    if (description) dataToUpdate.description = description
    if (status) dataToUpdate.completed = status
    if (date) dataToUpdate.date = new Date(date)

    if (Object.keys(dataToUpdate).length > 0) {
        const updated = await prisma.todo.update({
            where: {
                taskId: taskId,
            },
            data: dataToUpdate,
        })
        return {
            content: [{ type: 'text' as const, text: JSON.stringify(updated) }],
        }
    } else {
        return {
            content: [
                {
                    type: 'text' as const,
                    text: `No data found to be updated`,
                },
            ],
        }
    }
}

export async function deleteTaskById({ taskId }: { taskId: number }) {
    if (!taskId)
        return {
            content: [{ type: 'text' as const, text: 'Task Id is required' }],
            isError: true,
        }
    const deleted = await prisma.todo.delete({
        where: {
            taskId,
        },
    })
    return {
        content: [{ type: 'text' as const, text: JSON.stringify(deleted) }],
    }
}

async function getNextId() {
    const latestTask = await prisma.todo.findMany({
        select: {
            taskId: true,
        },
        orderBy: {
            taskId: 'desc',
        },
        take: 1,
    })
    return (latestTask?.[0]?.taskId ?? 0) + 1
}
