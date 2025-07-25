import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createNewTask, getAllTasks } from './_lib/data-fetchers/tasks'
import z from 'zod'

const server = new McpServer({
    name: 'taskManagement',
    version: '1.0.1',
})

server.tool(
    'getAllTasks',
    'Fetch/ Get list of all tasks',
    {
        completed: z
            .boolean()
            .nullable()
            .describe('Fetch the list of completed task or not completed task'),
    },
    getAllTasks
)

server.tool(
    'createNewTask',
    'Create or add new Task to the list',
    {
        title: z.string().describe('Task title to be saved'),
        description: z.string().nullable().describe('Task description'),
        status: z.boolean().default(false).describe('Status of the task e.g completed or not'),
        date: z.string().datetime().describe('Due date in ISO 8601 format'),
    },
    createNewTask
)

async function main() {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    console.warn(`[INFO] Task management server started...`)
}

main().catch((err) => {
    console.error(`[ERROR] Error starting server: `, err)
    process.exit(1)
})
