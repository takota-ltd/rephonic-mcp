import OAuthProvider from "@cloudflare/workers-oauth-provider";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";
import { ApiKeyHandler } from "./api-key-handler";

type Props = {
	apiKey: string;
};

export class MyMCP extends McpAgent<Env, Record<string, never>, Props> {
	server = new McpServer({
		name: "Rephonic",
		version: "1.0.0",
	});

	async init() {
		this.server.tool(
			"lookup_podcast",
			"Look up a podcast's metadata, chart rankings, and latest episodes by its Rephonic ID (e.g. 'huberman-lab'). Use the Rephonic search endpoint or ask the user if you don't know the ID.",
			{ podcast_id: z.string().describe("The Rephonic podcast ID, e.g. 'huberman-lab'") },
			async ({ podcast_id }) => {
				const resp = await fetch(`https://api.rephonic.com/api/podcasts/${encodeURIComponent(podcast_id)}/`, {
					headers: { "X-Rephonic-Api-Key": this.props!.apiKey },
				});

				if (!resp.ok) {
					const text = await resp.text();
					return {
						content: [{ type: "text", text: `Error ${resp.status}: ${text}` }],
						isError: true,
					};
				}

				const data = await resp.json();
				return {
					content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
				};
			},
		);
	}
}

const provider = new OAuthProvider({
	apiHandler: MyMCP.serve("/mcp"),
	apiRoute: "/mcp",
	authorizeEndpoint: "/authorize",
	clientRegistrationEndpoint: "/register",
	defaultHandler: ApiKeyHandler as any,
	tokenEndpoint: "/token",
});

// Wrap the provider so users can connect with just https://mcp.rephonic.com
// without apiRoute "/" catching /authorize and /submit-api-key
export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);
		if (url.pathname === "/") {
			const rewritten = new Request(new URL("/mcp", url.origin).toString(), request);
			return provider.fetch(rewritten, env, ctx);
		}
		return provider.fetch(request, env, ctx);
	},
};
