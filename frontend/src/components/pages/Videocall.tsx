import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  StreamVideoClient, 
  StreamVideo, 
  StreamCall, 
  StreamTheme, 
  Call,
  CallControls,
  SpeakerLayout,
  CallState
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';

const apiKey = '7bcxwk7s8xjv';

const tokenProvider = async (userId: string) => {
  try {
    const response = await fetch('http://localhost:7000/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch token');
    }

    const { token } = await response.json();
    return token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
};

const VideoCall: React.FC = () => {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const { callId } = useParams<{ callId?: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    const userId = `user-${Math.random().toString(16).substring(2)}`; // Example user ID

    const init = async () => {
      try {
        const token = await tokenProvider(userId);
        const streamClient = new StreamVideoClient({ apiKey, user: { id: userId }, token });
        setClient(streamClient);

        if (callId) {
          console.log(`Joining call with ID: ${callId}`);
          await joinCall(callId, streamClient);
        }
      } catch (error) {
        console.error('Error initializing video call:', error);
      }
    };

    init();

    return () => {
      if (client) {
        console.log('Cleaning up...');
        if (call) {
          call.leave().catch((err) => console.error('Failed to leave the call', err));
        }
        client.disconnectUser();
      }
    };
  }, []);

  const createMeeting = async () => {
    if (!client) return;
    try {
      const newCallId = `meeting-${Date.now()}`;
      console.log(`Creating new call with ID: ${newCallId}`);
      const newCall = client.call('default', newCallId);
      await newCall.join({ create: true }).catch((err) => {
        console.error(`Failed to join the call`, err);
      });
      setCall(newCall);
      navigate(`/videocall/${newCallId}`);
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  const joinCall = async (callId: string, clientToUse: StreamVideoClient) => {
    if (!clientToUse) return;
    try {
      const newCall = clientToUse.call('default', callId);
      await newCall.join();
      setCall(newCall);

    } catch (error) {
      console.error(`Error joining call with ID ${callId}:`, error);
    }
  };

  if (!client) return <div>Loading...</div>;

  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <div>
          {!call ? (
            <div>
              <button onClick={createMeeting}>Create Meeting</button>
              <button onClick={() => {
                const meetingId = prompt("Enter meeting ID:");
                if (meetingId) navigate(`/videocall/${meetingId}`);
              }}>Join Meeting</button>
            </div>
          ) : (
            <StreamCall call={call}>
              <SpeakerLayout />
              <CallControls onLeave={() => navigate(`/dashboard`)}/>
            </StreamCall>
          )}
        </div>
      </StreamTheme>
    </StreamVideo>
  );
};

export default VideoCall;
