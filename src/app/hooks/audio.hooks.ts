import { useCallback, useState } from "react";
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player";

interface AudioPlayerProps {
    objectUrl: string;
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
}

export const useAudioPlayback = ({ objectUrl }: AudioPlayerProps): AudioPlayback => {
    const { togglePlayPause, playing, volume } = useAudioPlayer({
        src: objectUrl,
        format: "mp3",
        autoplay: false,
    });
    const { position, duration, seek } = useAudioPosition({ highRefreshRate: true });

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

    const scrubToPosition = (position: number) => {
        setScrubbing(true);
        setTrackPosition(position);
    };

    const currentPosition = scrubbing ? trackPosition : position;

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
    };
};
