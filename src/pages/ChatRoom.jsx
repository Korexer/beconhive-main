import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { Send, Image as ImageIcon, Mic, StopCircle, ArrowLeft, MessageSquare } from 'lucide-react';

const ChatRoom = () => {
  const { agentId } = useParams();
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [targetUser, setTargetUser] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [inboxUsers, setInboxUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    if (agentId === 'all') {
      // Load Inbox mapping for Agents
      const fetchInbox = async () => {
        // Find all unique sender IDs that have messaged this agent
        const { data } = await supabase
          .from('messages')
          .select('sender_id, receiver_id')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
        
        if (data) {
          const uniqueIds = new Set();
          data.forEach(msg => {
            if (msg.sender_id !== user.id) uniqueIds.add(msg.sender_id);
            if (msg.receiver_id !== user.id) uniqueIds.add(msg.receiver_id);
          });
          
          if (uniqueIds.size > 0) {
            const idsArray = Array.from(uniqueIds);
            const { data: usersData } = await supabase
              .from('profiles')
              .select('id, full_name, role')
              .in('id', idsArray);
            if (usersData) setInboxUsers(usersData);
          }
        }
      };
      fetchInbox();
      return;
    }
    
    // Normal Chat Routine
    const fetchTargetUser = async () => {
      const { data } = await supabase.from('profiles').select('full_name, role').eq('id', agentId).single();
      if(data) setTargetUser(data);
    };
    
    fetchTargetUser();

    // Fetch message history
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${agentId}),and(sender_id.eq.${agentId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    fetchMessages();

    // Setup realtime subscription
    const channel = supabase.channel('chat_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new;
        if ((msg.sender_id === user.id && msg.receiver_id === agentId) || 
            (msg.sender_id === agentId && msg.receiver_id === user.id)) {
          setMessages(prev => [...prev, msg]);
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user, agentId]);

  const insertMessage = async (content, type, mediaUrl = null) => {
    await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: agentId,
      content: content,
      type: type,
      media_url: mediaUrl
    });
  };

  const handleSendText = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const msg = inputText;
    setInputText('');
    await insertMessage(msg, 'text');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('chat_media').upload(fileName, file);
    
    if (error) {
      alert("Please ensure you have created a public bucket named 'chat_media' in Supabase to upload images! Error: " + error.message);
      return;
    }
    
    const { data: publicData } = supabase.storage.from('chat_media').getPublicUrl(fileName);
    await insertMessage('Image Upload', 'image', publicData.publicUrl);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const audioChunks = [];
      recorder.ondataavailable = e => audioChunks.push(e.data);
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const file = new File([audioBlob], `audio_${Date.now()}.webm`, { type: 'audio/webm' });
        
        const fileName = `${user.id}/${Date.now()}_audio.webm`;
        const { data, error } = await supabase.storage.from('chat_media').upload(fileName, file);
        
        if (error) {
          alert("Audio upload failed! Check 'chat_media' bucket. " + error.message);
        } else {
          const { data: publicData } = supabase.storage.from('chat_media').getPublicUrl(fileName);
          await insertMessage('Voice Message', 'audio', publicData.publicUrl);
        }
      };
      
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied or not supported.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  if (loading || !user) return <div className="text-center section-padding">Loading...</div>;

  if (agentId === 'all') {
    return (
      <div className="section-padding" style={{ background: 'var(--bg-light-blue)', minHeight: 'calc(100vh - 80px)' }}>
         <div className="container" style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
              <button onClick={() => navigate('/dashboard')} className="btn btn-outline" style={{ padding: '8px 16px' }}><ArrowLeft size={18} /></button>
              <h2 style={{ margin: 0 }}>Your Inbox</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {inboxUsers.length === 0 ? (
                <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-gray)' }}>
                   No active conversations. When a user reaches out, they will appear here.
                </div>
              ) : (
                inboxUsers.map(u => (
                  <div key={u.id} className="glass-card card-hover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                       <div style={{ width: '50px', height: '50px', background: 'var(--primary-blue)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                         {u.full_name.charAt(0)}
                       </div>
                       <div>
                         <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{u.full_name}</h3>
                         <span style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>{u.role === 'customer' ? 'Customer' : 'Agent'}</span>
                       </div>
                     </div>
                     <button onClick={() => navigate(`/chat/${u.id}`)} className="btn btn-primary" style={{ padding: '10px 20px', display: 'flex', gap: '8px' }}><MessageSquare size={16} /> Open Chat</button>
                  </div>
                ))
              )}
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="chat-room-page" style={{ background: 'var(--bg-light-blue)', minHeight: 'calc(100vh - 80px)', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div className="glass-card chat-main-container" style={{ display: 'flex', flexDirection: 'column', height: '75vh', borderRadius: '16px', overflow: 'hidden' }}>
          {/* Chat Header */}
          <div style={{ padding: '20px', background: 'white', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
              <ArrowLeft color="var(--color-gray)" />
            </button>
            <div style={{ width: '40px', height: '40px', background: 'var(--primary-blue)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {targetUser?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: '0' }}>{targetUser?.full_name || 'Loading user...'}</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-gray)' }}>{targetUser?.role === 'agent' ? 'Verified Expert' : 'Customer'}</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.length === 0 ? (
              <div style={{ margin: 'auto', color: 'var(--color-gray)' }}>No messages yet. Start the conversation!</div>
            ) : (
              messages.map(msg => {
                const isMe = msg.sender_id === user.id;
                return (
                  <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '85%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ 
                      padding: '12px 18px', 
                      background: isMe ? 'var(--primary-blue)' : 'white', 
                      color: isMe ? 'white' : 'var(--color-black)', 
                      borderRadius: isMe ? '20px 20px 0 20px' : '20px 20px 20px 0',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                      border: isMe ? 'none' : '1px solid var(--border-color)',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere'
                    }}>
                      
                      {msg.type === 'image' ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <img src={msg.media_url} alt="Attachment" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '8px' }} />
                          <small style={{ opacity: 0.8 }}>Attached Image</small>
                        </div>
                      ) : msg.type === 'audio' ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                           <audio controls src={msg.media_url} style={{ width: '100%', maxWidth: '250px' }}></audio>
                           <small style={{ opacity: 0.8, marginTop: '4px' }}>Voice Note</small>
                        </div>
                      ) : (
                        <p style={{ margin: 0, color: 'inherit', fontSize: '1rem', lineHeight: '1.5' }}>{msg.content}</p>
                      )}
                      
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gray)', marginTop: '4px', alignSelf: isMe ? 'flex-end' : 'flex-start' }}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="chat-input-area" style={{ padding: '20px', background: 'white', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            <label style={{ cursor: 'pointer', display: 'flex', padding: '10px', background: 'var(--bg-light-blue)', borderRadius: '50%', color: 'var(--primary-blue)', transition: '0.2s', flexShrink: 0 }}>
              <ImageIcon size={20} />
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>

            {!isRecording ? (
               <button type="button" onClick={startRecording} style={{ cursor: 'pointer', display: 'flex', padding: '10px', background: 'var(--bg-light-blue)', borderRadius: '50%', color: 'var(--primary-orange)', border: 'none', transition: '0.2s', flexShrink: 0 }} title="Start Voice Recording">
                 <Mic size={20} />
               </button>
            ) : (
               <button type="button" onClick={stopRecording} style={{ cursor: 'pointer', display: 'flex', padding: '10px', background: '#FEE2E2', borderRadius: '50%', color: '#DC2626', border: 'none', transition: '0.2s', flexShrink: 0 }} title="Stop Recording">
                 <StopCircle size={20} className="animate-pulse" />
               </button>
            )}

            <form onSubmit={handleSendText} style={{ flex: 1, display: 'flex', gap: '10px' }}>
               <input 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 type="text" 
                 placeholder="Type a message..." 
                 style={{ flex: 1, padding: '12px 18px', borderRadius: '24px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-light-blue)', fontSize: '0.95rem', minWidth: 0 }} 
               />
               <button type="submit" disabled={!inputText.trim()} style={{ background: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: inputText.trim() ? 'pointer' : 'default', opacity: inputText.trim() ? 1 : 0.5, transition: '0.2s', flexShrink: 0 }}>
                 <Send size={18} />
               </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .chat-room-page { padding: 0 !important; }
          .chat-main-container { height: calc(100vh - 80px) !important; border-radius: 0 !important; }
          .chat-input-area { padding: 12px !important; }
        }
      `}</style>
    </div>
  );
};

export default ChatRoom;
