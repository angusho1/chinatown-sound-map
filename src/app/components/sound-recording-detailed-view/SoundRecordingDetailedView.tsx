import { Card, Center, Container, Flex, Image, Loader, LoadingOverlay, ScrollArea, Space, Stack, Text, TextProps, Title } from "@mantine/core";
import SoundRecording from "models/SoundRecording.model";
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useSoundRecordingFile, useSoundRecordingImageFiles } from "app/hooks/sound-recording.hooks";
import TagList from "../tag-list/TagList";
import ImageCarousel from "../image-carousel/ImageCarousel";
import AudioPlayer from "../audio-player/AudioPlayer";
import { DEFAULT_IMAGE_URL } from "constants/sound-recordings/sound-recording.constants";
dayjs.extend(localizedFormat);

interface SoundRecordingDetailedViewProps {
    soundRecording: SoundRecording;
}

export default function SoundRecordingDetailedView({ soundRecording }: SoundRecordingDetailedViewProps) {
    const recordingFile = useSoundRecordingFile(soundRecording.id);
    const imageFiles = useSoundRecordingImageFiles(soundRecording);

    const dateStr = soundRecording.dateRecorded ? dayjs(new Date(soundRecording.dateRecorded)).format('LL') : 'unknown';

    const areImagesLoading = imageFiles.length !== soundRecording.imageFiles?.length;
    const isAudioLoading = !recordingFile;

    return(
        <ScrollArea sx={{ height: 'calc(100vh - 110px)' }}>
        <Container>
            <Card.Section>
                <LoadingOverlay visible={areImagesLoading} overlayBlur={2} />
                <Image
                    src={imageFiles.length > 0 ? imageFiles[0].objectUrl : DEFAULT_IMAGE_URL}
                    height={200}
                />
            </Card.Section>
            <Stack spacing={2} my={10}>
                <Title order={2}>{soundRecording.title}</Title>
                <Flex justify="space-between">
                    <Text size="md" fw={400} color="gray">by {soundRecording.author}</Text>
                    <Text size="md" fw={400} color="gray">{dateStr}</Text>
                </Flex>
            </Stack>
            <Stack align="center" spacing={5}>
                {isAudioLoading && (
                    <Center>
                        <Loader color={'pink'} />
                    </Center>
                )}
                {recordingFile && (
                    <AudioPlayer objectUrl={recordingFile.objectUrl} />
                )}
                {/* <Container px="sm">
                    <ImageCarousel
                        selectedIndex={0}
                        images={imageFiles}
                        onSlideChange={() => {}}
                        autoPlay={true}
                        imageHeight={300}
                    />
                </Container> */}
            </Stack>
            <Stack align="left" spacing={8}>
                <Text component="p" fz="md" fw={400}>
                    {soundRecording.description}
                </Text>
            </Stack>
            <Stack spacing={2}>
                { soundRecording.tags && soundRecording.tags.length > 0 && (
                    <TagList tags={soundRecording.tags} />
                )}
            </Stack>
            <Space h="xl" />
        </Container>
        </ScrollArea>
    );
}
