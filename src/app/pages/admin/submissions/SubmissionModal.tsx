import { useEffect, useState } from 'react';
import { Badge, Center, Container, Divider, Flex, Group, Image, Loader, Modal, Stack, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { cacheSoundRecordingImageFile, selectSoundRecordingFileById, selectSoundRecordingImageById, setSoundRecordingFile } from 'features/sound-clips/soundClipSlice';
import { getSoundRecordingFile, getSoundRecordingImageFile } from 'features/sound-clips/soundClipAPI';
import ImageCarouselModal, { ImageModalState } from '../../../components/image-carousel/ImageCarouselModal';
import Submission from 'models/Submission.model';
import { AuthenticationResult } from '@azure/msal-browser';

dayjs.extend(localizedFormat);

export type SubmissionModalProps = {
    opened: boolean;
    submission: Submission;
    onClose: () => void;
    getToken: () => Promise<AuthenticationResult>;
}

export interface SubmissionModalState {
    opened: boolean;
    selectedSubmission?: Submission;
}

export default function SubmissionModal(props: SubmissionModalProps) {
    const { submission, opened, onClose, getToken } = props;
    const soundRecording = submission.soundRecording;

    const dispatch = useAppDispatch();
    const recordingFile = useAppSelector(state => selectSoundRecordingFileById(state, soundRecording.id));
    const imageFiles = useAppSelector(state => selectSoundRecordingImageById(state, soundRecording.id));
    const imageSrcStrings = imageFiles ? Object.values(imageFiles) : [];

    const [imageModalState, setImageModalState] = useState<ImageModalState>({
        opened: false,
        selectedIndex: 0,
    });

    const dateStr = soundRecording.dateRecorded ? dayjs(new Date(soundRecording.dateRecorded)).format('LL') : 'unknown';

    const isLoading = () => !recordingFile || (!imageFiles && soundRecording.imageFiles && soundRecording.imageFiles?.length > 0);

    useEffect(() => {
        let isRecordingSet = false;

        const fetchRecordingFile = async () => {
            const tokenResult = await getToken();
            const fileBlob = await getSoundRecordingFile(soundRecording.id, tokenResult.accessToken);
            if (isRecordingSet) return;
            const recordingFileSrc = URL.createObjectURL(fileBlob);
            dispatch(setSoundRecordingFile({
                recordingId: soundRecording.id,
                fileSrc: recordingFileSrc
            }));
        };

        const fetchImages = async () => {            
            soundRecording.imageFiles?.forEach(filename => {
                getToken()
                    .then(tokenResult => getSoundRecordingImageFile(filename, tokenResult.accessToken))
                    .then(fileBlob => {
                        if (imageFiles && imageFiles[filename]) return;
                        const recordingFileSrc = URL.createObjectURL(fileBlob);
                        dispatch(cacheSoundRecordingImageFile({
                            recordingId: soundRecording.id,
                            fileName: filename,
                            fileSrc: recordingFileSrc
                        }));
                    });
            });
        };

        if (!recordingFile && !isRecordingSet) fetchRecordingFile();
        if (!imageFiles) fetchImages();

        return () => {
            isRecordingSet = true;
        }
    }, [recordingFile, imageFiles, soundRecording.id, soundRecording.imageFiles, dispatch]);

    return (
        <Modal
            centered
            size="xl"
            opened={opened}
            onClose={onClose}
            transitionDuration={200}
        >
            <Container size={300} px="xs">
                <Stack align="center" spacing={8}>
                    <Stack spacing={2} align="center">
                        <Title order={4}>{soundRecording.title}</Title>
                        <Text size="sm" fw={300}>Recorded by {soundRecording.author}</Text>
                        <Text size="sm" fw={300}>Date: {dateStr}</Text>
                        <Text component="p" fz="sm" fw={300}>
                            {soundRecording.description}
                        </Text>
                    </Stack>
                    <Stack align="center">
                        {imageFiles && (
                            <Flex gap={5}>
                                {
                                    imageSrcStrings.map((imageSrc, index) => (
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
                    </Stack>
                    {isLoading() && (
                        <Center>
                            <Loader color={'pink'} />
                        </Center>
                    )}
                    <Stack spacing={2} align="stretch">
                        { soundRecording.categories && soundRecording.categories.length > 0 && (
                            <Container px={0}>
                                <Divider
                                    size="xs"
                                    my="sm"
                                    variant="solid"
                                    label="Categories"
                                    color="pink"
                                    labelPosition="center"
                                    labelProps={{
                                        fw: 500,
                                    }}
                                />
                                <Group spacing="xs" position="center">
                                    {soundRecording.categories && (
                                        soundRecording.categories.map(category => (
                                            <Badge key={category.name} >{ category.name }</Badge>
                                        ))
                                    )}
                                </Group>
                            </Container>
                        )}
                    </Stack>
                </Stack>

                { imageFiles && (
                    <ImageCarouselModal
                        opened={imageModalState.opened}
                        selectedIndex={imageModalState.selectedIndex}
                        images={imageSrcStrings}
                        onClose={() => setImageModalState({
                            ...imageModalState,
                            opened: false,
                        })}
                    />
                )}
            </Container>
        </Modal>
    )
}
