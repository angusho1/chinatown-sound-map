import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectCurrentSoundRecording, selectSoundRecordingFileById, selectSoundRecordingImageById, setSelectedSoundRecording, setSoundRecordingFile, cacheSoundRecordingImageFile } from 'features/sound-clips/soundClipSlice';
import { getSoundRecordingFile, getSoundRecordingImageFile } from 'features/sound-clips/soundClipAPI';
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
    const [requestedRecording, setRequestedRecording] = useState<boolean>(false);
    const [requestedImages, setRequestedImages] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const selectedRecording = useAppSelector(selectCurrentSoundRecording);
    const recordingFile = useAppSelector(state => selectSoundRecordingFileById(state, selectedRecording?.id));
    const imageFiles = useAppSelector(state => selectSoundRecordingImageById(state, selectedRecording?.id));

    useEffect(() => {
        if (selectedRecording && map) {
            if (!recordingFile && !requestedRecording) {
                getSoundRecordingFile(selectedRecording.id)
                    .then(fileBlob => {
                        const recordingFileSrc = URL.createObjectURL(fileBlob);
                        dispatch(setSoundRecordingFile({
                            recordingId: selectedRecording.id,
                            fileSrc: recordingFileSrc
                        }));
                    });
                setRequestedRecording(true);
            }

            if (!imageFiles && !requestedImages) {
                selectedRecording.imageFiles?.forEach(filename => {
                    getSoundRecordingImageFile(filename)
                        .then(fileBlob => {
                            const recordingFileSrc = URL.createObjectURL(fileBlob);
                            dispatch(cacheSoundRecordingImageFile({
                                recordingId: selectedRecording.id,
                                fileSrc: recordingFileSrc
                            }));
                        });
                    setRequestedImages(true);
                });
            }

            const content = ReactDOMServer.renderToString(
                <SoundRecordingPopover
                    soundRecording={selectedRecording}
                    recordingFile={recordingFile}
                    imageFiles={imageFiles}
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

                infoWindow.addListener('closeclick', () => {
                    dispatch(setSelectedSoundRecording(null));
                    setRequestedRecording(false);
                    setRequestedImages(false);
                    google.maps.event.clearInstanceListeners(infoWindow);
                });
            }
        }
    }, [selectedRecording, map, recordingFile, requestedRecording, imageFiles, requestedImages, mapFeatureMap, dispatch]);

    return <></>;
}
