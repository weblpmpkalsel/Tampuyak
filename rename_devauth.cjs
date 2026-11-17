const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.ts*');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/MOCK_USER/g, 'DEV_USER');
  content = content.replace(/MOCK_PROFILE/g, 'DEV_PROFILE');
  content = content.replace(/mock-admin-uid/g, 'dev-admin-uid');
  content = content.replace(/admin@sd.mock/g, 'admin@sd.dev');
  content = content.replace(/Mock Administrator/g, 'Dev Administrator');
  content = content.replace(/mock-token/g, 'dev-token');
  content = content.replace(/Mock User Accepted/g, 'Dev User Accepted');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed auth mock in', file);
  }
}
