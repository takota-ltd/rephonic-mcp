# Rephonic MCP Server

Give AI agents and LLMs access to podcast data from [Rephonic](https://rephonic.com) — covering 3+ million podcasts with listener estimates, demographics, contact details, chart rankings, episodes, and more.

This is a remote Model Context Protocol (MCP) server that connects AI assistants like Claude, ChatGPT, and Cursor to the [Rephonic API](https://rephonic.com/developers).

## What can your AI agent do with the Rephonic API?

- **Read, summarise and analyse transcripts** — grab a full-text transcript for almost any podcast episode
- **Search and discover podcasts** — find shows by topic, category, or audience fit
- **Research podcasts for guest pitching** — see listener numbers, audience demographics, and contact details without leaving your AI workflow
- **Monitor brand mentions** — track when your brand, competitors, or clients are mentioned across podcasts
- **Analyze audience demographics** — age, education, profession, income, and location breakdowns for any podcast
- **Track chart rankings** — daily Apple, Spotify, and YouTube chart data across countries and categories
- **Monitor sponsorships and promotions** — see who's advertising on which shows, with ad copy and promo codes
- **Build media lists** — pull verified email contacts, social accounts, and host/guest info at scale

## Tools

- **lookup_podcast** — Look up a podcast's metadata, chart rankings, and latest episodes by its Rephonic ID (e.g. `huberman-lab`).

## Setup

You need a Rephonic API key. [Get one here](https://rephonic.com/developers).

### ChatGPT

1. Go to **Settings** → **Apps** → **Advanced settings** and enable **Developer mode**
2. Then click **Create app**
3. Enter Name: Rephonic
4. Enter MCP Server URL: `https://mcp.rephonic.com`
3. Click **Create** and enter your Rephonic API key when prompted

### Claude.ai

1. Go to **Settings** → **Connectors**
2. Click **Add custom connector** and enter name `Rephonic` and MCP server URL `https://mcp.rephonic.com`
3. Click **Add** and enter your Rephonic API key when prompted

### Claude Desktop

Add to your config file and restart Claude Desktop:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "rephonic": {
      "url": "https://mcp.rephonic.com"
    }
  }
}
```

### Claude Code

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "rephonic": {
      "type": "http",
      "url": "https://mcp.rephonic.com"
    }
  }
}
```

### Cursor

Go to **Settings** → **MCP** → **Add new MCP server**. Set type to **URL** and enter `https://mcp.rephonic.com`.

---
<details>
<summary><h3>Development</h3></summary>

If you want to fork or customize this MCP server for your own needs, here is how you can run or deploy it.

### Prerequisites

- Node.js
- A [Cloudflare account](https://dash.cloudflare.com) (for deployment)

### Local dev

```bash
npm install
npm start
```

The server runs at `http://localhost:8788`. Test with the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector@latest
```

### Type-check

```bash
npm run type-check
```

### Regenerate Cloudflare types

After changing `wrangler.jsonc`:

```bash
npm run cf-typegen
```

</details>
<details>
<summary><h3>Deployment</h3></summary>

### First-time setup

1. Log in to Cloudflare:
   ```bash
   npx wrangler login
   ```

2. Create the KV namespace for OAuth state:
   ```bash
   npx wrangler kv namespace create OAUTH_KV
   ```
   Copy the `id` into `wrangler.jsonc`.

3. Set the cookie encryption secret:
   ```bash
   npx wrangler secret put COOKIE_ENCRYPTION_KEY
   ```
   Enter any random string when prompted (e.g. `openssl rand -hex 32`).

4. Add a Custom Domain in the Cloudflare dashboard:
   Workers & Pages → `rephonic-mcp` → Settings → Domains & Routes → Add `mcp.rephonic.com`.

### Deploy

```bash
npm run deploy
```
</details>
