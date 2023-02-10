import { useAppDispatch, useAppSelector } from "app/hooks";
import { finishScrub, scrubTrackToPosition, selectPositionState, selectVolume, setTrackToPosition, setVolume, toggleVolume } from "features/audio/audioSlice";
import SoundRecording from "models/SoundRecording.model";
import { useCallback, useEffect } from "react";
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player";

interface AudioPlayerProps {
    objectUrl?: string;
    soundRecording: SoundRecording;
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

export const useAudioPlayback = ({ objectUrl, soundRecording }: AudioPlayerProps): AudioPlayback => {
    const dispatch = useAppDispatch();
    const { volumeLevel, lastUnmutedVolumeLevel } = useAppSelector(selectVolume);
    const { trackPosition, scrubbing } = useAppSelector(selectPositionState);

    const { togglePlayPause, playing, volume, stop, stopped } = useAudioPlayer({
        src: objectUrl ? objectUrl : 'dummy.mp3',
        format: "mp3",
        autoplay: !!objectUrl,
        onseek: () => dispatch(finishScrub()),
        html5: true,
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

    useMediaSession({
        soundRecording,
        playbackState: playing ? 'playing' : (stopped ? 'none' : 'paused'),
        duration,
        position,
        togglePlayPause,
        setToPosition,
    });

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

interface MediaSessionProps {
    soundRecording: SoundRecording;
    playbackState: MediaSessionPlaybackState;
    duration: number;
    position: number;
    togglePlayPause: () => void;
    setToPosition: (pos: number) => void;
}

export const useMediaSession = ({ soundRecording, playbackState, duration, position, togglePlayPause, setToPosition }: MediaSessionProps) => {
    const mediaSessionAvailable = 'mediaSession' in navigator;

    useEffect(() => {
        if (!mediaSessionAvailable) return;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: soundRecording.title,
            artist: soundRecording.author,
            album: 'Chinatown Sound Map',
            artwork: [
            ],
        });
    }, [mediaSessionAvailable, soundRecording]);

    useEffect(() => {
        if (!mediaSessionAvailable) return;

        navigator.mediaSession.setActionHandler('play', togglePlayPause);
        navigator.mediaSession.setActionHandler('pause', togglePlayPause);
    }, [mediaSessionAvailable, togglePlayPause]);

    useEffect(() => {
        if (!mediaSessionAvailable) return;

        navigator.mediaSession.setActionHandler('seekto', (details: MediaSessionActionDetails) => {
            setToPosition(details.seekTime as number);
        });
    }, [mediaSessionAvailable, setToPosition]);

    useEffect(() => {
        if (!mediaSessionAvailable) return;
        navigator.mediaSession.playbackState = playbackState;
    }, [mediaSessionAvailable, playbackState]);

    useEffect(() => {
        if (!mediaSessionAvailable) return;
        navigator.mediaSession.setPositionState({ duration, position });
    }, [mediaSessionAvailable, duration, position]);
};
