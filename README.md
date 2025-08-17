# MCP Servers Collection

This repository is a **collection of multiple Model Context Protocol (MCP) servers**, each exposing domain-specific tools that can be used independently.

## 🏗️ Project Architecture

The project follows a modular architecture:

```bash
src/
├──_lib/
|  ├── helpers/
|  |   └── db.ts               # Reusable helpers for use across multiple servers
│  └── routes/                 # Each MCP server is added here
│      ├── google-calendar/    # Google Calendar MCP server
│      │   ├── fetchers.ts
│      │   ├── helpers.ts
│      │   ├── index.ts
│      │   └── tools.ts
│      ├── books-info/         # Books Information MCP server
│      │   ├── fetchers.ts
│      │   ├── index.ts
│      │   └── tools.ts
│      └── mcp-tasks/          # Task Management MCP server
│          ├── fetchers.ts
│          ├── index.ts
│          └── tools.ts
├── index.ts                # Entry point
└── playground.ts           # Playground for local testing

```

-   All **MCP servers** live under the `src/_lib/routes/` directory.
-   Each server contains:
    -   `fetchers.ts` → Functions for fetching data from APIs or sources.
    -   `helpers.ts` → Utility functions specific to that server.
    -   `tools.ts` → Exposed MCP tools (the actual actions/commands).
    -   `index.ts` → Server entry point.

This makes it easy to add new MCP servers — just add a new folder under `routes/` with the same structure.

## 📂 Instructions per MCP Server

Each server has its own detailed README under the [`instructions/`](./instructions) directory.

-   📅 [Google Calendar MCP Server](./instructions/google-calendar.md)
-   📚 [Books Info MCP Server](./instructions/books-info.md)
-   ✅ [Tasks MCP Server](./instructions/mcp-tasks.md)

## 🛠️ Installation

Clone this repository and install dependencies:

```bash
git clone https://github.com/utkarshgupta04092003/mcp-servers.git
cd mcp-servers
npm install
```

## ▶️ Usage

Run the dev server:

```bash
npm run dev
```

This will start all the MCP servers registered under `src/_lib/routes/`.

## ➕ Adding a New MCP Server

To add a new MCP server:

1. Create a folder under `src/_lib/routes/` (e.g. `weather-info/`).
2. Add the files (as required):

    - `fetchers.ts`
    - `helpers.ts`
    - `tools.ts`
    - `index.ts`

3. Add documentation for it in the [`instructions/`](./instructions) folder.
4. Link it in this README under **Instructions per MCP Server**.

## 📜 License

MIT License
