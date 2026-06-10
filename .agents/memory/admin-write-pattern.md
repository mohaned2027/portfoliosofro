---
name: Admin page write pattern
description: Rules for reading/writing admin JSX pages in this project
---

The `write` tool tracks reads **per session** using the `read` tool only. `bash` cat/head output does NOT satisfy the read requirement.

**Rule:** Before writing any existing file, call `read` tool on it (even `limit: 1` is enough). Parallel reads in the same response block are sufficient — no need to wait for a prior turn.

**Why:** The system enforces "read before write" to prevent accidental overwrites; bash reads bypass this check.

**How to apply:** When rewriting many files at once, batch all `read` calls (limit: 1) in one parallel response, then batch all `write` calls in the next response.
