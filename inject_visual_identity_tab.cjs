const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const tabOld = `{ id: "identitas", label: "Identitas", icon: Target },`;
const tabNew = `{ id: "identitas", label: "Identitas", icon: Target },
    { id: "visualIdentity", label: "Identitas Visual", icon: Palette },`;

if (content.includes(tabOld) && !content.includes('id: "visualIdentity"')) {
  content = content.replace(tabOld, tabNew);
}

const renderOld = `      case "identitas":
        return (
          <SettingsTabs.Identitas
            data={settings.identitas}
            update={(f: any, v: any) => updateSetting("identitas", f, v)}
          />
        );`;
const renderNew = `      case "identitas":
        return (
          <SettingsTabs.Identitas
            data={settings.identitas}
            update={(f: any, v: any) => updateSetting("identitas", f, v)}
          />
        );
      case "visualIdentity":
        return <SettingsTabs.VisualIdentity appCtx={appCtx} />;`;

if (content.includes(renderOld) && !content.includes('case "visualIdentity":')) {
  content = content.replace(renderOld, renderNew);
}

fs.writeFileSync('src/Tampuyak.tsx', content);
