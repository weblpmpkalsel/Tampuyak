# SUPERVISION MODULE PRODUCTION CHECKLIST

To successfully transition from Safe Implementation to Production, the following checklist must be completed in order.

### Phase 1: Dependency Injection Refactoring
- [ ] Create `FirestoreSupervisionRepository` implementing `SupervisionRepository`.
- [ ] Create `FirestoreScheduleRepository`, `FirestoreObservationRepository`, etc.
- [ ] Update `SupervisionContext` to provide repository instances.
- [ ] Refactor all UI components to consume repositories from the Context instead of `new Mock...`.

### Phase 2: Core Integration
- [ ] Connect `TeacherAssignment` to the actual `UserService` to query real school teachers.
- [ ] Ensure `QualityAnalyticsService` is fed data exclusively from the new Firestore repositories.
- [ ] Connect `SupervisionPublishingService` to the actual Firestore repositories.

### Phase 3: Security & Flags
- [ ] Update `Tampuyak.tsx` to strictly wrap the `<SupervisionAcademicView />` route rendering with the `VITE_ENABLE_SUPERVISION_MODULE` flag.
- [ ] Delete the `src/modules/supervision/persistence/mock` folder entirely to prevent accidental usage.

### Phase 4: Final Validation
- [ ] Run end-to-end testing with a real Headmaster account.
- [ ] Verify that a Headmaster can create a plan, assign a teacher, schedule an observation, input scores, and generate an RTL.
- [ ] Switch `VITE_ENABLE_SUPERVISION_MODULE` to `true` in production environment variables.
