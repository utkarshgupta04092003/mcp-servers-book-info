import { prisma } from '../helpers/db'

interface TaskInput {
    title: string
    description: string | null
    status: boolean
    date: string
}

export async function getAllTasks({ completed }: { completed: boolean | null }) {
    const taskList = await prisma.todo.findMany({
        where: completed ? { completed: completed } : {},
    })
    console.warn(`[INFO] Fetched all the task list of status: ${completed}: ${taskList}`)
    return {
        content: [{ type: 'text' as const, text: JSON.stringify(taskList) }],
    }
}

export async function createNewTask({ title, description, status, date }: TaskInput) {
    const createdTask = await prisma.todo.create({
        data: {
            title: title,
            description: description ?? '',
            completed: status,
            date: new Date(date),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    })
    console.warn(`[INFO] Created new task: ${createdTask}`)
    return {
        content: [
            {
                type: 'text' as const,
                text: JSON.stringify(createdTask),
            },
        ],
    }
}
