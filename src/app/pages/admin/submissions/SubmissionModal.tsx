import { Fragment, useEffect, useState } from 'react';
import { Container, Divider, Grid, Image, Modal, Table, Text } from '@mantine/core';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { cacheSoundRecordingImageFile, selectSoundRecordingFileById, selectSoundRecordingImageById, setSoundRecordingFile } from 'features/sound-clips/soundClipSlice';
import { getSoundRecordingFile, getSoundRecordingImageFile } from 'features/sound-clips/soundClipAPI';
import ImageCarouselModal, { ImageModalState } from '../../../components/image-carousel/ImageCarouselModal';
import Submission from 'models/Submission.model';
import { AuthenticationResult } from '@azure/msal-browser';
import './SubmissionModal.css';
import { getImageFileObjects } from 'utils/file-objects.utils';

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
    const images = imageFiles ? getImageFileObjects(imageFiles) : [];

    const [imageModalState, setImageModalState] = useState<ImageModalState>({
        opened: false,
        selectedIndex: 0,
    });

    const isLoading = () => !recordingFile || (!imageFiles && soundRecording.imageFiles && soundRecording.imageFiles?.length > 0);

    const getFormattedDateText = (date?: Date) => date ? dayjs(new Date(date)).format('LL') : 'Unknown';

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
                            <Text size="sm">
                                <Text span {...boldTextProps}>Date Submitted: </Text>
                                {getFormattedDateText(submission.dateCreated)}
                            </Text>
                            <Text size="sm">
                                <Text span {...boldTextProps}>Email Address: </Text>
                                {submission.email}
                            </Text>
                        </Container>

                        <Container p={0}>
                            <SectionHeader text="Recording Info" />
                            <Text size="sm">
                                <Text span {...boldTextProps}>Title: </Text>
                                {soundRecording.title}
                            </Text>
                            <Text size="sm">
                                <Text span {...boldTextProps}>Date Recorded: </Text>
                                {getFormattedDateText(soundRecording.dateRecorded)}
                            </Text>
                            <Text size="sm">
                                <Text span {...boldTextProps}>Author: </Text>
                                {soundRecording.author}
                            </Text>
                            <Text size="sm">
                                <Text span {...boldTextProps}>Description: </Text>
                                {soundRecording.description}
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
                                        {/* TODO: Include file name */}
                                        <Text>Recording File</Text>
                                    </td>
                                    <td>
                                        {recordingFile && (
                                            <audio
                                                style={{ float: 'right', maxWidth: '250px', height: '40px' }}
                                                controls
                                                src={recordingFile}>
                                            </audio>
                                        )}
                                    </td>
                                </tr>
                                {imageFiles && images.map((image, index) => (
                                    <tr>
                                        <td>
                                            <Text>
                                                { image.fileName }
                                            </Text>
                                        </td>
                                        <td>
                                            <Image
                                                className="popover-img"
                                                sx={{ cursor: 'pointer', float: 'right' }}
                                                key={image.objectUrl}
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
                    </Grid.Col>
                </Grid>
            </Container>
            { imageFiles && (
                <ImageCarouselModal
                    opened={imageModalState.opened}
                    selectedIndex={imageModalState.selectedIndex}
                    images={images.map(image => image.objectUrl)}
                    onClose={() => setImageModalState({
                        ...imageModalState,
                        opened: false,
                    })}
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

const boldTextProps = {
    fw: 700,
};
