import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import z from 'zod'
import { fetchBooks, listAllBooks } from './fetchers'

export const initializeTool = (server: McpServer) => {
    server.registerTool(
        'getBookInformation',
        {
            description: `Today is ${new Date().toDateString()}. extract all the information related to the books`,
            inputSchema: {
                query: z.string().optional().describe(`Some content related to the book`),
                maxNumber: z
                    .number()
                    .optional()
                    .describe(`Maximum number of book informtion to be fetched `),
            },
        },
        fetchBooks
    )
    
    server.registerTool(
        'listAllBooks',
        {
            description: `List all available books without any filters or parameters. This provides a comprehensive list of books.`,
            inputSchema: {},
        },
        listAllBooks
    )
}
