import { Fragment, useState } from 'react';
import SoundRecording from 'models/SoundRecording.model';
import { ActionIcon, Center, Container, Flex, Group, Image, Loader, Stack, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectIsDetailedViewOpen, setSelectedSoundRecording, toggleDetailedView } from 'features/sound-clips/soundClipSlice';
import ImageCarouselModal, { ImageModalState } from '../image-carousel/ImageCarouselModal';
import './SoundRecordingPopover.css';
import { IconArrowUpRightCircle, IconX } from '@tabler/icons';
import { useSoundRecordingFile, useSoundRecordingImageFiles } from 'app/hooks/sound-recording.hooks';
import TagList from '../tag-list/TagList';

dayjs.extend(localizedFormat);

export type SoundRecordingPopoverProps = {
    soundRecording: SoundRecording;
}

export default function SoundRecordingPopover(props: SoundRecordingPopoverProps) {
    const { soundRecording } = props;

    const dispatch = useAppDispatch();
    const isDetailedViewOpen = useAppSelector(selectIsDetailedViewOpen);
    const recordingFile = useSoundRecordingFile(soundRecording.id);
    const imageFiles = useSoundRecordingImageFiles(soundRecording);

    const [imageModalState, setImageModalState] = useState<ImageModalState>({
        opened: false,
        selectedIndex: 0,
    });

    const dateStr = soundRecording.dateRecorded ? dayjs(new Date(soundRecording.dateRecorded)).format('LL') : 'unknown';

    const isLoading = () => !recordingFile || (imageFiles.length !== soundRecording.imageFiles?.length);

    return (
        <Fragment>
            <Group position="right" spacing={2}>
                <ActionIcon onClick={() => dispatch(toggleDetailedView(!isDetailedViewOpen))}>
                    <IconArrowUpRightCircle size={18} />
                </ActionIcon>
                <ActionIcon onClick={() => dispatch(setSelectedSoundRecording(null))}>
                    <IconX size={18} />
                </ActionIcon>
            </Group>
            <Container size={300} px="xs" sx={{ border: '3px' }}>
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
                                    imageFiles.map((image, index) => (
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
                    <Stack spacing={2} align="stretch" w="100%">
                        { soundRecording.tags && soundRecording.tags.length > 0 && (
                            <TagList tags={soundRecording.tags} />
                        )}
                    </Stack>
                </Stack>

                <ImageCarouselModal
                    opened={imageModalState.opened}
                    selectedIndex={imageModalState.selectedIndex}
                    images={imageFiles}
                    onClose={() => setImageModalState({
                        ...imageModalState,
                        opened: false,
                    })}
                />
            </Container>
        </Fragment>
    )
}
