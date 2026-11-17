1.
Every file initializing Firebase:
- src/lib/firebase.ts

2.
Which firebaseConfig is actually used at runtime:
The `firebaseConfig` constructed in `src/lib/firebase.ts` is used, which attempts to read from `import.meta.env` (e.g., `VITE_FIREBASE_API_KEY`) and falls back to the values provided in `firebase-applet-config.json`. Since no VITE environment variables are defined, the fallback from `firebase-applet-config.json` is used at runtime.

3.
Runtime values:
apiKey: AIzaSyCYRH6dPXGzc4Dk1Cv5Qc8wFhcgFY_dqYY
projectId: gen-lang-client-0973410378
authDomain: gen-lang-client-0973410378.firebaseapp.com

4.
Confirm whether the runtime API key equals AIzaSyDFEiPzuQ0w7vSBkgc4XQrl1o2hdU6IDqI:
No, it does not.

Source of the different API key:
The API key `AIzaSyCYRH6dPXGzc4Dk1Cv5Qc8wFhcgFY_dqYY` originates from the `./firebase-applet-config.json` file in the root directory.
