cat << 'INNER_EOF' > /tmp/register_patch.js
const fs = require('fs');
const file = 'src/portal/RegisterPage.tsx';
let code = fs.readFileSync(file, 'utf8');

const replacement = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.agreeTerms) {
      setError('Anda harus menyetujui syarat & ketentuan.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Auth User
      const user = await AuthService.register(formData.email, formData.password);
      
      // 2. Create User Profile with exact requested fields
      await UserService.createUserProfile({
        uid: user.uid,
        email: user.email || formData.email,
        displayName: formData.fullName,
        schoolName: formData.schoolName,
        principalName: formData.position === 'HEADMASTER' ? formData.fullName : '',
        phone: formData.phone,
        province: formData.province,
        district: formData.district,
        npsn: formData.npsn,
        status: 'PENDING',
        role: 'school_admin' as any,
        workspaceId: null,
        emailVerified: user.emailVerified,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      // 6. Redirect to pending
      navigate('/pending');
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };`;

code = code.replace(/const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?\} finally \{\s*setLoading\(false\);\s*\}\s*\};/, replacement);
fs.writeFileSync(file, code);
INNER_EOF
node /tmp/register_patch.js
