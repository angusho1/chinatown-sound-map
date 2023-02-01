import { ActionIcon, Group, HoverCard, MantineNumberSize, Slider, Text } from "@mantine/core";
import { IconPlayerPause, IconPlayerPlay, IconVolume, IconVolume2, IconVolume3 } from "@tabler/icons";
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player";
import dayjs from 'dayjs';
import dur from 'dayjs/plugin/duration';
import { getTimeStampInSeconds } from "utils/transformers.utils";
import { useCallback } from "react";

dayjs.extend(dur);

interface AudioPlayerProps {
    objectUrl: string;
}

export default function AudioPlayer({ objectUrl }: AudioPlayerProps) {
    const { togglePlayPause, playing, volume } = useAudioPlayer({
        src: objectUrl,
        format: "mp3",
        autoplay: false,
    });
    const { position, duration, seek } = useAudioPosition({ highRefreshRate: true });

    const goToPosition = useCallback((position: number) => {
        seek(position);
    }, [seek]);

    const getVolumeIcon = (volume: number) => {
        if (volume === 0) return <IconVolume3 size={18} />;
        else if (volume < 0.7) return <IconVolume2 size={18} />;
        return <IconVolume size={18} />;
    };

    const currentPositionStr = getTimeStampInSeconds(position);
    const durationStr = getTimeStampInSeconds(duration);

    const playPauseIcon = playing ? <IconPlayerPause {...iconProps} /> : <IconPlayerPlay {...iconProps} />;
    const volumeIcon = getVolumeIcon(volume());

    return (
        <>
            <Group>
                <ActionIcon onClick={togglePlayPause}>
                    { playPauseIcon }
                </ActionIcon>
                <Text {...timeTextProps}>{ currentPositionStr }</Text>
                <Slider
                    min={0}
                    max={duration}
                    value={position}
                    onChange={goToPosition}
                    {...sliderProps}
                />
                <Text {...timeTextProps}>{ durationStr }</Text>
                <HoverCard
                    shadow="md"
                    position="top"
                >
                    <HoverCard.Target>
                        <ActionIcon
                            onClick={() => {
                                const vol = volume();
                                if (vol === 0) volume(0.5);
                                else volume(0);
                            }}
                        >
                            { volumeIcon }
                        </ActionIcon>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        <Slider
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume()}
                            onChange={volume}
                            {...sliderProps}
                        />
                    </HoverCard.Dropdown>
                </HoverCard>
            </Group>
        </>
    );
}

const sliderProps = {
    sx: {
        minWidth: '100px',
    },
    size: 'xs' as MantineNumberSize,
    thumbSize: 20,
    label: null,
};

const iconProps = {
    size: 18,
    stroke: 1,
    color: 'black',
    style: {
        fill: 'black',
    },
};

const timeTextProps = {
};