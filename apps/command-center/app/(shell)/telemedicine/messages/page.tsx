'use client';
import { useState } from 'react';
import { Card, Input, Button, ChatBubble, Avatar, EmptyState } from '@eumetise/ui';
import { Send, Phone, Video, Search, MoreVertical } from 'lucide-react';

const conversations = [
    { id: 1, name: 'John Doe', lastMsg: 'I am feeling a bit dizzy today.', time: '10:30 AM', unread: 2 },
    { id: 2, name: 'Jane Smith', lastMsg: 'Thanks for the update, Doctor.', time: 'Yesterday', unread: 0 },
    { id: 3, name: 'Sarah Connor', lastMsg: 'Appointment confirmed.', time: 'Yesterday', unread: 0 },
];

const messages = [
    { id: 1, text: "Good morning John, how are you feeling today?", isSelf: true, time: "10:00 AM" },
    { id: 2, text: "I am feeling a bit dizzy today actually.", isSelf: false, time: "10:05 AM" },
    { id: 3, text: "Have you taken your blood pressure medication?", isSelf: true, time: "10:06 AM" },
    { id: 4, text: "Not yet, I will take it now.", isSelf: false, time: "10:08 AM" },
];

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState<number | null>(1);
    const [msgText, setMsgText] = useState("");

    return (
        <div className="h-[calc(100vh-140px)] flex gap-4">
            {/* Sidebar List */}
            <Card className="w-80 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input className="pl-9 h-9 text-sm" placeholder="Search patients..." />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(c => (
                        <div 
                            key={c.id} 
                            onClick={() => setSelectedChat(c.id)}
                            className={`p-4 flex gap-3 cursor-pointer hover:bg-gray-50 border-b border-gray-50 ${selectedChat === c.id ? 'bg-accent-50' : ''}`}
                        >
                            <Avatar initials={c.name.substring(0,2)} />
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-bold text-sm text-gray-900 truncate">{c.name}</h4>
                                    <span className="text-[10px] text-gray-400 shrink-0">{c.time}</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate mt-1">{c.lastMsg}</p>
                            </div>
                            {c.unread > 0 && (
                                <div className="h-5 w-5 bg-accent-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0 mt-1">
                                    {c.unread}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col overflow-hidden">
                {selectedChat ? (
                    <>
                        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
                            <div className="flex items-center gap-3">
                                <Avatar initials="JD" />
                                <div>
                                    <h3 className="font-bold text-gray-900">John Doe</h3>
                                    <p className="text-xs text-success-600 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-success-500 rounded-full" /> Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm"><Phone className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm"><Video className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                            {messages.map(m => (
                                <ChatBubble 
                                    key={m.id} 
                                    message={m.text} 
                                    isSelf={m.isSelf} 
                                    timestamp={m.time} 
                                />
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-white flex gap-3">
                            <Input 
                                placeholder="Type a secure message..." 
                                value={msgText}
                                onChange={e => setMsgText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && setMsgText('')}
                            />
                            <Button disabled={!msgText} variant="primary" icon={Send} />
                        </div>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <EmptyState 
                            title="No Conversation Selected" 
                            description="Select a patient from the list to view secure message history." 
                        />
                    </div>
                )}
            </Card>
        </div>
    );
}