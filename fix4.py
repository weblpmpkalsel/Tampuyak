with open("src/Tampuyak.tsx", "r") as f:
    content = f.read()

content = content.replace('import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";', 'import { Joyride, Step, EventData, STATUS } from "react-joyride";')
content = content.replace('const handleJoyrideCallback = (data: CallBackProps) => {', 'const handleJoyrideCallback = (data: EventData) => {')
content = content.replace('callback={handleJoyrideCallback}', 'onEvent={handleJoyrideCallback}')
content = content.replace('disableBeacon: true,', 'skipBeacon: true,')

with open("src/Tampuyak.tsx", "w") as f:
    f.write(content)
