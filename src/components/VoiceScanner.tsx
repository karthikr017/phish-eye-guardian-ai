
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VoiceScannerProps {
  onUrlDetected: (url: string) => void;
  onVoiceCommand: (command: string) => void;
}

export function VoiceScanner({ onUrlDetected, onVoiceCommand }: VoiceScannerProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        console.log('Voice recognition started');
      };

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);

        if (finalTranscript) {
          processVoiceCommand(finalTranscript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Please check your microphone permissions",
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        console.log('Voice recognition ended');
      };

      setRecognition(recognitionInstance);
    } else {
      setIsSupported(false);
    }
  }, []);

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Extract URLs from voice command
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/g;
    const urls = command.match(urlRegex);
    
    if (urls && urls.length > 0) {
      let processedUrl = urls[0];
      if (!processedUrl.startsWith('http')) {
        processedUrl = 'https://' + processedUrl;
      }
      onUrlDetected(processedUrl);
      speakResponse(`I'll scan ${processedUrl} for you.`);
    }
    
    // Handle voice commands
    if (lowerCommand.includes('scan') || lowerCommand.includes('check') || lowerCommand.includes('analyze')) {
      onVoiceCommand('scan');
      if (!urls) {
        speakResponse("Please tell me which website you'd like me to scan.");
      }
    } else if (lowerCommand.includes('stop') || lowerCommand.includes('cancel')) {
      onVoiceCommand('stop');
      speakResponse("Scanning stopped.");
    } else if (lowerCommand.includes('help')) {
      onVoiceCommand('help');
      speakResponse("You can say 'scan website.com' or 'check if this site is safe' followed by a URL.");
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = speechSynthesis.getVoices().find(voice => 
        voice.name.includes('Google') || voice.name.includes('Microsoft')
      ) || null;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript('');
      recognition.start();
      toast({
        title: "Voice Scanner Active",
        description: "Say 'scan [website]' or 'check [website]'",
      });
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  if (!isSupported) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 text-center">
          <MicOff className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">Voice recognition is not supported in this browser.</p>
          <p className="text-sm text-slate-500 mt-2">Try using Chrome, Edge, or Safari for voice features.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Mic className="w-5 h-5 mr-2" />
          Voice-Powered Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button 
            onClick={startListening}
            disabled={isListening}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
          >
            {isListening ? (
              <>
                <Volume2 className="w-4 h-4 mr-2 animate-pulse" />
                Listening...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Start Voice Scan
              </>
            )}
          </Button>
          
          {isListening && (
            <Button 
              onClick={stopListening}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <MicOff className="w-4 h-4" />
            </Button>
          )}
        </div>

        {transcript && (
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <p className="text-sm text-slate-300 mb-1">You said:</p>
            <p className="text-white">{transcript}</p>
          </div>
        )}

        <div className="bg-slate-700/50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <MessageCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-green-500 mb-1">Voice Commands</p>
              <ul className="space-y-1 text-xs">
                <li>• "Scan example.com"</li>
                <li>• "Check if this website is safe: website.com"</li>
                <li>• "Analyze threats on domain.com"</li>
                <li>• "Help" - for more commands</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
