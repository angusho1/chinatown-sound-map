import { Modal } from '@mantine/core';
import { useState } from 'react';
import { SoundRecordingFileData } from 'types/state/sound-recording-state.types';
import ImageCarousel from './ImageCarousel';

interface ImageCarouselModalProps {
    opened: boolean;
    selectedIndex: number;
    images: (SoundRecordingFileData | File)[];
    showFileNames?: boolean;
    onClose: () => void;
}

export interface ImageModalState {
    opened: boolean;
    selectedIndex: number;
}

export default function ImageCarouselModal({ opened, selectedIndex, images, onClose, showFileNames }: ImageCarouselModalProps) {
    const TRANSITION_DURATION = 200;
    const [currentIndex, setCurrentIndex] = useState<number>(selectedIndex);

    const isFile = (img: SoundRecordingFileData | File) => img instanceof File;

    const getFileName = () => {
        const index = Math.min(images.length-1, currentIndex);
        const selectedFile = images[index];
        if (isFile(selectedFile)) return (selectedFile as File).name;
        else return (selectedFile as SoundRecordingFileData).fileName;
    };

    return (
        <Modal
            centered
            size="xl"
            opened={opened}
            onClose={onClose}
            transitionDuration={TRANSITION_DURATION}
            title={showFileNames && images.length > 0 ? getFileName() : undefined}
        >
            <ImageCarousel
                selectedIndex={selectedIndex}
                images={images}
                onSlideChange={setCurrentIndex}
            />
        </Modal>
    )
};