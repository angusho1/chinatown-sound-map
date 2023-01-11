import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import { Center, Image } from "@mantine/core";
import { useState } from "react";
import { SoundRecordingFileData } from "types/state/sound-recording-state.types";

interface ImageCarouselProps {
    selectedIndex: number;
    images: (SoundRecordingFileData | File)[];
    onSlideChange: (index: number) => void;
}

export default function ImageCarousel({ selectedIndex, images, onSlideChange }: ImageCarouselProps) {
    const TRANSITION_DURATION = 200;
    const [embla, setEmbla] = useState<Embla | null>(null);
    useAnimationOffsetEffect(embla, TRANSITION_DURATION);

    const isFile = (img: SoundRecordingFileData | File) => img instanceof File;
    const getImgUrl = (img: SoundRecordingFileData | File): string => {
        if (isFile(img)) return URL.createObjectURL(img as File);
        return (img as SoundRecordingFileData).objectUrl;
    };

    return (
        <Carousel
            align="start"
            controlSize={25}
            initialSlide={selectedIndex}
            inViewThreshold={1}
            getEmblaApi={setEmbla}
            onSlideChange={(i) => onSlideChange(i)}
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
    );
}