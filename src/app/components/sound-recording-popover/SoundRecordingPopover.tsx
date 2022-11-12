import React from 'react';
import SoundRecording from 'models/SoundRecording.model';
import { Center, Container, Flex, Image, Loader, Stack, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

export type SoundRecordingPopoverProps = {
    soundRecording: SoundRecording;
    recordingFile: string | null;
    imageFiles: string[] | null;
}

export default function SoundRecordingPopover(props: SoundRecordingPopoverProps) {
    const { soundRecording, recordingFile, imageFiles } = props;
    const dateStr = soundRecording.dateRecorded ? dayjs(new Date(soundRecording.dateRecorded)).format('LL') : 'unknown';

    const isLoading = () => !recordingFile || (!imageFiles && soundRecording.imageFiles && soundRecording.imageFiles?.length > 0)

    return (
        <Container size={300} px="xs">
            <Stack>
                <Stack spacing={2}>
                    <Title order={4}>{soundRecording.title}</Title>
                    <Text size="sm">Recorded by {soundRecording.author}</Text>
                    <Text size="sm">Date: {dateStr}</Text>
                </Stack>
                {imageFiles && (
                    <Flex gap={5}>
                        {
                            imageFiles.map(imageSrc => (
                                <Image
                                    key={imageSrc}
                                    width={100}
                                    height={80}
                                    src={imageSrc}
                                />
                            ))
                        }
                    </Flex>
                )}
                {recordingFile && (
                    <audio controls src={recordingFile}></audio>
                )}
                {isLoading() && (
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
