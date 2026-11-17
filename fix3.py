with open("src/Tampuyak.tsx", "r") as f:
    content = f.read()

replacement = """  return (
    <>
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#2563eb',
            zIndex: 10000,
          },
        }}
        locale={{
          back: 'Kembali',
          close: 'Tutup',
          last: 'Selesai',
          next: 'Lanjut',
          skip: 'Lewati',
        }}
      />
      <div id="print-guard" className="hidden print:flex fixed inset-0 items-center justify-center bg-white text-black text-2xl font-bold z-[9999]">"""

content = content.replace("""  return (
    <>
      <div id="print-guard" className="hidden print:flex fixed inset-0 items-center justify-center bg-white text-black text-2xl font-bold z-[9999]">""", replacement)

with open("src/Tampuyak.tsx", "w") as f:
    f.write(content)
