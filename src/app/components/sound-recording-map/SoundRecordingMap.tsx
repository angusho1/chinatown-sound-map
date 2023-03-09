import './SoundRecordingMap.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchSoundRecordings, selectCurrentSoundRecording, selectSoundRecordings, selectSoundRecordingStatus, setSelectedSoundRecording } from 'features/sound-recordings/soundRecordingSlice';
import { GOOGLE_MAPS_STYLES } from './mapStyles';
import SoundRecording from 'models/SoundRecording.model';
import { GoogleMap, InfoWindowF, MarkerClusterer, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { DEFAULT_SUBMISSION_LOCATION } from 'utils/form-validators.utils';
import SoundRecordingPopover from '../sound-recording-popover/SoundRecordingPopover';
import { playAudio } from 'features/audio/audioSlice';
import { LoadingOverlay } from '@mantine/core';

export default function SoundRecordingMap() {
    const dispatch = useAppDispatch();
    const soundRecordingStatus = useAppSelector(selectSoundRecordingStatus);
    const soundRecordings = useAppSelector(selectSoundRecordings);
    const selectedRecording = useAppSelector(selectCurrentSoundRecording);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY as string,
        version: 'weekly',
    });

    if (soundRecordingStatus === 'idle') {
        dispatch(fetchSoundRecordings());
    }

    const renderSoundRecordings = (clusterer: any) => {
        const soundRecordingsToRender = soundRecordings.filter(soundFilter);
        
        return soundRecordingsToRender.map((soundRecording: SoundRecording) => {
            const loc = {
                lat: soundRecording.location.lat,
                lng: soundRecording.location.lng,
            };

            const onMarkerClick = () => {
                dispatch(setSelectedSoundRecording(soundRecording));
                dispatch(playAudio());
            };

            const onInfoWindowClose = () => dispatch(setSelectedSoundRecording(null));

            return (
                <MarkerF
                    key={soundRecording.id}
                    position={loc}
                    onClick={onMarkerClick}
                    clusterer={clusterer}
                    icon="marker-icons/recording-marker-icon.png"
                >
                    { selectedRecording && selectedRecording.id === soundRecording.id && (
                        <InfoWindowF
                            options={{ ariaLabel: 'Sound Recording' }}
                            onCloseClick={onInfoWindowClose}
                        >
                            <SoundRecordingPopover
                                soundRecording={soundRecording}
                            />
                        </InfoWindowF>
                    )}
                </MarkerF>
            );
        });
    };

    const soundFilter = (sound: SoundRecording) => sound.location.lat && sound.location.lng;

    
    const renderMap = () => {
        const mapOptions: google.maps.MapOptions = {
            gestureHandling: 'greedy',
            styles: GOOGLE_MAPS_STYLES,
            mapTypeControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP,
            },
            fullscreenControlOptions: {
                position: google.maps.ControlPosition.BOTTOM_RIGHT,
            }
        };

        return (
            <GoogleMap
                mapContainerStyle={{ height: '100%' }}
                center={DEFAULT_SUBMISSION_LOCATION}
                zoom={17}
                options={mapOptions}
            >
                <LoadingOverlay visible={soundRecordingStatus === 'pending'} overlayBlur={2} />
                <MarkerClusterer
                    gridSize={40}
                    maxZoom={18}
                    styles={[
                        {
                            url: "/marker-icons/cluster1.png",
                            height: 40,
                            width: 40
                        },
                        {
                            url: "/marker-icons/cluster2.png",
                            height: 40,
                            width: 40
                        },
                        {
                            url: "/marker-icons/cluster3.png",
                            height: 40,
                            width: 40
                        },
                    ]}
                >
                    { (clusterer: any) => 
                        <>
                            { soundRecordingStatus === 'succeeded' && renderSoundRecordings(clusterer) }
                        </>
                    }
                </MarkerClusterer>
            </GoogleMap>
        );
    };

    return (
        <div id="map" data-testid="sound-map">
            { isLoaded ? renderMap() : null }
        </div>
    );
}
