import { ActionIcon, Group, HoverCard, MantineNumberSize, MantineTheme, Slider, Text } from "@mantine/core";
import { IconPlayerPause, IconPlayerPlay, IconVolume, IconVolume2, IconVolume3 } from "@tabler/icons";
import { getTimeStampInSeconds } from "utils/transformers.utils";
import { AudioPlayback } from "app/hooks/audio.hooks";

interface AudioPlayerProps {
    audioPlayback: AudioPlayback;
}

export default function AudioPlayer({ audioPlayback }: AudioPlayerProps) {
    const { playing, togglePlayPause, volume, setVolumeLevel, toggleVolume, position, setToPosition, scrubToPosition, duration } = audioPlayback;

    const getVolumeIcon = (volume: number) => {
        if (volume === 0) return <IconVolume3 size={18} />;
        else if (volume < 0.7) return <IconVolume2 size={18} />;
        return <IconVolume size={18} />;
    };

    const currentPositionStr = getTimeStampInSeconds(position);
    const durationStr = getTimeStampInSeconds(duration);

    const playPauseIcon = playing ? <IconPlayerPause {...iconProps} /> : <IconPlayerPlay {...iconProps} />;
    const volumeIcon = getVolumeIcon(volume);

    return (
        <>
            <Group w="100%">
                <ActionIcon onClick={togglePlayPause}>
                    { playPauseIcon }
                </ActionIcon>
                <Text {...timeTextProps}>{ currentPositionStr }</Text>
                <Slider
                    min={0}
                    max={duration}
                    value={position}
                    onChange={scrubToPosition}
                    onChangeEnd={setToPosition}
                    {...sliderProps}
                    sx={{
                        flexGrow: 1,
                    }}
                />
                <Text {...timeTextProps}>{ durationStr }</Text>
                <HoverCard
                    shadow="md"
                    position="top"
                >
                    <HoverCard.Target>
                        <ActionIcon
                            onClick={toggleVolume}
                        >
                            { volumeIcon }
                        </ActionIcon>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        <Slider
                            w={100}
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            onChange={setVolumeLevel}
                            {...sliderProps}
                        />
                    </HoverCard.Dropdown>
                </HoverCard>
            </Group>
        </>
    );
}

const sliderProps = {
    size: 'xs' as MantineNumberSize,
    thumbSize: 18,
    label: null,
    styles: (theme: MantineTheme) => ({
        track: {
        },
        thumb: {
            borderWidth: 3,
            boxShadow: theme.shadows.sm,
        },
    }),
};

const iconProps = {
    size: 18,
    stroke: 0,
    style: {
        fill: 'black',
    },
};

const timeTextProps = {
    fz: 'sm',
    fw: 250,
    sx: {
        width: '30px',
    }
};
