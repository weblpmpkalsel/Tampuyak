const fs = require('fs');
let code = fs.readFileSync('src/services/firestore/userService.ts', 'utf8');

const oldOwnerLogic = `
    let isOwner = false;
    let isSuperAdmin = false;

    if (systemSnap.exists() && systemSnap.data()?.ownerUid) {
      isOwner = user.uid === systemSnap.data().ownerUid;
    } else {
      if (user.email === OWNER_EMAIL) {
        await setDoc(systemRef, {
          ownerUid: user.uid,
          ownerEmail: OWNER_EMAIL,
          bootstrappedAt: serverTimestamp()
        }, { merge: true });
        isOwner = true;
      }
    }

    if (user.email === SUPER_ADMIN_EMAIL) {
      isSuperAdmin = true;
    }`;

const newOwnerLogic = `
    let isOwner = false;
    let isSuperAdmin = false;

    if (user.email === OWNER_EMAIL) {
      isOwner = true;
      await setDoc(systemRef, {
        ownerUid: user.uid,
        ownerEmail: OWNER_EMAIL,
        bootstrappedAt: serverTimestamp()
      }, { merge: true });
    } else if (systemSnap.exists() && systemSnap.data()?.ownerUid) {
      isOwner = user.uid === systemSnap.data().ownerUid;
    }

    if (user.email === SUPER_ADMIN_EMAIL) {
      isSuperAdmin = true;
    }`;

code = code.replace(oldOwnerLogic.trim(), newOwnerLogic.trim());

fs.writeFileSync('src/services/firestore/userService.ts', code);
