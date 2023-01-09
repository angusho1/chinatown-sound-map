import { useAppDispatch, useAppSelector } from "app/hooks";
import { getSoundRecordingFile, getSoundRecordingImageFile } from "features/sound-clips/soundClipAPI";
import { cacheSoundRecordingImageFile, selectSoundRecordingFileById, selectSoundRecordingImageById, setSoundRecordingFile } from "features/sound-clips/soundClipSlice";
import SoundRecording from "models/SoundRecording.model";
import { useEffect } from "react";
import { useAccessToken } from "./auth.hooks";

interface AuthRequestOptions {
    useToken: boolean;
}

export const useSoundRecordingFile = (soundRecordingId: string, options?: AuthRequestOptions) => {
    const dispatch = useAppDispatch();
    const recordingFile = useAppSelector(state => selectSoundRecordingFileById(state, soundRecordingId));
    const token = useAccessToken();

    useEffect(() => {
        let isRecordingSet = false;

        const fetchRecordingFile = async () => {
            const includeToken = options?.useToken;
            const getFileResult = await getSoundRecordingFile(soundRecordingId, includeToken ? token || undefined : undefined);
            if (isRecordingSet) return;
            dispatch(setSoundRecordingFile({
                recordingId: soundRecordingId,
                ...getFileResult,
            }));
        };
        
        const shouldFetch = !recordingFile && !isRecordingSet &&
            (!options?.useToken || (options?.useToken && token));

        if (shouldFetch) fetchRecordingFile();

        return () => {
            isRecordingSet = true;
        }
    }, [recordingFile, dispatch, soundRecordingId, options?.useToken, token]);

    return recordingFile;
};

export const useSoundRecordingImageFiles = (soundRecording: SoundRecording, options?: AuthRequestOptions) => {
    const dispatch = useAppDispatch();
    const imageFiles = useAppSelector(state => selectSoundRecordingImageById(state, soundRecording.id));
    const token = useAccessToken();

    useEffect(() => {
        const fetchImages = async () => {
            const includeToken = options?.useToken;
            soundRecording.imageFiles?.forEach(filename => {
                getSoundRecordingImageFile(filename, includeToken ? token || undefined : undefined)
                    .then(getFileResult => {
                        if (imageFiles && imageFiles[filename]) return;
                        dispatch(cacheSoundRecordingImageFile({
                            uniqueFileName: filename,
                            recordingId: soundRecording.id,
                            ...getFileResult,
                        }));
                    });
            });
        };

        const shouldFetch = !imageFiles && (!options?.useToken || (options?.useToken && token));

        if (shouldFetch) fetchImages();
    }, [imageFiles, soundRecording.id, soundRecording.imageFiles, dispatch, options?.useToken, token]);

    return imageFiles ? Object.values(imageFiles) : [];
};