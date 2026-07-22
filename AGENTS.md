# Project publishing workflow

The project owner has authorized automatic publishing of completed website changes to the GitHub `main` branch so the connected Netlify site can deploy them.

After completing a requested website change:

1. Run the relevant automated tests and production build.
2. Stage only the files changed for the current request. Never stage unrelated user changes.
3. Commit with a concise description of the completed change.
4. Synchronize safely with `origin/main`; do not overwrite remote work or force-push.
5. Push the validated commit directly to `origin/main` without opening a pull request, unless the user explicitly requests a branch or pull request.
6. If validation fails, authentication is unavailable, the working tree contains ambiguous unrelated changes, or the remote cannot be synchronized safely, do not publish. Explain the blocker to the user.

GitHub `origin` is the source used for automatic Netlify production deployments. The `codex-hosting` remote is separate and must not be used for this GitHub/Netlify workflow.
