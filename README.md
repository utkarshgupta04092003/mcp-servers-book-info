# 📚 LLM Book Info Agent – Powered by MCP (Model Context Protocol)

This project is a proof-of-concept implementation of **MCP (Model Context Protocol)** — a structured approach to extend LLMs (Large Language Models) with external tool-calling capabilities. The idea is simple: LLMs can generate natural language and take decisions, but they can’t directly **do** things like fetch data from APIs or interact with a database.

By introducing tools (functions) and wiring them through an MCP-style server, we can make models smart *and* useful — enabling them to actually complete tasks in real-world applications.


## 🚀 What This Project Does

Given a natural language query like:

> "Give me 5 top tech books."

This system:

1. **Parses the query using an LLM** to extract:

   * `maxNumber`: 5
   * `query`: "tech"
2. **Calls a 3rd-party book API** (e.g., freeapi.app API) with those parameters.
3. **Uses the model again** to refine the response into natural, human-readable output.


## 📦 Installation

```bash
git clone https://github.com/utkarshgupta04092003/mcp-servers-book-info.git
cd mcp-servers-book-info
npm install
```

## 🧰 Usage

```bash
npm run build
```

Then open any llm agent (e.g copilot, cursor etc) and select mcp server `bookInformations` and its all tools

start asking question via llm agent


## 🤝 Contributing

Contributions are welcome! Fork the repo, create a branch, and open a PR.

If you have ideas to expand this (e.g., multi-tool agents, plugin support, UI), feel free to connect!

## 🔗 Links

🔗 [GitHub Repo](https://github.com/utkarshgupta04092003/mcp-servers-book-info)

🔗 [Demo video](https://www.linkedin.com/posts/utkarshgupta04092003_ai-llm-openai-activity-7354380682342621184-l7V2?utm_source=share&utm_medium=member_desktop&rcm=ACoAAC9N_wwBqPVZh3FYjiN2exsa9c4U2Qw8jT0)




## 📄 License

MIT License
