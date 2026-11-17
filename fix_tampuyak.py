import re

with open('src/Tampuyak.tsx', 'r') as f:
    code = f.read()

# Make loadData fetch currentUser and workspaceId
replacement = """    async function loadData() {
      try {
        const { auth } = await import('./lib/firebase');
        const { UserService } = await import('./services/firestore/userService');
        let currentWorkspaceId = 'default-workspace';
        let currentRole = 'VIEWER';
        if (auth.currentUser) {
          const profile = await UserService.getUserProfile(auth.currentUser.uid);
          if (profile && profile.workspaceId) {
            currentWorkspaceId = profile.workspaceId;
            currentRole = profile.role;
          }
        }

        let stored = null;"""

code = code.replace("    async function loadData() {\n      try {\n        let stored = null;", replacement)

# Inject currentWorkspaceId into migrated settings
pattern = r"const migrated = \{\n\s*\.\.\.DEFAULT_SETTINGS,\n\s*\.\.\.parsed,"
replacement2 = """const migrated = {
            ...DEFAULT_SETTINGS,
            ...parsed,
            workspaceId: currentWorkspaceId,
            userRole: currentRole,"""

code = re.sub(pattern, replacement2, code)

# And if parsed is null
pattern2 = r"\} else \{\n\s*setSettings\(DEFAULT_SETTINGS\);\n\s*\}"
replacement3 = """} else {
          setSettings({ ...DEFAULT_SETTINGS, workspaceId: currentWorkspaceId, userRole: currentRole });
        }"""
code = re.sub(pattern2, replacement3, code)

with open('src/Tampuyak.tsx', 'w') as f:
    f.write(code)
