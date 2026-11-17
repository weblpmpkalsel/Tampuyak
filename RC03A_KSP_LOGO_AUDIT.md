# KSP Logo Upload Lifecycle Audit

## 1. Which component handles the KSP logo upload?
The logo upload is handled by the **`AssetUploadField`** component, which is rendered within the **`SettingsTabs.School`** component (found in `src/Tampuyak.tsx`).

## 2. Whether the upload function is actually called?
**Yes.** The `<input type="file" />` element inside `AssetUploadField` correctly triggers the `handleFileUpload` function upon file selection.

## 3. Whether the upload succeeds?
**Yes.** The upload logic reads the selected file, validates its format and size (maximum 5MB), processes it through an HTML `<canvas>` to resize and compress it to an 800x800 PNG, and successfully generates a Base64 string representation (`compressedBase64`).

## 4. Whether the returned URL is stored in component state?
**Yes.** The `AssetUploadField` correctly calls `updateSetting("identityAssets", assetKey, { ... })`. For the logos, it stores an **object** containing the Base64 URL and metadata inside the React context state (`settings.identityAssets.schoolLogo` and `settings.identityAssets.governmentLogo`):
```typescript
{
  url: compressedBase64,
  size: file.size,
  uploadedAt: Date.now(),
  name: file.name,
  type: file.type
}
```

## 5. Whether the Save handler sends the logo URL to the backend/database?
The application does not use a cloud backend/database for `settings`; it relies solely on local storage. A `useEffect` hook in `Tampuyak.tsx` successfully detects state changes and auto-saves the entire `settings` payload (including `identityAssets`) by calling `localStorage.setItem("tampuyak.settings", JSON.stringify(dataToSave))`.

## 6. Whether the backend/database persists the logo?
**Yes.** The `localStorage` engine successfully persists the stringified state containing the logo object, assuming the browser quota is not exceeded (the canvas compression prevents quota errors).

## 7. Whether the logo URL is loaded correctly when reopening the page?
**Yes.** When the page is reloaded, `Tampuyak.tsx` parses the `localStorage` data and spreads the parsed JSON (`...parsed`) into the `migrated` settings object. The `identityAssets` block is preserved precisely as it was saved.

## 8. Whether the rendering component reads the correct field?
**No. This is the point of failure.**

The error occurs during data mapping in **`src/ksp/KspMetadataAdapter.ts`** before being fed into the KSP document structure.

1. **Failure for School Logo (`schoolLogoUrl`)**:
   The adapter maps the school logo using legacy fields that are no longer accessible to the user:
   `schoolLogoUrl: settings?.branding?.logoUrl || settings?.visualIdentity?.logoSekolah || ''`
   It completely **ignores** `settings?.identityAssets?.schoolLogo`, which is where the active UI actually stores the uploaded data. Consequently, the logo returns as an empty string.

2. **Failure for Government Logo (`governmentLogoUrl`)**:
   The adapter maps the government logo using:
   `governmentLogoUrl: settings?.school?.governmentLogo || settings?.identityAssets?.governmentLogo || ''`
   While it targets the correct nested object (`settings.identityAssets.governmentLogo`), it fails to access the `.url` property. Since it assigns the entire metadata object `{ url, size, type, ... }` instead of a string URL, the rendering component receives `"[object Object]"` which breaks the HTML `<img src="[object Object]">` tag.

### Conclusion
The logo upload and persistence lifecycle work flawlessly. The disappearance/failure to persist is entirely caused by a data mapping mismatch in `KspMetadataAdapter.ts` targeting incorrect keys and missing property accessors when generating the document metadata payload.
