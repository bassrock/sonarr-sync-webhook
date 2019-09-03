# Sonarr Sync Webhook

Sonarr Sync Webhook adds downloaded tv seriess from a Sonarr instance to another Sonarr instance automatically.

## Requirements

- Two Sonarr instances
- Node.js / Docker

## Usage

### Webhook Setup

On your main Sonarr instance, create a new webhook:

1. Run "On Download" and "On Upgrade"
1. URL should point to `/import` and specify the following query parameters:
    1. `resolutions`: A comma-separated whitelist of resolutions to sync. 
    Current valid resolutions: `r2160P`, `r1080P`, `r720P`, `r480P`, `unknown`  
    1. `profile`: Quality profile id to use. Get a list of profile ids from the `/api/profile` endpoint on the secondary instance.
    1. Example URL: `http://localhost:3000/import?resolutions=r2160P,r1080P&profile=1`. 
1. Method: `POST`

### Manual methods

In addition to the `/import` webhook, you can also trigger syncs manually. The manual methods use the same URL parameters as the webhook.

#### `/import/:id`

Imports tv series `id`. You can get a list of tv series ids using the [API](https://github.com/Sonarr/Sonarr/wiki/API:Series#get).

Example: `curl -XPOST http://localhost:3000/import/1?resolutions=r2160P&profile=1`

#### `/import/all` 

Imports all tv seriess.

Example: `curl -XPOST http://localhost:3000/import/all?resolutions=r2160P&profile=1`

## Installation

### Node.js

Install node modules: `npm install`

### Docker

Create Docker image:
```
docker create \
--name=sonarr-sync \
-p 3000:3000 \
-e SRC_APIKEY=apikey \
-e DST_APIKEY=apikey \
-e SRC_ROOT="/my/UHD/TV" \
-e DST_ROOT="/my/HD/TV" \
-e SRC_HOST=http://localhost:7878 \
-e DST_HOST=http://localhost:9090 \
--restart unless-stopped \
sonarr-sync:latest
```

## Running

### Node.js

```
PORT=3000 \
SRC_APIKEY=apikey \
DST_APIKEY=apikey \
SRC_ROOT="/my/UHD/TV" \
DST_ROOT="/my/HD/TV" \
SRC_HOST=http://localhost:7878 \
DST_HOST=http://localhost:9090 \
npm start
```

### Docker

```
docker start sonarr-sync
```
