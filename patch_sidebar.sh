#!/bin/bash
awk '
/Mutu & Kepatuhan/ {
    print "          {import.meta.env.VITE_ENABLE_SUPERVISION_MODULE === \x27true\x27 && ("
    print "            <>"
    print "              <div className=\"text-xs font-bold text-[var(--color-eds-text-secondary)] mt-6 mb-2 px-3 uppercase tracking-wider\">Mutu Pendidikan</div>"
    print "              <button"
    print "                onClick={() => setCurrentView(\"supervisiAkademik\")}"
    print "                className={`enterprise-sidebar-item ${currentView === \"supervisiAkademik\" ? \"active\" : \"\"}`}"
    print "              >"
    print "                <Stethoscope className=\"enterprise-sidebar-icon\" />"
    print "                Supervisi Akademik"
    print "              </button>"
    print "            </>"
    print "          )}"
}
{ print $0 }
' src/Tampuyak.tsx > src/Tampuyak.tsx.tmp
mv src/Tampuyak.tsx.tmp src/Tampuyak.tsx
