"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerRole: string;
  lastMessage: string;
  lastAt: string;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

function MessagesContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const userId = (session?.user as any)?.id;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(
    searchParams.get("to")
  );
  const [partnerName, setPartnerName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    fetch("/api/messages").then(r => r.json()).then(data => {
      setConversations(data.conversations || []);
    });
  }, []);

  // Load messages for selected partner
  useEffect(() => {
    if (!selectedPartner) return;
    fetch(`/api/messages/${selectedPartner}`)
      .then(r => r.json())
      .then(data => {
        setMessages(data.messages || []);
        if (data.partner) setPartnerName(data.partner.name);
      });
  }, [selectedPartner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages
  useEffect(() => {
    if (!selectedPartner) return;
    const interval = setInterval(() => {
      fetch(`/api/messages/${selectedPartner}`)
        .then(r => r.json())
        .then(data => setMessages(data.messages || []));
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedPartner]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedPartner) return;
    setLoading(true);
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: selectedPartner, content: newMessage }),
    });
    setNewMessage("");
    // Reload messages
    const data = await fetch(`/api/messages/${selectedPartner}`).then(r => r.json());
    setMessages(data.messages || []);
    setLoading(false);
  };

  const roleLabel = (role: string) =>
    role === "STUDENT" ? "학생" : role === "COMPANY" ? "기업" : "관리자";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">메시지</h1>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ height: "70vh" }}>
        <div className="flex h-full">
          {/* 대화 목록 */}
          <div className="w-80 border-r flex flex-col">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-bold text-gray-700">대화 목록</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-sm text-gray-400 text-center">대화가 없습니다</div>
              ) : (
                conversations.map((conv) => (
                  <button key={conv.partnerId}
                    onClick={() => setSelectedPartner(conv.partnerId)}
                    className={`w-full text-left p-4 border-b hover:bg-gray-50 transition ${
                      selectedPartner === conv.partnerId ? "bg-orange-50" : ""
                    }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{conv.partnerName}</span>
                        <span className="ml-1 text-xs text-gray-400">({roleLabel(conv.partnerRole)})</span>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">{conv.lastMessage}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* 대화 내용 */}
          <div className="flex-1 flex flex-col">
            {selectedPartner ? (
              <>
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="font-bold text-gray-900">{partnerName}</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id}
                      className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
                        msg.senderId === userId
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.senderId === userId ? "text-orange-200" : "text-gray-400"
                        }`}>
                          {new Date(msg.createdAt).toLocaleString("ko-KR")}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t">
                  <div className="flex gap-3">
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                      className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="메시지를 입력하세요..."
                    />
                    <button onClick={sendMessage} disabled={loading || !newMessage.trim()}
                      className="bg-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-700 transition disabled:opacity-50">
                      전송
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-2xl mb-4">
                    <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <p>대화를 선택하거나 새 메시지를 보내세요</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto py-20 text-center text-gray-500">로딩 중...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
