import { 
  Call, 
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

interface CallControlsProps {
  call: Call;
}

function CallControls({ call }: CallControlsProps) {
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const micState = useMicrophoneState();
  const cameraState = useCameraState();

  const toggleMic = () => {
    if (micState.isEnabled) {
      micState.microphone.disable();
    } else {
      micState.microphone.enable();
    }
  };

  const toggleCamera = () => {
    if (cameraState.isEnabled) {
      cameraState.camera.disable();
    } else {
      cameraState.camera.enable();
    }
  };

  return (
    <div>
      <button onClick={toggleMic}>
        {micState.isEnabled ? 'Mute' : 'Unmute'}
      </button>
      <button onClick={toggleCamera}>
        {cameraState.isEnabled ? 'Disable Camera' : 'Enable Camera'}
      </button>
      <button onClick={() => call.leave()}>Leave Call</button>
    </div>
  );
}

export default CallControls;