'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

declare global {
  interface Window {
    DailyIframe: any;
  }
}

interface TelemedicineRoomProps {
  appointment: any;
  onEnd: () => void;
}

export default function TelemedicineRoom({ appointment, onEnd }: TelemedicineRoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [callFrame, setCallFrame] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Load Daily.co script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@daily-co/daily-js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.DailyIframe) {
        const frame = window.DailyIframe.createFrame(containerRef.current, {
          showLeaveButton: true,
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: 'none',
          },
        });
        frame.join({ url: appointment.roomUrl }); // roomUrl should come from backend
        setCallFrame(frame);

        frame.on('app-message', (event: any) => {
          setMessages(prev => [...prev, { from: event.fromId, text: event.data, timestamp: Date.now() }]);
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (callFrame) {
        callFrame.leave();
        callFrame.destroy();
      }
    };
  }, [appointment.roomUrl, callFrame]);

  const sendMessage = () => {
    if (!newMessage.trim() || !callFrame) return;
    callFrame.sendAppMessage({ text: newMessage });
    setMessages(prev => [...prev, { from: 'me', text: newMessage, timestamp: Date.now() }]);
    setNewMessage('');
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        <Button
          variant="danger"
          onClick={() => {
            callFrame?.leave();
            onEnd();
          }}
          style={{ position: 'absolute', bottom: 20, left: 20 }}
        >
          End Call
        </Button>
      </div>
      {showChat && (
        <div style={{ width: 300, background: 'white', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 16, borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>Chat</div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ marginBottom: 8, textAlign: msg.from === 'me' ? 'right' : 'left' }}>
                <span style={{ background: msg.from === 'me' ? '#2563eb' : '#f1f5f9', color: msg.from === 'me' ? 'white' : '#1e293b', padding: '6px 12px', borderRadius: 16, display: 'inline-block' }}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div style={{ padding: 16, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 }}>
            <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message" onKeyPress={e => e.key === 'Enter' && sendMessage()} />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowChat(!showChat)}
        style={{ position: 'absolute', bottom: 20, right: showChat ? 320 : 20, background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}
      >
        {showChat ? 'Hide Chat' : 'Show Chat'}
      </button>
    </div>
  );
}