const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionTeacherAssignment.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
`import React, { useState, useEffect } from 'react';
import { PermissionGuard } from '../auth/SupervisionGuards';
import { Users, UserPlus, Trash2 } from 'lucide-react';
import { useSupervision } from '../context/useSupervision';
import { UserService } from '../../../services/firestore/userService';
import { TeacherSnapshot } from '../types/SupervisionTypes';`,
`import React, { useState, useEffect, useMemo } from 'react';
import { PermissionGuard } from '../auth/SupervisionGuards';
import { Users, UserPlus, Trash2 } from 'lucide-react';
import { useSupervision } from '../context/useSupervision';
import { TeacherSnapshot } from '../types/SupervisionTypes';
import { useApp } from '../../../Tampuyak';`
);

const targetReplace = `export const SupervisionTeacherAssignment = ({ planId }: { planId: string }) => {
  const { repositories } = useSupervision();
  const scheduleRepo = repositories.getScheduleRepository();
  const { state, dispatch, applicationService } = useSupervision();
  const schedules = state.schedules.schedules;
  
  const [showModal, setShowModal] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());
  const [teachers, setTeachers] = useState<TeacherSnapshot[]>([]);
  
  useEffect(() => {
    scheduleRepo.findByPlanId(planId).then(updatedSchedules => {
      dispatch({ type: 'SET_SCHEDULES', payload: updatedSchedules });
    });
    
    // Simulate fetching teachers from UserService (until it has a real getTeachers method)
    // In a real scenario, this would be: UserService.getTeachersByWorkspace(workspaceId)
    // For now, we simulate an empty array or a simple fetch.
    // The user requested to integrate with core UserService to fetch real school teachers.
    // Fetch real users and map them.
    // Fetch real active teachers from the same workspace.
    // In a real scenario we need the workspaceId from auth context, assuming we have it:
    // Here we use a generic workspace ID or fetch all teachers for demo if not scoped.
    const workspaceId = 'default-workspace'; // Ideally from context
    UserService.getActiveTeachersByWorkspace(workspaceId).then(users => {
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

const newContent = `export const SupervisionTeacherAssignment = ({ planId }: { planId: string }) => {
  const { settings } = useApp();
  const rawTeachers = settings?.guru || [];

  const { repositories } = useSupervision();
  const scheduleRepo = repositories.getScheduleRepository();
  const { state, dispatch, applicationService } = useSupervision();
  const schedules = state.schedules.schedules;
  
  const [showModal, setShowModal] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());
  
  const teachers: TeacherSnapshot[] = useMemo(() => {
    return rawTeachers.map((g: any) => ({
      id: String(g.id || Math.random().toString(36).substr(2, 9)),
      nip: g.nip || '-',
      name: g.nama || 'Tanpa Nama',
      subject: g.mapel || 'Guru Mata Pelajaran',
      rank: g.pangkat || g.golongan || '-'
    }));
  }, [rawTeachers]);

  useEffect(() => {
    scheduleRepo.findByPlanId(planId).then(updatedSchedules => {
      dispatch({ type: 'SET_SCHEDULES', payload: updatedSchedules });
    });
  }, [planId, dispatch, scheduleRepo]);`;

content = content.replace(targetReplace, newContent);

fs.writeFileSync(file, content);
