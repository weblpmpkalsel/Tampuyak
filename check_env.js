import { loadEnv } from 'vite';
const env = loadEnv('development', process.cwd(), '');
console.log('VITE_FIREBASE_API_KEY:', env.VITE_FIREBASE_API_KEY);
