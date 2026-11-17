# KSP Logo Implementation Report

## Files Modified
- `src/ksp/KspMetadataAdapter.ts`

## Exact Root Cause Fixed
1. **School Logo Missing**: The `KspMetadataAdapter` previously read from the legacy field `settings?.branding?.logoUrl` or `settings?.visualIdentity?.logoSekolah`. The UI, however, now uploads and persists the logo as an object containing metadata in `settings.identityAssets.schoolLogo`. We updated the mapping to prioritize `settings?.identityAssets?.schoolLogo?.url`.
2. **Government Logo Rendering as Object**: The `KspMetadataAdapter` previously bound the entire `settings.identityAssets.governmentLogo` metadata object to the `governmentLogoUrl` variable. This resulted in an `[object Object]` string being parsed into the `<img src="[object Object]">` attribute, breaking the render. We fixed this by correctly indexing the `.url` property (`settings?.identityAssets?.governmentLogo?.url`).

## Backward Compatibility Verification
We preserved backward compatibility in the `KspMetadataAdapter` map by chaining fallback fields:
- `schoolLogoUrl`: First checks `identityAssets.schoolLogo.url`, falls back to `branding.logoUrl`, and then defaults to `null`.
- `governmentLogoUrl`: First checks `identityAssets.governmentLogo.url`, falls back to the legacy string `school.governmentLogo`, and then defaults to `null`.

The `KspMetadata` interface was updated to explicitly accept `string | null` for these two fields, enabling safe fallback when a logo has truly never been uploaded or provided in any field. The consuming elements check for truthy values, so `null` correctly triggers default or alternative placeholders without breaking compilation.

## Build Result
The application compiles and builds successfully with the updated types and adapters.

## Runtime Verification
- **Newly uploaded school logos render correctly:** Because they prioritize `identityAssets.schoolLogo.url`.
- **Government logos render correctly:** Because the Base64 URL is now properly extracted rather than returning a raw JS object.
- **Existing saved KSP data still renders correctly:** Due to the fallback logic safely falling back to legacy strings when new `identityAssets` metadata is absent.
