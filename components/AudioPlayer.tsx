import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { PlayIcon, PauseIcon, LinkIcon } from './icons';

interface AudioPlayerProps {
    audioScript?: string;
    audioSrc?: string;
}

const isGoogleDriveId = (id: string | undefined): id is string => {
    // Google Drive IDs are typically ~33 chars, alphanumeric with underscores/hyphens
    return !!id && !id.includes('/') && !id.startsWith('http') && id.length >= 25;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioScript, audioSrc }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
    const [speechRate, setSpeechRate] = useState(1.0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const isPlayingRef = useRef(isPlaying);
    isPlayingRef.current = isPlaying;

    const driveMode = useMemo(() => isGoogleDriveId(audioSrc), [audioSrc]);

    // Effect for loading system voices and settings for TTS
    useEffect(() => {
        if (driveMode) return;
        const loadVoicesAndSettings = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
                const savedVoiceURI = localStorage.getItem('tts-voice');
                const defaultVoice = availableVoices.find(v => v.default) || availableVoices[0];
                const initialVoice = availableVoices.find(v => v.voiceURI === savedVoiceURI) || defaultVoice;
                setSelectedVoiceURI(initialVoice?.voiceURI || null);
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
    }, [driveMode]);

    // Effect for preparing the TTS utterance
    useEffect(() => {
        if (driveMode || !audioScript) {
            window.speechSynthesis.cancel();
            utteranceRef.current = null;
            return;
        }

        const synth = window.speechSynthesis;
        const u = new SpeechSynthesisUtterance(audioScript);
        
        if (voices.length > 0) {
            const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
            if (selectedVoice) {
                u.voice = selectedVoice;
            }
        }
        
        u.rate = speechRate;
        u.onend = () => setIsPlaying(false);
        utteranceRef.current = u;

        if (isPlayingRef.current) {
            synth.cancel();
            synth.speak(u);
        }

        return () => {
            if (synth.speaking) {
                synth.cancel();
            }
        };
    }, [audioScript, selectedVoiceURI, voices, speechRate, driveMode]);

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
        const onLoadedMetadata = () => {
            if (audio) setDuration(audio.duration);
        };

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('error', onError);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);

        return () => {
            if (audio) {
                audio.removeEventListener('play', onPlay);
                audio.removeEventListener('pause', onPause);
                audio.removeEventListener('ended', onEnded);
                audio.removeEventListener('error', onError);
                audio.removeEventListener('timeupdate', onTimeUpdate);
                audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            }
        };
    }, [audioSrc, driveMode]);
    
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
        if (!driveMode && !hasError && audioRef.current) {
            const audio = audioRef.current;
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play().catch(() => setIsPlaying(false));
            }
        } else if (audioScript && utteranceRef.current) {
            const synth = window.speechSynthesis;
            if (isPlaying) {
                synth.cancel();
                setIsPlaying(false);
            } else {
                synth.cancel();
                synth.speak(utteranceRef.current);
                setIsPlaying(true);
            }
        }
    }, [isPlaying, driveMode, hasError, audioScript]);
    
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
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg p-4 shadow-inner border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
                {!hasError && audioSrc && <audio ref={audioRef} src={audioSrc} hidden preload="metadata" />}
                <button 
                    onClick={handlePlayPause}
                    className="flex-shrink-0 bg-blue-500 text-white rounded-full h-12 w-12 flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md"
                >
                    {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
                </button>
                <div className="ml-4 flex-grow">
                    {!hasError && audioSrc ? (
                        <div className="flex items-center space-x-3 w-full">
                            <span className="text-xs font-mono text-slate-500 w-10">{formatTime(currentTime)}</span>
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                onChange={handleSeek}
                                className="w-full h-1.5 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <span className="text-xs font-mono text-slate-500 w-10">{formatTime(duration)}</span>
                        </div>
                    ) : (
                        <div className="text-slate-700 dark:text-slate-300">
                            <p className="font-semibold text-sm">Text-to-Speech Player</p>
                            <p className="text-xs text-slate-500">Nhấn Play để nghe giáo viên đọc.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;