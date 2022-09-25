import React, { useEffect, useState } from 'react';
import { Loader } from "@googlemaps/js-api-loader";
import './Map.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchSoundClips, selectSoundClips } from 'features/sound-clips/soundClipSlice';
import SoundClip from 'models/SoundClip.model';
import { GridAlgorithm, MarkerClusterer } from '@googlemaps/markerclusterer';
import { GOOGLE_MAPS_STYLES } from './mapStyles';

export default function Map() {
    const dispatch = useAppDispatch();
    const [loadedSoundClips, setLoadedSoundClips] = useState(false);
    const soundClips = useAppSelector(selectSoundClips);

    if (!loadedSoundClips) {
        dispatch(fetchSoundClips());
        setLoadedSoundClips(true);
    }

    const loader = new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY as string,
        version: "weekly",
    });

    useEffect(() => {
        loader.load().then(() => {
            const map: google.maps.Map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
              center: { lat: 49.279470, lng: -123.099721 }, 
              zoom: 17,
              gestureHandling: 'greedy',
              styles: GOOGLE_MAPS_STYLES
            });

            const infoWindow = new google.maps.InfoWindow();

            const markers = soundClips.filter((soundClip: SoundClip) => soundClip.location.lat && soundClip.location.lng)
                .map((soundClip: SoundClip) => {
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
                });

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
