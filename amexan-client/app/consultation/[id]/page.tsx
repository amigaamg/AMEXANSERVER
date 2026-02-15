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
  const [remotePlayBlocked, setRemotePlayBlocked] = useState(false); // for manual play button

  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const candidateQueue = useRef<RTCIceCandidateInit[]>([]);
  const remoteDescriptionSet = useRef(false);
  const offerMade = useRef(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || API_BASE;

  // ✅ Your Metered TURN/STUN servers
  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      {
        urls: [
          "turn:videoamexan.metered.live:80",
          "turn:videoamexan.metered.live:443",
          "turn:videoamexan.metered.live:3478"
        ],
        username: "videoamexan",
        credential: "_R_tKrF3xSicInRntQvEGYkt6mM_Xj2uIKsA1Cc-FQqdrpfM"
      }
    ]
  };

  // 1. Fetch appointment and determine role
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const storedUser = localStorage.getItem("amexan_user");
        if (!storedUser) {
          router.push("/login");
          return;
        }
        const user = JSON.parse(storedUser);

        const res = await axios.get(`${API_BASE}/api/appointments/${id}`);
        const apt = res.data;

        if (user._id !== apt.patientId?._id && user._id !== apt.doctorId?._id) {
          setError("You are not authorized.");
          return;
        }

        const role = user._id === apt.patientId?._id ? "patient" : "doctor";
        setUserRole(role);
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

  // 2. Initialize WebRTC and socket
  useEffect(() => {
    if (!appointment?.roomId || !userRole) return;

    const roomId = appointment.roomId;
    console.log("Using roomId:", roomId, "Role:", userRole);

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected", socket.id);
      socket.emit("join_room", roomId);
    });

    const startWebRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideo.current) localVideo.current.srcObject = stream;
        setLocalStreamReady(true);

        const pc = new RTCPeerConnection(iceServers);
        peerConnection.current = pc;
        remoteDescriptionSet.current = false;
        candidateQueue.current = [];

        pc.onconnectionstatechange = () => {
          console.log("Connection state:", pc.connectionState);
          setConnectionState(pc.connectionState);
        };

        pc.oniceconnectionstatechange = () => {
          console.log("ICE connection state:", pc.iceConnectionState);
        };

        // Add local tracks
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.onicecandidate = (e) => {
          if (e.candidate) {
            socket.emit("ice_candidate", { room: roomId, candidate: e.candidate });
          }
        };

        pc.ontrack = (e) => {
          console.log("✅ Remote track received!");
          console.log("Track kinds:", e.streams[0].getTracks().map(t => t.kind)); // should include 'audio'
          if (remoteVideo.current) {
            remoteVideo.current.srcObject = e.streams[0];
            remoteVideo.current.muted = false;
            remoteVideo.current.volume = 1.0;
            // Try to play – may be blocked by browser autoplay policy
            remoteVideo.current.play().catch((err) => {
              console.warn("Autoplay blocked – user must click play button", err);
              setRemotePlayBlocked(true);
            });
          }
          setRemoteStreamReady(true);
        };

        // Process queued candidates after remote description set
        const processQueuedCandidates = async () => {
          while (candidateQueue.current.length) {
            const candidate = candidateQueue.current.shift();
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
              console.error("Error adding queued candidate:", err);
            }
          }
        };

        // Role-based negotiation: patient creates offer
        if (userRole === "patient") {
          setTimeout(async () => {
            if (!pc || offerMade.current) return;
            try {
              console.log("📞 Patient creating offer...");
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              socket.emit("offer", { room: roomId, offer });
              offerMade.current = true;
            } catch (err) {
              console.error("Error creating offer:", err);
            }
          }, 1000);
        }

        // Socket handlers
        socket.on("offer", async (offer: RTCSessionDescriptionInit) => {
          console.log("📞 Received offer");
          if (!pc) return;
          if (userRole !== "doctor") return; // only doctor answers
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            remoteDescriptionSet.current = true;
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("answer", { room: roomId, answer });
            await processQueuedCandidates();
          } catch (err) {
            console.error("❌ Offer handling error:", err);
          }
        });

        socket.on("answer", async (answer: RTCSessionDescriptionInit) => {
          console.log("📞 Received answer");
          if (!pc) return;
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
            remoteDescriptionSet.current = true;
            await processQueuedCandidates();
          } catch (err) {
            console.error("❌ Answer handling error:", err);
          }
        });

        socket.on("ice_candidate", async (candidate: RTCIceCandidateInit) => {
          console.log("🧊 Received ICE candidate");
          if (!pc) return;
          if (!remoteDescriptionSet.current) {
            candidateQueue.current.push(candidate);
          } else {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
              console.error("❌ ICE error:", err);
            }
          }
        });

      } catch (err) {
        console.error("❌ WebRTC init error:", err);
        alert("Could not access camera/mic: " + err);
      }
    };

    startWebRTC();

    socket.on("receive_message", (data: { message: string }) => {
      setMessages((prev) => [...prev, { text: data.message, from: "remote" }]);
    });

    return () => {
      socket.disconnect();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (peerConnection.current) peerConnection.current.close();
    };
  }, [appointment, userRole, SOCKET_URL]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !socketRef.current || !appointment?.roomId) return;
    socketRef.current.emit("send_message", { room: appointment.roomId, message: messageInput });
    setMessages((prev) => [...prev, { text: messageInput, from: "local" }]);
    setMessageInput("");
  };

  const playRemoteVideo = () => {
    if (remoteVideo.current) {
      remoteVideo.current.play().catch(err => console.error("Manual play failed", err));
      setRemotePlayBlocked(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading consultation...</div>;
  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;
  if (!appointment) return <div className="p-6 text-center">Appointment not found.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Consultation Room</h1>
      <p className="mb-4 text-gray-600">
        Room: {appointment.roomId} | Doctor: Dr. {appointment.doctorId?.name || "Unknown"} | Patient: {appointment.patientId?.name || "You"}
      </p>
      <p className="mb-2 text-sm">Connection: {connectionState} | Role: {userRole}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold mb-1">You {!localStreamReady && "(waiting for camera...)"}</h3>
          <video
            ref={localVideo}
            autoPlay
            playsInline
            muted
            className="w-full bg-black rounded"
            style={{ height: 240 }}
          />
        </div>
        <div>
          <h3 className="font-semibold mb-1">Remote {!remoteStreamReady && "(waiting for connection...)"}</h3>
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
              className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Click to enable remote audio/video
            </button>
          )}
        </div>
      </div>

      {/* Chat */}
      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">💬 Chat</h2>
        <div className="h-48 overflow-y-auto border p-2 mb-2 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-1 ${msg.from === "local" ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block px-3 py-1 rounded ${
                  msg.from === "local" ? "bg-blue-500 text-white" : "bg-gray-300"
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