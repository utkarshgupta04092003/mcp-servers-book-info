import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import z from 'zod'
import { createNewTask, deleteTaskById, getAllTasks, updateTaskbyId } from './fetchers'

export const initializeTool = (server: McpServer) => {
    server.registerTool(
        'getAllTasks',
        {
            description: `Today is ${new Date().toDateString()}. extract the tasks based on status pending or completed and based on date also. always add taskId in the final response`,
            inputSchema: {
                dueDate: z
                    .string()
                    .optional()
                    .describe(
                        `The date mentioned for each tasks that is due date in YYYY-MM-DD format`
                    ),
                completed: z
                    .boolean()
                    .optional()
                    .describe(
                        `Completed should be true if user is asking for completed tasks else false `
                    ),
            },
        },
        getAllTasks
    )
    server.registerTool(
        'createNewTask',
        {
            description: `Create or add new task to the list based on the provided title, description (optional), status (optional) and dueDate in ISO String format`,
            inputSchema: {
                title: z.string().describe('Task title to be saved'),
                description: z.string().optional().describe('Task description'),
                status: z
                    .boolean()
                    .default(false)
                    .describe('Status of the task e.g completed or not'),
                date: z.string().describe('Due date in UTC format format'),
            },
        },
        createNewTask
    )
    server.registerTool(
        'updateTaskById',
        {
            description: `Update an existing task by its ID. You can update title, description, status, or due date`,
            inputSchema: {
                taskId: z.number().describe('ID of the task to update'),
                title: z.string().optional().describe('New task title'),
                description: z.string().optional().describe('New task description'),
                status: z.boolean().optional().describe('New status of the task'),
                date: z.string().datetime().optional().describe('New due date in UTC format'),
            },
        },
        updateTaskbyId
    )
    server.registerTool(
        'deleteTaskById',
        {
            description: `Delete any task by its taskId`,
            inputSchema: {
                taskId: z.number().describe('Task id for deleting from DB'),
            },
        },
        deleteTaskById
    )
}
