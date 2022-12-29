import { Carousel, Embla, useAnimationOffsetEffect } from '@mantine/carousel';
import { Center, Image, Modal } from '@mantine/core';
import { useState } from 'react';
import { SoundRecordingFileData } from 'types/state/sound-recording-state.types';

interface ImageCarouselProps {
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

export default function ImageCarouselModal({ opened, selectedIndex, images, onClose, showFileNames }: ImageCarouselProps) {
    const TRANSITION_DURATION = 200;
    const [embla, setEmbla] = useState<Embla | null>(null);
    useAnimationOffsetEffect(embla, TRANSITION_DURATION);
    const [currentIndex, setCurrentIndex] = useState<number>(selectedIndex);

    const isFile = (img: SoundRecordingFileData | File) => img instanceof File;
    const getImgUrl = (img: SoundRecordingFileData | File): string => {
        if (isFile(img)) return URL.createObjectURL(img as File);
        return (img as SoundRecordingFileData).objectUrl;
    };
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
            <Carousel
                align="start"
                controlSize={25}
                initialSlide={selectedIndex}
                inViewThreshold={1}
                getEmblaApi={setEmbla}
                onSlideChange={(i) => setCurrentIndex(i)}
            >
                {
                    images.map((img, index) => {

                        return (
                            <Carousel.Slide key={index}>
                                <Center>
                                    <Image
                                        height={450}
                                        fit="contain"
                                        src={getImgUrl(img)}
                                    />
                                </Center>
                            </Carousel.Slide>
                        );
                    })
                }
            </Carousel>
        </Modal>
    )
};