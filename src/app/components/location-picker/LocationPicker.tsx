import React, { useState } from 'react';
import { GoogleMap, MarkerF, useGoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { Modal } from '@mantine/core';
import { RecordingLocation } from 'models/RecordingLocation.model';
import { GOOGLE_MAPS_STYLES } from '../sound-recording-map/mapStyles';

interface LocationPickerProps {
    opened: boolean;
    location: RecordingLocation;
    onClose: (location: RecordingLocation) => any;
}

export default function LocationPicker({ location, opened, onClose }: LocationPickerProps) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY as string,
        version: 'weekly',
    });

    const [pinLocation, setPinLocation] = useState<RecordingLocation | null>(null);
    
    const closeLocationModal = () => {
        onClose(!pinLocation ? location : pinLocation);
    };

    const getCurrLocation = (): RecordingLocation => {
        return pinLocation !== null ? { lat: pinLocation.lat, lng: pinLocation.lng } : { lat: location.lat, lng: location.lng };
    }

    const updateMarkerPosition = (e: any) => {
        const lat: number = e.latLng.lat() as number;
        const lng: number = e.latLng.lng() as number;
        setPinLocation({ lat, lng });
    };

    const renderMap = () => {
        const loc: RecordingLocation = getCurrLocation();

        const options: google.maps.MapOptions = {
            gestureHandling: 'greedy',
            styles: GOOGLE_MAPS_STYLES
        }

        return (
            <GoogleMap
                mapContainerStyle={{ height: '50vh' }}
                center={loc}
                zoom={17}
                options={options}
            >
                <MarkerF
                    position={loc}
                    draggable={true}
                    onMouseUp={updateMarkerPosition}
                />
                <PanningComponent location={getCurrLocation()} />
            </GoogleMap>
        );
    };

    return (
        <Modal centered size="lg" opened={opened} 
            title="Pick Location"
            onClose={closeLocationModal}
            >
            { isLoaded && renderMap() }
        </Modal>
    )
}

interface PanningComponentProps {
    location: RecordingLocation;
}

function PanningComponent({ location }: PanningComponentProps) {
    const map = useGoogleMap();
  
    React.useEffect(() => {
      if (map) {
        map.panTo(location);
      }
    }, [location, map]);
  
    return null;
}