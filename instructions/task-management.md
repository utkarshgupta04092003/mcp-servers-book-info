# ✅ Task Manager MCP Server

A **Model Context Protocol (MCP) server** that manages tasks (to-do list style) with tools for creating, updating, deleting, and listing tasks.

This project demonstrates how MCP can connect an LLM to a task database, making it possible to manage tasks directly through natural language queries.

---

## 🚀 Features

This server exposes the following tools:

-   **`getAllTasks`** → Retrieve tasks filtered by `status` (pending/completed) and/or `dueDate`
-   **`createNewTask`** → Add a new task with title, description, status, and due date
-   **`updateTaskById`** → Update an existing task by ID (title, description, status, or due date)
-   **`deleteTaskById`** → Delete a task by its ID

### Example Queries:

> _"Show me all pending tasks for today"_  
> _"Add a new task called 'Buy groceries' for tomorrow"_  
> _"Mark task 3 as completed"_  
> _"Delete task with ID 5"_

---

## 🔑 Setup

Before running the server, you need to set up a **MongoDB database**.

1. Create a MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas/database)).
2. Get your **MongoDB connection URI** (e.g., `mongodb+srv://username:password@cluster0.mongodb.net/myDB`).
3. Create a `.env` file in the project root and add:

```env
DATABASE_URL=your-mongodb-connection-url
```

⚠️ **Important:** Do not commit your `.env` file to GitHub.

---

## 🛠️ Installation

Clone this repository and install dependencies:

```bash
git clone https://github.com/utkarshgupta04092003/mcp-servers.git
cd mcp-servers
npm install
```

---

## ▶️ Usage

Run the server in development mode:

```bash
npm run dev
```

Once running, open an MCP-compatible client (e.g., Copilot, Cursor, etc.), select the MCP server **`taskManager`**, and start asking natural language questions.

---

## 🤝 Contributing

Contributions are welcome!

-   Fork the repo
-   Create a feature branch
-   Open a Pull Request

Ideas like **recurring tasks**, **priority support**, or **integration with calendar apps** are great next steps.

---

## 📄 License

MIT License
