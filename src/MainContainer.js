import React, { useRef, useState } from 'react';
import { Recorder } from './Recorder';
import * as constants from './constants';
import styled from 'styled-components';

const Container = styled.div`
	width: 60em;
	background: rgba(255, 255, 255, 0.4);
	box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
	backdrop-filter: blur(5.5px);
	-webkit-backdrop-filter: blur(5.5px);
	border-radius: 10px;
	border: 1px solid rgba(255, 255, 255, 0.18);
	margin: auto;
	margin-top: 5em;
	border-radius: 1.2em;
	padding: 2em;
`;

const Video = styled.video`
	width: 100%;
	height: auto;
	border-radius: 0.6em;
	background-color: black;
`;

const SettingContainer = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
`;

const OptionContainer = styled.div`
	box-sizing: border-box;
	width: 100%;
	padding: 1em;
	background: rgba(0, 0, 0, 0.6);
	backdrop-filter: blur(9px);
	-webkit-backdrop-filter: blur(9px);
	border-radius: 1.1em;
	margin: auto;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	height: 5em;
	select {
		font-family: 'Inter', sans-serif;
		font-weight: 600;
		-webkit-appearance: none; /* 네이티브 외형 감추기 */
		-moz-appearance: none;
		appearance: none;
		font-size: 1.3em;
		border-radius: 0.4em;
		padding: 0.2em;
		outline: none;
		width: 100%;
		margin: 0 0.2em;
		text-align-last: center;
		&:focus {
			border: 3px solid #0a89df;
		}
	}
`;

const RecordingButton = styled.button`
	font-family: 'Inter', sans-serif;
	padding: 0.5em 1.1em;
	color: white;
	font-size: 1.6em;
	font-weight: bold;
	border-radius: 0.5em;
	margin: 0.2em 0;
	margin-bottom: 0;
	border: none;
	&:hover {
		cursor: pointer;
	}
	${(props) =>
		props.isRecording
			? `background-color: #f03402;
			&:active {
				background-color: #d12b02;
			}
			`
			: `
			background-color: #3a2ee0;
			&:active {
				background-color: #2f25b8;
			}
			`
	}
`;

function MainContainer({ executeDownload }) {
	const videoStreaming = useRef();

	const stream = useRef();

	const recorder = useRef();

	const [options, setOptions] = useState({
		recordingType: '1',
		resolutionOption: '1',
	});

	const [recordingState, setRecordingState] = useState({
		isRecording: false,
	});

	const { recordingType, resolutionOption } = options;

	const { isRecording } = recordingState;

	const onOptionChange = (e) => {
		const { value, name } = e.target;
		setOptions({
			...options,
			[name]: value,
		});
		console.log(name, value);
	};

	const onClick = async () => {
		console.log(isRecording);
		if (!isRecording) {
			//recording start
			const [recType, resOption] = [
				constants.recordingTypeList[recordingType],
				constants.resolutionOptionList[resolutionOption],
			];
			if (recType.screen) {
				stream.current = await navigator.mediaDevices.getDisplayMedia({
					video: resOption,
					audio: recType.screen.audio
						? {
								autoGainControl: false,
								echoCancellation: false,
								googAutoGainControl: false,
								noiseSuppression: false,
						  }
						: false,
					frameRate: 30,
				});
			} else {
				stream.current = await navigator.mediaDevices.getUserMedia({
					video: resOption,
					audio: recType.cam
						? {
								autoGainControl: false,
								echoCancellation: false,
								googAutoGainControl: false,
								noiseSuppression: false,
						  }
						: false,
					frameRate: 30,
				});
			}
			recorder.current = new Recorder(
				stream.current,
				{
					mimeType: 'video/webm; codecs=vp8',
					audioBitsPerSecond: 128000,
				},
				(blob, duration) => executeDownload(blob, 30, duration)
			);
			recorder.current.startRecording();
			videoStreaming.current.srcObject = stream.current;
			videoStreaming.current.onloadedmetadata = (e) =>
				videoStreaming.current.play();
			setRecordingState({
				isRecording: true,
			});
		} else {
			setRecordingState({
				isRecording: false,
			});
			stream.current.getTracks().forEach((track) => track.stop());
			recorder.current.stopRecording();
		}
	};

	return (
		<Container>
			<div>
				<Video ref={videoStreaming} muted></Video>
			</div>
			<SettingContainer>
				<OptionContainer>
					<select
						value={recordingType}
						onChange={onOptionChange}
						name="recordingType"
					>
						<option value="1">Screen</option>
						<option value="2">Screen + Audio</option>
						<option value="3">Camera</option>
						<option value="4">Camera + Microphone</option>
					</select>
					<select
						value={resolutionOption}
						onChange={onOptionChange}
						name="resolutionOption"
					>
						<option value="1">640 x 360 (360P)</option>
						<option value="2">1280 x 720 (HD)</option>
						<option value="3">1920 x 1080 (FHD)</option>
						<option value="4">2560 x 1440 (QHD)</option>
						<option value="5">3240 x 2160 (4K UHD)</option>
					</select>
				</OptionContainer>
				<RecordingButton
					onClick={onClick}
					isRecording={isRecording}
				>
					{isRecording ? 'Stop Recording' : 'Record Now'}
				</RecordingButton>
			</SettingContainer>
		</Container>
	);
}

export default MainContainer;
