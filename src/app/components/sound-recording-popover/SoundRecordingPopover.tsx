import React from 'react';
import SoundRecording from 'models/SoundRecording.model';
import { Center, Container, Loader, Stack, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

export type SoundRecordingPopoverProps = {
    soundRecording: SoundRecording;
    recordingFile: string | null;
}

export default function SoundRecordingPopover(props: SoundRecordingPopoverProps) {
    const { soundRecording, recordingFile } = props;
    const dateStr = soundRecording.dateRecorded ? dayjs(new Date(soundRecording.dateRecorded)).format('LL') : 'unknown';

    return (
        <Container size={300} px="xs">
            <Stack>
                <Stack spacing={2}>
                    <Title order={4}>{soundRecording.title}</Title>
                    <Text size="sm">Recorded by {soundRecording.author}</Text>
                    <Text size="sm">Date: {dateStr}</Text>
                </Stack>
                {recordingFile && (
                    <audio controls src={recordingFile}></audio>
                )}
                {!recordingFile && (
                    <Center>
                        <Loader color={'pink'} />
                    </Center>
                )}
                <Stack spacing={2}>
                    <p>
                        {soundRecording.description}
                    </p>
                </Stack>
            </Stack>
        </Container>
    )
}
