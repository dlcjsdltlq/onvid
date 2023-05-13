import { createFFmpeg } from '@ffmpeg/ffmpeg';

function Recorder(stream, options, callback) {
    this.mediaRecoder = new MediaRecorder(stream, options);
    this.recordedChunks = [];
    this.startTime = 0;
    this.duration = 0;

    this.handleDataAvailable = (e) => {
        if (e.data.size > 0) {
            this.recordedChunks.push(e.data);
            callback(new Blob(this.recordedChunks), this.duration / 1000);
        }
    };

    this.startRecording = () => {
        this.mediaRecoder.start();
        this.startTime = new Date();
    };
    this.stopRecording = () => {
        this.mediaRecoder.stop();
        this.duration = new Date() - this.startTime;
    };

    this.mediaRecoder.ondataavailable = this.handleDataAvailable;
}

async function toLibx264(blob, logger) {
    const ffmpeg = createFFmpeg({
        logger: logger,
    });

    await ffmpeg.load();
    const buffer = await blob.arrayBuffer();
    ffmpeg.FS('writeFile', 'input.webm', new Uint8Array(buffer, 0, buffer.byteLength));
    await ffmpeg.run('-i', 'input.webm', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '27', 'output.mp4');
    const output = ffmpeg.FS('readFile', 'output.mp4');
    
    ffmpeg.FS('unlink', 'input.webm');
    setTimeout(() => ffmpeg.FS('unlink', 'output.mp4'), 2000);
    return new Blob([output.buffer], { type: 'video/mp4' });
}

export { Recorder, toLibx264 };
