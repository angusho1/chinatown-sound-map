import { useEffect, useState } from 'react';
import SoundRecording from 'models/SoundRecording.model';
import { Center, Container, Flex, Image, Loader, Stack, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { cacheSoundRecordingImageFile, selectSoundRecordingFileById, selectSoundRecordingImageById, setSoundRecordingFile } from 'features/sound-clips/soundClipSlice';
import { getSoundRecordingFile, getSoundRecordingImageFile } from 'features/sound-clips/soundClipAPI';
import ImageCarouselModal, { ImageModalState } from '../image-carousel/ImageCarouselModal';
import './SoundRecordingPopover.css';

dayjs.extend(localizedFormat);

export type SoundRecordingPopoverProps = {
    soundRecording: SoundRecording;
    recordingFile: string | null;
    imageFiles: string[] | null;
}

export default function SoundRecordingPopover(props: SoundRecordingPopoverProps) {
    const { soundRecording } = props;

    const dispatch = useAppDispatch();
    const recordingFile = useAppSelector(state => selectSoundRecordingFileById(state, soundRecording.id));
    const imageFiles = useAppSelector(state => selectSoundRecordingImageById(state, soundRecording.id));

    const [requestedRecording, setRequestedRecording] = useState<boolean>(false);
    const [requestedImages, setRequestedImages] = useState<boolean>(false);
    const [imageModalState, setImageModalState] = useState<ImageModalState>({
        opened: false,
        selectedIndex: 0,
    });

    const dateStr = soundRecording.dateRecorded ? dayjs(new Date(soundRecording.dateRecorded)).format('LL') : 'unknown';

    const isLoading = () => !recordingFile || (!imageFiles && soundRecording.imageFiles && soundRecording.imageFiles?.length > 0);

    useEffect(() => {
        if (!recordingFile && !requestedRecording) {
            getSoundRecordingFile(soundRecording.id)
                .then(fileBlob => {
                    const recordingFileSrc = URL.createObjectURL(fileBlob);
                    dispatch(setSoundRecordingFile({
                        recordingId: soundRecording.id,
                        fileSrc: recordingFileSrc
                    }));
                });
            setRequestedRecording(true);
        }

        if (!imageFiles && !requestedImages) {
            soundRecording.imageFiles?.forEach(filename => {
                getSoundRecordingImageFile(filename)
                    .then(fileBlob => {
                        const recordingFileSrc = URL.createObjectURL(fileBlob);
                        dispatch(cacheSoundRecordingImageFile({
                            recordingId: soundRecording.id,
                            fileSrc: recordingFileSrc
                        }));
                    });
                setRequestedImages(true);
            });
        }
    }, [recordingFile, requestedRecording, imageFiles, requestedImages, soundRecording.id, soundRecording.imageFiles, dispatch]);

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
                            imageFiles.map((imageSrc, index) => (
                                <Image
                                    className="popover-img"
                                    sx={{ cursor: 'pointer' }}
                                    key={imageSrc}
                                    width={100}
                                    height={80}
                                    src={imageSrc}
                                    onClick={() => {
                                        setImageModalState({
                                            opened: true,
                                            selectedIndex: index,
                                        });
                                    }}
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

            { imageFiles && (
                <ImageCarouselModal
                    opened={imageModalState.opened}
                    selectedIndex={imageModalState.selectedIndex}
                    images={imageFiles}
                    onClose={() => setImageModalState({
                        ...imageModalState,
                        opened: false,
                    })}
                />
            )}
        </Container>
    )
}
