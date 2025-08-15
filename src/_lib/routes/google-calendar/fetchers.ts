import { authenticate } from '@google-cloud/local-auth'
import { readFileSync, writeFileSync } from 'fs'
import { google } from 'googleapis'
import * as path from 'path'
import { getCalendarIdFromQuery, getCalendarTimezone } from './helpers'

type CreateEventProps = {
    calendarInfo?: string | undefined
    meetingTitle: string
    meetingLocation?: string | undefined
    description?: string | undefined
    startTime: string
    endTime: string
    attendees?: Array<{ email: string }>
    isConference: boolean
}

const SCOPES = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
]
// Note: Everytime scopes are changed, token needs to be changed

const TOKEN_PATH = path.join(process.cwd(), 'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')

export async function listAllCalendars() {
    const auth = await authorize()
    const calendar = google.calendar({ version: 'v3', auth })
    const res = await calendar.calendarList.list()
    const calendarData = (res.data.items ?? []).map((item) => ({
        id: item.id,
        summary: item.summary,
        timeZone: item.timeZone,
    }))
    console.log({ calendarData })
    return {
        content: [
            {
                type: 'text' as const,
                text: `All the calendars: ${JSON.stringify(calendarData)}`,
            },
        ],
    }
}

export async function listCalendarEvents({ calendarId }: { calendarId?: string }) {
    const auth = await authorize()
    const calendar = google.calendar({ version: 'v3', auth })

    console.log(calendarId)
    const eventLists = await calendar.events.list({
        calendarId,
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    })

    const events = eventLists.data.items || []
    if (events.length === 0) {
        console.log('No upcoming events found.')
        return {
            content: [
                {
                    type: 'text' as const,
                    text: `No Upcoming events found.`,
                },
            ],
        }
    }
    console.log('Upcoming events:')
    const eventDetails: any[] = []
    events.map((event) => {
        const start = event?.start?.dateTime || event?.start?.date
        const end = event?.end?.dateTime || event?.end?.date
        console.log(`${start} - ${event?.summary ?? 'NA'}`)
        eventDetails.push({
            eventId: event.id,
            start,
            end,
            summary: event?.summary ?? 'NA',
            description: event?.description ?? 'NA',
            htmlLink: event?.htmlLink,
        })
    })
    console.log(eventDetails)
    return {
        content: [
            {
                type: 'text' as const,
                text: `Upcoming 10 events: ${JSON.stringify(eventDetails.slice(0, 10))}`,
            },
        ],
    }
}

export async function createEvent({
    calendarInfo,
    meetingTitle,
    meetingLocation,
    description,
    startTime,
    endTime,
    attendees,
    isConference,
}: CreateEventProps) {
    let calendarId = await getCalendarIdFromQuery(calendarInfo)
    let currentTimezone = await getCalendarTimezone(calendarId)
    const isIST = currentTimezone === 'Asia/Kolkata'
    const event = {
        summary: meetingTitle,
        location: meetingLocation ?? '',
        description: description ?? '',
        start: {
            dateTime: isIST ? startTime : startTime,
            timeZone: currentTimezone,
        },
        end: {
            dateTime: isIST ? endTime : endTime,
            timeZone: currentTimezone,
        },
        // recurrence: ['RRULE:FREQ=DAILY;COUNT=1'],
        attendees: attendees,
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'email', minutes: 24 * 60 },
                { method: 'popup', minutes: 10 },
            ],
        },
        ...(isConference
            ? {
                  conferenceData: {
                      createRequest: {
                          requestId: 'unique-id-1234',
                          conferenceSolutionKey: {
                              type: 'hangoutsMeet',
                          },
                      },
                  },
              }
            : {}),
    }
    console.dir({ event }, { depth: null })
    const auth = await authorize()
    const calendar = google.calendar({ version: 'v3', auth })
    try {
        const createdEvent = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId ?? 'primary',
            requestBody: event,
            conferenceDataVersion: 1,
        })
        return {
            content: [
                {
                    type: 'text' as const,
                    text: `Event created successful, event  url: ${createdEvent.data.htmlLink}, Google meet link: ${createdEvent.data.hangoutLink}, Organizer: ${createdEvent.data.organizer?.email}`,
                },
            ],
        }
    } catch (err) {
        console.log('There was an error contacting the Calendar service:', err)
        return {
            content: [
                {
                    type: 'text' as const,
                    text: `Error while creating event ${err}`,
                },
            ],
            isError: true,
        }
    }
}

export async function deleteEvent({
    calendarId,
    eventId,
}: {
    calendarId: string
    eventId: string
}) {
    try {
        const auth = await authorize()
        const calendar = google.calendar({ version: 'v3', auth })
        await calendar.events.delete({
            calendarId,
            eventId,
        })
        return {
            content: [
                {
                    type: 'text' as const,
                    text: 'Event deleted successfully.',
                },
            ],
        }
    } catch (error) {
        return {
            content: [
                {
                    type: 'text' as const,
                    text: `Failed to delete event. Error: ${error}`,
                },
            ],
            isError: true,
        }
    }
}

function loadSavedCredentialsIfExist() {
    try {
        const content = readFileSync(TOKEN_PATH) as any
        const credentials = JSON.parse(content)
        return google.auth.fromJSON(credentials)
    } catch (err) {
        return null
    }
}

function saveCredentials(client: any) {
    const content = readFileSync(CREDENTIALS_PATH) as any
    const keys = JSON.parse(content)
    const key = keys.installed || keys.web
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    })
    writeFileSync(TOKEN_PATH, payload)
}

// move this to helpers
export async function authorize() {
    let client: any = loadSavedCredentialsIfExist()
    if (client) {
        console.log('Already authenticated, returning client')
        return client
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    })
    if (client.credentials) {
        saveCredentials(client)
    }
    return client
}
