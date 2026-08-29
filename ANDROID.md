# Hide the Android APK address bar

PWABuilder Android packages use a **Trusted Web Activity (TWA)**.  
If Digital Asset Links fail, Chrome falls back to a browser UI **with the address bar**.

Docs: [PWABuilder Android publishing](https://docs.pwabuilder.com/#/builder/android)

## Why it happens on GitHub Pages

Your PWA is at:

`https://pashaie.github.io/tanyar/`

Android does **not** look under `/tanyar/`. It always requests:

`https://pashaie.github.io/.well-known/assetlinks.json`

That file is currently missing (404), so the address bar stays.

## Fix (required)

### 1. Get values from your PWABuilder zip

After generating the Android package, open:

- `assetlinks.json` from the zip, **or**
- `signing-key-info.txt` / package options for:
  - **Package ID** (e.g. `io.github.pashaie.tanyar`)
  - **SHA-256 certificate fingerprint**

If you already uploaded to Google Play, also add Play App Signing’s SHA-256 from:

Play Console → Setup → App integrity → App signing

### 2. Edit this repo’s template

Update:

`public/.well-known/assetlinks.json`

Package ID is already set to `io.github.pashaie.twa`. Replace:

- `REPLACE_WITH_SHA256_FROM_PWABUILDER`

You can list **multiple** fingerprints in `sha256_cert_fingerprints` (PWABuilder key + Play signing key).

### 3. Publish at the **domain root** (critical)

Serving only `https://pashaie.github.io/tanyar/.well-known/assetlinks.json` is **not enough**.

Create a GitHub user site repo named exactly:

`pashaie.github.io`

Put this file there:

```text
.well-known/assetlinks.json   ← same content as above
.nojekyll                     ← empty file (prevents Jekyll from ignoring .well-known)
```

Enable GitHub Pages on that repo (deploy from branch / Actions).

Verify in a browser (must be **200**, not 404):

https://pashaie.github.io/.well-known/assetlinks.json

### 4. Reinstall / clear Chrome cache

1. Uninstall the APK
2. Chrome → Settings → Privacy → Clear browsing data (cached images/files) for the site
3. Reinstall the APK

Optional: install **Peter’s Asset Links Tool** on the device and confirm package name + fingerprint match.

## Packaging tips in PWABuilder

- Display mode: **Standalone** (not browser)
- Host: `pashaie.github.io`
- Start URL: `/tanyar/`
- Signing: use **New** or **Mine** (not unsigned) for a real TWA signature

After asset links validate, the address bar disappears.
