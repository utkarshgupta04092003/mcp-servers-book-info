import { formatInTimeZone } from 'date-fns-tz'
import Fuse from 'fuse.js'
import { google } from 'googleapis'
import { authorize } from './fetchers'

export async function getCalendarTimezone(calendarId: string | null | undefined): Promise<string> {
    try {
        const auth = await authorize()
        const calendar = google.calendar({ version: 'v3', auth })
        const response = await calendar.calendarList.get({ calendarId: calendarId ?? 'primary' })
        if (!response.data) {
            throw new Error(`Calendar ${calendarId} not found`)
        }
        return response.data.timeZone || 'UTC'
    } catch (error) {
        console.log('error', error)
        return 'UTC'
    }
}

export function convertUTCToIST(date: string) {
    try {
        return formatInTimeZone(new Date(date), 'Asia/Kolkata', 'yyyy-MM-ddTHH:mm:ss')
    } catch {
        return formatInTimeZone(new Date(), 'Asia/Kolkata', 'yyyy-MM-ddTHH:mm:ss')
    }
}

export async function getCalendarIdFromQuery(query: string | undefined): Promise<string> {
    if (!query) return 'primary'
    try {
        const auth = await authorize()
        const calendar = google.calendar({ version: 'v3', auth })
        const response = await calendar.calendarList.list()
        const calendarData = (response.data.items ?? []).map((item) => ({
            id: item.id,
            summary: item.summary,
            timeZone: item.timeZone,
        }))
        const fuseOptions = {
            keys: [
                {
                    name: 'summary',
                    weight: 0.7, // Give more weight to summary matches
                },
                {
                    name: 'id',
                    weight: 0.3, // Less weight to id matches
                },
            ],
            threshold: 0.5,
            includeScore: true,
            findAllMatches: false,
            minMatchCharLength: 1,
            shouldSort: true,
        }
        const fuse = new Fuse(calendarData, fuseOptions)
        const searchResults = fuse.search(query)
        const calendarId = searchResults.length > 0 ? searchResults[0].item.id : undefined
        return calendarId ?? 'primary'
    } catch (error) {
        console.log('error', error)
        return 'primary'
    }
}

// helper functions to get timezone
// async function getCalendarDetails(
//     calendarId: string
// ): Promise<calendar_v3.Schema$CalendarListEntry> {
//     try {
//         const calendar = await authorize()
//         const response = await calendar.calendarList.get({ calendarId })
//         if (!response.data) {
//             throw new Error(`Calendar ${calendarId} not found`)
//         }
//         return response.data
//     } catch (error: any) {
//         throw new Error(error)
//     }
// }
