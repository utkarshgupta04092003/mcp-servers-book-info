import express from 'express'
import bookInformationRoute from './_lib/routes/books-info'
import mcpTasksRoute from './_lib/routes/mcp-tasks'

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.use('/book-information', bookInformationRoute)
app.use('/task-management', mcpTasksRoute)

app.listen(PORT, () => console.warn(`Server is running at port ${PORT}`))
