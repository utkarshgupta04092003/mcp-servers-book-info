import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fetchBooks } from "./_lib/helpers/global";

const server = new McpServer({
  name: "book-details",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
  "getAllBookInfo",
  "Fetch all the books information",
  {
    query: z.string().describe("category of the books"),
    maxNumber: z.number().describe("Maximum no of books"),
  },
  fetchBooks
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.warn("Book MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
