import { google } from 'googleapis'
import { authorize, getCalendarIdFromQuery, getCalendarTimezone } from './helpers'

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

export async function listAllCalendars() {
    const auth = await authorize()
    const calendar = google.calendar({ version: 'v3', auth })
    const res = await calendar.calendarList.list()
    const calendarData = (res.data.items ?? []).map((item) => ({
        id: item.id,
        summary: item.summary,
        timeZone: item.timeZone,
    }))
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
    const eventLists = await calendar.events.list({
        calendarId,
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    })
    const events = eventLists.data.items || []
    if (events.length === 0) {
        return {
            content: [
                {
                    type: 'text' as const,
                    text: `No Upcoming events found.`,
                },
            ],
        }
    }
    const eventDetails: any[] = []
    events.map((event) => {
        const start = event?.start?.dateTime || event?.start?.date
        const end = event?.end?.dateTime || event?.end?.date
        eventDetails.push({
            eventId: event.id,
            start,
            end,
            summary: event?.summary ?? 'NA',
            description: event?.description ?? 'NA',
            htmlLink: event?.htmlLink,
        })
    })
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
    const event = {
        summary: meetingTitle,
        location: meetingLocation ?? '',
        description: description ?? '',
        start: {
            dateTime: startTime,
            timeZone: currentTimezone,
        },
        end: {
            dateTime: endTime,
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

export async function searchEventByQuery({
    calendarId,
    query,
}: {
    calendarId: string
    query: string
}) {
    try {
        const auth = await authorize()
        const calendar = google.calendar({ version: 'v3', auth })
        const response = await calendar.events.list({
            calendarId,
            q: query,
        })
        const events = response.data.items ?? []
        return {
            content: [
                {
                    type: 'text' as const,
                    text: `Found ${
                        events.length
                    } events matching query "${query}": ${JSON.stringify(events)}`,
                },
            ],
        }
    } catch (error) {
        return {
            content: [
                {
                    type: 'text' as const,
                    text: `Failed to search events. Error: ${error}`,
                },
            ],
            isError: true,
        }
    }
}
