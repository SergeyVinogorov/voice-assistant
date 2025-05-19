export async function askAI(prompt:string): Promise<string> {
    const apiKey = import.meta.env.VITE_VOICE_ASSISTANCE_KEY;
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: prompt}]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (err: any) {
        console.error("OpenAI error:", err);
        throw new Error(err.message || "Failed to fetch AI response.");
    }
}
