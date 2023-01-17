
interface AudioPlayerProps {
    objectUrl: string;
}

export default function AudioPlayer({ objectUrl }: AudioPlayerProps) {
    return (
        <audio
            style={{ height: '40px' }}
            controls
            src={objectUrl}
        />
    );
}