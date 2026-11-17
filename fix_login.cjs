const fs = require('fs');
let code = fs.readFileSync('src/portal/LoginPage.tsx', 'utf-8');
const target = `    } catch (err: any) {
      setError(err.message || 'Login gagal. Periksa kembali kredensial Anda.');
    }`;
const replace = `    } catch (err: any) {
      console.error(err);
      let errMsg = 'Login gagal. Periksa kembali email dan kata sandi Anda.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errMsg = 'Email atau kata sandi tidak valid.';
      } else if (err.code === 'auth/too-many-requests') {
        errMsg = 'Terlalu banyak percobaan. Silakan coba lagi nanti.';
      }
      import('../services/firestore/auditService').then(m => {
        m.AuditService.log({
          actorUid: 'SYSTEM',
          actorRole: 'SYSTEM',
          action: 'LOGIN_FAILED',
          targetId: formData.email,
          details: { error: err.code || err.message }
        });
      }).catch(() => {});
      setError(errMsg);
    }`;
code = code.replace(target, replace);
fs.writeFileSync('src/portal/LoginPage.tsx', code);
console.log('done');
