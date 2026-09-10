# svelte-exam-trainer

Svelte-based multiple choice examination tool. Built to help train for examinations, could also be easily adapted for actual examinations.

Demo: [Private Pilot License theory exams](https://ppl-exam-trainer.pages.dev/)

## Developing

Clone the repository locally, then install dependencies with `bun install` and start a development server:

```bash
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Building

To create a production version of your app:

```bash
bun run build
```

The site is fully static. `@sveltejs/adapter-static` prerenders it into `build/`.

Preview the production build with `bun run preview`, or serve it exactly as Cloudflare will with `bunx wrangler dev`.

## Deployment

The demo is a Cloudflare Worker serving `build/` as static assets, configured in `wrangler.jsonc`. There is no worker script: no code runs at request time.

Cloudflare builds and deploys on every push to `ppl-exam-trainer` through its GitHub connection. To deploy by hand instead, run `bun run deploy`.

## Contibutors

- paulditerwich
- florisporro
