import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineChatAlt2, HiX, HiOutlinePaperAirplane } from 'react-icons/hi';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your Vedalush assistant. How can I help you discover the perfect organic skincare today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat`, {
        message: userMessage.text
      });
      
      const botMessage = { id: Date.now() + 1, text: response.data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat API Error:', error);
      const errorMessage = { 
        id: Date.now() + 1, 
        text: "I'm having trouble connecting right now. Please try again later or contact us directly on WhatsApp.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMarkdownText = (text) => {
    // Simple parser for basic markdown bold and links
    let parsedText = text;
    // Bold
    parsedText = parsedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Links [Text](URL)
    parsedText = parsedText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#8E7A65] underline hover:text-[#5D4E42] font-semibold">$1</a>');
    // Bullet points
    parsedText = parsedText.replace(/^- (.*)$/gm, '<li class="ml-4 list-disc">$1</li>');
    // New lines
    parsedText = parsedText.replace(/\n/g, '<br/>');

    return <div dangerouslySetInnerHTML={{ __html: parsedText }} />;
  };

  return (
    <>
      {/* Floating Action Button */}
      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] flex items-center justify-center">
        {!isOpen && (
          <span className="absolute animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite] inline-flex h-full w-full rounded-full bg-[#8E7A65] opacity-40"></span>
        )}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-[#5D4E42] text-white p-4 rounded-full shadow-lg hover:bg-[#8E7A65] transition-all duration-300 hover:scale-110 flex items-center justify-center"
          aria-label="Toggle Chat"
        >
          {isOpen ? (
            <HiX className="w-7 h-7" />
          ) : (
            <HiOutlineChatAlt2 className="w-7 h-7" />
          )}
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed bottom-[84px] right-4 sm:bottom-[100px] sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[600px] max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#E6DED2] origin-bottom-right"
          >
            {/* Header */}
            <div className="bg-[#5D4E42] text-white p-4 flex justify-between items-center shadow-md z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                  <HiOutlineChatAlt2 className="w-6 h-6" />
                </div>
                <div className="flex flex-col justify-center text-left">
                  <div className="font-serif font-bold text-base sm:text-lg leading-tight">Vedalush Assistant</div>
                  <div className="text-xs text-white/80 mt-0.5 flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    Online
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors shrink-0 focus:outline-none"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#F8F4EC] space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl shadow-sm text-sm ${
                      msg.sender === 'user' 
                        ? 'bg-[#8E7A65] text-white rounded-tr-sm' 
                        : 'bg-white border border-[#E6DED2] text-[#5D4E42] rounded-tl-sm'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      msg.text
                    ) : (
                      renderMarkdownText(msg.text)
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E6DED2] p-4 rounded-2xl rounded-tl-sm flex gap-1.5 items-center shadow-sm">
                    <div className="w-2 h-2 bg-[#8E7A65]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-[#8E7A65]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-[#8E7A65]/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#E6DED2] flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about products or skin types..."
                className="flex-1 bg-[#F8F4EC] border border-[#E6DED2] rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8E7A65] text-[#5D4E42] placeholder-[#5D4E42]/50"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-[#5D4E42] text-white p-2.5 rounded-full hover:bg-[#8E7A65] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <HiOutlinePaperAirplane className="w-5 h-5 transform rotate-90" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
