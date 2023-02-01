import { useCallback, useState } from "react";
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player";

interface AudioPlayerProps {
    objectUrl?: string;
}

export interface AudioPlayback {
    playing: boolean;
    togglePlayPause: () => void;
    volume: number;
    setVolumeLevel: (volume: number) => void;
    toggleVolume: () => void;
    position: number;
    setToPosition: (position: number) => void;
    scrubToPosition: (position: number) => void;
    duration: number;
    stop: () => void;
}

const nullAudioPlayback: AudioPlayback = {
    playing: false,
    togglePlayPause: () => {},
    volume: 0,
    setVolumeLevel: () => {},
    toggleVolume: () => {},
    position: 0,
    setToPosition: (position: number) => {},
    scrubToPosition: (position: number) => {},
    duration: 0,
    stop: () => {},
};

export const useAudioPlayback = ({ objectUrl }: AudioPlayerProps): AudioPlayback => {
    const audioplayer = useAudioPlayer({
        src: objectUrl ? objectUrl : 'dummy.mp3',
        format: "mp3",
        autoplay: !!objectUrl,
    });
    const { togglePlayPause, playing, volume, stop } = audioplayer;
    const audioposition = useAudioPosition({ highRefreshRate: true });
    const { position, duration, seek } = audioposition;

    const [volumeState, setVolumeState] = useState<number>(1);
    const [lastUnmutedVolumeLevel, setLastUnmutedVolumeLevel] = useState<number>(1);
    const [trackPosition, setTrackPosition] = useState<number>(0);
    const [scrubbing, setScrubbing] = useState<boolean>(false);

    const setVolumeLevel = useCallback((vol: number) => {
        setVolumeState(vol);
        volume(vol);
    }, [volume]);

    const toggleVolume = useCallback(() => {
        if (volumeState === 0) setVolumeLevel(lastUnmutedVolumeLevel);
        else {
            setLastUnmutedVolumeLevel(volumeState);
            setVolumeLevel(0);
        }
    }, [volumeState, setVolumeLevel, lastUnmutedVolumeLevel]);

    const setToPosition = useCallback((position: number) => {
        setScrubbing(false);
        seek(position);
        setTrackPosition(position);
    }, [seek]);

    const scrubToPosition = useCallback((position: number) => {
        setScrubbing(true);
        setTrackPosition(position);
    }, [setScrubbing, setTrackPosition]);

    const currentPosition = scrubbing ? trackPosition : position;

    if (!objectUrl) return nullAudioPlayback;

    return {
        playing,
        togglePlayPause,
        volume: volumeState,
        setVolumeLevel,
        toggleVolume,
        position: currentPosition,
        setToPosition,
        scrubToPosition,
        duration,
        stop
    };
};
