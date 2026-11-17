# FB-1.0 PRINT BUTTON FORENSIC TRACE

## ANSWER
1. **Which file renders Print Browser?**
   `src/enterprise/workspace/preview/KspPreviewWorkspace.tsx`

2. **What is assigned to disabled?**
   `disabled={!isReady}` (Historically, before the UI-1.1 fix)

3. **Where is disabled calculated?**
   Line: `const isReady = complianceReport.releaseReadiness;`

4. **Which hook provides it?**
   `useMemo` hook providing `complianceReport` and `useApp` hook providing `settings` to the `complianceContext`.

5. **Which service provides it?**
   `enterpriseComplianceEngine` from `src/enterprise/compliance/engine/ComplianceEngine.ts`

6. **Which validation affects it?**
   The Compliance Engine executes `RuleRegistry.ts`, specifically:
   - `MissingAttachmentRule` (ECE-001)
   - `MissingChapterRule` (ECE-002)

7. **Which variable finally evaluates FALSE?**
   `releaseReadiness` evaluates to `FALSE` because `failedCriticalOrBlocker` evaluates to a value > 0 (specifically `2`). This is caused by `context.metadata?.academicCalendar?.attachmentUrl` being undefined/null and `identitas.visi` being empty.

8. **Show the complete chain.**

`src/enterprise/workspace/preview/KspPreviewWorkspace.tsx`
↓
`<button onClick={() => window.print()} disabled={!isReady}>`
↓
`isReady`
↓
`complianceReport.releaseReadiness`
↓
`useMemo(() => enterpriseComplianceEngine.execute(complianceContext))`
↓
`enterpriseComplianceEngine` (instance of `ComplianceEngine`)
↓
Runs `RuleRegistry` against `complianceContext`
↓
`MissingAttachmentRule` returns `CRITICAL` issue (Kalender Pendidikan missing)
`MissingChapterRule` returns `CRITICAL` issue (Visi/Misi missing)
↓
`failedCriticalOrBlocker` = 2
↓
`releaseReadiness` = `(2 === 0)` 
↓
`FALSE`
↓
`!isReady` = `TRUE`
↓
`disabled={true}`
