## Intracurricular Validation Flow Audit

### 1. Execution Trace
When a user clicks "Tambah Mata Pelajaran", the following sequence of events occurs:
1. The `onClick` event handler triggers `handleAddSubject()`.
2. Inside `handleAddSubject()`, a new `newSubject` object is instantiated with empty default values (e.g., `subjectName: ''`).
3. A new `IntracurricularKnowledge` class instance is created containing the previous subjects plus the newly created empty subject.
4. `setIntracurricular()` is called with this new instance, updating the React state.
5. The state update forces a synchronous React component re-render.
6. During the render phase, the component unconditionally executes `intracurricular.validate()`.
7. The validation engine iterates through the `subjects` array. It encounters the newly appended subject, observes that `subjectName` is an empty string, and immediately flags an `ERROR`.
8. The component reaches the JSX return statement and, because the validation status is now `'ERROR'`, immediately mounts and displays the red error banner.

### 2. Where Validation is Triggered
Validation is triggered **as a derived state computed during the React render cycle**. 
- It is NOT triggered by a "Save" button.
- It is NOT triggered by an `onBlur` or `onChange` event from the input field.
- It is evaluated on every single re-render of the `CurriculumHubModule` component.

### 3. Why Validation Runs Before Data Entry
Validation runs before the user can type because the application evaluates validation rules *too eagerly*. As soon as the empty "draft" object is inserted into the main state array, the component re-renders. Because the validation execution is hardcoded directly into the main render path (without checking if the field has been interacted with), the empty string is instantly evaluated against strict schema rules, failing immediately.

### 4. Problem Classification
The root cause is a combination of **Validation timing** and **UI state management**:
- **Validation timing:** Validation is run synchronously on render, making it overly eager. It does not wait for a submission event or an input blur event.
- **UI state management:** The state model does not differentiate between a "new, untouched draft item" and a "completed item". Lacking a `touched` boolean or a separate draft state, the validation engine treats the fresh template as invalid user input.

### 5. File References

**src/enterprise/workspace/modules/CurriculumHubModule.tsx**
- `Line 589`: `<button onClick={handleAddSubject}>` triggers the flow.
- `Lines 99-118`: `handleAddSubject()` function definition.
  - `Line 102`: `subjectName: ''` creates the empty invalid state.
  - `Line 116`: `setIntracurricular(newKnowledge)` commits it to state, causing a re-render.
- `Line 97`: `const intracurricularValidation = intracurricular.validate();` executes validation during the render.
- `Line 601`: `{intracurricularValidation.status === 'ERROR' && ...}` renders the red error banner instantly.

**src/enterprise/knowledge/models/curriculum/IntracurricularKnowledge.ts**
- `Lines 57-77`: `validate()` function definition.
  - `Lines 61-63`: `if (!subject.subjectName) { issues.push(...) }` pushes the specific error being seen in the UI.
