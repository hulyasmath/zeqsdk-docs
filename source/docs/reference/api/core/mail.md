---
id: mail
title: ZeqMail — Equation-bound email
sidebar_label: Mail
description: Identity-tied mail server using ZID and zeqond-stamped envelopes.
---

# ZeqMail

ZeqMail replaces SMTP/IMAP with a ZID-routed inbox. There are no usernames or passwords — your mail address is your ZID, your authentication is your equation.

## Auth flow

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/mail/register` | Create a mail identity from an equation |
| POST | `/api/mail/login` | Get a mail token for an existing ZID |
| GET  | `/api/mail/health` | Public health check |

## Mailbox endpoints

All require a Bearer token from `/login`.

| Method | Path | Purpose |
|---|---|---|
| GET  | `/api/mail/inbox` | Received messages, sorted newest first |
| GET  | `/api/mail/sent` | Sent messages |
| GET  | `/api/mail/starred` | Starred messages |
| GET  | `/api/mail/trash` | Trash |
| GET  | `/api/mail/contacts` | Known correspondent ZIDs |
| GET  | `/api/mail/status` | Inbox counts and quotas |
| POST | `/api/mail/star` | Toggle a star on a message |

## Public-key directory

```
GET  /api/mail/pubkey/:zid
POST /api/mail/pubkey
```

`pubkey/:zid` is **public** — anyone can fetch a recipient's encryption key to send them mail without registering.

## Message envelope

Every message carries:

```json
{
  "id": "...",
  "fromZid": "...",
  "toZid": "...",
  "ciphertext": "hex",
  "iv": "hex",
  "tag": "hex",
  "zeqond": 65392856,
  "phase": 0.4127,
  "sig": "hex"
}
```

The ciphertext is end-to-end encrypted with the recipient's pubkey. The server cannot read it.

## curl

```bash
TOKEN=$(curl -s -X POST https://zeq.dev/api/mail/login \
  -H "content-type: application/json" \
  -d '{"equation":"sin(x)+cos(y)"}' | jq -r .token)

curl https://zeq.dev/api/mail/inbox -H "authorization: Bearer $TOKEN"
```

## Related

- [ZeqAuth](../../protocols/zeq-auth-equation-based-identity/zeq-identity-mesh.md) · [HITE](./hite) · [Text](./text)
