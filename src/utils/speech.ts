export function speak(text:string) {
    const utterance = new SpeechSynthesisUtterance(text)
    speechSynthesis.speak(utterance)
}

export function getSpeechRecognition(): SpeechRecognition | null {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    return new SpeechRecognition();
}
