import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, X, MessageSquare } from 'lucide-react';
import API from '../../api';

const AIChatBot = ({ patientId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            API.get('planner/ai-chat/').then(res => {
                const history = [];
                res.data.forEach(chat => {
                    history.push({ type: 'user', text: chat.query });
                    history.push({ type: 'ai', text: chat.response });
                });
                setMessages(history);
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userMsg = query;
        setQuery('');
        setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const res = await API.post('planner/ai-chat/', { query: userMsg, patient: patientId });
            setMessages(prev => [...prev, { type: 'ai', text: res.data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { type: 'ai', text: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setLoading(false);
        }
    };

    const suggestions = [
        "Fever/Temperature",
        "Nutrition & Diet",
        "Nausea/Sickness",
        "Fatigue/Weakness",
        "Mouth Sores",
        "Social Support"
    ];

    const handleSuggestion = (text) => {
        setQuery(text);
        // We don't trigger send automatically to let them edit if they want, 
        // but for better UX we could. Let's just set it for now.
    };

    return (
        <div className="fixed-bottom end-0 p-4" style={{ zIndex: 1050 }}>
            {isOpen ? (
                <div className="glass-card shadow-lg border-primary border-top border-4" style={{ width: '350px', height: '520px', display: 'flex', flexDirection: 'column' }}>
                    <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-primary text-white rounded-top">
                        <div className="d-flex align-items-center">
                            <Bot size={20} className="me-2" />
                            <h6 className="mb-0 fw-bold">Onco Assistant AI</h6>
                        </div>
                        <button className="btn btn-sm text-white p-0" onClick={() => setIsOpen(false)}><X size={20} /></button>
                    </div>

                    <div className="flex-grow-1 p-3 overflow-auto chat-scroll" ref={scrollRef} style={{ background: '#f8f9fa' }}>
                        {messages.length === 0 && (
                            <div className="text-center mt-4 text-muted">
                                <Bot size={40} className="mb-2 opacity-25" />
                                <p className="small px-3">Hi! I'm here to help with your care questions. Try asking about:</p>
                                <div className="d-flex flex-wrap justify-content-center gap-2 mt-2 px-2">
                                    {suggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            className="btn btn-xs btn-outline-primary rounded-pill py-1 px-3"
                                            style={{ fontSize: '11px' }}
                                            onClick={() => handleSuggestion(s)}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <div key={i} className={`d-flex mb-3 ${m.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div className={`p-2 rounded-4 small shadow-sm ${m.type === 'user' ? 'bg-primary text-white rounded-bottom-end-0' : 'bg-white text-dark rounded-bottom-start-0'}`} style={{ maxWidth: '85%' }}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="d-flex justify-content-start mb-3">
                                <div className="bg-white p-2 rounded-4 small shadow-sm">
                                    <span className="spinner-grow spinner-grow-sm text-primary" role="status"></span>
                                    <span className="ms-2">Thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <form className="p-3 border-top bg-white rounded-bottom" onSubmit={handleSend}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control border-0 bg-light rounded-start-pill px-3"
                                placeholder="Type your question..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                            <button className="btn btn-primary rounded-end-pill px-3" type="submit">
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <button
                    className="btn btn-primary rounded-circle shadow-lg p-3 animate__animated animate__bounceIn"
                    onClick={() => setIsOpen(true)}
                    style={{ width: '60px', height: '60px' }}
                >
                    <MessageSquare size={24} />
                    <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger border border-light" style={{ fontSize: '10px' }}>AI</span>
                </button>
            )}
        </div>
    );
};

export default AIChatBot;
