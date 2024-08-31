import React, { useEffect, useState } from 'react';
import {
  Call,
  CallParticipantsList,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
//import { CallParticipant } from "@stream-io/video-client";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import jwtDecode from "jwt-decode";

const apiKey = '7bcxwk7s8xjv';
const callId = 'your_call_id_here'; 

interface UserInfo {
  id: string;
  name: string;
}

function App() {
    const participants = Array.from(call.participants.values());
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [client, setClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    const Localtoken = localStorage.getItem("authToken");
    if (Localtoken) {
      try {
        const dataInfo = jwtDecode(Localtoken) as UserInfo;
        setUserInfo(dataInfo);
      } catch (err) {
        console.log('Error decoding token:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (!userInfo) return;
    const Localtoken = localStorage.getItem("authToken");
    if (!Localtoken) return;

    const myClient = new StreamVideoClient({
      apiKey,
      user: userInfo,
      token: Localtoken
    });
    setClient(myClient);

    return () => {
      myClient.disconnectUser();
      setClient(null);
    };
  }, [userInfo]);

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <StreamVideo client={client}>
      <VideoCall callId={callId} />
    </StreamVideo>
  );
}

interface VideoCallProps {
  callId: string;
}

function VideoCall({ callId }: VideoCallProps) {
  const [call, setCall] = useState<Call | null>(null);
  const { useCall } = useCallStateHooks();
  const activeCall = useCall();

  useEffect(() => {
    if (!activeCall) {
      const call = client.call('default', callId);
      call.join({ create: true }).catch((err) => {
        console.error('Failed to join the call:', err);
      });
      setCall(call);
    } else {
      setCall(activeCall);
    }
  }, [activeCall, callId]);

  if (!call) {
    return <div>Joining call...</div>;
  }

  return (
    <div>
      <CallControls call={call} />
      <Participants call={call} />
    </div>
  );
}

interface CallControlsProps {
  call: Call;
}

function CallControls({ call }: CallControlsProps) {
  return (
    <div>
      <button onClick={() => call.microphone.toggle()}>Toggle Mic</button>
      <button onClick={() => call.camera.toggle()}>Toggle Camera</button>
      <button onClick={() => call.leave()}>Leave Call</button>
    </div>
  );
}

interface ParticipantsProps {
  call: Call;
}

function Participants({ call }: ParticipantsProps) {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  return (
    <div>
      {participants.map((participant) => (
        <VideoView key={participant.sessionId} participant={participant} />
      ))}
    </div>
  );
}

interface VideoViewProps {
  participant: CallParticipant;
}

function VideoView({ participant }: VideoViewProps) {
  return (
    <div>
      <video
        ref={(el) => {
          if (el) participant.videoTrack?.attach(el);
        }}
        autoPlay
        muted={participant.isLocalParticipant}
      />
      <div>{participant.name}</div>
    </div>
  );
}

export default App;