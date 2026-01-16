"use client";
import { useEffect, useRef, useState } from "react";

export default function VideoCall() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const callRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [localAudioEnabled, setLocalAudioEnabled] = useState(true);
  const [localVideoEnabled, setLocalVideoEnabled] = useState(true);
  const [status, setStatus] = useState("Initializing...");
  const [myPeerId, setMyPeerId] = useState(null);
  const [partnerPeerId, setPartnerPeerId] = useState(null);
  const [waitingRoom, setWaitingRoom] = useState([]);

  useEffect(() => {
    loadPeerJS();
  }, []);

  const loadPeerJS = () => {
    // Load PeerJS from CDN
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js';
    script.onload = () => {
      console.log('PeerJS loaded');
      initializePeer();
    };
    document.head.appendChild(script);
  };

  const initializePeer = async () => {
    try {
      setStatus("Connecting to server...");

      // Get Metered.ca TURN servers
      const iceServers = await fetchMeteredServers();

      // Create Peer connection with PeerJS free cloud server
      const peer = new window.Peer({
        config: {
          iceServers: iceServers
        }
      });

      peerRef.current = peer;

      peer.on('open', (id) => {
        console.log('My peer ID:', id);
        setMyPeerId(id);
        setStatus("Getting camera access...");
        setupMedia();
      });

      peer.on('call', async (call) => {
        console.log('Receiving call from:', call.peer);
        setPartnerPeerId(call.peer);
        setStatus("Incoming call! Connecting...");
        setIsConnecting(true);
        
        if (!localStream) {
          const stream = await getMediaStream();
          call.answer(stream);
        } else {
          call.answer(localStream);
        }
        
        handleCall(call);
      });

      peer.on('error', (error) => {
        console.error('Peer error:', error);
        setStatus(`Error: ${error.type}`);
      });

      peer.on('disconnected', () => {
        setStatus("Disconnected. Reconnecting...");
        peer.reconnect();
      });

    } catch (error) {
      console.error('Initialize error:', error);
      setStatus("Error: " + error.message);
    }
  };

  const getMediaStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        width: { ideal: 1280 }, 
        height: { ideal: 720 },
        facingMode: "user"
      },
      audio: { 
        echoCancellation: true, 
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    
    setLocalStream(stream);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    
    return stream;
  };

  const setupMedia = async () => {
    try {
      await getMediaStream();
      setStatus("Ready! Share your ID or enter partner's ID");
      
      // Auto-connect to waiting room
      joinWaitingRoom();
    } catch (error) {
      console.error('Media error:', error);
      setStatus("Camera/Mic access denied");
    }
  };

  const joinWaitingRoom = () => {
    // Use a shared room ID for random matching
    const roomId = 'telemedicine-waiting-room';
    
    // Store peer ID in localStorage for matching
    const waitingPeers = JSON.parse(localStorage.getItem(roomId) || '[]');
    
    // Filter out expired peers (older than 1 minute)
    const now = Date.now();
    const activePeers = waitingPeers.filter(p => now - p.timestamp < 60000 && p.id !== myPeerId);
    
    if (activePeers.length > 0) {
      // Connect to the first available peer
      const partner = activePeers[0];
      connectToPeer(partner.id);
      
      // Remove partner from waiting room
      const updatedPeers = activePeers.filter(p => p.id !== partner.id);
      localStorage.setItem(roomId, JSON.stringify(updatedPeers));
    } else {
      // Add self to waiting room
      waitingPeers.push({ id: myPeerId, timestamp: now });
      localStorage.setItem(roomId, JSON.stringify(waitingPeers));
      setStatus("Waiting for a partner...");
      
      // Check for partners every 2 seconds
      const checkInterval = setInterval(() => {
        const currentPeers = JSON.parse(localStorage.getItem(roomId) || '[]');
        const available = currentPeers.filter(p => 
          Date.now() - p.timestamp < 60000 && 
          p.id !== myPeerId &&
          !partnerPeerId
        );
        
        if (available.length > 0) {
          clearInterval(checkInterval);
          const partner = available[0];
          connectToPeer(partner.id);
          
          // Remove both from waiting room
          const updatedPeers = currentPeers.filter(p => p.id !== partner.id && p.id !== myPeerId);
          localStorage.setItem(roomId, JSON.stringify(updatedPeers));
        }
      }, 2000);
      
      // Clean up interval after 5 minutes
      setTimeout(() => clearInterval(checkInterval), 300000);
    }
  };

  const connectToPeer = (peerId) => {
    if (!localStream || !peerRef.current) return;
    
    setPartnerPeerId(peerId);
    setStatus("Calling partner...");
    setIsConnecting(true);
    
    const call = peerRef.current.call(peerId, localStream);
    handleCall(call);
  };

  const handleCall = (call) => {
    callRef.current = call;
    
    call.on('stream', (remoteStream) => {
      console.log('Received remote stream');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        setIsConnected(true);
        setIsConnecting(false);
        setStatus("Connected");
      }
    });

    call.on('close', () => {
      console.log('Call ended');
      setIsConnected(false);
      setStatus("Call ended");
      setPartnerPeerId(null);
    });

    call.on('error', (error) => {
      console.error('Call error:', error);
      setStatus("Call error");
      setIsConnecting(false);
    });
  };

  const fetchMeteredServers = async () => {
    try {
      const response = await fetch(
        "https://videoamexan.metered.live/api/v1/turn/credentials?apiKey=7e093594fec298edaac63a02a2ce931f5f55"
      );
      
      if (response.ok) {
        const servers = await response.json();
        console.log("✅ Loaded Metered.ca TURN servers");
        return servers;
      }
    } catch (error) {
      console.log("⚠️ Using hardcoded credentials");
    }

    return [
      { urls: "stun:stun.relay.metered.ca:80" },
      {
        urls: "turn:global.relay.metered.ca:80",
        username: "4b71bece57147d0a4cf7f62b",
        credential: "cRhpdVg4vumYTfZi",
      },
      {
        urls: "turn:global.relay.metered.ca:80?transport=tcp",
        username: "4b71bece57147d0a4cf7f62b",
        credential: "cRhpdVg4vumYTfZi",
      },
      {
        urls: "turn:global.relay.metered.ca:443",
        username: "4b71bece57147d0a4cf7f62b",
        credential: "cRhpdVg4vumYTfZi",
      },
      {
        urls: "turns:global.relay.metered.ca:443?transport=tcp",
        username: "4b71bece57147d0a4cf7f62b",
        credential: "cRhpdVg4vumYTfZi",
      },
    ];
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setLocalAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setLocalVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const endCall = () => {
    if (callRef.current) {
      callRef.current.close();
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    // Clear from waiting room
    const roomId = 'telemedicine-waiting-room';
    const waitingPeers = JSON.parse(localStorage.getItem(roomId) || '[]');
    const updated = waitingPeers.filter(p => p.id !== myPeerId);
    localStorage.setItem(roomId, JSON.stringify(updated));
    
    window.location.reload();
  };

  const copyPeerId = () => {
    if (myPeerId) {
      navigator.clipboard.writeText(myPeerId);
      setStatus("ID copied! Share with partner");
      setTimeout(() => {
        setStatus(partnerPeerId ? "Connected" : "Waiting for partner...");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🏥</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Telemedicine</h1>
                <p className="text-xs text-gray-500">Secure Video Consultation</p>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              isConnected ? 'bg-green-100 text-green-700' : 
              isConnecting ? 'bg-yellow-100 text-yellow-700' : 
              'bg-gray-100 text-gray-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500 animate-pulse' : 
                isConnecting ? 'bg-yellow-500 animate-pulse' : 
                'bg-gray-400'
              }`}></div>
              {status}
            </div>
          </div>
          
          {/* Peer ID Display */}
          {myPeerId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-blue-600 font-medium mb-1">Your ID (optional - auto-matching enabled)</p>
                  <p className="text-sm font-mono text-blue-900 truncate">{myPeerId}</p>
                </div>
                <button
                  onClick={copyPeerId}
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md font-medium whitespace-nowrap"
                >
                  📋 Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Remote Video */}
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline
              className="w-full h-full object-cover"
            />
            {!isConnected && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center px-4">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-700/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-5xl">👤</span>
                  </div>
                  <p className="text-white text-lg font-medium mb-2">{status}</p>
                  <p className="text-gray-400 text-sm">Auto-matching with available users...</p>
                  {isConnecting && (
                    <div className="mt-6">
                      <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-600 border-t-blue-500"></div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium">
              {partnerPeerId ? `Partner: ${partnerPeerId.substring(0, 10)}...` : 'Waiting...'}
            </div>
          </div>

          {/* Local Video */}
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <video 
              ref={localVideoRef} 
              autoPlay 
              muted 
              playsInline
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {!localVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-5xl">📹</span>
                </div>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium">
              You
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleAudio}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                localAudioEnabled 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              <span className="text-3xl">{localAudioEnabled ? '🎤' : '🔇'}</span>
            </button>

            <button
              onClick={toggleVideo}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                localVideoEnabled 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              <span className="text-3xl">{localVideoEnabled ? '📹' : '📷'}</span>
            </button>

            <button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
            >
              <span className="text-3xl">📞</span>
            </button>
          </div>
          
          <p className="text-center text-xs text-gray-500 mt-4">
            Powered by PeerJS & Metered.ca • End-to-end encrypted
          </p>
        </div>
      </div>
    </div>
  );
}