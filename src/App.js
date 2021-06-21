import MainContainer from './MainContainer';
import VideoProcessingNotice from './VideoProcessingNotice';
import { toLibx264 } from './Recorder';
import { useState } from 'react';

function App() {
	const [progressState, setProgress] = useState({
		isProgress: false,
		rate: 0,
	});

	const updateProgress = (frameRate, t, log) => {
		const { message } = log;
		if (message.startsWith('frame=')) {
			setProgress({
				isProgress: true,
				rate: (message.split(/\s+/)[1] / (t * frameRate)) * 100,
			});
			console.log(message, t);
		}
	};

	const downloadBlob = async (blob) => {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = new Date().toLocaleString() + '.mp4';
		a.click();
	};

	const executeDownload = async (blob, frameRate, t) => {
		const resultBlob = await toLibx264(blob, (log) =>
			updateProgress(frameRate, t, log)
		);
		setProgress({
			isProgress: true,
			rate: 100,
		});
		setTimeout(() => {
			setProgress({ isProgress: false, rate: 100 });
			setTimeout(() => setProgress({ isProgress: false, rate: 0 }), 400);
		}, 2500);
		downloadBlob(resultBlob);
	};

	return (
		<div>
			<MainContainer executeDownload={executeDownload} />
			<VideoProcessingNotice progressState={progressState} />
		</div>
	);
}

export default App;