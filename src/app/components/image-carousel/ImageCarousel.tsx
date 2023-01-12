import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import { Center, createStyles, Image } from "@mantine/core";
import { useRef, useState } from "react";
import { SoundRecordingFileData } from "types/state/sound-recording-state.types";
import Autoplay from 'embla-carousel-autoplay';

interface ImageCarouselProps {
    selectedIndex: number;
    images: (SoundRecordingFileData | File)[];
    onSlideChange: (index: number) => void;
    autoPlay?: boolean;
    imageHeight?: number;
}

export default function ImageCarousel({ selectedIndex, images, onSlideChange, autoPlay, imageHeight }: ImageCarouselProps) {
    const { classes } = useStyles();
    const autoPlayRef = useRef(Autoplay({ delay: 3000 }));
    const TRANSITION_DURATION = 200;
    const [embla, setEmbla] = useState<Embla | null>(null);
    useAnimationOffsetEffect(embla, TRANSITION_DURATION);
    const imgHeight = imageHeight ? imageHeight : 450;

    const isFile = (img: SoundRecordingFileData | File) => img instanceof File;
    const getImgUrl = (img: SoundRecordingFileData | File): string => {
        if (isFile(img)) return URL.createObjectURL(img as File);
        return (img as SoundRecordingFileData).objectUrl;
    };

    const plugins = [
        ...autoPlay ? [autoPlayRef.current] : [],
    ];

    const optionalCarouselProps = {
        onMouseEnter: autoPlay ? autoPlayRef.current.stop : undefined,
        onMouseLeave: autoPlay ? autoPlayRef.current.reset : undefined,
        loop: !!autoPlay,
    }

    return (
        <Carousel
            align="start"
            controlSize={25}
            initialSlide={selectedIndex}
            inViewThreshold={1}
            getEmblaApi={setEmbla}
            onSlideChange={(i) => onSlideChange(i)}
            {...images.length > 0 ? optionalCarouselProps : {}}
            plugins={plugins}
            classNames={classes}
        >
            {
                images.map((img, index) => {

                    return (
                        <Carousel.Slide key={index}>
                            <Center>
                                <Image
                                    height={imgHeight}
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

// Ref: https://mantine.dev/others/carousel/#show-controls-on-hover

const useStyles = createStyles((_theme, _params, getRef) => ({
    controls: {
        ref: getRef('controls'),
        transition: 'opacity 150ms ease',
        opacity: 0,
    },
  
    root: {
        '&:hover': {
            [`& .${getRef('controls')}`]: {
                opacity: 1,
            },
        },
    },
}));