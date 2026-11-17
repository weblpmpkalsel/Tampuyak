const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionTeacherRecord.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/generated-schedule-id/g, 'schedule.id');
content = content.replace(
  '{/* List of Schedules assigned to this teacher */}\n      <div className="space-y-6">',
  `{/* List of Schedules assigned to this teacher */}\n      <div className="space-y-6">
        {schedules.map(schedule => (`
);
content = content.replace(
  '            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center">\n              <div className="mb-4 sm:mb-0">',
  `            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center">\n              <div className="mb-4 sm:mb-0">`
);

// Actually, this is too complex for string replace if it's fully hardcoded. Let's just do a simple replacement for the schedule ID.
// Wait, replacing 'generated-schedule-id' with 'teacherId' works as a placeholder ID that is unique to the teacher.
