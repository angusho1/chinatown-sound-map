import { useEffect, useState } from 'react';
import SoundRecording from 'models/SoundRecording.model';
import { ActionIcon, Badge, Center, Container, Divider, Flex, Group, Image, Loader, Stack, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { cacheSoundRecordingImageFile, selectIsDetailedViewOpen, selectSoundRecordingFileById, selectSoundRecordingImageById, setSoundRecordingFile, toggleDetailedView } from 'features/sound-clips/soundClipSlice';
import { getSoundRecordingFile, getSoundRecordingImageFile } from 'features/sound-clips/soundClipAPI';
import ImageCarouselModal, { ImageModalState } from '../image-carousel/ImageCarouselModal';
import './SoundRecordingPopover.css';
import { IconArrowUpRightCircle } from '@tabler/icons';

dayjs.extend(localizedFormat);

export type SoundRecordingPopoverProps = {
    soundRecording: SoundRecording;
}

export default function SoundRecordingPopover(props: SoundRecordingPopoverProps) {
    const { soundRecording } = props;

    const dispatch = useAppDispatch();
    const isDetailedViewOpen = useAppSelector(selectIsDetailedViewOpen);
    const recordingFile = useAppSelector(state => selectSoundRecordingFileById(state, soundRecording.id));
    const imageFiles = useAppSelector(state => selectSoundRecordingImageById(state, soundRecording.id));
    const imageFileObjects = imageFiles ? Object.values(imageFiles) : [];

    const [imageModalState, setImageModalState] = useState<ImageModalState>({
        opened: false,
        selectedIndex: 0,
    });

    const dateStr = soundRecording.dateRecorded ? dayjs(new Date(soundRecording.dateRecorded)).format('LL') : 'unknown';

    const isLoading = () => !recordingFile || (!imageFiles && soundRecording.imageFiles && soundRecording.imageFiles?.length > 0);

    useEffect(() => {
        let isRecordingSet = false;

        const fetchRecordingFile = async () => {
            const getFileResult = await getSoundRecordingFile(soundRecording.id);
            if (isRecordingSet) return;
            dispatch(setSoundRecordingFile({
                recordingId: soundRecording.id,
                ...getFileResult,
            }));
        };

        const fetchImages = async () => {            
            soundRecording.imageFiles?.forEach(filename => {
                getSoundRecordingImageFile(filename)
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

        if (!recordingFile && !isRecordingSet) fetchRecordingFile();
        if (!imageFiles) fetchImages();

        return () => {
            isRecordingSet = true;
        }
    }, [recordingFile, imageFiles, soundRecording.id, soundRecording.imageFiles, dispatch]);

    return (
        <Container size={300} px="xs">
            <ActionIcon onClick={() => dispatch(toggleDetailedView(!isDetailedViewOpen))}>
                <IconArrowUpRightCircle size={18} />
            </ActionIcon>
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
                                imageFileObjects.map((image, index) => (
                                    <Image
                                        className="popover-img"
                                        sx={{ cursor: 'pointer' }}
                                        key={image.objectUrl}
                                        width={100}
                                        height={80}
                                        src={image.objectUrl}
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
                        <audio controls src={recordingFile.objectUrl}></audio>
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
                    images={imageFileObjects}
                    onClose={() => setImageModalState({
                        ...imageModalState,
                        opened: false,
                    })}
                />
            )}
        </Container>
    )
}
