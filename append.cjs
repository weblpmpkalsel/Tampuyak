const fs = require('fs');

const jsx = `
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
              className={\`w-full text-left px-3 py-2 text-sm rounded-lg font-medium transition-all duration-200 \${
                activeSection === item.id 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }\`}
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
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={knowledge.payload.educationLevel}
                    onChange={(e) => handleUpdate('educationLevel', e.target.value)}
                    placeholder="mis., Sekolah Dasar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fase</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={knowledge.payload.phase}
                    onChange={(e) => handleUpdate('phase', e.target.value)}
                    placeholder="mis., Fase A, B, dan C"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kurikulum</label>
                  <input 
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
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    value={learningLoad.payload.educationLevel}
                    onChange={(e) => handleLearningLoadUpdate('educationLevel', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fase</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    value={learningLoad.payload.phase}
                    onChange={(e) => handleLearningLoadUpdate('phase', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year</label>
                  <input 
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
                  <textarea 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px] bg-white"
                    value={learningOrganization.payload.educationalPhilosophy}
                    onChange={(e) => handleLearningOrganizationUpdate('educationalPhilosophy', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prinsip Pembelajaran</label>
                  <textarea 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px] bg-white"
                    value={learningOrganization.payload.learningPrinciples}
                    onChange={(e) => handleLearningOrganizationUpdate('learningPrinciples', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Strategi Implementasi</label>
                  <textarea 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px] bg-white"
                    value={learningOrganization.payload.implementationStrategy}
                    onChange={(e) => handleLearningOrganizationUpdate('implementationStrategy', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assessment Approach</label>
                  <textarea 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px] bg-white"
                    value={learningOrganization.payload.assessmentApproach}
                    onChange={(e) => handleLearningOrganizationUpdate('assessmentApproach', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Responsible Unit</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      value={learningOrganization.payload.responsibleUnit}
                      onChange={(e) => handleLearningOrganizationUpdate('responsibleUnit', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Learners</label>
                    <input 
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
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={subject.subjectName}
                            onChange={(e) => handleUpdateSubject(index, 'subjectName', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Pendekatan Pembelajaran</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={subject.learningApproach}
                            onChange={(e) => handleUpdateSubject(index, 'learningApproach', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Jam Pelajaran Mingguan (JP)</label>
                          <input 
                            type="number" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={subject.weeklyLearningHours}
                            onChange={(e) => handleUpdateSubject(index, 'weeklyLearningHours', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Jam Pelajaran Tahunan (JP)</label>
                          <input 
                            type="number" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={subject.annualLearningHours}
                            onChange={(e) => handleUpdateSubject(index, 'annualLearningHours', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Fase</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={subject.phase}
                            onChange={(e) => handleUpdateSubject(index, 'phase', e.target.value)}
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
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    value={cocurricular.payload.programIdentity}
                    onChange={(e) => handleCocurricularUpdate('programIdentity', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tujuan</label>
                  <textarea 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-h-[80px]"
                    value={cocurricular.payload.objectives}
                    onChange={(e) => handleCocurricularUpdate('objectives', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Strategi Asesmen</label>
                    <textarea 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-h-[80px]"
                      value={cocurricular.payload.assessment}
                      onChange={(e) => handleCocurricularUpdate('assessment', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Strategi Refleksi</label>
                    <textarea 
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
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={activity.activityName}
                            onChange={(e) => handleUpdateActivity(index, 'activityName', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Target Fase</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={activity.targetFase}
                            onChange={(e) => handleUpdateActivity(index, 'targetFase', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Waktu Pelaksanaan</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={activity.implementationTime}
                            onChange={(e) => handleUpdateActivity(index, 'implementationTime', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                          <input 
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
                      <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" value={prog.name} onChange={(e) => handleExtracurricularChange('mandatoryPrograms', idx, 'name', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                      <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" value={prog.description} onChange={(e) => handleExtracurricularChange('mandatoryPrograms', idx, 'description', e.target.value)} />
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
                      <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" value={prog.name} onChange={(e) => handleExtracurricularChange('optionalPrograms', idx, 'name', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                      <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" value={prog.description} onChange={(e) => handleExtracurricularChange('optionalPrograms', idx, 'description', e.target.value)} />
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
                  <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" value={academicCalendar.academicYear} onChange={(e) => handleCalendarUpdate('academicYear', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Catatan Tambahan</label>
                  <textarea className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-h-[80px]" value={academicCalendar.notes} onChange={(e) => handleCalendarUpdate('notes', e.target.value)} />
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
`;

fs.appendFileSync('src/enterprise/workspace/modules/CurriculumHubModule.tsx', jsx);
