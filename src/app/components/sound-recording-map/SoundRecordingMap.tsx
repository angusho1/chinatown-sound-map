import React, { useEffect, useState } from 'react';
import { Loader } from "@googlemaps/js-api-loader";
import './SoundRecordingMap.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchSoundClips, fetchSoundRecordings, selectSoundClips, selectSoundClipStatus, selectSoundRecordings, selectSoundRecordingStatus, setSelectedSoundRecording } from 'features/sound-clips/soundClipSlice';
import SoundClip from 'models/SoundClip.model';
import { GridAlgorithm, MarkerClusterer } from '@googlemaps/markerclusterer';
import { GOOGLE_MAPS_STYLES } from './mapStyles';
import SoundRecording from 'models/SoundRecording.model';
import SoundRecordingPopoverLoader, { MapFeatures, SoundRecordingMapFeatureMap } from '../sound-recording-popover/SoundRecordingPopoverLoader';

export default function SoundRecordingMap() {
    const dispatch = useAppDispatch();
    const [map, setMap] = useState<google.maps.Map>();
    const soundClipStatus = useAppSelector(selectSoundClipStatus);
    const soundRecordingStatus = useAppSelector(selectSoundRecordingStatus);
    const soundClips = useAppSelector(selectSoundClips);
    const soundRecordings = useAppSelector(selectSoundRecordings);

    if (soundClipStatus === 'idle') {
        dispatch(fetchSoundClips());
    }

    if (soundRecordingStatus === 'idle') {
        dispatch(fetchSoundRecordings());
    }

    const createSoundClipMarker = (soundClip: SoundClip): google.maps.Marker => {
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

    const createSoundRecordingMarker = (soundRecording: SoundRecording): MapFeatures => {
        const infoWindow = new google.maps.InfoWindow();

        const marker = new google.maps.Marker({
            position: { lat: soundRecording.location.lat, lng: soundRecording.location.lng },
            map,
            opacity: 0.5
        });

        marker.addListener('click', () => {
            dispatch(setSelectedSoundRecording(soundRecording));
        });

        return { marker, infoWindow };
    };

    const soundFilter = (sound: SoundClip | SoundRecording) => sound.location.lat && sound.location.lng;

    useEffect(() => {
        if (map) return;

        const loader = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY as string,
            version: "weekly",
        });

        loader.load().then(() => {
            const map: google.maps.Map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
                center: { lat: 49.279470, lng: -123.099721 }, 
                zoom: 17,
                gestureHandling: 'greedy',
                styles: GOOGLE_MAPS_STYLES
            });
    
            setMap(map);
        });
    }, [map?.getMapTypeId()]);
    
    const createMarkers = () => {
        if (!map) return;
        if (soundClipStatus !== 'succeeded' || soundRecordingStatus !== 'succeeded') return;
    
        const soundClipMarkers = soundClips.filter(soundFilter).map((soundClip: SoundClip) => createSoundClipMarker(soundClip));

        const soundRecordingMapFeatures: SoundRecordingMapFeatureMap = soundRecordings
            .filter(soundFilter)
            .reduce((featureMap: SoundRecordingMapFeatureMap, recording: SoundRecording) => {
                const mapFeatures = createSoundRecordingMarker(recording);
                featureMap[recording.id] = mapFeatures;
                return featureMap;
            }, {} as SoundRecordingMapFeatureMap);

        const markers = soundClipMarkers.concat(Object.values(soundRecordingMapFeatures).map(features => features.marker));

        new MarkerClusterer({
            algorithm: new GridAlgorithm({
                gridSize: 40,
                maxZoom: 17,
            }),
            map,
            markers
        });
    
        return soundRecordingMapFeatures;
    };

    const recordingIdToFeatureMap = createMarkers();

    return (
        <div id="map" data-testid="sound-map">
            <SoundRecordingPopoverLoader
                map={map}
                mapFeatureMap={recordingIdToFeatureMap}
            />
        </div>
    )
}
