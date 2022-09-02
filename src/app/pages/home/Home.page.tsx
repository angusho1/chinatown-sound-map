import React, { useEffect } from 'react';
import Map from './map/Map';

export default function HomePage() {
  useEffect(() => {
    document.title = 'Chinatown Sound Map';
  });

  return (
    <Map />
  )
}
