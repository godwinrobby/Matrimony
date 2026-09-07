import { useState, useEffect, useRef, FormEvent } from 'react';
import { Send, X, Shield, RefreshCw, MessageSquare, Brain, Check, CheckCheck, Radio, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Profile, ChatMessage } from '../types';
import { realtimeChatService, RealtimeEvent } from '../lib/realtimeChat';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: Profile | null; // If null, we chat with Pundit Shastri AI Coach
}

export default function ChatWidget({ isOpen, onClose, activeProfile }: ChatWidgetProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(realtimeChatService.getMuted());
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentChatId = activeProfile ? activeProfile.id : 'pundit-ai';

  // Listen for real-time events
  useEffect(() => {
    const unsubscribe = realtimeChatService.subscribe((event: RealtimeEvent) => {
      if (event.type === 'NEW_MESSAGE') {
        const { chatId, message, isLocal } = event.payload;
        if (chatId === currentChatId && !isLocal) {
          setMessages(prev => {
            if (prev.some(m => m.id === message.id)) return prev;
            return [...prev, message];
          });
          if (message.receiverId === 'user') {
            realtimeChatService.playIncomingChime();
          }
        }
      }
    });

    return () => unsubscribe();
  }, [currentChatId]);

  // Initialize chats when conversation participant changes
  useEffect(() => {
    try {
      const savedDbStr = localStorage.getItem('soulmate_chats_db');
      if (savedDbStr) {
        const db = JSON.parse(savedDbStr);
        if (db && db[currentChatId] && db[currentChatId].length > 0) {
          setMessages(db[currentChatId]);
          return;
        }
      }
    } catch {}

    if (activeProfile) {
      setMessages([
        {
          id: 'welcome-1',
          senderId: activeProfile.id,
          receiverId: 'user',
          text: `Namaste! I am ${activeProfile.name}. I read your profile interest and would love to connect. I work as a ${activeProfile.profession} in ${activeProfile.location.city}. How is your day going?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        }
      ]);
    } else {
      setMessages([
        {
          id: 'welcome-pundit',
          senderId: 'pundit-ai',
          receiverId: 'user',
          text: `Namaste, beta! I am Pundit Shastri, your spiritual matrimonial coach. I can answer your questions on Guna Milan, Kundli stars, Manglik remedies, and sacred Vedic marriage vows. How can I guide your journey today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        }
      ]);
    }
  }, [activeProfile, isOpen, currentChatId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    realtimeChatService.setMuted(next);
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsgText = inputMessage.trim();
    setInputMessage('');

    // Append user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      senderId: 'user',
      receiverId: currentChatId,
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    // Broadcast user message
    realtimeChatService.broadcast({
      type: 'NEW_MESSAGE',
      payload: { chatId: currentChatId, message: userMsg, isLocal: true }
    });

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    // Transition tick to delivered
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'delivered' } : m));
    }, 400);

    try {
      let responseText = '';
      if (activeProfile) {
        const res = await fetch('/api/profile-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: activeProfile, messages: updatedMessages })
        });
        const data = await res.json();
        responseText = data.text;
      } else {
        const res = await fetch('/api/pundit-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updatedMessages })
        });
        const data = await res.json();
        responseText = data.text;
      }

      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'read' } : m));

      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        senderId: currentChatId,
        receiverId: 'user',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAi: true,
        status: 'read'
      };

      setMessages(prev => [...prev, aiResponse]);

      realtimeChatService.broadcast({
        type: 'NEW_MESSAGE',
        payload: { chatId: currentChatId, message: aiResponse, isLocal: false }
      });
      realtimeChatService.playIncomingChime();

    } catch (error) {
      console.error('Chat endpoint failed:', error);
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        senderId: currentChatId,
        receiverId: 'user',
        text: activeProfile 
          ? `I would love to tell you more about myself, but my network seems a bit slow right now! Let's talk more soon.`
          : `Namaste! The cosmic gateway is a bit busy, but remember that patience is a sacred virtue. What other queries may I resolve?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAi: true,
        status: 'read'
      };

      setMessages(prev => [...prev, errorMsg]);

      realtimeChatService.broadcast({
        type: 'NEW_MESSAGE',
        payload: { chatId: currentChatId, message: errorMsg, isLocal: false }
      });
      realtimeChatService.playIncomingChime();
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="chat-slider-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex justify-end"
        >
          {/* Chat Drawer container */}
          <motion.div
            id="chat-drawer-container"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 180 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:w-[460px] bg-white h-full shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-4 bg-linear-to-r from-orange-500 via-amber-500 to-pink-500 text-white flex items-center justify-between shadow-md relative">
              <div className="flex items-center gap-3">
                {activeProfile ? (
                  <>
                    <img
                      src={activeProfile.image}
                      alt={activeProfile.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-full border-2 border-white/80"
                    />
                    <div className="text-left">
                      <h4 className="font-poppins font-bold text-sm flex items-center gap-1.5">
                        {activeProfile.name}
                        <span className="text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                          Verified
                        </span>
                      </h4>
                      <p className="text-[10px] font-sans opacity-90">{activeProfile.profession}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-lg">
                      <Brain size={22} className="animate-pulse" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-poppins font-bold text-sm flex items-center gap-1">
                        Pundit Shastri AI Coach
                      </h4>
                      <p className="text-[10px] font-sans opacity-90">Spiritual Counselor &amp; Scholar</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white"
                  title={isMuted ? 'Unmute chat sound' : 'Mute chat sound'}
                >
                  {isMuted ? <BellOff size={16} /> : <Bell size={16} />}
                </button>
                <button
                  id="btn-close-chat"
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 bg-ivory p-4 overflow-y-auto space-y-4 text-left mandala-pattern">
              {messages.map((msg) => {
                const isUser = msg.senderId === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-orange-500 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1.5">
                        <span
                          className={`text-[9px] ${
                            isUser ? 'text-orange-100' : 'text-gray-400'
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                        {isUser && (
                          <span className="inline-flex items-center">
                            {msg.status === 'read' ? (
                              <CheckCheck size={12} className="text-sky-200 stroke-[2.5]" aria-label="Read" />
                            ) : msg.status === 'delivered' ? (
                              <CheckCheck size={12} className="text-orange-200" aria-label="Delivered" />
                            ) : (
                              <Check size={12} className="text-orange-200" aria-label="Sent" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-xs rounded-bl-none">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                placeholder={activeProfile ? `Type serious message to ${activeProfile.name}...` : 'Ask Pundit Shastri ji (e.g. Manglik Dosha)...'}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 p-3 text-xs bg-gray-50 rounded-xl outline-none border border-gray-100 focus:border-orange-500 focus:bg-white transition-all font-sans"
              />
              <button
                type="submit"
                id="btn-chat-send"
                className="p-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/10 cursor-pointer transition-transform duration-100 active:scale-95"
              >
                <Send size={14} />
              </button>
            </form>

            {/* Privacy note */}
            <div className="py-2.5 px-4 bg-gray-50 text-[10px] text-gray-400 flex items-center gap-1.5 justify-center border-t border-gray-100/50">
              <Shield size={12} className="text-emerald-500" />
              <span>Messages are securely encrypted. We value your family values.</span>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
