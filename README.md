# @pipeworx/reactome

[Reactome](https://reactome.org) MCP — open peer-reviewed biological pathway database. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `search(query, types?)` — cross-DB search (pathway, reaction, protein, …)
- `pathway(id)` — full pathway record
- `participants(id)` — entity participants of a pathway
- `pathways_for_entity(entity_id)` — pathways containing the given entity
- `orthologous_events(id, species)` — orthologous pathways/reactions in another species

## Data source

`https://reactome.org/ContentService/`

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
