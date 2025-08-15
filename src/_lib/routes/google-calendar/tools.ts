import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import z from 'zod'
import { createEvent, listAllCalendars, listCalendarEvents } from './fetchers'

export const initializeTool = (server: McpServer) => {
    server.registerTool(
        'listAllCalendars',
        {
            description: `Extract the list of all the calendars saved on the google calendar`,
        },
        listAllCalendars
    )
    server.registerTool(
        'listEvents',
        {
            description: `Today is ${new Date().toISOString()}.Extract the list of all the events saved on the google calendar, either from one calendar or multiple calendars`,
            inputSchema: {
                calendarId: z
                    .string()
                    .optional()
                    .describe('The ID of the calendar to list events from'),
                timezone: z.string().optional().describe('The timezone of the calendar'),
                //  add timezone and time interval in the params
            },
        },
        listCalendarEvents
    )
    server.registerTool(
        'createEvent',
        {
            description: `Today is ${new Date().toISOString()}. Extract the necessary event details from the user's prompt and create a corresponding meetings/conferences in Google Calendar.`,
            inputSchema: {
                query: z
                    .string()
                    .optional()
                    .describe(`Query describe the calendar to search for events`),
                meetingTitle: z
                    .string()
                    .describe('A brief title that summarizes the purpose of the meeting'),
                meetingLocation: z
                    .string()
                    .optional()
                    .describe('The physical or virtual location where the meeting will take place'),
                description: z
                    .string()
                    .optional()
                    .describe('A detailed explanation or agenda of the meeting'),
                startTime: z
                    .string()
                    .datetime()
                    .describe(
                        'The exact start date and time of the meeting in UTC format (e.g.,30th july 9AM -> 2025-07-30T09:00:00Z)'
                    ),
                endTime: z
                    .string()
                    .datetime()
                    .describe(
                        'The exact end date and time of the meeting in UTC format (e.g., 30th july 10AM -> 2025-07-30T10:00:00Z)'
                    ),
                attendees: z
                    .array(
                        z.object({
                            email: z.string().email(),
                        })
                    )
                    .default([])
                    .describe('A list of attendees including their email addresses'),
                isConference: z
                    .boolean()
                    .default(false)
                    .describe(
                        'Set to true if this is a video/online conference call (e.g., Google Meet); false if it’s a personal reminder'
                    ),
            },
        },
        createEvent
    )
}
