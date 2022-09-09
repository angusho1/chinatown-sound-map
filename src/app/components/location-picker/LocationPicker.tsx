import React, { useEffect, useRef, useState } from 'react';
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
    const markerRef = useRef<google.maps.Marker>();
    const mapRef = useRef<google.maps.Map>();
    const isMapLoaded = useRef<boolean>(false);
    const [pinLocation, setPinLocation] = useState<MapLocation | null>(null);
    const mapElementId = 'picker-map';
    
    const closeLocationModal = () => {
        onClose(!pinLocation ? location : pinLocation);
        isMapLoaded.current = false;
    };

    const getCurrLocation = (): MapLocation => {
        return pinLocation !== null ? { lat: pinLocation.lat, lng: pinLocation.lng } : { lat: location.lat, lng: location.lng };
    }
    
    /**
     * Load Google Map. Should only be called on the first render
     */
    const loadMap = async () => {
        const loader = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY as string,
            version: "weekly",
        });

        await loader.load();

        const loc: MapLocation = getCurrLocation();

        mapRef.current = new google.maps.Map(document.getElementById(mapElementId) as HTMLElement, {
          center: loc, 
          zoom: 17,
        });

        isMapLoaded.current = true;
    };

    /**
     * Add marker. Should only be called on the first render
     */
    const addMarker = () => {        
        const loc: MapLocation = getCurrLocation();
    
        const marker = new google.maps.Marker({
            position: loc,
            draggable: true,
            map: mapRef.current,
        });
    
        marker.addListener('mouseup', () => {
            const pos = marker.getPosition();
            const lat: number = pos?.lat() as number;
            const lng: number = pos?.lng() as number;
            setPinLocation({ lat, lng });
        });

        markerRef.current = marker;
    };
    
    const recenterMap = () => {
        const map: google.maps.Map = mapRef.current as google.maps.Map;
        const loc = getCurrLocation();
        map.panTo(loc);
    };

    useEffect(() => {
        if (opened) {
            if (isMapLoaded.current) {
                recenterMap();
            } else {
                loadMap().then(addMarker);
            }
        }
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
