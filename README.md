# mcp-reactome

Reactome biological pathway database

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search` | Search across all Reactome objects. |
| `pathway` | Full pathway record by stable id (e.g. R-HSA-68886). |
| `participants` | Entity participants of a pathway. |
| `pathways_for_entity` | Pathways containing an entity, looked up by external resource id (e.g. UniProt accession). |
| `orthologous_events` | Orthologous pathways/reactions in another species. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "reactome": {
      "url": "https://gateway.pipeworx.io/reactome/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Reactome data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
