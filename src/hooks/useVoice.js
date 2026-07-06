import { useState, useEffect, useRef, useCallback } from 'react';

export function useVoice({ onTranscript, onSpeakStart, onSpeakEnd, onBoundary }) {
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  
  const recognitionRef = useRef(null);
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };
      
      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptStr = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptStr;
          } else {
            interim += transcriptStr;
          }
        }
        
        setInterimTranscript(interim);
        if (final && onTranscript) {
          onTranscript(final);
        }
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, [onTranscript]);
  
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Failed to start listening", e);
      }
    }
  }, [isListening]);
  
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);
  
  const cancelSpeak = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);
  
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    
    cancelSpeak();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find Indian English voice
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.name.includes('India') || v.lang === 'en-IN');
    if (indianVoice) {
      utterance.voice = indianVoice;
    }
    
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    if (onSpeakStart) {
      utterance.onstart = onSpeakStart;
    }
    
    if (onBoundary) {
      utterance.onboundary = onBoundary;
    }
    
    if (onSpeakEnd) {
      utterance.onend = onSpeakEnd;
    }
    
    window.speechSynthesis.speak(utterance);
  }, [onSpeakStart, onSpeakEnd, onBoundary, cancelSpeak]);
  
  // Ensure voices are loaded (Chrome sometimes needs this)
  useEffect(() => {
    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Just triggers re-evaluation if needed
      };
    }
  }, []);

  return {
    voiceSupported,
    isListening,
    interimTranscript,
    startListening,
    stopListening,
    speak,
    cancelSpeak
  };
}
