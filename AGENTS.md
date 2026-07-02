<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Local Browser Work

When testing Bugdrop locally in a browser, prefer `http://bugdrop.localhost:3000` over bare `localhost` or `127.0.0.1`. Browser cookies are scoped by host, not port, so analytics/auth cookies set on `localhost` can be sent to unrelated local OAuth callbacks on other ports and trigger HTTP 431 request-header failures. Keep local analytics env vars unset unless the task specifically requires them, and avoid mixing `localhost` with `127.0.0.1` in the same workflow.
