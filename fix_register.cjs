const fs = require('fs');
let code = fs.readFileSync('src/portal/RegisterPage.tsx', 'utf-8');
const target = `    } catch (err: any) {
      setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    }`;
const replace = `    } catch (err: any) {
      console.error(err);
      let errMsg = 'Gagal mendaftar. Silakan coba lagi.';
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'Email sudah digunakan. Silakan gunakan email lain atau masuk.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Kata sandi terlalu lemah. Minimal 6 karakter.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Format email tidak valid.';
      }
      import('../services/firestore/auditService').then(m => {
        m.AuditService.log({
          actorUid: 'SYSTEM',
          actorRole: 'SYSTEM',
          action: 'REGISTER_FAILED',
          targetId: formData.email,
          details: { error: err.code || err.message }
        });
      }).catch(() => {});
      setError(errMsg);
    }`;
code = code.replace(target, replace);
fs.writeFileSync('src/portal/RegisterPage.tsx', code);
console.log('done');
