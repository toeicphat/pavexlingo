import React, { useState, useEffect, useCallback, useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { PlayIcon, PauseIcon, LinkIcon, PlusIcon, MinusIcon } from './icons';

export interface AudioPlayerHandle {
    replay: () => void;
}

interface AudioPlayerProps {
    audioScript?: string;
    audioSrc?: string;
    autoPlay?: boolean;
}

const isGoogleDriveId = (id: string | undefined): id is string => {
    // Google Drive IDs are typically ~33 chars, alphanumeric with underscores/hyphens
    return !!id && !id.includes('/') && !id.startsWith('http') && id.length >= 25;
};

const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(({ audioScript, audioSrc, autoPlay = false }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
    const [speechRate, setSpeechRate] = useState(1.0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    
    const lastSpokenScriptRef = useRef<string | null>(null);

    const driveMode = useMemo(() => isGoogleDriveId(audioSrc), [audioSrc]);

    // Helper to play TTS with current settings
    const playTTS = useCallback((text: string) => {
        const synth = window.speechSynthesis;
        // Cancel any ongoing speech
        synth.cancel();

        const u = new SpeechSynthesisUtterance(text);
        
        // Apply current voice
        if (voices.length > 0) {
            const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
            if (selectedVoice) {
                u.voice = selectedVoice;
            } else {
                 // Fallback to the first available if selected isn't found (shouldn't happen often)
                 u.voice = voices[0];
            }
        }
        
        // Apply current rate
        u.rate = speechRate;
        
        u.onend = () => setIsPlaying(false);
        u.onstart = () => setIsPlaying(true);
        u.onerror = () => setIsPlaying(false);

        utteranceRef.current = u;
        synth.speak(u);
    }, [voices, selectedVoiceURI, speechRate]);

    // Expose replay method to parent
    useImperativeHandle(ref, () => ({
        replay: () => {
            if (driveMode) return; 

            if (audioSrc && audioRef.current) {
                const audio = audioRef.current;
                audio.currentTime = 0;
                audio.play().catch(() => setIsPlaying(false));
                setIsPlaying(true);
            } else if (audioScript) {
                // Re-create the utterance to ensure it plays (browsers sometimes fail to replay the same instance)
                playTTS(audioScript);
            }
        }
    }));

    // Effect for loading system voices and settings for TTS
    useEffect(() => {
        if (driveMode) return;
        const loadVoicesAndSettings = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                // Prioritize English voices (US, GB, AU, CA, etc.)
                const englishLocales = ['en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN', 'en-NZ', 'en-IE', 'en-ZA'];
                const englishVoices = availableVoices.filter(v => 
                    englishLocales.some(locale => v.lang.startsWith(locale)) || v.lang.startsWith('en-')
                );
                
                setVoices(englishVoices.length > 0 ? englishVoices : availableVoices);
                
                const savedVoiceURI = localStorage.getItem('tts-voice');
                let initialVoice = availableVoices.find(v => v.voiceURI === savedVoiceURI);
                
                if (!initialVoice) {
                    // Try to find a good English default (like Google US English)
                    initialVoice = englishVoices.find(v => v.name.includes('Google') && v.lang === 'en-US') || 
                                   englishVoices.find(v => v.lang === 'en-US') || 
                                   englishVoices[0] || 
                                   availableVoices[0];
                }
                
                // Only set if we don't have one or if we are initializing
                if (!selectedVoiceURI) {
                    setSelectedVoiceURI(initialVoice?.voiceURI || null);
                }
            }
            const savedRate = localStorage.getItem('tts-rate');
            if (savedRate) {
                setSpeechRate(parseFloat(savedRate));
            }
        };

        window.speechSynthesis.addEventListener('voiceschanged', loadVoicesAndSettings);
        loadVoicesAndSettings();

        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', loadVoicesAndSettings);
        };
    }, [driveMode, selectedVoiceURI]); // Added selectedVoiceURI dependency to avoid overwriting user selection

    // Handle voice change
    const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const uri = e.target.value;
        setSelectedVoiceURI(uri);
        localStorage.setItem('tts-voice', uri);
    };

    const handleSpeedChange = useCallback((change: number) => {
        setSpeechRate(prev => {
            const newRate = Math.max(0.5, Math.min(2.0, parseFloat((prev + change).toFixed(1))));
            localStorage.setItem('tts-rate', newRate.toString());
            return newRate;
        });
    }, []);

    // Effect for updating HTML Audio playback rate
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = speechRate;
        }
    }, [speechRate]);

    // Effect for preparing/playing the TTS utterance automatically on change
    useEffect(() => {
        if (driveMode || !audioScript) {
            window.speechSynthesis.cancel();
            utteranceRef.current = null;
            return;
        }

        // Automatically play ONLY IF autoPlay is enabled AND this script hasn't been spoken yet
        if (autoPlay && lastSpokenScriptRef.current !== audioScript) {
            // Use a small timeout to ensure voices are loaded and previous audio is cleared
            const timer = setTimeout(() => {
                playTTS(audioScript);
                lastSpokenScriptRef.current = audioScript;
            }, 100);
            return () => clearTimeout(timer);
        }

        // We don't pre-create the utterance here anymore to avoid stale closures.
        // playTTS will create it on demand or when auto-play triggers.

        return () => {
             // Cleanup on unmount or script change
             if (window.speechSynthesis.speaking) {
                 window.speechSynthesis.cancel();
             }
        };
    }, [audioScript, driveMode, autoPlay, playTTS]); 

    // Effect for handling standard <audio> element events
    useEffect(() => {
        if (driveMode) return;
        const audio = audioRef.current;
        if (!audio) return;

        setHasError(false);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => setIsPlaying(false);
        const onError = () => {
            setIsPlaying(false);
            setHasError(true);
        };
        const onTimeUpdate = () => {
            if (audio) setCurrentTime(audio.currentTime);
        };
        const onCanPlayThrough = () => {
            setDuration(audio.duration);
            // Apply speed setting when audio is ready
            audio.playbackRate = speechRate;
            
            // Auto-play only if the source has changed
            if (autoPlay && lastSpokenScriptRef.current !== audioSrc) {
                audio.play().catch(() => {});
                lastSpokenScriptRef.current = audioSrc || null;
            }
        };

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('error', onError);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('canplaythrough', onCanPlayThrough);

        return () => {
            if (audio) {
                audio.removeEventListener('play', onPlay);
                audio.removeEventListener('pause', onPause);
                audio.removeEventListener('ended', onEnded);
                audio.removeEventListener('error', onError);
                audio.removeEventListener('timeupdate', onTimeUpdate);
                audio.removeEventListener('canplaythrough', onCanPlayThrough);
            }
        };
    }, [audioSrc, driveMode, autoPlay, speechRate]); 
    
    // Global cleanup
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            if (audioRef.current && !audioRef.current.paused) {
                audioRef.current.pause();
            }
        };
    }, []);

    const handlePlayPause = useCallback(() => {
        if (!driveMode && !hasError && audioRef.current && audioSrc) {
            const audio = audioRef.current;
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play().catch(() => setIsPlaying(false));
            }
        } else if (audioScript) {
            const synth = window.speechSynthesis;
            if (isPlaying) {
                synth.cancel();
                setIsPlaying(false);
            } else {
                playTTS(audioScript);
            }
        }
    }, [isPlaying, driveMode, hasError, audioScript, audioSrc, playTTS]);
    
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const newTime = Number(e.target.value);
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    if (driveMode) {
        return (
            <div className="w-full space-y-3">
                <div className="relative w-full aspect-video sm:aspect-auto sm:h-[150px] overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-black shadow-lg">
                    <iframe 
                        src={`https://drive.google.com/file/d/${audioSrc}/preview`} 
                        className="absolute inset-0 w-full h-full border-none"
                        allow="autoplay"
                        title="Google Drive Audio Player"
                    />
                </div>
                <div className="flex justify-center">
                    <a 
                        href={`https://drive.google.com/file/d/${audioSrc}/view`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
                    >
                        <LinkIcon className="h-3 w-3" />
                        Mở trong Google Drive (Nếu không nghe được)
                    </a>
                </div>
            </div>
        );
    }

    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds) || timeInSeconds === Infinity) return '00:00';
        const m = Math.floor(timeInSeconds / 60);
        const s = Math.floor(timeInSeconds % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    return (
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 shadow-inner border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex items-center gap-4 flex-grow">
                    {!hasError && audioSrc && <audio ref={audioRef} src={audioSrc} hidden preload="metadata" />}
                    <button 
                        onClick={handlePlayPause}
                        className="flex-shrink-0 bg-blue-600 text-white rounded-full h-16 w-16 flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                    >
                        {isPlaying ? <PauseIcon className="h-8 w-8" /> : <PlayIcon className="h-8 w-8" />}
                    </button>
                    <div className="flex-grow">
                        {!hasError && audioSrc ? (
                            <div className="flex items-center space-x-3 w-full">
                                <span className="text-sm font-mono text-slate-500 w-12">{formatTime(currentTime)}</span>
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 0}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <span className="text-sm font-mono text-slate-500 w-12">{formatTime(duration)}</span>
                            </div>
                        ) : (
                            <div className="text-slate-700 dark:text-slate-300">
                                <p className="font-black text-lg">Phát âm AI</p>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-0.5">Nhấn Play để nghe giáo viên đọc</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Speed Control */}
                <div className="flex flex-col items-center justify-center min-w-[5rem]">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 px-1">Tốc độ</label>
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-300 dark:border-slate-600 shadow-sm">
                        <button 
                            onClick={() => handleSpeedChange(-0.1)} 
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300 transition-colors"
                            aria-label="Slow down"
                        >
                            <MinusIcon className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold w-8 text-center text-slate-700 dark:text-slate-200 tabular-nums">
                            {speechRate.toFixed(1)}x
                        </span>
                        <button 
                            onClick={() => handleSpeedChange(0.1)} 
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300 transition-colors"
                            aria-label="Speed up"
                        >
                            <PlusIcon className="h-3 w-3" />
                        </button>
                    </div>
                </div>

                {/* Voice Selector - only for TTS */}
                {(!audioSrc && voices.length > 0) && (
                    <div className="flex flex-col sm:w-48">
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 px-1">Giọng đọc</label>
                        <select 
                            value={selectedVoiceURI || ''} 
                            onChange={handleVoiceChange}
                            className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-xs font-bold rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none w-full"
                        >
                            {voices.map(voice => (
                                <option key={voice.voiceURI} value={voice.voiceURI}>
                                    {voice.name} ({voice.lang})
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
});

export default AudioPlayer;