interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Reactome MCP — open biological pathway knowledge-base.
 *
 * Auth: none. Docs: https://reactome.org/ContentService/
 */


const BASE = 'https://reactome.org/ContentService';
const UA = 'pipeworx-mcp-reactome/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'search',
    description: 'Search across all Reactome objects.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        types: { type: 'string', description: 'Comma-sep: Pathway,Reaction,Protein,Complex,…' },
        cluster: { type: 'boolean', description: 'Group results by type (default true).' },
      },
      required: ['query'],
    },
  },
  {
    name: 'pathway',
    description: 'Full pathway record by stable id (e.g. R-HSA-68886).',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id'],
    },
  },
  {
    name: 'participants',
    description: 'Entity participants of a pathway.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id'],
    },
  },
  {
    name: 'pathways_for_entity',
    description: 'Pathways containing an entity, looked up by external resource id (e.g. UniProt accession).',
    inputSchema: {
      type: 'object',
      properties: {
        resource: { type: 'string', description: 'UniProt | ChEBI | Ensembl | NCBI | GeneCards | … (default UniProt)' },
        entity_id: { type: 'string', description: 'Identifier within the resource, e.g. "P04637" for TP53.' },
        species: { type: 'string', description: 'NCBI taxonomy id as a string (default "9606" — human).' },
      },
      required: ['entity_id'],
    },
  },
  {
    name: 'orthologous_events',
    description: 'Orthologous pathways/reactions in another species.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Source Reactome event id.' },
        species: { type: 'string', description: 'Target species (e.g. "Mus musculus").' },
      },
      required: ['id', 'species'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search': {
      const params = new URLSearchParams({
        query: reqStr(args, 'query', '"signaling by EGFR"'),
        cluster: args.cluster === false ? 'false' : 'true',
      });
      if (args.types) params.set('types', String(args.types));
      return rxGet(`/search/query?${params}`);
    }
    case 'pathway':
      return rxGet(`/data/pathway/${encodeURIComponent(reqStr(args, 'id', '"R-HSA-68886"'))}/containedEvents`);
    case 'participants':
      return rxGet(`/data/pathway/${encodeURIComponent(reqStr(args, 'id', '"R-HSA-68886"'))}/participants`);
    case 'pathways_for_entity': {
      const resource = (args.resource as string | undefined) ?? 'UniProt';
      const ent = reqStr(args, 'entity_id', '"P04637"');
      const species = (args.species as string | undefined) ?? '9606';
      return rxGet(
        `/data/mapping/${encodeURIComponent(resource)}/${encodeURIComponent(ent)}/pathways?species=${encodeURIComponent(species)}`,
      );
    }
    case 'orthologous_events': {
      const id = reqStr(args, 'id', '"R-HSA-68886"');
      const species = reqStr(args, 'species', '"Mus musculus"');
      return rxGet(`/data/orthologies/${encodeURIComponent(id)}/species/${encodeURIComponent(species)}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function rxGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('Reactome: not found');
  if (!res.ok) throw new Error(`Reactome: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
