import { useAppDispatch, useAppSelector } from "app/hooks";
import { finishScrub, scrubTrackToPosition, selectPositionState, selectVolume, setTrackToPosition, setVolume, toggleVolume } from "features/audio/audioSlice";
import { useCallback } from "react";
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
    const dispatch = useAppDispatch();
    const { volumeLevel, lastUnmutedVolumeLevel } = useAppSelector(selectVolume);
    const { trackPosition, scrubbing } = useAppSelector(selectPositionState);

    const { togglePlayPause, playing, volume, stop } = useAudioPlayer({
        src: objectUrl ? objectUrl : 'dummy.mp3',
        format: "mp3",
        autoplay: !!objectUrl,
        onseek: () => dispatch(finishScrub()),
    });
    const { position, duration, seek } = useAudioPosition({ highRefreshRate: true });

    const setVolumeLevel = useCallback((vol: number) => {
        dispatch(setVolume({ volumeLevel: vol }));
        volume(vol);
    }, [dispatch, volume]);

    const toggleVolumeState = useCallback(() => {
        dispatch(toggleVolume());
        if (volumeLevel === 0) volume(lastUnmutedVolumeLevel);
        else volume(0);
    }, [dispatch, volume, volumeLevel, lastUnmutedVolumeLevel]);

    const setToPosition = useCallback((position: number) => {
        seek(position);
        dispatch(setTrackToPosition({ position }));
    }, [dispatch, seek]);

    const scrubToPosition = useCallback((position: number) => {
        dispatch(scrubTrackToPosition({ position }));
    }, [dispatch]);

    const currentPosition = scrubbing ? trackPosition : position;

    if (!objectUrl) return nullAudioPlayback;

    return {
        playing,
        togglePlayPause,
        volume: volumeLevel,
        setVolumeLevel,
        toggleVolume: toggleVolumeState,
        position: currentPosition,
        setToPosition,
        scrubToPosition,
        duration,
        stop
    };
};
