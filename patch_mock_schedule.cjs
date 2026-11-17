const fs = require('fs');
const file = 'src/modules/supervision/persistence/mock/MockScheduleRepository.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "async findByPlanId(planId: string): Promise<SupervisionSchedule[]> {",
  `async findById(id: string): Promise<SupervisionSchedule | null> {
    return mockSchedules.get(id) || null;
  }
  
  async findAll(): Promise<SupervisionSchedule[]> {
    return Array.from(mockSchedules.values());
  }

  async findByPlanId(planId: string): Promise<SupervisionSchedule[]> {`
);

fs.writeFileSync(file, code);
