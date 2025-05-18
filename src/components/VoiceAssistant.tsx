import React, { useState, useRef } from "react";
import { getSpeechRecognition, speak } from "../utils/speech";
import { askAI } from "../utils/openai";

export const VoiceAssistant: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const handleVoiceInput = () => {
        const recognition = getSpeechRecognition();
        if (!recognition) return alert("SpeechRecognition not supported");

        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.continuous = false;

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);

        // @ts-ignore
        recognition.onresult = async (event) => {
            const transcript = event.results[0][0].transcript;
            setMessages((prev) => [...prev, `🗣️ You: ${transcript}`]);
            const reply = await askAI(transcript);
            setMessages((prev) => [...prev, `🤖 AI: ${reply}`]);
            speak(reply);
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-2xl rounded-2xl">
            <h1 className="text-2xl font-bold mb-4">🎤 AI Voice Assistant</h1>
            <button
                onClick={handleVoiceInput}
                className={`w-full py-2 px-4 rounded-xl text-white font-semibold ${
                    listening ? "bg-red-500" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {listening ? "Listening..." : "Start Talking"}
            </button>

            <div className="mt-6 space-y-3">
                {messages.map((msg, idx) => (
                    <div key={idx} className="bg-gray-100 p-3 rounded-md shadow-sm text-gray">
                        {msg}
                    </div>
                ))}
            </div>
        </div>
    );
};
