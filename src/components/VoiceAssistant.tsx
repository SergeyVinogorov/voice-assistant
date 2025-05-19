import React, { useState, useRef } from "react";
import { getSpeechRecognition, speak, stopSpeaking } from "../utils/speech";
import { askAI } from "../utils/openai";
import { ChatMessages } from './ChatMessages'
import { LatestNews } from "./LatestNews";
import { StickyNotes } from "./StickyNotes";

export const VoiceAssistant: React.FC = () => {
    const [notes, setNotes] = useState<string[]>([]);
    const [news, setNews] = useState<string[]>([]);
    const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
    const [listening, setListening] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const addNote = (text: string) => setNotes(prev => [...prev, text]);

    const handleCommand = async (command: string) => {
        const lower = command.toLowerCase();
        setError(null);

        if (lower.startsWith("create a note")) {
            const noteText = command.replace(/create a note/i, "").trim();
            addNote(noteText);
            return;
        }

        if (lower.includes("news")) {
            setLoading(true);
            try {
                const summary = await askAI("Give me today's most important news in 3 bullet points.");
                const lines = summary.split(/\n+/).map(line => line.replace(/^\d+\.\s*/, ''));
                setNews(lines);
                speak(summary);
            } catch (err: any) {
                setError(err.message);
            }
            setLoading(false);
            return;
        }

        if (lower.startsWith("create note about")) {
            const keyword = lower.replace("create note about", "").trim();
            const match = news.find(n => n.toLowerCase().includes(keyword));
            if (match) addNote(match);
            return;
        }

        if (["stop", "skip", "cancel"].some(word => lower.includes(word))) {
            stopSpeaking();
            return;
        }

        // Non-action → treat as chat
        setLoading(true);
        setChatMessages(prev => [...prev, { role: "user", text: command }]);

        try {
            const reply = await askAI(command);
            setChatMessages(prev => [...prev, { role: "ai", text: reply }]);
            speak(reply);
        } catch (err: any) {
            setError(err.message);
        }

        setLoading(false);
    };

    const startListening = () => {
        const recognition = getSpeechRecognition();
        if (!recognition) return alert("Speech recognition not supported");

        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            handleCommand(transcript);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold">🎤 AI Voice Assistant</h1>
                <p className="text-gray-500 mt-1">Try saying: “Create a note…”, “What’s in the news today?”, “Create note about…”</p>
                <button
                    onClick={startListening}
                    className={`mt-4 px-6 py-2 text-white rounded-xl font-medium ${
                        listening ? "bg-red-500" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {listening ? "Listening..." : "Start Talking"}
                </button>
                <button
                    onClick={stopSpeaking}
                    className="mt-4 px-6 py-2 ml-2 text-sm text-white bg-gray-500 hover:bg-gray-600 rounded-xl"
                >
                    Skip
                </button>
                {loading && <p className="text-sm text-gray-400 mt-2 animate-pulse">🤖 Thinking...</p>}
                {error && <p className="text-sm text-red-600 mt-2">❌ {error}</p>}
            </div>

            {chatMessages.length > 0 && (
                <ChatMessages chatMessages={chatMessages}/>
            )}

            {news.length > 0 && (
               <LatestNews news={news}/>
            )}

            {notes.length > 0 && (
               <StickyNotes notes={notes}/>
            )}
        </div>
    );
};
