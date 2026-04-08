---
id: text
title: ZeqText — Encrypted channels
sidebar_label: Text
description: Equation-rooted text channels with verifiable receive and replay-proof messages.
---

# ZeqText

Channel-based messaging where every message is anchored to a zeqond tick and signed with the sender's ZID-derived key. Messages are verifiable independently of the channel server.

## POST /api/text/channel/create

```json
{ "name": "ops", "members": ["zid1","zid2"] }
```
Response: `{ "channelId": "...", "createdAt": "...", "zeqond": ... }`

## POST /api/text/send

```json
{ "channelId": "...", "fromZid": "...", "ciphertext": "hex", "sig": "hex" }
```
Response: `{ "messageId": "...", "zeqond": ..., "phase": ... }`

## POST /api/text/receive

```json
{ "channelId": "...", "sinceZeqond": 65392800 }
```
Response: `{ "messages": [ { "id":"...", "fromZid":"...", "ciphertext":"...", "sig":"...", "zeqond":... } ] }`

## POST /api/text/verify

Verifies a message signature against the sender's published pubkey.
```json
{ "messageId": "...", "fromZid": "...", "sig": "..." }
```
Response: `{ "valid": true, "zeqond": ... }`

## GET /api/text/channel/:channelId/info

Returns channel metadata, member ZIDs, message count, and last activity zeqond.

## Related

- [Mail](./mail) · [Mesh](./mesh)
