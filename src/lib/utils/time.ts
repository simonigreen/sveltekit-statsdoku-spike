export const secondsToMinutesAndSeconds = (timeInSeconds: number) => {
	const minutes = Math.floor(timeInSeconds / 60);
	const seconds = timeInSeconds % 60;
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
