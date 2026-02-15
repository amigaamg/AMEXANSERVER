"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import io from "socket.io-client";

export default function ConsultationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [localStreamReady, setLocalStreamReady] = useState(false);
  const [remoteStreamReady, setRemoteStreamReady] = useState(false);
  const [connectionState, setConnectionState] = useState("new");
  const [userRole, setUserRole] = useState<"patient" | "doctor" | null>(null);
  const [remotePlayBlocked, setRemotePlayBlocked] = useState(false);
  const [localMuted, setLocalMuted] = useState(false);
  const [remoteMuted, setRemoteMuted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [audioStatus, setAudioStatus] = useState<string>("checking...");

  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const candidateQueue = useRef<RTCIceCandidateInit[]>([]);
  const remoteDescriptionSet = useRef(false);
  const offerMade = useRef(false);
  const makingOffer = useRef(false);
  const offerTimer = useRef<NodeJS.Timeout | null>(null);
  // FIX: Track whether the peer joined BEFORE us so we know to (re)send offer
  const peerAlreadyInRoom = useRef(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || API_BASE;

  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      {
        urls: [
          "turn:videoamexan.metered.live:80",
          "turn:videoamexan.metered.live:443",
          "turn:videoamexan.metered.live:3478",
        ],
        username: "videoamexan",
        credential: "_R_tKrF3xSicInRntQvEGYkt6mM_Xj2uIKsA1Cc-FQqdrpfM",
      },
    ],
  };

  // ─── Fetch appointment + determine role ──────────────────────────────────────
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const storedUser = localStorage.getItem("amexan_user");
        if (!storedUser) { router.push("/login"); return; }
        const user = JSON.parse(storedUser);
        setCurrentUser(user);

        const res = await axios.get(`${API_BASE}/api/appointments/${id}`);
        const apt = res.data.appointment || res.data;
        if (!apt) throw new Error("Appointment not found");

        if (user._id !== apt.patientId?._id && user._id !== apt.doctorId?._id) {
          setError("You are not authorized."); return;
        }

        setUserRole(user._id === apt.patientId?._id ? "patient" : "doctor");
        setAppointment(apt);
      } catch (err) {
        console.error("Failed to load appointment", err);
        setError("Could not load appointment details.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id, API_BASE, router]);

  // ─── Load chat history ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!appointment?._id || !currentUser) return;
    const loadMessages = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/messages/${appointment._id}`);
        const formatted = res.data.map((m: any) => ({
          text: m.text,
          from: m.senderId._id === currentUser._id ? "local" : "remote",
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    loadMessages();
  }, [appointment, currentUser, API_BASE]);

  // ─── WebRTC + Socket ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!appointment?.roomId || !userRole || !currentUser) return;

    const roomId = appointment.roomId;
    console.log("roomId:", roomId, "| Role:", userRole);

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    // ── Helper: flush queued ICE candidates ─────────────────────────────────
    const flushCandidateQueue = async (pc: RTCPeerConnection) => {
      while (candidateQueue.current.length) {
        const candidate = candidateQueue.current.shift()!;
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("✅ Queued ICE candidate added");
        } catch (err) {
          console.warn("Queued ICE candidate error (usually safe to ignore):", err);
        }
      }
    };

    // ── Create offer (only patient, or on re-trigger) ─────────────────────
    const createOffer = async (pc: RTCPeerConnection) => {
      if (userRole !== "patient") return;
      if (offerMade.current || makingOffer.current) return;
      if (pc.signalingState === "closed") return;

      try {
        console.log("📞 Creating offer...");
        makingOffer.current = true;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { room: roomId, offer });
        offerMade.current = true;
        console.log("✅ Offer sent");
      } catch (err) {
        console.error("❌ createOffer error:", err);
      } finally {
        makingOffer.current = false;
      }
    };

    // ── Main WebRTC bootstrap ────────────────────────────────────────────────
    const startWebRTC = async () => {
      let stream: MediaStream;

      // FIX 1: Request audio explicitly; fall back gracefully
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } catch (err) {
        console.error("getUserMedia failed:", err);
        alert("Could not access camera/microphone. Please allow permissions and reload.");
        return;
      }

      const audioTracks = stream.getAudioTracks();
      const videoTracks = stream.getVideoTracks();
      console.log(`Local tracks → audio:${audioTracks.length} video:${videoTracks.length}`);
      setAudioStatus(
        audioTracks.length > 0
          ? `Local mic: ${audioTracks[0].label}`
          : "⚠️ No microphone detected"
      );

      localStreamRef.current = stream;

      // FIX 2: Attach local stream properly (muted so you don't hear yourself)
      if (localVideo.current) {
        localVideo.current.srcObject = stream;
        localVideo.current.muted = true; // always mute local preview
        localVideo.current.volume = 0;
      }
      setLocalStreamReady(true);

      // ── Create PeerConnection ──────────────────────────────────────────────
      const pc = new RTCPeerConnection(iceServers);
      peerConnection.current = pc;
      remoteDescriptionSet.current = false;
      candidateQueue.current = [];
      offerMade.current = false;

      pc.onconnectionstatechange = () => {
        console.log("Connection state:", pc.connectionState);
        setConnectionState(pc.connectionState);
      };

      pc.oniceconnectionstatechange = () => {
        console.log("ICE state:", pc.iceConnectionState);
        // FIX 3: Attempt ICE restart if connection drops
        if (
          pc.iceConnectionState === "failed" &&
          userRole === "patient" &&
          !makingOffer.current
        ) {
          console.warn("ICE failed – attempting restart");
          offerMade.current = false;
          createOffer(pc);
        }
      };

      // FIX 4: Add ALL tracks (audio + video) before creating offer
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
        console.log(`➕ Added local ${track.kind} track: ${track.label}`);
      });

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice_candidate", { room: roomId, candidate: e.candidate });
        }
      };

      // FIX 5: ontrack — attach AFTER srcObject is set, then play
      pc.ontrack = (e) => {
        console.log("🎯 Remote track received:", e.track.kind, e.track.label);

        const remoteStream = e.streams[0];
        if (!remoteStream) {
          console.warn("ontrack fired but no stream attached");
          return;
        }

        const remoteAudio = remoteStream.getAudioTracks();
        const remoteVideo_ = remoteStream.getVideoTracks();
        console.log(
          `Remote stream → audio:${remoteAudio.length} video:${remoteVideo_.length}`
        );

        if (remoteVideo.current) {
          // FIX 6: Set srcObject FIRST, then unmute, then play
          remoteVideo.current.srcObject = remoteStream;
          remoteVideo.current.muted = false;   // ← MUST be false for remote audio
          remoteVideo.current.volume = 1.0;

          remoteVideo.current
            .play()
            .then(() => {
              console.log("▶️ Remote video playing with audio");
              setRemotePlayBlocked(false);
            })
            .catch((err) => {
              console.warn("Autoplay blocked – waiting for user gesture:", err);
              setRemotePlayBlocked(true);
            });
        }
        setRemoteStreamReady(true);
      };

      // ── Socket signalling handlers ────────────────────────────────────────
      socket.on("offer", async (offer: RTCSessionDescriptionInit) => {
        if (userRole !== "doctor") return;
        if (!pc || pc.signalingState === "closed") return;

        console.log("📨 Received offer");
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          remoteDescriptionSet.current = true;
          await flushCandidateQueue(pc);

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", { room: roomId, answer });
          console.log("✅ Answer sent");
        } catch (err) {
          console.error("❌ Offer handling error:", err);
        }
      });

      socket.on("answer", async (answer: RTCSessionDescriptionInit) => {
        if (userRole !== "patient") return;
        if (!pc || pc.signalingState === "closed") return;

        console.log("📨 Received answer");
        try {
          // FIX 7: Guard against setting answer when already stable
          if (pc.signalingState !== "have-local-offer") {
            console.warn("Ignoring answer – signalingState:", pc.signalingState);
            return;
          }
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          remoteDescriptionSet.current = true;
          await flushCandidateQueue(pc);
          console.log("✅ Remote description set from answer");
        } catch (err) {
          console.error("❌ Answer handling error:", err);
        }
      });

      socket.on("ice_candidate", async (candidate: RTCIceCandidateInit) => {
        if (!pc || pc.signalingState === "closed") return;

        if (!remoteDescriptionSet.current) {
          // Queue it until remote description is ready
          candidateQueue.current.push(candidate);
        } else {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.warn("ICE candidate add error (usually safe):", err);
          }
        }
      });

      // FIX 8: Listen for "peer_joined" event — so patient knows doctor arrived
      // Your backend should emit this when a second user joins the room.
      // If you can't change backend, use a small delay after "user_joined" instead.
      socket.on("user_joined", () => {
        console.log("👤 Peer joined the room");
        peerAlreadyInRoom.current = true;
        // Patient re-triggers offer when the doctor (peer) joins
        if (userRole === "patient") {
          offerMade.current = false;
          if (offerTimer.current) clearTimeout(offerTimer.current);
          offerTimer.current = setTimeout(() => createOffer(pc), 500);
        }
      });

      // Also attempt an offer shortly after joining in case peer is already waiting
      if (userRole === "patient") {
        if (offerTimer.current) clearTimeout(offerTimer.current);
        offerTimer.current = setTimeout(() => createOffer(pc), 1500);
      }
    };

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("join_room", roomId);
    });

    socket.on("receive_message", (data: { message: string }) => {
      setMessages((prev) => [...prev, { text: data.message, from: "remote" }]);
    });

    startWebRTC();

    return () => {
      if (offerTimer.current) clearTimeout(offerTimer.current);
      socket.disconnect();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      peerConnection.current?.close();
    };
  }, [appointment, userRole, currentUser, SOCKET_URL]);

  // ─── Send message ─────────────────────────────────────────────────────────────
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !socketRef.current || !appointment?.roomId || !currentUser?._id)
      return;

    const msg = messageInput;
    socketRef.current.emit("send_message", { room: appointment.roomId, message: msg });

    try {
      await axios.post(`${API_BASE}/api/messages`, {
        appointmentId: appointment._id,
        senderId: currentUser._id,
        text: msg,
      });
    } catch (err) {
      console.error("Failed to save message:", err);
    }

    setMessages((prev) => [...prev, { text: msg, from: "local" }]);
    setMessageInput("");
  };

  // ─── Manual play (for browsers that block autoplay with sound) ───────────────
  const playRemoteVideo = () => {
    if (remoteVideo.current) {
      remoteVideo.current.muted = false;
      remoteVideo.current.volume = 1.0;
      remoteVideo.current
        .play()
        .then(() => setRemotePlayBlocked(false))
        .catch((err) => console.error("Manual play failed:", err));
    }
  };

  // ─── Mute toggles ─────────────────────────────────────────────────────────────
  const toggleLocalMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = !t.enabled;
      });
      setLocalMuted((m) => !m);
    }
  };

  const toggleRemoteMute = () => {
    if (remoteVideo.current) {
      remoteVideo.current.muted = !remoteVideo.current.muted;
      setRemoteMuted(remoteVideo.current.muted);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  if (loading) return <div className="p-6 text-center">Loading consultation...</div>;
  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;
  if (!appointment) return <div className="p-6 text-center">Appointment not found.</div>;

  const doctorName =
    appointment.doctorId?.name || (userRole === "doctor" ? "You" : "Doctor");
  const patientName =
    appointment.patientId?.name || (userRole === "patient" ? "You" : "Patient");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Consultation Room</h1>
      <p className="mb-1 text-gray-600">
        Room: {appointment.roomId} | Dr. {doctorName} ↔ {patientName}
      </p>
      <p className="mb-1 text-sm text-gray-500">
        Connection: <strong>{connectionState}</strong> | Role: <strong>{userRole}</strong>
      </p>
      <p className="mb-4 text-xs text-gray-400">{audioStatus}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Local video */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold">
              You {!localStreamReady && <span className="text-gray-400">(waiting…)</span>}
            </h3>
            <button
              onClick={toggleLocalMute}
              className={`px-2 py-1 text-xs rounded ${
                localMuted ? "bg-red-500 text-white" : "bg-gray-300"
              }`}
            >
              {localMuted ? "🎙️ Unmute" : "🔇 Mute"}
            </button>
          </div>
          {/* FIX: local video is always muted to prevent echo */}
          <video
            ref={localVideo}
            autoPlay
            playsInline
            muted
            className="w-full bg-black rounded"
            style={{ height: 240 }}
          />
        </div>

        {/* Remote video */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold">
              Remote{" "}
              {!remoteStreamReady && (
                <span className="text-gray-400">(waiting for connection…)</span>
              )}
            </h3>
            {remoteStreamReady && (
              <button
                onClick={toggleRemoteMute}
                className={`px-2 py-1 text-xs rounded ${
                  remoteMuted ? "bg-red-500 text-white" : "bg-gray-300"
                }`}
              >
                {remoteMuted ? "🔊 Unmute Remote" : "🔇 Mute Remote"}
              </button>
            )}
          </div>
          {/*
            FIX: Do NOT add `muted` attribute here.
            The browser needs this element unmuted to play remote audio.
            Autoplay-with-sound requires a user gesture on mobile — handled by the button below.
          */}
          <video
            ref={remoteVideo}
            autoPlay
            playsInline
            className="w-full bg-black rounded"
            style={{ height: 240 }}
          />
          {remotePlayBlocked && (
            <button
              onClick={playRemoteVideo}
              className="mt-2 w-full bg-yellow-500 text-white px-4 py-2 rounded font-semibold"
            >
              ▶️ Tap here to enable audio & video
            </button>
          )}
        </div>
      </div>

      {/* Chat */}
      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">💬 Chat</h2>
        <div className="h-48 overflow-y-auto border p-2 mb-2 bg-gray-50 rounded">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-1 ${msg.from === "local" ? "text-right" : "text-left"}`}
            >
              <span
                className={`inline-block px-3 py-1 rounded ${
                  msg.from === "local"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 border p-2 rounded"
            placeholder="Type a message..."
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}