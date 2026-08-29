# Domain-root Digital Asset Links for TanYar

Android looks here (not under /tanyar/):

https://pashaie.github.io/.well-known/assetlinks.json

## Create the user site

1. Create a new GitHub repo named `pashaie.github.io` (must match your username).
2. Copy these files into that repo:
   - `.well-known/assetlinks.json` (fill package id + SHA-256 from PWABuilder zip)
   - `.nojekyll` (empty)
3. Enable GitHub Pages on the repo.
4. Confirm: https://pashaie.github.io/.well-known/assetlinks.json returns JSON.
