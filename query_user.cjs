const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  projectId: "gen-lang-client-0973410378",
  appId: "1:707278634587:web:ea41150a57eb35083f097e",
  apiKey: "AIzaSyCYRH6dPXGzc4Dk1Cv5Qc8wFhcgFY_dqYY",
  authDomain: "gen-lang-client-0973410378.firebaseapp.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-remixmigrasilayo-2ce7f589-d14b-4e08-b535-0a7911853024");

async function run() {
  const q = query(collection(db, "users"), where("email", "==", "kkg1jaro@gmail.com"));
  const snap = await getDocs(q);
  snap.forEach(doc => {
    console.log("Found user:", doc.id, doc.data());
  });
  console.log("Done");
  process.exit(0);
}

run();
