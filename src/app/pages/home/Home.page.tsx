import { Drawer } from '@mantine/core';
import SoundRecordingDetailedView from 'app/components/sound-recording-detailed-view/SoundRecordingDetailedView';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectCurrentSoundRecording, selectIsDetailedViewOpen, setSelectedSoundRecording, toggleDetailedView } from 'features/sound-clips/soundClipSlice';
import { Fragment, useEffect } from 'react';
import SoundRecordingMap from '../../components/sound-recording-map/SoundRecordingMap';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const isDetailedViewOpen = useAppSelector(selectIsDetailedViewOpen);
  const selectedSoundRecording = useAppSelector(selectCurrentSoundRecording);

  useEffect(() => {
    document.title = 'Chinatown Sound Map';
  });

  useEffect(() => {
    return () => {
      dispatch(setSelectedSoundRecording(null));
    }
  }, [dispatch]);

  return (
    <Fragment>
      <Drawer
        styles={{
          drawer: {
            height: 'calc(100vh - 60px)',
            top: '60px',
            backgroundColor: '#e1d8e8f5',
          },
        }}
        withOverlay={false}
        size={400}
        opened={isDetailedViewOpen && !!selectedSoundRecording}
        onClose={() => dispatch(toggleDetailedView(false))}
        withinPortal={false}
      >
        { selectedSoundRecording && (
          <SoundRecordingDetailedView soundRecording={selectedSoundRecording} />
        )}
      </Drawer>
      <SoundRecordingMap />
    </Fragment>
  )
}
