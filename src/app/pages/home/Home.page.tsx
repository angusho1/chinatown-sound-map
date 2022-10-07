import React, { useEffect } from 'react';
import SoundRecordingMap from '../../components/sound-recording-map/SoundRecordingMap';

export default function HomePage() {
  useEffect(() => {
    document.title = 'Chinatown Sound Map';
  });

  return (
    <SoundRecordingMap />
  )
}
