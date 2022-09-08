import React, { useEffect, useState } from 'react';
import { Loader } from "@googlemaps/js-api-loader";
import { Modal } from '@mantine/core';

export interface MapLocation {
    lat: number;
    lng: number;
}

interface LocationPickerProps {
    opened: boolean;
    location: MapLocation;
    onClose: (location: MapLocation) => any;
}

export default function LocationPicker({ location, opened, onClose }: LocationPickerProps) {
    let marker: google.maps.Marker;
    const [pinLocation, setPinLocation] = useState<MapLocation | null>(null);
    const mapElementId = 'picker-map';
    
    const closeLocationModal = () => {
        onClose(!pinLocation ? location : pinLocation);
    };
    
    const loadMap = () => {
        const loader = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY as string,
            version: "weekly",
        });

        loader.load().then(() => {
            const loc: MapLocation = pinLocation !== null ? { lat: pinLocation.lat, lng: pinLocation.lng } : { lat: location.lat, lng: location.lng };

            const map: google.maps.Map = new google.maps.Map(document.getElementById(mapElementId) as HTMLElement, {
              center: loc, 
              zoom: 17,
            });
    
            marker = new google.maps.Marker({
                position: loc,
                draggable: true,
                map,
            });

            marker.addListener('mouseup', () => {
                const pos = marker.getPosition();
                const lat: number = pos?.lat() as number;
                const lng: number = pos?.lng() as number;
                setPinLocation({ lat, lng });
            });
        });
    }

    useEffect(() => {
        if (opened) loadMap();
    });

    return (
        <Modal centered size="lg" opened={opened} 
            title="Pick Location"
            onClose={closeLocationModal}
            >
            <div id={mapElementId} style={{ height: '50vh' }} data-testid="location-picker-map">
            </div>
        </Modal>
    )
}
