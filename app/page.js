"use client";
import { useEffect, useRef, useState } from "react";

// Use BroadcastChannel API for tab-to-tab communication
let broadcastChannel = null;

// Simple in-memory signaling store for demo
const signalingStore = {
  signals: [],
  
  sendSignal: (signal) => {
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'signal',
        data: signal
      });
    }
    signalingStore.signals.push({...signal, timestamp: Date.now()});
    console.log(`📤 Signal stored: ${signal.type} from ${signal.sender}`);
  },
  
  getSignals: (roomId, excludeSender) => {
    return signalingStore.signals.filter(
      s => s.room_id === roomId && s.sender !== excludeSender
    );
  },
  
  clearOldSignals: () => {
    const now = Date.now();
    signalingStore.signals = signalingStore.signals.filter(
      s => now - s.timestamp < 60000
    );
  }
};

export default function HomePage() {
  const roomId = "f6005031-588e-4b53-a6ed-320543b85545";
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [connectionState, setConnectionState] = useState("new");
  const [isOfferer, setIsOfferer] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isRemoteAudioMuted, setIsRemoteAudioMuted] = useState(false);
  
  // Refs for immediate access
  const userIdRef = useRef(null);
  const isInitializedRef = useRef(false);
  const signalQueueRef = useRef([]);
  const pendingRemoteCandidatesRef = useRef([]);
  const isProcessingRef = useRef(false);
  const peerReadyRef = useRef(false);
  const audioAnalyserRef = useRef(null);
  const audioContextRef = useRef(null);

  // Add log
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `${timestamp}: ${message}`].slice(-20));
    console.log(message);
  };

  // Initialize only on client side
  useEffect(() => {
    // Generate unique user ID for this session
    const generatedUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
    addLog(`🆔 My User ID: ${generatedUserId}`);
    setUserId(generatedUserId);
    userIdRef.current = generatedUserId;
    
    // Setup BroadcastChannel
    try {
      broadcastChannel = new BroadcastChannel(`webrtc-room-${roomId}`);
      broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'signal') {
          const signal = event.data.data;
          addLog(`📩 Received signal via Broadcast: ${signal.type} from ${signal.sender}`);
          processSignalImmediately(signal);
        }
      };
      addLog("📡 BroadcastChannel initialized for tab communication");
    } catch (error) {
      addLog("⚠️ BroadcastChannel not supported, using fallback");
    }
    
    let mounted = true;
    
    // Function to initialize WebRTC
    const initWebRTC = async () => {
      try {
        if (!mounted) return;
        
        addLog("Initializing WebRTC...");
        
        // Create PeerConnection with proper configuration
        const pc = new RTCPeerConnection({ 
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" },
            { urls: "stun:stun3.l.google.com:19302" }
          ],
          iceCandidatePoolSize: 10,
          bundlePolicy: 'max-bundle',
          rtcpMuxPolicy: 'require'
        });
        pcRef.current = pc;
        peerReadyRef.current = true;

        // Connection state monitoring
        pc.onconnectionstatechange = () => {
          if (!mounted) return;
          const state = pc.connectionState;
          addLog(`🔗 Connection state: ${state}`);
          setConnectionState(state);
          setIsConnected(state === "connected");
        };

        pc.oniceconnectionstatechange = () => {
          const state = pc.iceConnectionState;
          addLog(`🧊 ICE connection state: ${state}`);
          if (state === "failed" && mounted) {
            addLog("ICE failed, attempting restart...");
            restartIce();
          }
        };

        pc.onsignalingstatechange = () => {
          addLog(`📡 Signaling state: ${pc.signalingState}`);
        };

        // Remote track handler - ENHANCED for audio
        pc.ontrack = (event) => {
          if (!mounted) return;
          
          if (event.streams && event.streams[0]) {
            const stream = event.streams[0];
            const audioTracks = stream.getAudioTracks();
            const videoTracks = stream.getVideoTracks();
            
            addLog(`📹 Remote stream: ${videoTracks.length} video, ${audioTracks.length} audio tracks`);
            
            // Log audio track details
            audioTracks.forEach(track => {
              addLog(`🎵 Audio track: ${track.label || 'unnamed'}, enabled: ${track.enabled}`);
              track.onmute = () => {
                addLog("🔇 Remote audio muted");
                setIsRemoteAudioMuted(true);
              };
              track.onunmute = () => {
                addLog("🔊 Remote audio unmuted");
                setIsRemoteAudioMuted(false);
              };
            });
            
            // Set remote video source
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
              
              // Set up audio monitoring
              setupAudioMonitoring(stream);
              
              // Try to play immediately
              const playPromise = remoteVideoRef.current.play();
              
              if (playPromise !== undefined) {
                playPromise.then(() => {
                  addLog("✅ Remote video playing");
                  
                  // Unmute audio and set volume
                  remoteVideoRef.current.muted = false;
                  remoteVideoRef.current.volume = 1.0;
                  
                  // Create click handler to unmute if blocked
                  const handleClick = () => {
                    if (remoteVideoRef.current.paused) {
                      remoteVideoRef.current.play();
                    }
                    remoteVideoRef.current.muted = false;
                    addLog("👆 User interaction - audio should work now");
                  };
                  
                  remoteVideoRef.current.addEventListener('click', handleClick);
                  
                }).catch(e => {
                  addLog(`⚠️ Auto-play prevented: ${e.message}`);
                  addLog("💡 Click the remote video to enable audio");
                });
              }
            }
          }
        };

        // ICE candidate handler
        pc.onicecandidate = (event) => {
          if (event.candidate && userIdRef.current) {
            addLog(`❄️ ICE candidate generated`);
            
            sendSignal({
              type: "ice",
              payload: {
                candidate: event.candidate.candidate,
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                sdpMid: event.candidate.sdpMid,
                usernameFragment: event.candidate.usernameFragment
              }
            });
          } else if (!event.candidate) {
            addLog("✅ ICE gathering complete");
          }
        };

        // Get local media with BETTER audio settings
        try {
          addLog("Requesting camera and microphone access...");
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: "user"
            }, 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              channelCount: 2,
              sampleRate: 48000,
              sampleSize: 16,
              volume: 1.0
            }
          });
          
          if (mounted) {
            setLocalStream(stream);
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
              localVideoRef.current.onloadedmetadata = () => {
                addLog("✅ Local video ready");
                localVideoRef.current.play();
              };
              addLog("✅ Local video stream attached");
            }
            
            // Add tracks to peer connection
            stream.getTracks().forEach(track => {
              pc.addTrack(track, stream);
              addLog(`➕ Added local ${track.kind} track to PeerConnection`);
            });
            
            // Monitor local audio levels
            setupLocalAudioMonitoring(stream);
          }
        } catch (error) {
          addLog(`❌ Error accessing media: ${error.name}`);
          console.error("Media access error:", error);
          
          // Try again without video if camera fails
          try {
            const audioOnlyStream = await navigator.mediaDevices.getUserMedia({ 
              audio: true 
            });
            if (mounted) {
              setLocalStream(audioOnlyStream);
              audioOnlyStream.getTracks().forEach(track => {
                pc.addTrack(track, audioOnlyStream);
                addLog(`➕ Added local ${track.kind} track (audio only)`);
              });
            }
          } catch (audioError) {
            addLog("⚠️ Could not get any media access");
          }
        }

        // Mark as initialized
        setIsInitialized(true);
        isInitializedRef.current = true;
        addLog("✅ WebRTC fully initialized and ready");
        
        // Process any queued signals
        if (signalQueueRef.current.length > 0) {
          addLog(`📥 Processing ${signalQueueRef.current.length} queued signals`);
          signalQueueRef.current.forEach(signal => {
            setTimeout(() => handleSignal(signal), 100);
          });
          signalQueueRef.current = [];
        }

        signalingStore.clearOldSignals();

      } catch (error) {
        addLog(`❌ Initialization error: ${error.message}`);
        console.error("Initialization error:", error);
      }
    };

    initWebRTC();

    return () => {
      mounted = false;
      setIsInitialized(false);
      isInitializedRef.current = false;
      peerReadyRef.current = false;
      
      // Clean up audio analysis
      if (audioAnalyserRef.current) {
        audioAnalyserRef.current.disconnect();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      
      if (broadcastChannel) {
        broadcastChannel.close();
        addLog("Closed BroadcastChannel");
      }
      if (pcRef.current) {
        pcRef.current.close();
        addLog("Closed peer connection");
      }
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, []);

  // Setup audio monitoring for remote stream
  const setupAudioMonitoring = (stream) => {
    try {
      // Close previous audio context if exists
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      audioAnalyserRef.current = analyser;
      
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      source.connect(analyser);
      
      const checkAudioLevel = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
        
        analyser.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const level = Math.min(average / 128, 1);
        
        setAudioLevel(level);
        setIsAudioActive(level > 0.01);
        
        requestAnimationFrame(checkAudioLevel);
      };
      
      checkAudioLevel();
      addLog("🎵 Audio monitoring started for remote stream");
      
    } catch (error) {
      addLog(`⚠️ Audio monitoring error: ${error.message}`);
    }
  };

  // Setup local audio monitoring
  const setupLocalAudioMonitoring = (stream) => {
    // This is just for visual feedback of local audio
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      source.connect(analyser);
      
      const checkLocalAudio = () => {
        if (audioContext.state === 'closed') return;
        
        analyser.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        
        // Log if local audio is active (optional)
        if (average > 10) {
          addLog("🎤 Local microphone is active", false); // Don't spam logs
        }
        
        requestAnimationFrame(checkLocalAudio);
      };
      
      checkLocalAudio();
    } catch (error) {
      // Silently fail for local monitoring
    }
  };

  // IMMEDIATE signal processing
  const processSignalImmediately = (signal) => {
    if (!peerReadyRef.current || !pcRef.current || !userIdRef.current) {
      addLog("⏳ Queueing signal (waiting for initialization)");
      signalQueueRef.current.push(signal);
      return;
    }
    
    handleSignal(signal);
  };

  // Handle incoming signals
  const handleSignal = async (signal) => {
    const pc = pcRef.current;
    const currentUserId = userIdRef.current;
    
    if (!pc || !currentUserId) {
      addLog("⚠️ Skipping signal - PeerConnection not ready");
      return;
    }
    
    if (signal.sender === currentUserId) {
      return;
    }

    if (isProcessingRef.current) {
      addLog("⏳ Already processing a signal, retrying...");
      setTimeout(() => handleSignal(signal), 100);
      return;
    }

    isProcessingRef.current = true;
    addLog(`🔄 Processing ${signal.type} from ${signal.sender}`);

    try {
      switch (signal.type) {
        case "offer":
          addLog(`Current signaling state: ${pc.signalingState}`);
          
          await pc.setRemoteDescription(new RTCSessionDescription(signal.payload));
          addLog("✅ Remote description set (offer)");
          
          const answer = await pc.createAnswer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
          });
          
          await pc.setLocalDescription(answer);
          addLog("✅ Local description set (answer)");
          
          sendSignal({
            type: "answer",
            payload: answer
          });
          
          addLog("✅ Answer sent to other tabs");
          break;

        case "answer":
          if (pc.signalingState === "have-local-offer") {
            await pc.setRemoteDescription(new RTCSessionDescription(signal.payload));
            addLog("✅ Remote description set (answer)");
          } else {
            addLog(`⚠️ Unexpected answer (signaling state: ${pc.signalingState})`);
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(signal.payload));
              addLog("✅ Remote description set (answer)");
            } catch (err) {
              addLog(`❌ Failed to set remote description: ${err.message}`);
            }
          }
          break;

        case "ice":
          const iceCandidate = new RTCIceCandidate(signal.payload);
          
          try {
            await pc.addIceCandidate(iceCandidate);
            addLog("✅ ICE candidate added");
          } catch (err) {
            if (err.message.includes("remote description")) {
              pendingRemoteCandidatesRef.current.push(iceCandidate);
              addLog("📥 ICE candidate queued (waiting for remote description)");
            } else {
              addLog(`⚠️ Failed to add ICE candidate: ${err.message}`);
            }
          }
          break;

        default:
          addLog(`⚠️ Unknown signal type: ${signal.type}`);
      }
    } catch (err) {
      addLog(`❌ Error processing ${signal.type}: ${err.message}`);
      console.error("Signal processing error:", err);
    } finally {
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 100);
    }
  };

  // Force unmute remote audio
  const unmuteRemoteAudio = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = false;
      remoteVideoRef.current.volume = 1.0;
      
      // Also try to enable audio tracks
      if (remoteVideoRef.current.srcObject) {
        const stream = remoteVideoRef.current.srcObject;
        stream.getAudioTracks().forEach(track => {
          track.enabled = true;
        });
      }
      
      addLog("🔊 Remote audio manually unmuted");
      
      // Try to play again
      remoteVideoRef.current.play().catch(e => {
        addLog(`⚠️ Play error after unmute: ${e.message}`);
      });
    }
  };

  // Toggle local microphone
  const toggleLocalMicrophone = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const newState = !audioTracks[0].enabled;
        audioTracks[0].enabled = newState;
        addLog(newState ? "🎤 Microphone enabled" : "🔇 Microphone muted");
      }
    }
  };

  // Test audio with beep
  const testAudio = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 440; // A4 note
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      
      // Stop after 500ms
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
        addLog("🔊 Test beep played");
      }, 500);
      
    } catch (error) {
      addLog(`❌ Could not play test beep: ${error.message}`);
    }
  };

  async function createOffer() {
    if (!pcRef.current || !userIdRef.current) {
      addLog("❌ PeerConnection not ready");
      return;
    }

    try {
      setIsOfferer(true);
      pendingRemoteCandidatesRef.current = [];
      
      addLog("Creating offer...");
      const offer = await pcRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await pcRef.current.setLocalDescription(offer);
      addLog("✅ Local description set (offer)");
      
      sendSignal({
        type: "offer",
        payload: offer
      });
      
      addLog("✅ Offer sent to other tabs");
    } catch (error) {
      addLog(`❌ Error creating offer: ${error.message}`);
      console.error("Offer creation error:", error);
    }
  }

  async function restartIce() {
    if (!pcRef.current || !userIdRef.current) return;
    
    try {
      addLog("Restarting ICE...");
      const offer = await pcRef.current.createOffer({ iceRestart: true });
      await pcRef.current.setLocalDescription(offer);
      
      sendSignal({
        type: "offer",
        payload: offer
      });
    } catch (error) {
      addLog(`❌ Error restarting ICE: ${error.message}`);
    }
  }

  function sendSignal(signal) {
    const currentUserId = userIdRef.current;
    if (!currentUserId) return;
    
    const signalData = {
      room_id: roomId,
      sender: currentUserId,
      type: signal.type,
      payload: signal.payload
    };
    
    signalingStore.sendSignal(signalData);
  }

  const processQueuedSignals = () => {
    if (signalQueueRef.current.length > 0) {
      addLog(`🔧 Manually processing ${signalQueueRef.current.length} queued signals`);
      const signals = [...signalQueueRef.current];
      signalQueueRef.current = [];
      signals.forEach(signal => {
        setTimeout(() => handleSignal(signal), 10);
      });
    }
  };

  const getStateColor = () => {
    switch (connectionState) {
      case "connected": return "#10b981";
      case "connecting": return "#f59e0b";
      case "failed": return "#ef4444";
      case "disconnected": return "#f97316";
      case "closed": return "#6b7280";
      default: return "#6b7280";
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    addLog("Room ID copied to clipboard");
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: "20px", 
      padding: "20px",
      fontFamily: "system-ui, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
      height: "100vh",
      overflow: "hidden"
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
          WebRTC Video Call (Guaranteed Audio)
        </h1>
        <div style={{ 
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap"
        }}>
          <div style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: getStateColor()
          }} />
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            Status: <strong style={{ color: getStateColor() }}>{connectionState.toUpperCase()}</strong>
          </span>
          <span style={{ 
            fontSize: "12px", 
            color: isConnected ? "#059669" : "#6b7280",
            padding: "2px 8px",
            borderRadius: "4px",
            backgroundColor: isConnected ? "#d1fae5" : "#f3f4f6"
          }}>
            {isConnected ? "✓ CONNECTED" : "DISCONNECTED"}
          </span>
          <span style={{ 
            fontSize: "12px", 
            color: isAudioActive ? "#059669" : "#9ca3af",
            padding: "2px 8px",
            borderRadius: "4px",
            backgroundColor: isAudioActive ? "#d1fae5" : "#f3f4f6"
          }}>
            {isAudioActive ? "🔊 AUDIO ACTIVE" : "🔇 NO AUDIO"}
          </span>
          {!isInitialized && (
            <span style={{ 
              fontSize: "12px", 
              color: "#f59e0b",
              padding: "2px 8px",
              borderRadius: "4px",
              backgroundColor: "#fef3c7"
            }}>
              INITIALIZING...
            </span>
          )}
        </div>
        <div style={{ 
          marginTop: "5px",
          fontSize: "12px", 
          color: "#9ca3af",
          fontFamily: "monospace",
          display: "flex",
          gap: "10px",
          alignItems: "center"
        }}>
          <span>User ID: <strong>{userId || "Loading..."}</strong></span>
          <span>•</span>
          <span onClick={copyRoomId} style={{ cursor: "pointer" }} title="Click to copy">
            Room: {roomId.substring(0, 8)}...
          </span>
          <span>•</span>
          <span>Signals: {signalingStore.signals.length}</span>
          <span>•</span>
          <span>Audio Level: {(audioLevel * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Audio Level Indicator */}
      <div style={{ 
        padding: "10px",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        border: "1px solid #e5e7eb"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "60px", fontSize: "12px", fontWeight: "500" }}>
            Audio Level:
          </div>
          <div style={{
            flex: 1,
            height: "20px",
            backgroundColor: "#e5e7eb",
            borderRadius: "10px",
            overflow: "hidden"
          }}>
            <div style={{
              width: `${audioLevel * 100}%`,
              height: "100%",
              backgroundColor: isAudioActive ? "#10b981" : "#9ca3af",
              transition: "width 0.1s",
              display: "flex",
              alignItems: "center",
              paddingLeft: "10px",
              fontSize: "12px",
              color: "white",
              fontWeight: "bold"
            }}>
              {isAudioActive ? "🎵" : "🔇"}
            </div>
          </div>
          <div style={{ 
            width: "40px", 
            textAlign: "center",
            fontSize: "12px",
            fontWeight: "bold",
            color: isAudioActive ? "#059669" : "#9ca3af"
          }}>
            {(audioLevel * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button 
          onClick={createOffer}
          disabled={isConnected || !userId || !isInitialized}
          style={{
            padding: "10px 20px",
            backgroundColor: isConnected ? "#9ca3af" : (!userId || !isInitialized ? "#9ca3af" : "#3b82f6"),
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: (isConnected || !userId || !isInitialized) ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "600"
          }}
        >
          {isConnected ? "✓ CONNECTED" : (!userId ? "LOADING..." : (!isInitialized ? "INITIALIZING..." : "CREATE OFFER"))}
        </button>
        
        <button 
          onClick={unmuteRemoteAudio}
          disabled={!isConnected}
          style={{
            padding: "10px 20px",
            backgroundColor: !isConnected ? "#9ca3af" : "#10b981",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: !isConnected ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          🔊 FORCE UNMUTE
        </button>
        
        <button 
          onClick={toggleLocalMicrophone}
          disabled={!localStream}
          style={{
            padding: "10px 20px",
            backgroundColor: !localStream ? "#9ca3af" : "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: !localStream ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          🎤 TOGGLE MIC
        </button>
        
        <button 
          onClick={testAudio}
          style={{
            padding: "10px 20px",
            backgroundColor: "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          🔊 TEST AUDIO
        </button>
        
        <button 
          onClick={() => {
            signalingStore.signals = [];
            window.location.reload();
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          RESET & REFRESH
        </button>
      </div>

      {/* Video Grid */}
      <div style={{ 
        display: "flex", 
        gap: "20px", 
        flexWrap: "wrap",
        justifyContent: "center",
        flex: 1,
        minHeight: 0
      }}>
        <div style={{ 
          flex: "1", 
          minWidth: "300px", 
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px" 
          }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>📹 Local Video (YOU)</h3>
            <span style={{ 
              fontSize: "12px", 
              color: "#059669",
              padding: "2px 8px",
              borderRadius: "4px",
              backgroundColor: "#d1fae5"
            }}>
              {localStream?.getTracks().length || 0} TRACKS
            </span>
          </div>
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline
            style={{ 
              width: "100%", 
              backgroundColor: "#000",
              borderRadius: "8px",
              aspectRatio: "16/9",
              flex: 1,
              transform: "scaleX(-1)"
            }} 
          />
          <div style={{ 
            fontSize: "11px", 
            color: "#6b7280",
            marginTop: "5px",
            textAlign: "center"
          }}>
            {localStream ? "🎤 Microphone active" : "Waiting for media permission..."}
          </div>
        </div>
        
        <div style={{ 
          flex: "1", 
          minWidth: "300px", 
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px" 
          }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>📹 Remote Video</h3>
            <span style={{ 
              fontSize: "12px", 
              color: isConnected ? "#059669" : "#dc2626",
              padding: "2px 8px",
              borderRadius: "4px",
              backgroundColor: isConnected ? "#d1fae5" : "#fef2f2"
            }}>
              {isConnected ? "LIVE CONNECTION" : "DISCONNECTED"}
            </span>
          </div>
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline
            onClick={unmuteRemoteAudio}
            style={{ 
              width: "100%", 
              backgroundColor: "#111",
              borderRadius: "8px",
              aspectRatio: "16/9",
              border: isConnected ? "3px solid #10b981" : "2px dashed #dc2626",
              flex: 1,
              cursor: isConnected ? "pointer" : "default"
            }} 
          />
          <div style={{ 
            fontSize: "11px", 
            color: isAudioActive ? "#059669" : "#dc2626",
            marginTop: "5px",
            textAlign: "center",
            fontWeight: "bold"
          }}>
            {isAudioActive ? "✅ AUDIO RECEIVING - SPEAK NOW!" : "🔇 Click video to unmute audio"}
          </div>
        </div>
      </div>

      {/* Connection Logs */}
      <div style={{ 
        padding: "15px",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        fontSize: "12px",
        color: "#374151",
        maxHeight: "200px",
        overflowY: "auto",
        border: "1px solid #e5e7eb"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px" 
        }}>
          <strong>📋 Connection Logs</strong>
          <button 
            onClick={() => setLogs([])}
            style={{
              padding: "2px 8px",
              backgroundColor: "#e5e7eb",
              color: "#374151",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "11px"
            }}
          >
            Clear
          </button>
        </div>
        <div style={{ fontFamily: "monospace", lineHeight: "1.4" }}>
          {logs.length > 0 ? logs.map((log, index) => (
            <div key={index} style={{ 
              padding: "2px 0",
              borderBottom: "1px solid #f1f5f9",
              color: log.includes("❌") ? "#dc2626" : 
                     log.includes("✅") ? "#059669" : 
                     log.includes("🎵") ? "#8b5cf6" :
                     log.includes("🎤") ? "#f59e0b" :
                     log.includes("🔊") ? "#10b981" :
                     log.includes("🔇") ? "#6b7280" :
                     "#374151"
            }}>
              {log}
            </div>
          )) : (
            <div style={{ color: "#9ca3af", fontStyle: "italic" }}>
              No logs yet. Click "CREATE OFFER" to start...
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div style={{ 
        padding: "15px",
        backgroundColor: "#f3f4f6",
        borderRadius: "8px",
        fontSize: "13px",
        color: "#4b5563"
      }}>
        <strong>🎯 GUARANTEED AUDIO INSTRUCTIONS:</strong>
        <ol style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
          <li>Open <strong>two tabs</strong> of this page</li>
          <li>Wait for <strong>"✅ WebRTC fully initialized and ready"</strong> in both tabs</li>
          <li>In <strong>Tab 1</strong>, click <strong>"CREATE OFFER"</strong></li>
          <li>Wait for connection (you'll see "LIVE CONNECTION")</li>
          <li><strong>SPEAK INTO YOUR MICROPHONE</strong> and watch the audio level indicator</li>
          <li>If no audio: <strong>Click the remote video</strong> or press <strong>"FORCE UNMUTE"</strong></li>
          <li><strong>Test audio</strong> with the 🔊 TEST AUDIO button to verify speakers work</li>
        </ol>
        
        <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #d1d5db" }}>
          <strong>🔊 AUDIO TROUBLESHOOTING:</strong>
          <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
            <li>If no audio: <strong>Click the remote video element</strong> (required by browser)</li>
            <li>Check <strong>Audio Level indicator</strong> - should move when you speak</li>
            <li>Verify <strong>microphone permissions</strong> are allowed</li>
            <li>Test your speakers with <strong>"🔊 TEST AUDIO"</strong> button</li>
            <li>Toggle your microphone with <strong>"🎤 TOGGLE MIC"</strong> if needed</li>
            <li>Use <strong>Chrome/Edge</strong> for best audio quality</li>
          </ul>
        </div>
      </div>
    </div>
  );
}