import React, { useState } from 'react';
import { ProgramContent, ProgramActivity } from '../models/ProgramKnowledgeModel';
import { EnterpriseKnowledgeType } from '../../../types/EnterpriseKnowledgeType';

interface EditorProps {
  knowledgeType: EnterpriseKnowledgeType;
  initialContent?: Partial<ProgramContent>;
  onSave: (content: ProgramContent) => void;
}

export const ProgramKnowledgeEditor: React.FC<EditorProps> = ({ knowledgeType, initialContent, onSave }) => {
  const [identity, setIdentity] = useState({
    programName: initialContent?.identity?.programName || '',
    academicYear: initialContent?.identity?.academicYear || '',
    description: initialContent?.identity?.description || ''
  });

  const [activities, setActivities] = useState<ProgramActivity[]>(initialContent?.activities || []);
  const [dimensiProfilLulusan, setDimensiProfilLulusan] = useState<string[]>(initialContent?.dimensiProfilLulusan || []);
  const [tujuhKebiasaan, setTujuhKebiasaan] = useState<string[]>(initialContent?.tujuhKebiasaan || []);
  const [attachments, setAttachments] = useState<string[]>(initialContent?.attachments || []);

  const handleAddActivity = () => {
    setActivities([
      ...activities,
      {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
        name: '',
        objectives: '',
        description: '',
        schedule: '',
        responsiblePerson: '',
        targetParticipants: ''
      }
    ]);
  };

  const handleUpdateActivity = (id: string, updates: Partial<ProgramActivity>) => {
    setActivities(activities.map(act => act.id === id ? { ...act, ...updates } : act));
  };

  const handleSave = () => {
    onSave({
      identity,
      activities,
      dimensiProfilLulusan,
      tujuhKebiasaan,
      attachments
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">{knowledgeType.displayName} Editor</h2>
        <p className="text-gray-500 text-sm mt-1">{knowledgeType.description}</p>
      </div>

      {/* Identity Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Identity</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Program Name</label>
            <input maxLength={255} 
              type="text" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500" 
              value={identity.programName} 
              onChange={e => setIdentity({ ...identity, programName: e.target.value })} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Academic Year</label>
            <input maxLength={255} 
              type="text" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500" 
              value={identity.academicYear} 
              onChange={e => setIdentity({ ...identity, academicYear: e.target.value })} 
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea maxLength={2000} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500" 
              rows={3}
              value={identity.description} 
              onChange={e => setIdentity({ ...identity, description: e.target.value })} 
            />
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-medium text-gray-800">Activity Design</h3>
          <button 
            onClick={handleAddActivity}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
          >
            + Add Activity
          </button>
        </div>
        
        {activities.map((activity, index) => (
          <div key={activity.id} className="p-4 border border-gray-200 rounded-md space-y-4 bg-gray-50">
            <h4 className="font-medium text-sm text-gray-700">Activity {index + 1}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-gray-500">Activity Name</label>
                <input maxLength={255} 
                  type="text" 
                  className="mt-1 block w-full text-sm rounded-md border-gray-300 border p-2" 
                  value={activity.name} 
                  onChange={e => handleUpdateActivity(activity.id, { name: e.target.value })} 
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500">Objectives</label>
                <input maxLength={255} 
                  type="text" 
                  className="mt-1 block w-full text-sm rounded-md border-gray-300 border p-2" 
                  value={activity.objectives} 
                  onChange={e => handleUpdateActivity(activity.id, { objectives: e.target.value })} 
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500">Description</label>
                <textarea maxLength={2000} 
                  className="mt-1 block w-full text-sm rounded-md border-gray-300 border p-2" 
                  rows={2}
                  value={activity.description} 
                  onChange={e => handleUpdateActivity(activity.id, { description: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Schedule</label>
                <input maxLength={255} 
                  type="text" 
                  className="mt-1 block w-full text-sm rounded-md border-gray-300 border p-2" 
                  value={activity.schedule} 
                  onChange={e => handleUpdateActivity(activity.id, { schedule: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Responsible Person</label>
                <input maxLength={255} 
                  type="text" 
                  className="mt-1 block w-full text-sm rounded-md border-gray-300 border p-2" 
                  value={activity.responsiblePerson} 
                  onChange={e => handleUpdateActivity(activity.id, { responsiblePerson: e.target.value })} 
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500">Target Participants</label>
                <input maxLength={255} 
                  type="text" 
                  className="mt-1 block w-full text-sm rounded-md border-gray-300 border p-2" 
                  value={activity.targetParticipants} 
                  onChange={e => handleUpdateActivity(activity.id, { targetParticipants: e.target.value })} 
                />
              </div>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-sm text-gray-500 italic">No activities added yet.</p>
        )}
      </section>

      {/* Dimensi Profil Lulusan */}
      {knowledgeType.governmentPolicyTags.includes('8 Dimensi Profil Lulusan') && (
        <section className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 border-b pb-2">8 Dimensi Profil Lulusan</h3>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Select Dimensions (comma separated for demo)</label>
            <input maxLength={255} 
              type="text" 
              placeholder="e.g. Beriman, Berkebinekaan Global"
              className="block w-full rounded-md border-gray-300 shadow-sm border p-2"
              value={dimensiProfilLulusan.join(', ')}
              onChange={e => setDimensiProfilLulusan(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            />
          </div>
        </section>
      )}

      {/* 7 Kebiasaan */}
      {knowledgeType.governmentPolicyTags.includes('7 Kebiasaan Anak Indonesia Hebat') && (
        <section className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 border-b pb-2">7 Kebiasaan Anak Indonesia Hebat</h3>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Select Habits (comma separated for demo)</label>
            <input maxLength={255} 
              type="text" 
              placeholder="e.g. Bangun Pagi, Beribadah"
              className="block w-full rounded-md border-gray-300 shadow-sm border p-2"
              value={tujuhKebiasaan.join(', ')}
              onChange={e => setTujuhKebiasaan(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            />
          </div>
        </section>
      )}

      {/* Attachments */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Attachments (Reference Documents)</h3>
        <div>
          <label className="block text-sm text-gray-700 mb-2">Document IDs (comma separated)</label>
          <input maxLength={255} 
            type="text" 
            placeholder="e.g. doc-123, doc-456"
            className="block w-full rounded-md border-gray-300 shadow-sm border p-2"
            value={attachments.join(', ')}
            onChange={e => setAttachments(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          />
          <p className="text-xs text-gray-500 mt-1">Reference documents ONLY. No physical file uploads.</p>
        </div>
      </section>

      <div className="pt-4 border-t flex justify-end">
        <button 
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
        >
          Save to Document Library
        </button>
      </div>
    </div>
  );
};
