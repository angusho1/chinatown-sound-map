import React, { useEffect, useState } from 'react';
import { Loader } from "@googlemaps/js-api-loader";
import './Map.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchSoundClips, selectSoundClips } from 'features/sound-clips/soundClipSlice';
import SoundClip from 'features/sound-clips/SoundClip';

export default function Map() {
    let map: google.maps.Map;

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
            map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
              center: { lat: 49.279992, lng: -123.104931 }, 
              zoom: 16,
            });

            soundClips.forEach((soundClip: SoundClip) => {
                const infowindow = new google.maps.InfoWindow({
                    content: `<h5>"${soundClip.title}"</h5>
                            <div>Author: ${soundClip.author}</div>
                            <div>Date: ${soundClip.date}</div>`,
                });

                const marker = new google.maps.Marker({
                    position: { lat: soundClip.location.lat, lng: soundClip.location.lng },
                    map,
                });

                marker.addListener('click', () => {
                    infowindow.open({
                        anchor: marker,
                        map
                    });
                });
            });
        });
    });

    return (
        <div id="map">
        </div>
    )
}
