import { authenticate } from '@google-cloud/local-auth'
import { formatInTimeZone } from 'date-fns-tz'
import { readFileSync, writeFileSync } from 'fs'
import Fuse from 'fuse.js'
import { google } from 'googleapis'
import path from 'path'

const SCOPES = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
]
// Note: Everytime scopes are changed, token needs to be changed

const TOKEN_PATH = path.join(process.cwd(), 'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')
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

export async function authorize() {
    let client: any = loadSavedCredentialsIfExist()
    if (client) {
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
        return 'primary'
    }
}
