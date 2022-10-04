import React, { useEffect, useState } from 'react';
import { Loader } from "@googlemaps/js-api-loader";
import './Map.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchSoundClips, fetchSoundRecordings, selectSoundClips, selectSoundRecordingFiles, selectSoundRecordings, setSoundRecordingFile } from 'features/sound-clips/soundClipSlice';
import SoundClip from 'models/SoundClip.model';
import { GridAlgorithm, MarkerClusterer } from '@googlemaps/markerclusterer';
import { GOOGLE_MAPS_STYLES } from './mapStyles';
import SoundRecording from 'models/SoundRecording.model';
import { getSoundRecordingFile } from 'features/sound-clips/soundClipAPI';

export default function Map() {
    const dispatch = useAppDispatch();
    const [loadedSoundClips, setLoadedSoundClips] = useState(false);
    const [loadedSoundRecordings, setLoadedSoundRecordings] = useState(false);
    const soundClips = useAppSelector(selectSoundClips);
    const soundRecordings = useAppSelector(selectSoundRecordings);
    const recordingFiles = useAppSelector(selectSoundRecordingFiles);

    if (!loadedSoundClips) {
        dispatch(fetchSoundClips());
        setLoadedSoundClips(true);
    }

    if (!loadedSoundRecordings) {
        dispatch(fetchSoundRecordings());
        setLoadedSoundRecordings(true);
    }

    const loader = new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY as string,
        version: "weekly",
    });

    const createSoundClipMarker = (soundClip: SoundClip, map: google.maps.Map): google.maps.Marker => {
        const infoWindow = new google.maps.InfoWindow();

        const marker = new google.maps.Marker({
            position: { lat: soundClip.location.lat, lng: soundClip.location.lng },
            map,
        });
    
        marker.addListener('click', () => {
            infoWindow.setContent(
                `<h5>${soundClip.title}</h5>
                <div>${soundClip.content}</div>
                <div>Author: ${soundClip.author}</div>
                <div>Date: ${soundClip.date ? soundClip.date : 'unknown'}</div>`
            );
    
            infoWindow.open({
                anchor: marker,
                map
            });
        });
    
        return marker;
    };

    const createSoundRecordingMarker = (soundRecording: SoundRecording, map: google.maps.Map): google.maps.Marker => {
        const infoWindow = new google.maps.InfoWindow();

        const marker = new google.maps.Marker({
            position: { lat: soundRecording.location.lat, lng: soundRecording.location.lng },
            map,
            opacity: 0.5
        });

        marker.addListener('click', async () => {
            let recordingFileSrc: string;
            if (!recordingFiles[soundRecording.id]) {
                const fileBlob = await getSoundRecordingFile(soundRecording.id);
                recordingFileSrc = URL.createObjectURL(fileBlob);
                dispatch(setSoundRecordingFile({
                    recordingId: soundRecording.id,
                    fileSrc: recordingFileSrc
                }));
            } else {
                recordingFileSrc = recordingFiles[soundRecording.id];
            }

            infoWindow.setContent(
                `<h5>${soundRecording.title}</h5>
                <audio controls src="${recordingFileSrc}"></audio>
                <div>Author: ${soundRecording.author}</div>
                <div>Date: ${soundRecording.dateRecorded ? soundRecording.dateRecorded : 'unknown'}</div>`
            );
    
            infoWindow.open({
                anchor: marker,
                map
            });
        });
    
        return marker;
    };

    const soundFilter = (sound: SoundClip | SoundRecording) => sound.location.lat && sound.location.lng;

    useEffect(() => {
        loader.load().then(() => {
            const map: google.maps.Map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
              center: { lat: 49.279470, lng: -123.099721 }, 
              zoom: 17,
              gestureHandling: 'greedy',
              styles: GOOGLE_MAPS_STYLES
            });

            const markers = soundClips.filter(soundFilter)
                .map((soundClip: SoundClip) => createSoundClipMarker(soundClip, map))
                .concat(
                    soundRecordings.filter(soundFilter)
                        .map((recording: SoundRecording) => createSoundRecordingMarker(recording, map))
                );

            new MarkerClusterer({
                algorithm: new GridAlgorithm({
                    gridSize: 40,
                    maxZoom: 17,
                }),
                map,
                markers
            });
        });
    });

    return (
        <div id="map" data-testid="sound-map">
        </div>
    )
}
