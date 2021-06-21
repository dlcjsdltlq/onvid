import React from 'react';
import styled from 'styled-components';

const VideoProcessing = styled.div`
	background: rgba(0, 0, 0, 0.5);
	box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
	border-radius: 10px;
	border: 1px solid rgba(255, 255, 255, 0.18);
	display: inline-block;
	color: white;
	font-size: 1.5em;
	text-align: left;
	position: fixed;
	bottom: 0;
	right: 0;
	z-index: 1;
	margin: 1.5em;
	padding: 0 1.3em;
	transition: opacity 0.4s;
	width: 13em;
	opacity: ${(props) => (props.isProgress ? 1 : 0)};
`;

const ProcessingText = styled.div`
	margin: 0.8em 0;
	font-weight: 700;
	color: ${(props) => (props.isComplete ? '#00ff00' : '#FFFFFF')};
`;

const ProgressBar = styled.div`
	background-color: rgba(0, 0, 0, 0.233);
	border-radius: 1em;
	margin: 0.8em 0;
	height: 0.4em;
	overflow: hidden;
	div {
		background-color: #ffffff;
		border-radius: 1em;
		height: 100%;
		transition: width 0.3s ease-in-out;
		width: ${(props) => props.rate + '%'};
	}
`;

function VideoProcessingNotice({ progressState }) {
	const { isProgress, rate } = progressState;
	console.log(progressState);
	return (
		<VideoProcessing isProgress={isProgress}>
			<ProcessingText isComplete={rate === 100}>
				{rate === 100 ? 'Complete!' : 'Video Processing...'}
			</ProcessingText>
				<ProgressBar rate={isProgress ? rate : 0}>
					<div></div>
				</ProgressBar>
		</VideoProcessing>
	);
}

export default VideoProcessingNotice;
