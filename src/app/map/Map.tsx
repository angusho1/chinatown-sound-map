import React, { useEffect, useState } from 'react';
import { Loader } from "@googlemaps/js-api-loader";
import './Map.css';
import { useAppDispatch } from 'app/hooks';
import { fetchSoundClips } from 'features/sound-clips/soundClipSlice';

export default function Map() {
    let map: google.maps.Map;

    const dispatch = useAppDispatch();
    const [loadedSoundClips, setLoadedSoundClips] = useState(false);

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
        });
    });

    return (
        <div id="map">
        </div>
    )
}
