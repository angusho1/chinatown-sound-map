import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectCurrentSoundRecording, selectSoundRecordingFileById, setSoundRecordingFile } from 'features/sound-clips/soundClipSlice';
import { getSoundRecordingFile } from 'features/sound-clips/soundClipAPI';
import SoundRecordingPopover from './SoundRecordingPopover';
import * as ReactDOMServer from 'react-dom/server';

export type MapFeatures = {
    marker: google.maps.Marker;
    infoWindow: google.maps.InfoWindow;
}

export type SoundRecordingMapFeatureMap = {
    [recordingId: string]: MapFeatures;
}

export type SoundRecordingPopoverLoaderProps = {
    map?: google.maps.Map;
    mapFeatureMap?: SoundRecordingMapFeatureMap;
}

export default function SoundRecordingPopoverLoader(props: SoundRecordingPopoverLoaderProps) {
    const { map, mapFeatureMap } = props;
    const dispatch = useAppDispatch();
    const selectedRecording = useAppSelector(selectCurrentSoundRecording);
    const recordingFile = useAppSelector(state => selectSoundRecordingFileById(state, selectedRecording?.id));

    useEffect(() => {
        if (selectedRecording && map) {
            if (!recordingFile) {
                getSoundRecordingFile(selectedRecording.id)
                    .then(fileBlob => {
                        const recordingFileSrc = URL.createObjectURL(fileBlob);
                        dispatch(setSoundRecordingFile({
                            recordingId: selectedRecording.id,
                            fileSrc: recordingFileSrc
                        }));
                    });
            }
            const content = ReactDOMServer.renderToString(
                <SoundRecordingPopover
                    soundRecording={selectedRecording}
                    recordingFile={recordingFile}
                />
            );

            if (!mapFeatureMap) return;
            const features = mapFeatureMap[selectedRecording.id];

            if (!features) return;
            const { marker, infoWindow } = features;
    
            if (marker && infoWindow) {
                infoWindow.setContent(
                    content
                );
        
                infoWindow.open({
                    anchor: marker,
                    map
                });
            }
        }
    });

    return <></>;
}
