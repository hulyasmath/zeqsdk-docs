---
sidebar_position: 5
title: Mail API
description: End-to-end encrypted email via the ZeqMail service
---

# Mail API

ZeqMail provides end-to-end encrypted email communication. All messages are stored as ciphertext on the server, with encryption keys derived from your passphrase. Message retention is managed via HulyaPulse tick tracking with optional TTL expiration.

## Authentication

### Register a New Mail Identity

Create a new ZeqMail account with a memorable passphrase.

```
POST /api/mail/register
```

**Request Body:**
```json
{
  "name": "string (display name)",
  "phrase": "string (2+ words)"
}
```

**Response:**
```json
{
  "ok": true,
  "token": "string (bearer token)",
  "zid": "string (zeq identity)",
  "email": "string (zid@hulyas.org)"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/mail/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "phrase": "quantum butterfly dream"
  }'
```

### Login with Passphrase

Authenticate to your ZeqMail account using your passphrase.

```
POST /api/mail/login
```

**Request Body:**
```json
{
  "phrase": "string (your passphrase)"
}
```

**Response:**
```json
{
  "ok": true,
  "token": "string (bearer token)",
  "zid": "string (zeq identity)"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/mail/login \
  -H "Content-Type: application/json" \
  -d '{
    "phrase": "quantum butterfly dream"
  }'
```

## Messages

All message endpoints require Bearer token authentication.

### List Inbox Messages

Retrieve paginated inbox messages.

```
GET /api/mail/inbox?page=0&limit=50
```

**Query Parameters:**
- `page` (number, default: 0) — Page number for pagination
- `limit` (number, default: 50) — Messages per page (max: 100)

**Response:**
```json
{
  "ok": true,
  "messages": [
    {
      "id": "string",
      "from": "string",
      "subject": "string (decrypted)",
      "body": "string (decrypted, preview)",
      "timestamp": "string (ISO 8601)",
      "read": boolean,
      "starred": boolean,
      "encrypted": boolean
    }
  ],
  "total": number,
  "page": number
}
```

**Example:**
```bash
curl -X GET "http://localhost:3000/api/mail/inbox?page=0&limit=25" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### List Sent Messages

Retrieve paginated sent messages.

```
GET /api/mail/sent?page=0&limit=50
```

**Query Parameters:**
- `page` (number, default: 0) — Page number
- `limit` (number, default: 50) — Messages per page

**Response:** Same as inbox.

### List Starred Messages

Retrieve all starred messages.

```
GET /api/mail/starred
```

**Response:**
```json
{
  "ok": true,
  "messages": [
    {
      "id": "string",
      "from": "string",
      "subject": "string",
      "timestamp": "string (ISO 8601)",
      "starred": true
    }
  ]
}
```

### List Trash Messages

Retrieve messages in trash.

```
GET /api/mail/trash
```

**Response:** Same structure as inbox.

### Send a Message

Compose and send an encrypted email.

```
POST /api/mail/compose
```

**Request Body:**
```json
{
  "to": "string (recipient email)",
  "subject": "string",
  "body": "string (message body)",
  "encrypted": boolean (optional, default: true)
}
```

**Response:**
```json
{
  "ok": true,
  "id": "string (message id)",
  "zeqond_sent": number (zeqond tick when sent)"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/mail/compose \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "bob@hulyas.org",
    "subject": "Meeting Notes",
    "body": "Here are the notes from our discussion about the quantum framework.",
    "encrypted": true
  }'
```

### Mark Message as Read

Mark a specific message as read.

```
POST /api/mail/read/:id
```

**Response:**
```json
{
  "ok": true,
  "id": "string",
  "read": true
}
```

### Toggle Star on Message

Mark or unmark a message as starred.

```
POST /api/mail/star/:id
```

**Response:**
```json
{
  "ok": true,
  "id": "string",
  "starred": boolean
}
```

### Move Message to Trash

Delete a message (move to trash).

```
POST /api/mail/trash/:id
```

**Response:**
```json
{
  "ok": true,
  "id": "string",
  "trashed": true
}
```

### Archive a Message

Archive a message for long-term storage.

```
POST /api/mail/archive/:id
```

**Response:**
```json
{
  "ok": true,
  "id": "string",
  "archived": true
}
```

## Contacts & Keys

### List Known Contacts

Retrieve your contact list.

```
GET /api/mail/contacts
```

**Response:**
```json
{
  "ok": true,
  "contacts": [
    {
      "zid": "string",
      "email": "string",
      "name": "string (optional)",
      "publicKey": "string (hex)",
      "added": "string (ISO 8601)"
    }
  ]
}
```

### Get a User's Public Key

Retrieve the public encryption key for a ZeqMail identity.

```
GET /api/mail/pubkey/:zid
```

**Response:**
```json
{
  "ok": true,
  "zid": "string",
  "publicKey": "string (hex)",
  "algorithm": "string (HITE)"
}
```

### Upload Your Public Key

Upload or update your public key for recipients to use.

```
POST /api/mail/pubkey
```

**Request Body:**
```json
{
  "publicKey": "string (hex format)"
}
```

**Response:**
```json
{
  "ok": true,
  "publicKey": "string",
  "verified": true
}
```

## Status & Statistics

### Get Mailbox Statistics

Retrieve summary statistics for your mailbox.

```
GET /api/mail/status
```

**Response:**
```json
{
  "ok": true,
  "inbox": number,
  "unread": number,
  "sent": number,
  "starred": number,
  "trash": number,
  "contacts": number,
  "storage_bytes": number,
  "storage_limit": number
}
```

**Example:**
```bash
curl -X GET http://localhost:3000/api/mail/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## End-to-End Encryption

All ZeqMail messages are encrypted using HITE protocol. The server stores only ciphertext; decryption occurs on the client side. Your encryption key is derived from your passphrase and never transmitted to the server.

**Key Features:**
- Zero-knowledge encryption — the server cannot read message content
- Automatic key derivation from passphrase
- Support for optional recipient key validation
- Ciphertext integrity verification via HMAC-SHA256

## Message TTL and Retention

Messages can be configured with optional TTL (Time To Live) expiration. Expiration is tracked via HulyaPulse tick count:

- 1 Zeqond = 0.777 seconds
- HulyaPulse frequency = 1.287 Hz
- Tick tracking enables deterministic message expiration across the network

To set message TTL, include `ttl_zeqonds` in the compose request body. Expired messages are automatically purged from the server.

## Error Responses

All endpoints return error responses in this format:

```json
{
  "ok": false,
  "error": "string (error code)",
  "message": "string (human-readable description)"
}
```

Common error codes:
- `INVALID_PHRASE` — Passphrase failed validation
- `UNAUTHORIZED` — Missing or invalid bearer token
- `INVALID_EMAIL` — Recipient email not found
- `QUOTA_EXCEEDED` — Storage limit reached
- `MESSAGE_EXPIRED` — Message TTL has expired
