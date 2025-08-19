# 📚 Book Information MCP Server

A **Model Context Protocol (MCP) server** that connects to a **Book Information API**, providing tools to search and fetch books by query, category, or limit.  

This project demonstrates how MCP can extend LLMs with external tool-calling, enabling real-world tasks like fetching book recommendations from APIs and returning human-friendly answers.

---

## 🚀 Features
This server exposes the following tools:
- **`getBookInformation`** → Search books by keyword (e.g., "tech", "history") with a max number of book info. 

Example:  
> User: *"Give me 5 top tech books"*  
> MCP extracts → `{ maxNumber: 5, query: "tech" }`  
> Calls API → Returns structured list  
> LLM → Converts response into natural, readable text  

---

## 🔑 Setup
This server uses the [FreeAPI.app Books API](https://freeapi.app/) (or any 3rd-party book API).  
No special authentication is required for basic usage.  

---

## 🛠️ Installation

Clone this repository and install dependencies:

```bash
git clone https://github.com/utkarshgupta04092003/mcp-servers.git
cd mcp-servers
npm install
```
## ▶️ Usage

Run the server in development mode:
```
npm run dev
```

Once running, open any MCP-compatible client (e.g., Copilot, Cursor, etc.), select the MCP server bookInformations, and start asking questions like:
```
"Show me 10 best AI books"
"Find top-rated history books"
"Get details of a book called 'Clean Code'"
```

## 🤝 Contributing

Contributions are welcome!
```
1. Fork the repo
2. Create a branch
3. Submit a PR
```

## 🔗 Links

🎥 Demo Video [click here](https://www.linkedin.com/posts/utkarshgupta04092003_ai-llm-openai-activity-7354380682342621184-l7V2/)

## 📄 License

MIT License
