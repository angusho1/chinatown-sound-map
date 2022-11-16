import { useState } from 'react';
import './SoundRecordingMap.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchSoundClips, fetchSoundRecordings, selectCurrentSoundRecording, selectSoundClips, selectSoundClipStatus, selectSoundRecordings, selectSoundRecordingStatus, setSelectedSoundRecording } from 'features/sound-clips/soundClipSlice';
import SoundClip from 'models/SoundClip.model';
import { MarkerClusterer as GoogleMarkerClusterer } from '@googlemaps/markerclusterer';
import { GOOGLE_MAPS_STYLES } from './mapStyles';
import SoundRecording from 'models/SoundRecording.model';
import { GoogleMap, InfoWindow, Marker, MarkerClusterer, useJsApiLoader } from '@react-google-maps/api';
import { DEFAULT_SUBMISSION_LOCATION } from 'utils/form-validators.utils';
import SoundRecordingPopover from '../sound-recording-popover/SoundRecordingPopover';

export default function SoundRecordingMap() {
    const dispatch = useAppDispatch();
    const [selectedSoundClip, setSelectedSoundClip] = useState<SoundClip | null>(null);
    const soundClipStatus = useAppSelector(selectSoundClipStatus);
    const soundRecordingStatus = useAppSelector(selectSoundRecordingStatus);
    const soundClips = useAppSelector(selectSoundClips);
    const soundRecordings = useAppSelector(selectSoundRecordings);
    const selectedRecording = useAppSelector(selectCurrentSoundRecording);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY as string,
        version: 'weekly',
    });

    if (soundClipStatus === 'idle') {
        dispatch(fetchSoundClips());
    }

    if (soundRecordingStatus === 'idle') {
        dispatch(fetchSoundRecordings());
    }

    const renderSoundClips = (clusterer: GoogleMarkerClusterer) => {
        const soundClipsToRender = soundClips.filter(soundFilter);

        return soundClipsToRender.map((soundClip: SoundClip) => {
            const loc = {
                lat: soundClip.location.lat,
                lng: soundClip.location.lng,
            };

            return (
                <Marker
                    key={soundClip.title}
                    position={loc}
                    onClick={() => setSelectedSoundClip(soundClip)}
                    clusterer={clusterer}
                >
                    { selectedSoundClip && selectedSoundClip.title === soundClip.title && (
                        <InfoWindow
                            onCloseClick={() => setSelectedSoundClip(null)}
                        >
                            <div>
                                <h5>{soundClip.title}</h5>
                                <div dangerouslySetInnerHTML={{
                                    __html: soundClip.content
                                }}></div>
                                <div>Author: {soundClip.author}</div>
                                <div>Date: {soundClip.date ? soundClip.date : 'unknown'}</div>
                            </div>
                        </InfoWindow>
                    )}
                </Marker>
            );
        });
    };

    const renderSoundRecordings = (clusterer: GoogleMarkerClusterer) => {
        const soundRecordingsToRender = soundRecordings.filter(soundFilter);
        
        return soundRecordingsToRender.map((soundRecording: SoundRecording) => {
            const loc = {
                lat: soundRecording.location.lat,
                lng: soundRecording.location.lng,
            };

            const onMarkerClick = () => dispatch(setSelectedSoundRecording(soundRecording));

            const onInfoWindowClose = () => dispatch(setSelectedSoundRecording(null));

            return (
                <Marker
                    key={soundRecording.id}
                    position={loc}
                    opacity={0.5}
                    onClick={onMarkerClick}
                    clusterer={clusterer}
                >
                    { selectedRecording && selectedRecording.id === soundRecording.id && (
                        <InfoWindow
                            onCloseClick={onInfoWindowClose}
                        >
                            <SoundRecordingPopover
                                soundRecording={soundRecording}
                                recordingFile={null}
                                imageFiles={null}
                            />
                        </InfoWindow>
                    )}
                </Marker>
            );
        });
    };

    const soundFilter = (sound: SoundClip | SoundRecording) => sound.location.lat && sound.location.lng;

    const mapOptions: google.maps.MapOptions = {
        gestureHandling: 'greedy',
        styles: GOOGLE_MAPS_STYLES
    };

    return (
        <div id="map">
            { isLoaded && (
                <GoogleMap
                    mapContainerStyle={{ height: '100%' }}
                    center={DEFAULT_SUBMISSION_LOCATION}
                    zoom={17}
                    options={mapOptions}
                >
                    <MarkerClusterer
                        gridSize={40}
                        maxZoom={18}
                    >
                        { (clusterer: any) => 
                            <>
                                { soundClipStatus === 'succeeded' && renderSoundClips(clusterer) }
                                { soundRecordingStatus === 'succeeded' && renderSoundRecordings(clusterer) }
                            </>
                        }
                    </MarkerClusterer>
                </GoogleMap>
            )}
        </div>
    );
}
