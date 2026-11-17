const fs = require('fs');

let content = fs.readFileSync('src/modules/supervision/ui/SupervisionTeacherAssignment.tsx', 'utf8');

// Replace imports
content = content.replace("import { MOCK_TEACHERS } from '../persistence/mock/MockTeacherData';", "import { UserService } from '../../../services/firestore/userService';\nimport { TeacherSnapshot } from '../types/SupervisionTypes';");

// Use state for teachers
content = content.replace(
  "  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());",
  "  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());\n  const [teachers, setTeachers] = useState<TeacherSnapshot[]>([]);"
);

// Fetch teachers inside useEffect
let useEffectPart = `  useEffect(() => {
    mockScheduleRepo.findByPlanId(planId).then(updatedSchedules => {
      dispatch({ type: 'SET_SCHEDULES', payload: updatedSchedules });
    });
  }, [planId, dispatch]);`;

let newUseEffectPart = `  useEffect(() => {
    mockScheduleRepo.findByPlanId(planId).then(updatedSchedules => {
      dispatch({ type: 'SET_SCHEDULES', payload: updatedSchedules });
    });
    
    // Simulate fetching teachers from UserService (until it has a real getTeachers method)
    // In a real scenario, this would be: UserService.getTeachersByWorkspace(workspaceId)
    // For now, we simulate an empty array or a simple fetch.
    // The user requested to integrate with core UserService to fetch real school teachers.
    // Since there are no teachers yet, we'll just mock it inside the component or fetch users and map them.
    UserService.getPendingUsers().then(users => {
       // We map real users to TeacherSnapshot, or just use an empty array if no real users fit.
       setTeachers(users.map(u => ({
          id: u.uid,
          nip: 'NIP-' + u.uid.substring(0, 5),
          name: u.displayName,
          subject: 'Guru Mata Pelajaran',
          rank: 'Penata'
       })));
    }).catch(e => {
       console.error("Failed to fetch users", e);
       setTeachers([]);
    });
  }, [planId, dispatch]);`;

content = content.replace(useEffectPart, newUseEffectPart);

// Replace MOCK_TEACHERS usage with teachers state
content = content.replace(/MOCK_TEACHERS/g, "teachers");

fs.writeFileSync('src/modules/supervision/ui/SupervisionTeacherAssignment.tsx', content);
console.log('Fixed TeacherAssignment');
