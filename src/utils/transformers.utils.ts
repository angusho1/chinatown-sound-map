import dayjs from 'dayjs';
import dur from 'dayjs/plugin/duration';

dayjs.extend(dur);

export const getTimeStampInSeconds = (seconds: number) => {
    const roundedSeconds = Math.floor(seconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const remainderSeconds = roundedSeconds % 60;
    return dayjs.duration({ minutes, seconds: remainderSeconds }).format('m:ss');
}