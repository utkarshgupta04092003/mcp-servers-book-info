# Google Calendar MCP Server

A **Model Context Protocol (MCP) server** that connects to **Google Calendar**, providing tools to list, create, delete, and search calendar events.  

## 🚀 Features
This server exposes the following tools:
- **`listAllCalendars`** → Fetch all available calendars  
- **`listEvents`** → List events from a specific calendar  
- **`createEvent`** → Create a new event  
- **`deleteEvent`** → Delete an event  
- **`searchEventByQuery`** → Search events by keyword query  

## 🔑 Setup & Authentication
Before running the server, you’ll need to set up Google Calendar API access.  

1. **Enable Google Calendar API**  
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).  
   - Create a project (or use an existing one).  
   - Enable the **Google Calendar API**.  

2. **Generate credentials**  
   - In **API & Services → Credentials**, create **OAuth 2.0 Client IDs**.  
   - Download the file as `credentials.json`.  
   - Place `credentials.json` in the **root** of this project.  

3. **Authenticate**  
   - On the first run, the server will ask you to authenticate with Google.  
   - A browser window will open asking for permission to access your Google Calendar.  
   - After granting access, a token file will be created so you don’t need to log in every time.  

⚠️ **Important:** Never commit `credentials.json` or your generated token file to GitHub.  

## 🛠️ Installation

Clone this repository and install dependencies:

```bash
git clone https://github.com/utkarshgupta04092003/mcp-servers.git
cd mcp-servers
npm install
```

▶️ Usage

Run the server in development mode:
```bash
npm run dev
```
Once running, the MCP server will expose the Google Calendar tools, and you can interact with them through your MCP client.