const fs = require('fs');
let code = fs.readFileSync('src/workspace/OrganizationSetup.tsx', 'utf-8');

const targetSubmit = `  const handleSubmit = async () => {
    if (!userProfile?.workspaceId) {
      setError('No workspace assigned');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await OrganizationService.createProfile(userProfile.workspaceId, formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save organization profile');
      setLoading(false);
    }
  };`;

const replaceSubmit = `  const handleSubmit = async () => {
    if (!auth.currentUser) {
      setError('Not authenticated');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await OrganizationService.setupOrganization(auth.currentUser.uid, formData);
      // Wait a moment for firestore to sync before navigating
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to save organization profile');
      setLoading(false);
    }
  };`;

code = code.replace(targetSubmit, replaceSubmit);
fs.writeFileSync('src/workspace/OrganizationSetup.tsx', code);
console.log('done');
