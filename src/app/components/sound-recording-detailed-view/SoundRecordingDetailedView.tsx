import { Center, Container, Loader, ScrollArea, Space, Stack, Text, TextProps, Title } from "@mantine/core";
import SoundRecording from "models/SoundRecording.model";
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useSoundRecordingFile, useSoundRecordingImageFiles } from "app/hooks/sound-recording.hooks";
import TagList from "../tag-list/TagList";
import ImageCarousel from "../image-carousel/ImageCarousel";
import AudioPlayer from "../audio-player/AudioPlayer";
dayjs.extend(localizedFormat);

interface SoundRecordingDetailedViewProps {
    soundRecording: SoundRecording;
}

export default function SoundRecordingDetailedView({ soundRecording }: SoundRecordingDetailedViewProps) {
    const recordingFile = useSoundRecordingFile(soundRecording.id);
    const imageFiles = useSoundRecordingImageFiles(soundRecording);

    const dateStr = soundRecording.dateRecorded ? dayjs(new Date(soundRecording.dateRecorded)).format('LL') : 'unknown';


    const isLoading = !recordingFile || (imageFiles.length !== soundRecording.imageFiles?.length);

    return(
        <ScrollArea sx={{ height: 'calc(100vh - 110px)' }}>
        <Container>
            <Stack align="left" spacing={8} mb={10}>
                <Title order={2}>{soundRecording.title}</Title>
                <Text {...infoTextProps}>
                    Recorded by {soundRecording.author}
                </Text>
                <Text {...infoTextProps}>
                    Date Recorded: {dateStr}
                </Text>
            </Stack>
            <Stack align="center" spacing={5}>
                {isLoading && (
                    <Center>
                        <Loader color={'pink'} />
                    </Center>
                )}
                {recordingFile && (
                    <AudioPlayer objectUrl={recordingFile.objectUrl} />
                )}
                <Container px="sm">
                    <ImageCarousel
                        selectedIndex={0}
                        images={imageFiles}
                        onSlideChange={() => {}}
                        autoPlay={true}
                        imageHeight={300}
                    />
                </Container>
            </Stack>
            <Stack align="left" spacing={8}>
                <Text component="p" fz="md" fs="italic" fw={400}>
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

const infoTextProps: TextProps = {
    sx: { lineHeight: '1.2rem' },
    color: 'gray',
    size: 'md',
    fw: 400,
};
