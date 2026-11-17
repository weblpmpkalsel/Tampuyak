## Intracurricular Validation Timing Fix

### 1. Files Modified
- `src/enterprise/workspace/modules/CurriculumHubModule.tsx`

### 2. Unified Diff
```diff
--- src/enterprise/workspace/modules/CurriculumHubModule.tsx
+++ src/enterprise/workspace/modules/CurriculumHubModule.tsx
@@ -47,6 +47,18 @@
   const [intracurricular, setIntracurricular] = useState<IntracurricularKnowledge>(
     new IntracurricularKnowledge('ic-1', '1.0.0', IntracurricularAdapter.normalize(settings?.curriculum?.intracurricular || settings?.intracurricular, metadata))
   );
+  
+  const [touchedIntraSubjects, setTouchedIntraSubjects] = useState<Set<string>>(() => {
+    const initialData = IntracurricularAdapter.normalize(settings?.curriculum?.intracurricular || settings?.intracurricular, metadata);
+    return new Set((initialData?.subjects || []).map((s: any) => s.id));
+  });
+
+  const markIntraSubjectTouched = (subjectId: string) => {
+    if (!touchedIntraSubjects.has(subjectId)) {
+      setTouchedIntraSubjects(prev => new Set(prev).add(subjectId));
+    }
+  };
 
   const [cocurricular, setCocurricular] = useState<CocurricularKnowledge>(
     new CocurricularKnowledge('cc-1', '1.0.0', CocurricularAdapter.normalize(settings?.curriculum?.cocurricular || settings?.cocurricular, metadata))
@@ -93,7 +105,22 @@
     handleCocurricularUpdate('activities', updatedActivities);
   };
 
-  const intracurricularValidation = intracurricular.validate();
+  const rawIntracurricularValidation = intracurricular.validate();
+  const intracurricularValidation = {
+    ...rawIntracurricularValidation,
+    issues: rawIntracurricularValidation.issues.filter(issue => {
+      const match = issue.field.match(/subjects\[(\d+)\]/);
+      if (match) {
+        const index = parseInt(match[1], 10);
+        const subject = intracurricular.payload.subjects[index];
+        if (subject && !touchedIntraSubjects.has(subject.id)) {
+          return false;
+        }
+      }
+      return true;
+    })
+  };
+  intracurricularValidation.status = intracurricularValidation.issues.length > 0 ? 'ERROR' : 'PASS';
 
   const handleAddSubject = () => {
     const newSubject = {
@@ -117,6 +144,8 @@
 
   const handleUpdateSubject = (index: number, field: string, value: any) => {
     const updatedSubjects = [...intracurricular.payload.subjects];
+    const subjectId = updatedSubjects[index].id;
+    markIntraSubjectTouched(subjectId);
     updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
     const newKnowledge = new IntracurricularKnowledge('ic-1', '1.0.0', {
       subjects: updatedSubjects
@@ -631,6 +660,7 @@
                             className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                             value={subject.subjectName}
                             onChange={(e) => handleUpdateSubject(index, 'subjectName', e.target.value)}
+                            onBlur={() => markIntraSubjectTouched(subject.id)}
                           />
                         </div>
                         <div>
@@ -639,6 +669,7 @@
                             className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                             value={subject.learningApproach}
                             onChange={(e) => handleUpdateSubject(index, 'learningApproach', e.target.value)}
+                            onBlur={() => markIntraSubjectTouched(subject.id)}
                           />
                         </div>
                         <div>
@@ -647,6 +678,7 @@
                             className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                             value={subject.weeklyLearningHours}
                             onChange={(e) => handleUpdateSubject(index, 'weeklyLearningHours', parseInt(e.target.value) || 0)}
+                            onBlur={() => markIntraSubjectTouched(subject.id)}
                           />
                         </div>
                         <div>
@@ -655,6 +687,7 @@
                             className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                             value={subject.annualLearningHours}
                             onChange={(e) => handleUpdateSubject(index, 'annualLearningHours', parseInt(e.target.value) || 0)}
+                            onBlur={() => markIntraSubjectTouched(subject.id)}
                           />
                         </div>
                         <div>
@@ -663,6 +696,7 @@
                             className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                             value={subject.phase}
                             onChange={(e) => handleUpdateSubject(index, 'phase', e.target.value)}
+                            onBlur={() => markIntraSubjectTouched(subject.id)}
                           />
                         </div>
```

### 3. Risk Assessment
- **Low Risk:** The solution introduces standard UI state behavior (`touched` state tracking) natively into the React rendering layer without touching the underlying validation engine or data models. The validation rules themselves remain entirely intact.

### 4. Regression Impact
- **No Impact on Other Modules:** The touched logic was carefully scoped exclusively to the Intracurricular module. Cocurricular and Extracurricular remain untouched.
- **Backwards Compatibility:** Any initially loaded subjects are immediately marked as touched upon mounting, meaning any existing subjects missing required fields will correctly display errors right away as they previously did.
- **No Data Model Tampering:** The underlying data schema and its hydration paths were not altered. The `IntracurricularKnowledge.ts` file remains 100% compliant with its business rules.

### 5. UAT Checklist
- [x] Click "Tambah Mata Pelajaran". The subject appears as a draft, but no validation error banner is displayed.
- [x] Click inside the "Nama Mata Pelajaran" input, do not type anything, and click away (triggering blur). The validation error should now appear.
- [x] Type in the input (triggering change). Validation evaluates in real-time, displaying error or hiding it when corrected.
- [x] Refresh the page. If a saved subject exists with missing fields, the validation error correctly displays since it is loaded from persistence.
