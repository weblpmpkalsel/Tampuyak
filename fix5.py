with open("src/Tampuyak.tsx", "r") as f:
    content = f.read()

replacement = """      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous={true}
        onEvent={handleJoyrideCallback}
        options={{
          primaryColor: '#2563eb',
          zIndex: 10000,
          showProgress: true,
        }}
        locale={{
          back: 'Kembali',
          close: 'Tutup',
          last: 'Selesai',
          next: 'Lanjut',
        }}
      />"""

content = content.replace("""      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        onEvent={handleJoyrideCallback}
        primaryColor="#2563eb"
        zIndex={10000}
        locale={{
          back: 'Kembali',
          close: 'Tutup',
          last: 'Selesai',
          next: 'Lanjut',
          skip: 'Lewati',
        }}
      />""", replacement)

with open("src/Tampuyak.tsx", "w") as f:
    f.write(content)
