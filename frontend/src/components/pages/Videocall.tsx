import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  StreamVideoClient, 
  StreamVideo, 
  StreamCall, 
  StreamTheme, 
  Call,
  CallControls,
  SpeakerLayout
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import '../../styles/videocall.css'

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

const tokenProvider = async (userId: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/token`, {
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
  const [copySuccess, setCopySuccess] = useState<string>('');
  const { callId } = useParams<{ callId?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const userId = `user-${Math.random().toString(16).substring(2)}`;

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

  const copyCallLinkToClipboard = () => {
    const callLink = `${window.location.origin}/videocall/${call?.id}`;
    navigator.clipboard.writeText(callLink)
      .then(() => {
        setCopySuccess('Call link copied to clipboard!');
        setTimeout(() => setCopySuccess(''), 3000); // Clear the message after 3 seconds
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        setCopySuccess('Failed to copy call link');
      });
  };

  if (!client) return <div>Loading...</div>;

  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <div>
          {!call ? (
            <div className="video-call-lobby">
            <div className="video-placeholder"></div>
            <div className="button-container">
              <button className="call-button" onClick={createMeeting}>Create Meeting</button>
              <button 
                className="call-button"
                onClick={() => {
                  const meetingId = prompt("Enter meeting ID:");
                  if (meetingId) navigate(`/videocall/${meetingId}`);
                }}
              >
                Join Meeting
              </button>
            </div>
          </div>
          ) : (
            <StreamCall call={call}>
              <SpeakerLayout />
              <div className='flex justify-center align-center'>
                <CallControls onLeave={() => navigate(`/dashboard`)} >
                </CallControls>
                <button className='copy-link-button' onClick={copyCallLinkToClipboard}>
                  Copy Link
                </button>
              </div>
              

              
              {copySuccess && <p>{copySuccess}</p>}
            </StreamCall>
          )}
        </div>
      </StreamTheme>
    </StreamVideo>
  );
};

export default VideoCall;