import React, { useState } from 'react';
import { BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { CurriculumStructureKnowledge } from '../../knowledge/models/curriculum/CurriculumStructureKnowledge';
import { LearningLoadKnowledge } from '../../knowledge/models/curriculum/LearningLoadKnowledge';
import { LearningOrganizationKnowledge } from '../../knowledge/models/curriculum/LearningOrganizationKnowledge';
import { IntracurricularKnowledge } from '../../knowledge/models/curriculum/IntracurricularKnowledge';
import { CocurricularKnowledge } from '../../knowledge/models/curriculum/CocurricularKnowledge';
import { Trash2, Plus, ArrowUp } from 'lucide-react';
import { LearningLoadAdapter, LearningOrganizationAdapter, IntracurricularAdapter, CocurricularAdapter, ExtracurricularAdapter } from '../adapters/CurriculumAdapter';
import { KspMetadataAdapter } from '../../../ksp/KspMetadataAdapter';
import { useEffect } from 'react';

export const CurriculumHubModule = ({ settings, updateSetting }: any) => {
  const metadata = KspMetadataAdapter.adapt(settings);
  const paudMetadata = settings?.enterpriseProfile?.paudMetadata || {};
  const kesetaraanMetadata = settings?.enterpriseProfile?.kesetaraanMetadata || {};

  const updatePaud = (field: string, value: string) => {
    if (updateSetting) {
      updateSetting('enterpriseProfile', 'paudMetadata', { ...paudMetadata, [field]: value });
    }
  };

  const updateKesetaraan = (field: string, value: string) => {
    if (updateSetting) {
      updateSetting('enterpriseProfile', 'kesetaraanMetadata', { ...kesetaraanMetadata, [field]: value });
    }
  };
  const [knowledge, setKnowledge] = useState<CurriculumStructureKnowledge>(
    new CurriculumStructureKnowledge('cs-1', '1.0.0', {
      educationLevel: metadata.schoolLevel || 'Sekolah Dasar (SD)',
      phase: metadata.phase || 'Fase A, B, dan C',
      curriculumType: 'Kurikulum Merdeka'
    })
  );

  const [learningLoad, setLearningLoad] = useState<LearningLoadKnowledge>(
    new LearningLoadKnowledge('ll-1', '1.0.0', LearningLoadAdapter.normalize(settings?.curriculum?.learningLoad || settings?.learningLoad, metadata))
  );

  
  const [learningOrganization, setLearningOrganization] = useState<LearningOrganizationKnowledge>(
    new LearningOrganizationKnowledge('lo-1', '1.0.0', LearningOrganizationAdapter.normalize(settings?.curriculum?.learningOrganization || settings?.learningOrganization, metadata))
  );

  
  const [intracurricular, setIntracurricular] = useState<IntracurricularKnowledge>(
    new IntracurricularKnowledge('ic-1', '1.0.0', IntracurricularAdapter.normalize(settings?.curriculum?.intracurricular || settings?.intracurricular, metadata))
  );
  
  const [touchedIntraSubjects, setTouchedIntraSubjects] = useState<Set<string>>(() => {
    const initialData = IntracurricularAdapter.normalize(settings?.curriculum?.intracurricular || settings?.intracurricular, metadata);
    return new Set((initialData?.subjects || []).map((s: any) => s.id));
  });

  const markIntraSubjectTouched = (subjectId: string) => {
    if (!touchedIntraSubjects.has(subjectId)) {
      setTouchedIntraSubjects(prev => new Set(prev).add(subjectId));
    }
  };


  
  const [cocurricular, setCocurricular] = useState<CocurricularKnowledge>(
    new CocurricularKnowledge('cc-1', '1.0.0', CocurricularAdapter.normalize(settings?.curriculum?.cocurricular || settings?.cocurricular, metadata))
  );

  const cocurricularValidation = cocurricular.validate();

  const handleCocurricularUpdate = (field: string, value: any) => {
    const updatedPayload = {
      ...cocurricular.payload,
      [field]: value
    };
    
    const newKnowledge = new CocurricularKnowledge('cc-1', '1.0.0', updatedPayload as any);
    setCocurricular(newKnowledge);
    
    if (updateSetting) {
      updateSetting('cocurricular', '', newKnowledge.payload);
    }
  };

  const handleAddActivity = () => {
    const newActivity = {
      id: `act-${Date.now()}`,
      activityName: '',
      targetPhase: knowledge.payload.phase,
      implementationTime: '',
      profilLulusanDimensions: [],
      tujuhKebiasaan: [],
      description: ''
    };
    handleCocurricularUpdate('activities', [...cocurricular.payload.activities, newActivity]);
  };

  const handleUpdateActivity = (index: number, field: string, value: any) => {
    const updatedActivities = [...cocurricular.payload.activities];
    updatedActivities[index] = { ...updatedActivities[index], [field]: value };
    handleCocurricularUpdate('activities', updatedActivities);
  };

  const handleRemoveActivity = (index: number) => {
    const updatedActivities = [...cocurricular.payload.activities];
    updatedActivities.splice(index, 1);
    handleCocurricularUpdate('activities', updatedActivities);
  };

  const rawIntracurricularValidation = intracurricular.validate();
  const intracurricularValidation = {
    ...rawIntracurricularValidation,
    issues: rawIntracurricularValidation.issues.filter(issue => {
      const match = issue.field.match(/subjects\[(\d+)\]/);
      if (match) {
        const index = parseInt(match[1], 10);
        const subject = intracurricular.payload.subjects[index];
        if (subject && !touchedIntraSubjects.has(subject.id)) {
          return false;
        }
      }
      return true;
    })
  };
  intracurricularValidation.status = intracurricularValidation.issues.length > 0 ? 'ERROR' : 'PASS';

  const handleAddSubject = () => {
    const newSubject = {
      id: `sub-${Date.now()}`,
      subjectName: '',
      educationLevel: knowledge.payload.educationLevel,
      phase: knowledge.payload.phase,
      weeklyLearningHours: 0,
      annualLearningHours: 0,
      learningApproach: 'Mata Pelajaran',
      profilLulusanDimensions: [],
      tujuhKebiasaan: [],
      deepLearningIndicators: [],
      notes: ''
    };
    const newKnowledge = new IntracurricularKnowledge('ic-1', '1.0.0', {
      subjects: [...intracurricular.payload.subjects, newSubject]
    });
    setIntracurricular(newKnowledge);
    if (updateSetting) updateSetting('intracurricular', '', newKnowledge.payload);
  };

  const handleUpdateSubject = (index: number, field: string, value: any) => {
    const updatedSubjects = [...intracurricular.payload.subjects];
    const subjectId = updatedSubjects[index].id;
    markIntraSubjectTouched(subjectId);
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
    const newKnowledge = new IntracurricularKnowledge('ic-1', '1.0.0', {
      subjects: updatedSubjects
    });
    setIntracurricular(newKnowledge);
    if (updateSetting) updateSetting('intracurricular', '', newKnowledge.payload);
  };

  const handleRemoveSubject = (index: number) => {
    const updatedSubjects = [...intracurricular.payload.subjects];
    updatedSubjects.splice(index, 1);
    const newKnowledge = new IntracurricularKnowledge('ic-1', '1.0.0', {
      subjects: updatedSubjects
    });
    setIntracurricular(newKnowledge);
    if (updateSetting) updateSetting('intracurricular', '', newKnowledge.payload);
  };

  const learningOrganizationValidation = learningOrganization.validate();

  const handleLearningOrganizationUpdate = (field: keyof typeof learningOrganization.payload, value: string) => {
    const updatedPayload = {
      ...learningOrganization.payload,
      [field]: value
    };
    
    const newKnowledge = new LearningOrganizationKnowledge('lo-1', '1.0.0', updatedPayload as any);
    setLearningOrganization(newKnowledge);
    
    if (updateSetting) {
      updateSetting('learningOrganization', '', newKnowledge.payload);
    }
  };

  const learningLoadValidation = learningLoad.validate();

  const handleLearningLoadUpdate = (field: keyof typeof learningLoad.payload, value: string | number) => {
    const newKnowledge = new LearningLoadKnowledge('ll-1', '1.0.0', {
      ...learningLoad.payload,
      [field]: value
    });
    setLearningLoad(newKnowledge);
    if (updateSetting) updateSetting('learningLoad', '', newKnowledge.payload);
  };

  const validation = knowledge.validate();

  const handleUpdate = (field: 'educationLevel' | 'phase' | 'curriculumType', value: string) => {
    setKnowledge(
      new CurriculumStructureKnowledge('cs-1', '1.0.0', {
        ...knowledge.payload,
        [field]: value
      })
    );
  };

  const [activeSection, setActiveSection] = useState('struktur');
  const [extracurricular, setExtracurricular] = useState(ExtracurricularAdapter.normalize(settings?.curriculum?.extracurricular || settings?.extracurricular, metadata));

  const [academicCalendar, setAcademicCalendar] = useState(settings?.curriculum?.academicCalendar || settings?.academicCalendar || {
    academicYear: metadata.academicYear || '2026/2027',
    semester1Start: '',
    semester2Start: '',
    notes: ''
  });

  const handleExtracurricularUpdate = (field: string, value: any) => {
    const newData = { ...extracurricular, [field]: value };
    setExtracurricular(newData);
    if (updateSetting) updateSetting('extracurricular', '', newData);
  };

  const handleCalendarUpdate = (field: string, value: any) => {
    const newData = { ...academicCalendar, [field]: value };
    setAcademicCalendar(newData);
    if (updateSetting) updateSetting('academicCalendar', '', newData);
  };
  
  const handleCalendarEventAdd = () => {
    const newEvents = [...(academicCalendar.events || [])];
    newEvents.push({
      date: new Date().toISOString().split('T')[0],
      name: 'Kegiatan Baru',
      type: 'SCHOOL_EVENT'
    });
    handleCalendarUpdate('events', newEvents);
  };
  
  const handleCalendarEventUpdate = (idx: number, field: string, value: any) => {
    const newEvents = [...(academicCalendar.events || [])];
    newEvents[idx] = { ...newEvents[idx], [field]: value };
    handleCalendarUpdate('events', newEvents);
  };

  const handleCalendarEventRemove = (idx: number) => {
    const newEvents = [...(academicCalendar.events || [])];
    newEvents.splice(idx, 1);
    handleCalendarUpdate('events', newEvents);
  };
  
  const handleExtracurricularAdd = (type: 'mandatoryPrograms' | 'optionalPrograms') => {
    const programs = [...extracurricular[type]];
    programs.push({
      id: `ext-${Date.now()}`,
      name: '',
      description: '',
      targetHabits: []
    });
    handleExtracurricularUpdate(type, programs);
  };

  const handleExtracurricularChange = (type: 'mandatoryPrograms' | 'optionalPrograms', index: number, field: string, value: string) => {
    const programs = [...extracurricular[type]];
    programs[index] = { ...programs[index], [field]: value };
    handleExtracurricularUpdate(type, programs);
  };

  const handleExtracurricularRemove = (type: 'mandatoryPrograms' | 'optionalPrograms', index: number) => {
    const programs = [...extracurricular[type]];
    programs.splice(index, 1);
    handleExtracurricularUpdate(type, programs);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visibleSections = entries.filter(entry => entry.isIntersecting);
      if (visibleSections.length > 0) {
        setActiveSection(visibleSections[0].target.id);
      }
    }, { rootMargin: '-20% 0px -80% 0px' });

    const sectionIds = ['struktur', 'beban', 'pengorganisasian', 'intrakurikuler', 'kokurikuler', 'ekstrakurikuler', 'kalender'];
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const BackToTop = () => (
    <div className="flex justify-end mt-4">
      <button onClick={() => scrollTo('struktur')} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
        <ArrowUp className="w-4 h-4" /> Back to Top
      </button>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-2rem)] w-full bg-slate-50 relative animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      <div className="w-64 shrink-0 bg-white border-r border-slate-200 sticky top-0 h-full overflow-y-auto z-10 flex flex-col">
        <div className="p-4 font-bold text-slate-800 border-b border-slate-200 bg-slate-50 shrink-0">
          Daftar Isi BAB III
        </div>
        <div className="p-3 flex-1 overflow-y-auto space-y-1">
          {[
            { id: 'struktur', label: 'Struktur Kurikulum' },
            { id: 'beban', label: 'Beban Belajar' },
            { id: 'pengorganisasian', label: 'Pengorganisasian' },
            { id: 'intrakurikuler', label: 'Intrakurikuler' },
            { id: 'kokurikuler', label: 'Kokurikuler' },
            { id: 'ekstrakurikuler', label: 'Ekstrakurikuler' },
            { id: 'kalender', label: 'Kalender Pendidikan' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                activeSection === item.id 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 h-full overflow-y-auto p-8 bg-slate-50 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-12 pb-32">
          
          <div id="struktur" className="scroll-mt-8 relative">
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Pengetahuan Struktur Kurikulum</h2>
              </div>
              
              <p className="text-slate-600 mb-6">
                Define the fundamental structural constraints for the curriculum.
              </p>

              {validation.status === 'ERROR' && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex flex-col gap-2 text-sm border border-red-200">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4" /> Kesalahan Validasi
                  </div>
                  <ul className="list-disc list-inside">
                    {validation.issues.map((issue, idx) => (
                      <li key={idx}>{issue.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validation.status === 'PASS' && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2 text-sm font-medium border border-emerald-200">
                  <CheckCircle className="w-4 h-4" />
                  Knowledge is valid and ready for publishing.
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jenjang Pendidikan</label>
                  <input maxLength={255} 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={knowledge.payload.educationLevel}
                    onChange={(e) => handleUpdate('educationLevel', e.target.value)}
                    placeholder="mis., Sekolah Dasar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fase</label>
                  <input maxLength={255} 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={knowledge.payload.phase}
                    onChange={(e) => handleUpdate('phase', e.target.value)}
                    placeholder="mis., Fase A, B, dan C"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kurikulum</label>
                  <input maxLength={255} 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={knowledge.payload.curriculumType}
                    onChange={(e) => handleUpdate('curriculumType', e.target.value)}
                    placeholder="mis., Kurikulum Merdeka"
                  />
                </div>
              </div>
            </div>
            <BackToTop />
          </div>
          
          <hr className="border-slate-300" />
          
          <div id="beban" className="scroll-mt-8 relative">
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Beban Belajar Knowledge</h2>
              </div>
              
              <p className="text-slate-600 mb-6">
                Define the learning load parameters.
              </p>

              {learningLoadValidation.status === 'ERROR' && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex flex-col gap-2 text-sm border border-red-200">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4" /> Kesalahan Validasi
                  </div>
                  <ul className="list-disc list-inside">
                    {learningLoadValidation.issues.map((issue, idx) => (
                      <li key={idx}>{issue.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {learningLoadValidation.status === 'PASS' && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2 text-sm font-medium border border-emerald-200">
                  <CheckCircle className="w-4 h-4" />
                  Knowledge is valid and ready for publishing.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jenjang Pendidikan</label>
                  <input maxLength={255} 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    value={learningLoad.payload.educationLevel}
                    onChange={(e) => handleLearningLoadUpdate('educationLevel', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fase</label>
                  <input maxLength={255} 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    value={learningLoad.payload.phase}
                    onChange={(e) => handleLearningLoadUpdate('phase', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year</label>
                  <input maxLength={255} 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    value={learningLoad.payload.academicYear}
                    onChange={(e) => handleLearningLoadUpdate('academicYear', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Effective Weeks</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    value={learningLoad.payload.effectiveWeeks}
                    onChange={(e) => handleLearningLoadUpdate('effectiveWeeks', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Weekly Beban Belajar (hours)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    value={learningLoad.payload.weeklyLearningLoad}
                    onChange={(e) => handleLearningLoadUpdate('weeklyLearningLoad', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Annual Beban Belajar (hours)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    value={learningLoad.payload.annualLearningLoad}
                    onChange={(e) => handleLearningLoadUpdate('annualLearningLoad', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Jam Pelajaran</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    value={learningLoad.payload.totalLearningHours}
                    onChange={(e) => handleLearningLoadUpdate('totalLearningHours', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
            <BackToTop />
          </div>
          
          <hr className="border-slate-300" />
          
          <div id="pengorganisasian" className="scroll-mt-8 relative">
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Pengorganisasian Pembelajaran Knowledge</h2>
              </div>
              
              <p className="text-slate-600 mb-6">
                Define the philosophical and strategic foundations for the curriculum implementation.
              </p>

              {learningOrganizationValidation.status === 'ERROR' && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex flex-col gap-2 text-sm border border-red-200">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4" /> Kesalahan Validasi
                  </div>
                  <ul className="list-disc list-inside">
                    {learningOrganizationValidation.issues.map((issue, idx) => (
                      <li key={idx}>{issue.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {learningOrganizationValidation.status === 'PASS' && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2 text-sm font-medium border border-emerald-200">
                  <CheckCircle className="w-4 h-4" />
                  Knowledge is valid and ready for publishing.
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Educational Philosophy</label>
                  <textarea maxLength={2000} 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px] bg-white"
                    value={learningOrganization.payload.educationalPhilosophy}
                    onChange={(e) => handleLearningOrganizationUpdate('educationalPhilosophy', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prinsip Pembelajaran</label>
                  <textarea maxLength={2000} 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px] bg-white"
                    value={learningOrganization.payload.learningPrinciples}
                    onChange={(e) => handleLearningOrganizationUpdate('learningPrinciples', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Strategi Implementasi</label>
                  <textarea maxLength={2000} 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px] bg-white"
                    value={learningOrganization.payload.implementationStrategy}
                    onChange={(e) => handleLearningOrganizationUpdate('implementationStrategy', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assessment Approach</label>
                  <textarea maxLength={2000} 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px] bg-white"
                    value={learningOrganization.payload.assessmentApproach}
                    onChange={(e) => handleLearningOrganizationUpdate('assessmentApproach', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Responsible Unit</label>
                    <input maxLength={255} 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      value={learningOrganization.payload.responsibleUnit}
                      onChange={(e) => handleLearningOrganizationUpdate('responsibleUnit', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Learners</label>
                    <input maxLength={255} 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      value={learningOrganization.payload.targetLearners}
                      onChange={(e) => handleLearningOrganizationUpdate('targetLearners', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <BackToTop />
          </div>
          
          <hr className="border-slate-300" />
          
          <div id="intrakurikuler" className="scroll-mt-8 relative">
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Intracurricular Knowledge</h2>
                </div>
                <button 
                  onClick={handleAddSubject}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Mata Pelajaran
                </button>
              </div>
              
              <p className="text-slate-600 mb-6">
                Define the subjects, learning hours, and approaches.
              </p>

              {intracurricularValidation.status === 'ERROR' && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex flex-col gap-2 text-sm border border-red-200">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4" /> Kesalahan Validasi
                  </div>
                  <ul className="list-disc list-inside">
                    {intracurricularValidation.issues.map((issue, idx) => (
                      <li key={idx}>{issue.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-4">
                {intracurricular.payload.subjects.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                    Belum ada mata pelajaran. Klik "Tambah Mata Pelajaran" untuk memulai.
                  </div>
                ) : (
                  intracurricular.payload.subjects.map((subject, index) => (
                    <div key={subject.id} className="p-4 border border-slate-200 rounded-lg space-y-4 bg-slate-50 relative">
                      <button
                        onClick={() => handleRemoveSubject(index)}
                        className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Nama Mata Pelajaran</label>
                          <input maxLength={255} 
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={subject.subjectName}
                            onChange={(e) => handleUpdateSubject(index, 'subjectName', e.target.value)}
                            onBlur={() => markIntraSubjectTouched(subject.id)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Pendekatan Pembelajaran</label>
                          <input maxLength={255} 
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={subject.learningApproach}
                            onChange={(e) => handleUpdateSubject(index, 'learningApproach', e.target.value)}
                            onBlur={() => markIntraSubjectTouched(subject.id)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Jam Pelajaran Mingguan (JP)</label>
                          <input 
                            type="number" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={subject.weeklyLearningHours}
                            onChange={(e) => handleUpdateSubject(index, 'weeklyLearningHours', parseInt(e.target.value) || 0)}
                            onBlur={() => markIntraSubjectTouched(subject.id)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Jam Pelajaran Tahunan (JP)</label>
                          <input 
                            type="number" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={subject.annualLearningHours}
                            onChange={(e) => handleUpdateSubject(index, 'annualLearningHours', parseInt(e.target.value) || 0)}
                            onBlur={() => markIntraSubjectTouched(subject.id)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Fase</label>
                          <input maxLength={255} 
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={subject.phase}
                            onChange={(e) => handleUpdateSubject(index, 'phase', e.target.value)}
                            onBlur={() => markIntraSubjectTouched(subject.id)}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <BackToTop />
          </div>
          
          <hr className="border-slate-300" />
          
          <div id="kokurikuler" className="scroll-mt-8 relative">
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Pengetahuan Kokurikuler</h2>
                </div>
              </div>
              
              <p className="text-slate-600 mb-6">
                Tentukan program, kegiatan, dan tujuan Kokurikuler. (Menggantikan P5 versi lama).
              </p>

              {cocurricularValidation.status === 'ERROR' && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex flex-col gap-2 text-sm border border-red-200">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4" /> Kesalahan Validasi
                  </div>
                  <ul className="list-disc list-inside">
                    {cocurricularValidation.issues.map((issue, idx) => (
                      <li key={idx}>{issue.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Identitas Program</label>
                  <input maxLength={255} 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    value={cocurricular.payload.programIdentity}
                    onChange={(e) => handleCocurricularUpdate('programIdentity', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tujuan</label>
                  <textarea maxLength={2000} 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-h-[80px]"
                    value={cocurricular.payload.objectives}
                    onChange={(e) => handleCocurricularUpdate('objectives', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Strategi Asesmen</label>
                    <textarea maxLength={2000} 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-h-[80px]"
                      value={cocurricular.payload.assessment}
                      onChange={(e) => handleCocurricularUpdate('assessment', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Strategi Refleksi</label>
                    <textarea maxLength={2000} 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-h-[80px]"
                      value={cocurricular.payload.reflection}
                      onChange={(e) => handleCocurricularUpdate('reflection', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Kegiatan</h3>
                <button 
                  onClick={handleAddActivity}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Kegiatan
                </button>
              </div>

              <div className="space-y-4">
                {cocurricular.payload.activities.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                    Belum ada kegiatan. Klik "Tambah Kegiatan" untuk memulai.
                  </div>
                ) : (
                  cocurricular.payload.activities.map((activity, index) => (
                    <div key={activity.id} className="p-4 border border-slate-200 rounded-lg space-y-4 bg-slate-50 relative">
                      <button
                        onClick={() => handleRemoveActivity(index)}
                        className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kegiatan</label>
                          <input maxLength={255} 
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={activity.activityName}
                            onChange={(e) => handleUpdateActivity(index, 'activityName', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Target Fase</label>
                          <input maxLength={255} 
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={activity.targetPhase}
                            onChange={(e) => handleUpdateActivity(index, 'targetPhase', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Waktu Pelaksanaan</label>
                          <input maxLength={255} 
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={activity.implementationTime}
                            onChange={(e) => handleUpdateActivity(index, 'implementationTime', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                          <input maxLength={255} 
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={activity.description}
                            onChange={(e) => handleUpdateActivity(index, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <BackToTop />
          </div>
          
          <hr className="border-slate-300" />
          
          <div id="ekstrakurikuler" className="scroll-mt-8 relative">
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Ekstrakurikuler Knowledge</h2>
              </div>
              <p className="text-slate-600 mb-6">
                Tentukan program ekstrakurikuler wajib dan pilihan.
              </p>
              
              <div className="flex items-center justify-between mb-4 mt-8">
                <h3 className="text-lg font-bold text-slate-800">Ekstrakurikuler Wajib</h3>
                <button 
                  onClick={() => handleExtracurricularAdd('mandatoryPrograms')}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" /> Tambah Wajib
                </button>
              </div>
              <div className="space-y-4">
                {extracurricular.mandatoryPrograms.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">Belum ada ekstrakurikuler wajib.</div>
                ) : extracurricular.mandatoryPrograms.map((prog, idx) => (
                  <div key={prog.id} className="p-4 border border-slate-200 rounded-lg space-y-4 bg-slate-50 relative">
                    <button onClick={() => handleExtracurricularRemove('mandatoryPrograms', idx)} className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nama Program</label>
                      <input maxLength={255} type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" value={prog.name} onChange={(e) => handleExtracurricularChange('mandatoryPrograms', idx, 'name', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                      <input maxLength={255} type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" value={prog.description} onChange={(e) => handleExtracurricularChange('mandatoryPrograms', idx, 'description', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between mb-4 mt-8">
                <h3 className="text-lg font-bold text-slate-800">Ekstrakurikuler Pilihan</h3>
                <button 
                  onClick={() => handleExtracurricularAdd('optionalPrograms')}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" /> Tambah Pilihan
                </button>
              </div>
              <div className="space-y-4">
                {extracurricular.optionalPrograms.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">Belum ada ekstrakurikuler pilihan.</div>
                ) : extracurricular.optionalPrograms.map((prog, idx) => (
                  <div key={prog.id} className="p-4 border border-slate-200 rounded-lg space-y-4 bg-slate-50 relative">
                    <button onClick={() => handleExtracurricularRemove('optionalPrograms', idx)} className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nama Program</label>
                      <input maxLength={255} type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" value={prog.name} onChange={(e) => handleExtracurricularChange('optionalPrograms', idx, 'name', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                      <input maxLength={255} type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" value={prog.description} onChange={(e) => handleExtracurricularChange('optionalPrograms', idx, 'description', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <BackToTop />
          </div>
          
          <hr className="border-slate-300" />
          
          <div id="kalender" className="scroll-mt-8 relative">
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Kalender Pendidikan Knowledge</h2>
              </div>
              <p className="text-slate-600 mb-6">
                Tentukan pengaturan kalender akademik untuk satuan pendidikan.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tahun Akademik</label>
                  <input maxLength={255} type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" value={academicCalendar.academicYear} onChange={(e) => handleCalendarUpdate('academicYear', e.target.value)} />
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Daftar Kegiatan</h3>
                    <button onClick={handleCalendarEventAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      <Plus className="w-4 h-4" /> Tambah Kegiatan
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(academicCalendar.events || []).map((event: any, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                        <button onClick={() => handleCalendarEventRemove(idx)} className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Nama Kegiatan</label>
                            <input maxLength={255} type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" value={event.name} onChange={(e) => handleCalendarEventUpdate(idx, 'name', e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Jenis</label>
                            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" value={event.type} onChange={(e) => handleCalendarEventUpdate(idx, 'type', e.target.value)}>
                              <option value="NATIONAL_HOLIDAY">Libur Nasional</option>
                              <option value="REGIONAL_HOLIDAY">Libur Daerah</option>
                              <option value="SCHOOL_HOLIDAY">Libur Sekolah</option>
                              <option value="ASSESSMENT">Penilaian/Asesmen</option>
                              <option value="PROJECT_WEEK">Minggu Kokurikuler</option>
                              <option value="REPORT_DISTRIBUTION">Pembagian Rapor</option>
                              <option value="SEMESTER_BOUNDARY">Awal/Akhir Semester</option>
                              <option value="MPLS">MPLS</option>
                              <option value="SCHOOL_EVENT">Kegiatan Sekolah Lainnya</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Tanggal</label>
                            <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" value={event.date} onChange={(e) => handleCalendarEventUpdate(idx, 'date', e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Sampai Tanggal (Opsional)</label>
                            <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" value={event.endDate || ''} onChange={(e) => handleCalendarEventUpdate(idx, 'endDate', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!academicCalendar.events || academicCalendar.events.length === 0) && (
                      <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-sm">
                        Belum ada kegiatan kalender yang ditambahkan.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Catatan Tambahan</label>
                  <textarea maxLength={2000} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-h-[80px]" value={academicCalendar.notes} onChange={(e) => handleCalendarUpdate('notes', e.target.value)} />
                </div>
              </div>
            </div>
            <BackToTop />
          </div>

        </div>
      </div>
    </div>
  );
};
