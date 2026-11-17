import React, { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export function EnterpriseUpdateManager() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('PWA Audit: onRegistered fired', r);
      // SW Registered
    },
    onRegisterError(error) {
      console.error('PWA Audit: onRegisterError fired', error);
    },
    onNeedRefresh() {
      console.log('PWA Audit: onNeedRefresh fired! A new service worker is waiting.');
    },
    onOfflineReady() {
      console.log('PWA Audit: onOfflineReady fired!');
    },
  });

  useEffect(() => {
    console.log('PWA Audit: EnterpriseUpdateManager mounted');
  }, []);

  useEffect(() => {
    console.log(`PWA Audit: State changed - offlineReady: ${offlineReady}, needRefresh: ${needRefresh}`);
  }, [offlineReady, needRefresh]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  console.log('PWA Audit: Rendering update banner (offlineReady or needRefresh is true)');

  return (
    <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <span className="text-xl">🚀</span>
            </div>
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-slate-900">
              TAMPUYAK OS Enterprise
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {offlineReady
                ? 'Offline Ready'
                : 'Versi terbaru tersedia.'}
            </p>
            {needRefresh && (
              <div className="mt-3 flex space-x-3">
                <button
                  onClick={() => updateServiceWorker(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Muat Ulang
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={close}
              className="bg-white rounded-md inline-flex text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Tutup</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
