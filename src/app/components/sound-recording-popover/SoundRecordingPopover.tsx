import React, { useEffect } from 'react';
import SoundRecording from 'models/SoundRecording.model';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectSoundRecordingFileById, setSoundRecordingFile } from 'features/sound-clips/soundClipSlice';
import { getSoundRecordingFile } from 'features/sound-clips/soundClipAPI';

export type SoundRecordingPopoverProps = {
    soundRecording: SoundRecording;
}

export default function SoundRecordingPopover(props: SoundRecordingPopoverProps) {
    const { soundRecording } = props;
    const dispatch = useAppDispatch();
    const recordingFile = useAppSelector(state => selectSoundRecordingFileById(state, soundRecording.id));

    console.log(recordingFile);

    useEffect(() => {
        if (!recordingFile) {
            getSoundRecordingFile(soundRecording.id)
                .then(fileBlob => {
                    const recordingFileSrc = URL.createObjectURL(fileBlob);
                    console.log(recordingFileSrc);
                    dispatch(setSoundRecordingFile({
                        recordingId: soundRecording.id,
                        fileSrc: recordingFileSrc
                    }));
                });
        }
    });

    return (
        <div>
            <h5>{soundRecording.title}</h5>
            {recordingFile && (
                <audio controls src={recordingFile}></audio>
            )}
            <div>Author: {soundRecording.author}</div>
            <div>Date: {soundRecording.dateRecorded ? soundRecording.dateRecorded : 'unknown'}</div>
        </div>
    )
}
