# Frontend AI Engineering - FlyRank

Capstone repository for the **Frontend AI Engineering** track at [FlyRank](https://flyrank.com/).

## About

This project explores AI-assisted frontend development workflows using modern tooling and best practices. The repository serves as the foundation for weekly assignments and the final capstone project.

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | LTS (v22+) | JavaScript runtime |
| [Git](https://git-scm.com/) | 2.x+ | Version control |
| [Cursor](https://cursor.com/) | Latest | AI-assisted IDE |

## Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 with design tokens in `app/globals.css`
- **AI streaming:** Vercel AI SDK + OpenRouter Free Router
- **Deployment:** Vercel preview deployments on every push
- **Version control:** Git + GitHub
- **IDE:** Cursor with project rules in `.cursor/rules/`
- **Commit style:** [Conventional Commits](https://www.conventionalcommits.org/)

## Getting Started

```bash
git clone https://github.com/808StaN/frontend-ai-engineering-flyrank.git
cd frontend-ai-engineering-flyrank
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build for production |
| `npm run start` | Run production server locally |
| `npm run lint` | Run ESLint (Next.js) |

## Routes

| Route | Screen |
|-------|--------|
| `/` | Dashboard |
| `/chat` | Streaming FlyRank Capstone Advisor |
| `/projects` | Projects list |
| `/projects/[projectId]` | Project detail |
| `/settings` | Settings placeholder |
| `/health` | Health-check (server fetch) |

## Environment Variables

Copy `.env.example` to `.env.local` for local development:

```bash
HEALTH_CHECK_API_URL=https://jsonplaceholder.typicode.com/posts/1
OPENROUTER_API_KEY=your_openrouter_server_key
```

`OPENROUTER_API_KEY` is server-side only and must never use a `NEXT_PUBLIC_`
prefix. Create it in the [OpenRouter keys dashboard](https://openrouter.ai/keys),
add it to `.env.local`, and set it in Vercel for preview and production
deployments. Never commit secrets to the repository.

## Streaming AI chat

The `/chat` route streams a multi-turn conversation through `app/api/chat/route.ts`.
The route uses the Vercel AI SDK and `openrouter/free`, while
`lib/ai/config.ts` centralizes the system prompt, model choice, and generation
configuration. The browser never receives the OpenRouter key.

## Deployment (Vercel)

1. Import the GitHub repository in [Vercel](https://vercel.com/).
2. Framework preset: **Next.js**
3. Add `HEALTH_CHECK_API_URL` and `OPENROUTER_API_KEY` in Project Settings → Environment Variables
4. Every push creates a preview deployment; merges to `main` update production

## Project Structure

```
frontend-ai-engineering-flyrank/
├── app/                    # App Router pages and layout
├── components/             # Shared UI components
├── lib/                    # Server utilities (health check, navigation)
├── public/
├── .cursor/rules/          # Cursor AI rules
├── .env.example
├── WORKFLOW.md             # FE-03 AI workflow comparison
└── README.md
```

## Development Workflow

1. Create a feature branch from `main`
2. Use Cursor Agent for implementation with project rules applied
3. Review AI-generated changes before committing
4. Follow [Conventional Commits](https://www.conventionalcommits.org/) for all commits
5. Push to trigger a Vercel preview deployment

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.
