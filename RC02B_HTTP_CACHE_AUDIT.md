## RC-02B HTTP Cache Audit

### 1-4. Cache-Control Headers (Observed via Local Production Build / Vite Preview)
When inspecting the locally generated production build running via `vite preview`, all files are served with the same default header because it is a local dev utility, not a production CDN:
- **`index.html`**: `Cache-Control: no-cache`
- **`sw.js`**: `Cache-Control: no-cache`
- **`manifest.webmanifest`**: `Cache-Control: no-cache`
- **`assets/index-*.js`**: `Cache-Control: no-cache`

*(Note: On Netlify without custom configuration, `index.html` and `sw.js` would default to `public, max-age=0, must-revalidate`, while hashed `assets/` files might be cached longer depending on automatic detection).*

### 5. Determine whether index.html can remain stale after deployment.
**Yes, it will remain stale.** Because this is a PWA configured with `vite-plugin-pwa`, `index.html` is added to the Workbox precache manifest. All navigation requests are intercepted by the Service Worker's `NavigationRoute`, which uses a cache-first strategy to serve `index.html` instantly from the browser's Cache Storage, bypassing the network (and therefore bypassing any server-level Cache-Control headers).

### 6. Determine whether Netlify is serving index.html with immutable caching.
**No.** There is no `_headers` or `netlify.toml` file present in the repository to define custom cache rules. By default, Netlify serves HTML files with `Cache-Control: public, max-age=0, must-revalidate`. 
*(Note: Serving `index.html` as immutable is a known anti-pattern that permanently breaks updates. Netlify intentionally avoids doing this).*

### 7. Explain why a browser with no manual cache clear still receives the previous HTML document after deployment.
This is the intended behavior of the PWA's **"prompt for update"** strategy (`registerType: 'prompt'`):
1. The user navigates to the URL. The currently active Service Worker intercepts the request and instantly serves the old `index.html` from the precache.
2. The browser renders the old app. In the background, the browser checks for an updated `sw.js` file from the server.
3. The browser detects that the new `sw.js` is different (byte-for-byte), downloads it, and installs it. The new Service Worker precaches the new version of `index.html` and the new hashed assets.
4. **Crucially**, the new Service Worker enters a `waiting` state. It will NOT take over the page automatically.
5. The `EnterpriseUpdateManager` component detects the waiting Service Worker and renders the "Versi terbaru tersedia. (Muat Ulang)" banner.
6. Until the user clicks that button (which fires `skipWaiting()` and forces a window reload), the active Service Worker continues to serve the old HTML and old assets.
