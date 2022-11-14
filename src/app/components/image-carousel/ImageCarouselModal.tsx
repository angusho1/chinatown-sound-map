import { Carousel, Embla, useAnimationOffsetEffect } from '@mantine/carousel';
import { Center, Image, Modal } from '@mantine/core';
import { useState } from 'react';

interface ImageCarouselProps {
    opened: boolean;
    selectedIndex: number;
    images: (string | File)[];
    onClose: () => void;
}

export default function ImageCarouselModal({ opened, selectedIndex, images, onClose }: ImageCarouselProps) {
    const TRANSITION_DURATION = 200;
    const [embla, setEmbla] = useState<Embla | null>(null);
    useAnimationOffsetEffect(embla, TRANSITION_DURATION);

    const isFile = (img: string | File) => img instanceof File;
    const getImgSrc = (img: string | File): string => {
        if (isFile(img)) return URL.createObjectURL(img as File);
        return img as string;
    };
    
    return (
        <Modal
            centered
            size="xl"
            opened={opened}
            onClose={onClose}
            transitionDuration={TRANSITION_DURATION}
        >
            <Carousel
                align="start"
                controlSize={25}
                initialSlide={selectedIndex}
                inViewThreshold={1}
                getEmblaApi={setEmbla}
            >
                {
                    images.map((img, index) => {

                        return (
                            <Carousel.Slide key={index}>
                                <Center>
                                    <Image
                                        height={450}
                                        fit="contain"
                                        src={getImgSrc(img)}
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