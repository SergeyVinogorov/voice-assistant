import React from "react";

type ChatMessages = {
    role: "user" | "ai";
    text: string;
}
interface Props {
    chatMessages: ChatMessages[]
}

export const ChatMessages: React.FC<Props> = ({chatMessages}) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">💬 Conversation</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
                {chatMessages.map((msg, i) => (
                    <div key={i} className={`p-3 rounded-md shadow-sm text-sm ${msg.role === "user" ? "bg-blue-100 text-right" : "bg-gray-100 text-left"}`}>
                        <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.text}
                    </div>
                ))}
            </div>
        </div>
    );
};
