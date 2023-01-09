import { useState } from 'react';
import SoundRecording from 'models/SoundRecording.model';
import { ActionIcon, Badge, Center, Container, Divider, Flex, Group, Image, Loader, Stack, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectIsDetailedViewOpen, toggleDetailedView } from 'features/sound-clips/soundClipSlice';
import ImageCarouselModal, { ImageModalState } from '../image-carousel/ImageCarouselModal';
import './SoundRecordingPopover.css';
import { IconArrowUpRightCircle } from '@tabler/icons';
import { useSoundRecordingFile, useSoundRecordingImageFiles } from 'app/hooks/sound-recording.hooks';

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
    )
}
