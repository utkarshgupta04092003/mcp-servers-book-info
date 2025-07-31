interface FetchBooksParams {
    query?: string | null
    maxNumber?: number | null
}

export async function fetchBooks({ query, maxNumber }: FetchBooksParams) {
    const page = 1
    const limit = maxNumber ?? 10
    const inc = 'kind,id,etag,volumeInfo'
    const queryValue = query ?? ''

    const baseUrl = 'https://api.freeapi.app/api/v1/public/books'
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        inc: inc,
        query: queryValue,
    })
    try {
        const response = await fetch(`${baseUrl}?${queryParams}`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return {
            content: [
                {
                    type: 'text' as const,
                    text: JSON.stringify(data.data.data),
                },
            ],
        }
    } catch (error) {
        return {
            content: [
                {
                    type: 'text' as const,
                    text: `❌ Error fetching books ${error as string}`,
                },
            ],
            isError: true,
        }
    }
}
