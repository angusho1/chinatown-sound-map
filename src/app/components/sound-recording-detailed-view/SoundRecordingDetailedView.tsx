import SoundRecording from "models/SoundRecording.model";
import SoundRecordingPopover from "../sound-recording-popover/SoundRecordingPopover";

interface SoundRecordingDetailedViewProps {
    soundRecording: SoundRecording;
}

export default function SoundRecordingDetailedView({ soundRecording }: SoundRecordingDetailedViewProps) {

    return(
        <SoundRecordingPopover soundRecording={soundRecording}/>
    );
}