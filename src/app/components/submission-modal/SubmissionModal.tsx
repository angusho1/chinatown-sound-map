import { Fragment, useState } from 'react';
import { Center, Container, Divider, Grid, Image, Loader, MantineNumberSize, Modal, Table, Text } from '@mantine/core';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import ImageCarouselModal, { ImageModalState } from '../image-carousel/ImageCarouselModal';
import Submission from 'models/Submission.model';
import './SubmissionModal.css';
import { useSoundRecordingFile, useSoundRecordingImageFiles } from 'app/hooks/sound-recording.hooks';

dayjs.extend(localizedFormat);

export type SubmissionModalProps = {
    opened: boolean;
    submission: Submission;
    onClose: () => void;
}

export interface SubmissionModalState {
    opened: boolean;
    selectedSubmission?: Submission;
}

export default function SubmissionModal(props: SubmissionModalProps) {
    const { submission, opened, onClose } = props;
    const soundRecording = submission.soundRecording;

    const recordingFile = useSoundRecordingFile(soundRecording.id, { useToken: true });
    const imageFiles = useSoundRecordingImageFiles(soundRecording, { useToken: true });

    const [imageModalState, setImageModalState] = useState<ImageModalState>({
        opened: false,
        selectedIndex: 0,
    });

    const isLoading = () => !recordingFile || (!imageFiles && soundRecording.imageFiles && soundRecording.imageFiles?.length > 0);

    const getFormattedDateText = (date?: Date) => date ? dayjs(new Date(date)).format('LL') : 'Unknown';

    return (
        <Modal
            centered
            size="70vw"
            opened={opened}
            onClose={onClose}
            transitionDuration={200}
            title={soundRecording.title}
            className="submission-modal"
        >
            <Container sx={{ minHeight: '60vh', padding: 0 }}>
                <Grid grow>
                    <Grid.Col span={5}>
                        <Container p={0} mb={30}>
                            <SectionHeader text="Submission Info" />
                            <Text {...textProps}>
                                <Text span {...boldTextProps}>Date Submitted: </Text>
                                {getFormattedDateText(submission.dateCreated)}
                            </Text>
                            <Text {...textProps}>
                                <Text span {...boldTextProps}>Email Address: </Text>
                                {submission.email}
                            </Text>
                        </Container>

                        <Container p={0}>
                            <SectionHeader text="Recording Info" />
                            <Text {...textProps}>
                                <Text span {...boldTextProps}>Title: </Text>
                                {soundRecording.title}
                            </Text>
                            <Text {...textProps}>
                                <Text span {...boldTextProps}>Date Recorded: </Text>
                                {getFormattedDateText(soundRecording.dateRecorded)}
                            </Text>
                            <Text {...textProps}>
                                <Text span {...boldTextProps}>Author: </Text>
                                {soundRecording.author}
                            </Text>
                            <Text {...textProps}>
                                <Text span {...boldTextProps}>Description: </Text>
                                {soundRecording.description}
                            </Text>
                            <Text {...textProps}>
                                <Text span {...boldTextProps}>Categories: </Text>
                                {soundRecording.categories?.map(category => category.name).join(', ')}
                            </Text>
                        </Container>
                    </Grid.Col>
                    <Grid.Col span={7}>
                        <SectionHeader text="Files" />

                        <Table
                            fontSize="sm"
                            highlightOnHover
                        >
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <Text>{recordingFile?.fileName}</Text>
                                    </td>
                                    <td>
                                        {recordingFile && (
                                            <audio
                                                style={{ float: 'right', maxWidth: '250px', height: '40px' }}
                                                controls
                                                src={recordingFile.objectUrl}>
                                            </audio>
                                        )}
                                    </td>
                                </tr>
                                {imageFiles.map((image, index) => (
                                    <tr key={image.objectUrl}>
                                        <td>
                                            <Text>
                                                { image.fileName }
                                            </Text>
                                        </td>
                                        <td>
                                            <Image
                                                className="popover-img"
                                                sx={{ cursor: 'pointer', float: 'right' }}
                                                width={40}
                                                height={40}
                                                src={image.objectUrl}
                                                onClick={() => {
                                                    setImageModalState({
                                                        opened: true,
                                                        selectedIndex: index,
                                                    });
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))
                                }
                            </tbody>
                        </Table>
                        {isLoading() && (
                            <Center>
                                <Loader color={'pink'} />
                            </Center>
                        )}
                    </Grid.Col>
                </Grid>
            </Container>
            { imageFiles && (
                <ImageCarouselModal
                    opened={imageModalState.opened}
                    selectedIndex={imageModalState.selectedIndex}
                    images={imageFiles}
                    onClose={() => setImageModalState({
                        ...imageModalState,
                        opened: false,
                    })}
                    showFileNames
                />
            )}
        </Modal>
    )
}

interface SectionHeaderProps {
    text: string;
}

const SectionHeader = ({ text }: SectionHeaderProps) => (
    <Fragment>
        <Text
            size="sm"
            sx={{ marginBottom: '5px', lineHeight: '1rem' }}
            color="gray"
        >
            { text }
        </Text>
        <Divider sx={{ marginTop: '5px', marginBottom: '10px' }} />
    </Fragment>
);

const textProps = {
    size: 'sm' as MantineNumberSize,
    sx: {
        marginBottom: '0.2rem'
    }
};

const boldTextProps = {
    fw: 700,
};
