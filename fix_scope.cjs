const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionScheduling.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `      // Update plan status if all schedules are done?
      // In this mockup, we'll just let the plan status be updated manually or leave it as READY_FOR_SCHEDULING/SCHEDULED.
      const handleStartPreObservation = async (schedule: SupervisionSchedule) => {
    try {
      const updatedSchedule = applicationService.startPreObservation({
        schedule,
        notes: preObsNotes
      });
      await mockScheduleRepo.update(updatedSchedule.id, updatedSchedule);
      
      const updatedSchedules = await mockScheduleRepo.findByPlanId(plan.id);
      dispatch({ type: 'SET_SCHEDULES', payload: updatedSchedules });
      
      setStartingPreObsId(null);
      setPreObsNotes('');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const allScheduled = updatedSchedules.every(s => s.status !== SupervisionStatus.DRAFT && s.status !== SupervisionStatus.READY_FOR_SCHEDULING);
      
      if (allScheduled && plan.status === SupervisionStatus.READY_FOR_SCHEDULING) {`,
  `      // Update plan status if all schedules are done?
      // In this mockup, we'll just let the plan status be updated manually or leave it as READY_FOR_SCHEDULING/SCHEDULED.
      const allScheduled = updatedSchedules.every(s => s.status !== SupervisionStatus.DRAFT && s.status !== SupervisionStatus.READY_FOR_SCHEDULING);
      
      if (allScheduled && plan.status === SupervisionStatus.READY_FOR_SCHEDULING) {`
);

code = code.replace(
  "const handleSave = async (schedule: SupervisionSchedule) => {",
  `const handleStartPreObservation = async (schedule: SupervisionSchedule) => {
    try {
      const updatedSchedule = applicationService.startPreObservation({
        schedule,
        notes: preObsNotes
      });
      await mockScheduleRepo.update(updatedSchedule.id, updatedSchedule);
      
      const updatedSchedules = await mockScheduleRepo.findByPlanId(plan.id);
      dispatch({ type: 'SET_SCHEDULES', payload: updatedSchedules });
      
      setStartingPreObsId(null);
      setPreObsNotes('');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSave = async (schedule: SupervisionSchedule) => {`
);

fs.writeFileSync(file, code);
