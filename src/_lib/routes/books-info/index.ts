import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js'
import express, { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { initializeTool } from './tools'

const router = Router()
const transportMap: { [sessionId: string]: StreamableHTTPServerTransport } = {}

router.post('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined
    let transport: StreamableHTTPServerTransport
    if (sessionId && transportMap[sessionId]) {
        transport = transportMap[sessionId]
    } else if (!sessionId && isInitializeRequest(req.body)) {
        transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: (sessionId) => {
                transportMap[sessionId] = transport
            },
            enableJsonResponse: true,
        })
        transport.onclose = () => {
            if (transport.sessionId) {
                delete transportMap[transport.sessionId]
            }
        }
        const server = new McpServer({
            name: 'MCP Server',
            version: '0.0.1',
        })
        initializeTool(server)
        await server.connect(transport)
    } else {
        res.status(400).json({
            jsonrpc: '2.0',
            error: {
                code: -32000,
                message: 'Bad Request: No valid session ID provided',
            },
            id: null,
        })
        return
    }
    await transport.handleRequest(req, res, req.body)
})

// Reusable handler for GET and DELETE requests
const handleSessionRequest = async (req: express.Request, res: express.Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined
    if (!sessionId || !transportMap[sessionId]) {
        res.status(400).send('Invalid or missing session ID')
        return
    }
    const transport = transportMap[sessionId]
    await transport.handleRequest(req, res)
}

router.get('/mcp', handleSessionRequest)

export default router
