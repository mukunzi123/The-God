
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { createFaithChat } from '../services/geminiService';
import { GenerateContentResponse } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

const FaithAssistant: React.FC = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = createFaithChat(language);
    setMessages([
      { 
        role: 'model', 
        text: language === 'Kinyarwanda' 
          ? 'Muraho! Nejejwe no kubafasha mu rugendo rwanyu rwa gikristo. Mbafashe iki uyu munsi?' 
          : language === 'French'
          ? 'Bonjour! Je suis ravi de vous accompagner dans votre cheminement spirituel. Comment puis-je vous aider aujourd\'hui?'
          : 'Welcome! I am here to assist you in your spiritual journey. How can I help you today?'
      }
    ]);
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatRef.current.sendMessageStream({ message: textToSend });
      let fullResponse = '';
      
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        fullResponse += c.text;
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text = fullResponse;
          return newMsgs;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'I apologize, I encountered an error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = language === 'Kinyarwanda' 
    ? ["Nsomera isengesho rya mu gitondo", "Nsobanurira urukundo rwa Yesu", "Inyigisho ku kwihangana"]
    : language === 'French'
    ? ["Prière du matin", "Expliquez-moi la grâce", "Versets sur la paix"]
    : ["Morning prayer", "Explain the concept of Grace", "Verses for inner peace"];

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-64px)] flex flex-col p-4 md:p-8">
      <div className="bg-white rounded-3xl shadow-xl flex-grow flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-blue-900 p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center text-blue-900 shadow-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Faith AI Assistant</h2>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Powered by BSR Digital Ministry</p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <span className="text-xs px-3 py-1 bg-white/10 rounded-full border border-white/20">
              Session in {language}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50"
        >
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={`max-w-[85%] md:max-w-[70%] p-5 rounded-3xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-700 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed serif text-lg">{msg.text || (isLoading && i === messages.length - 1 ? '...' : '')}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl border border-gray-100">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Input */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(undefined, s)}
                className="text-xs font-bold px-4 py-2 bg-gray-50 text-gray-600 border border-gray-100 rounded-full hover:bg-blue-50 hover:text-blue-700 transition"
              >
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'Kinyarwanda' ? "Andika hano..." : "Ask a question..."}
              className="w-full pl-6 pr-16 py-5 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition"
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-700 text-white rounded-xl flex items-center justify-center hover:bg-blue-800 transition shadow-lg disabled:opacity-50"
            >
              <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </form>
          <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-widest font-bold">
            Guidance based on the Holy Scriptures
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaithAssistant;
