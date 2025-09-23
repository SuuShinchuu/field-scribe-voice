import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Mic, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  disabled = false,
  className
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'es-ES';

      recognitionInstance.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript) {
          onTranscript(transcript);
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognition) {
      alert('Reconocimiento de voz no soportado en este navegador');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  return (
    <Button
      type="button"
      variant={isListening ? "default" : "outline"}
      size="sm"
      onClick={toggleListening}
      disabled={disabled || !recognition}
      className={cn(
        "shrink-0 transition-all duration-200",
        isListening 
          ? "bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/25" 
          : "hover:bg-primary hover:text-primary-foreground",
        className
      )}
    >
      {isListening ? (
        <Square className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};