import SoundRecording from 'models/SoundRecording.model';
import { ActionIcon, Anchor, Card, Center, Container, Flex, Group, Image, Loader, LoadingOverlay, Stack, Text, Title, Tooltip } from '@mantine/core';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectIsDetailedViewOpen, setSelectedSoundRecording, toggleDetailedView } from 'features/sound-clips/soundClipSlice';
import ImageCarouselModal, { ImageModalState } from '../image-carousel/ImageCarouselModal';
import './SoundRecordingPopover.css';
import { IconArrowDownLeftCircle, IconArrowUpRightCircle, IconX } from '@tabler/icons';
import { useSoundRecordingFile, useSoundRecordingImageFiles } from 'app/hooks/sound-recording.hooks';
import AudioPlayer from '../audio-player/AudioPlayer';
import { DEFAULT_IMAGE_URL } from 'constants/sound-recordings/sound-recording.constants';
import { useAudioPlayback } from 'app/hooks/audio.hooks';
import { stopAudio } from 'features/audio/audioSlice';

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

    const audioPlayback = useAudioPlayback({ objectUrl: recordingFile?.objectUrl });

    // const [imageModalState, setImageModalState] = useState<ImageModalState>({
    //     opened: false,
    //     selectedIndex: 0,
    // });

    const dateStr = soundRecording.dateRecorded ? dayjs(new Date(soundRecording.dateRecorded)).format('LL') : 'unknown';

    const areImagesLoading = imageFiles.length !== soundRecording.imageFiles?.length;
    const isAudioLoading = !recordingFile;

    return (
        <Container p={0} sx={{ maxWidth: 350 }}>
            <Card.Section>
                <LoadingOverlay visible={areImagesLoading} overlayBlur={2} />
                <Image
                    src={imageFiles.length > 0 ? imageFiles[0].objectUrl : DEFAULT_IMAGE_URL}
                    height={200}
                />
            </Card.Section>
            <Group position="right" spacing={2}>
                <Tooltip label={isDetailedViewOpen ? 'Hide Detail' : 'Show Detail'}>
                    <ActionIcon onClick={() => dispatch(toggleDetailedView(!isDetailedViewOpen))}>
                        { isDetailedViewOpen ? <IconArrowDownLeftCircle size={18} /> : <IconArrowUpRightCircle size={18} />
                        }
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Close">
                    <ActionIcon onClick={() => {
                        audioPlayback.stop();
                        dispatch(stopAudio());
                        dispatch(setSelectedSoundRecording(null));
                    }}>
                        <IconX size={18} />
                    </ActionIcon>
                </Tooltip>
            </Group>
            <Card sx={{ backgroundColor: '#e1d8e8f5' }} pt={0}>
                <Stack align="center" spacing={8}>
                    <Stack spacing={2}>
                        <Title order={4}>{soundRecording.title}</Title>
                        <Flex justify="space-between">
                            <Text size="sm" fw={400} color="gray">by {soundRecording.author}</Text>
                            <Text size="sm" fw={400} color="gray">{dateStr}</Text>
                        </Flex>
                        <Text component="p" fz="sm" fw={350} lineClamp={4} mb={0}>
                            {soundRecording.description}
                        </Text>
                        <Anchor onClick={() => dispatch(toggleDetailedView(!isDetailedViewOpen))}>
                            { isDetailedViewOpen ? 'Show Less' : 'Show More' }
                        </Anchor>
                    </Stack>
                    {recordingFile && (
                        <AudioPlayer
                            audioPlayback={audioPlayback}
                        />
                    )}
                    {/* <Stack align="center">
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
                    </Stack> */}
                    {isAudioLoading && (
                        <Center>
                            <Loader color={'pink'} />
                        </Center>
                    )}
                </Stack>


                {/* <ImageCarouselModal
                    opened={imageModalState.opened}
                    selectedIndex={imageModalState.selectedIndex}
                    images={imageFiles}
                    onClose={() => setImageModalState({
                        ...imageModalState,
                        opened: false,
                    })}
                /> */}
            </Card>
        </Container>
    )
}
