import MainContainer from './MainContainer';
import VideoProcessingNotice from './VideoProcessingNotice';
import { toLibx264 } from './Recorder';
import { useState } from 'react';
import NotSupportMobile from './NotSupportMobile';

const isNotSupport = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent); 

function App() {
    const [progressState, setProgress] = useState({
        isProgress: false,
        rate: 0,
    });

    const updateProgress = (duration, log) => {
        const { message } = log;
        if (message.startsWith('frame=')) {
            const l = message.match(/[\d.]+/g);
            if (l.length !== 11) return;
            const time = l[4] * 3600 + l[5] * 60 + +l[6];

            setProgress({
                isProgress: true,
                rate: (time / duration) * 100,
            });
        }
    };

    const downloadBlob = async (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = new Date().toLocaleString() + '.mp4';
        a.click();
    };

    const executeDownload = async (blob, duration) => {
        const resultBlob = await toLibx264(blob, (log) => {
            updateProgress(duration, log);
        }
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
            { isNotSupport ? <NotSupportMobile/> : <MainContainer executeDownload={executeDownload} /> }
            <VideoProcessingNotice progressState={progressState} />
        </div>
    );
}

export default App;