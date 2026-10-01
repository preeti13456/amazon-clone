# Cartly — an Amazon-style store
Browse/search/sort products, product pages, cart, sign up / sign in, checkout, order history.
Stack: Node 18+, Express, vanilla JS SPA, JSON-file storage (no native deps).

## Run locally
    npm install
    npm start        # http://localhost:3000

## Deploy (pick one)
**Render** — push to GitHub → New Web Service → Build `npm install`, Start `npm start`, add env `SECRET=<long random string>`.
Free-tier disk is ephemeral: add a Disk mounted at `/data` and set `DB_PATH=/data/db.json` to keep accounts/orders.
**Railway / Fly.io** — works as-is with the included `Dockerfile`; set `SECRET`, and mount a volume + `DB_PATH` for persistence.

## Agent capture (assignment step 2–4) — do this BEFORE building more
1. Use **Claude Code** in this repo (`npm i -g @anthropic-ai/claude-code`, then `claude`). Hooks live in `.claude/settings.json`
   and run `.agent-logs/capture.js` on every prompt and end of turn. Run `/hooks` to confirm they're loaded.
2. Optional: `export GITHUB_HANDLE=yourhandle` so the log's author is right.
3. Send `CAPTURE TEST — 8x assignment, <your name>`; check a file appears in `.agent-logs/` with PROMPT and RESPONSE entries.
   Start a **new** session, send another canary, confirm it lands too. If nothing appears, read `.agent-logs/capture-errors.txt`.
4. Write `CAPTURE-TEST.md` yourself from the real results (tool, model, config file, log path, both canaries pasted raw, what failed first).
5. Commit `.agent-logs/` as you go. Never gitignore or edit it.

## Not built (scope cuts)
Real payments, reviews, wishlist, seller side, image uploads, DB migrations.
