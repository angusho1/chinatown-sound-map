import React from 'react';
import SoundRecording from 'models/SoundRecording.model';
import { Loader } from '@mantine/core';

export type SoundRecordingPopoverProps = {
    soundRecording: SoundRecording;
    recordingFile: string | null;
}

export default function SoundRecordingPopover(props: SoundRecordingPopoverProps) {
    const { soundRecording, recordingFile } = props;

    return (
        <div>
            <h5>{soundRecording.title}</h5>
            {recordingFile && (
                <audio controls src={recordingFile}></audio>
            )}
            {!recordingFile && <Loader />}
            <div>Author: {soundRecording.author}</div>
            <div>Date: {soundRecording.dateRecorded ? soundRecording.dateRecorded : 'unknown'}</div>
        </div>
    )
}
