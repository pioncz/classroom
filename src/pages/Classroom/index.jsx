import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import styled from '@emotion/styled';
import * as faceapi from 'face-api.js';
import { motion, useAnimation } from 'framer-motion';
import { Spinner } from 'theme-ui';
import TopBar from './TopBar';
import ChatBar from './ChatBar';

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  flex: 1 1;
  display: flex;
`;

const VideoGrid = styled.div`
  flex: 1 1;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  align-items: center;
  justify-content: center;
`;

const VideoBox = styled.div`
  width: 30%;
  position: relative;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-sizing: content-box;

  border: 3px solid
    ${(props) => (props.selected ? '#69ffac' : '#232323')};

  &::after {
    content: '';
    display: block;
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 56%;
  }

  video {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;

const PhotoWrapper = styled(motion.div)`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  opacity: 0;

  canvas {
    position: absolute;
  }
`;

const StyledSpinner = styled(Spinner)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledChatBar = styled(ChatBar)`
  flex: 0 0 350px;
`;

const PhotoInterval = 5 * 1000;

function Classroom({ firstClick, onInitialized }) {
  const [initialized, setInitialized] = useState(false);
  const videoRef = useRef();
  const videoContainerRef0 = useRef();
  const videoContainerRef1 = useRef();
  const videoContainerRef2 = useRef();
  const videoContainerRef3 = useRef();
  const videoContainerRef4 = useRef();
  const videoContainerRef5 = useRef();
  const videoContainerRef6 = useRef();
  const videoContainerRef7 = useRef();
  const canvasRef = useRef();
  const canvasOverlayRef = useRef();
  const initRef = useRef(false);
  const photoControls = useAnimation();

  useEffect(() => {
    if (initialized) {
      onInitialized();
    }
  }, [initialized, onInitialized]);

  const handleClickRoot = useCallback(() => {
    console.log('Start making photo');
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const canvasOverlay = canvasOverlayRef.current;
    const { videoHeight: height, videoWidth: width } = video;

    if (!width || !height) return;

    const { width: elWidth, height: elHeight } =
      video.getBoundingClientRect();

    let newHeight;
    let newWidth;

    // Video El is more horizontal, then stream
    if (elWidth / elHeight > width / height) {
      newWidth = elHeight * (width / height);
      newHeight = elHeight;
      // Video El is more vertical, then stream
    } else {
      newWidth = elWidth;
      newHeight = elWidth * (width / height);
    }

    canvas.width = newWidth;
    canvas.height = newHeight;
    canvasOverlay.width = newWidth;
    canvasOverlay.height = newHeight;

    canvasRef.current
      .getContext('2d')
      .drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );

    faceapi
      .detectAllFaces(
        canvasRef.current,
        new faceapi.TinyFaceDetectorOptions(),
      )
      .then((detections) => {
        setInitialized(true);
        if (!detections.length) {
          initRef.current = true;
          setTimeout(handleClickRoot, PhotoInterval);
          return;
        }

        const videoContainer = videos.find((vC) => !!vC.videoRef);

        if (!videoContainer?.containerRef?.current) return;

        const {
          x: videoContainerX,
          y: videoContainerY,
          width: videoContainerWidth,
          height: videoContainerHeight,
        } = videoContainer.containerRef.current.getBoundingClientRect();

        photoControls.set({
          width: videoContainerWidth - 6,
          height: videoContainerHeight - 6,
          top: videoContainerY + 3,
          left: videoContainerX + 3,
          opacity: 0,
          filter: 'brightness(0)',
          scale: 1,
        });

        // Draw rectange
        const { width, height } = canvasOverlayRef.current;
        const ctx = canvasOverlayRef.current.getContext('2d');
        const {
          left,
          top,
          width: widthDetection,
          height: heightDetection,
        } = detections[0].box;

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.rect(left, top, widthDetection, heightDetection);
        ctx.stroke();
        ctx.closePath();

        if (initRef.current) {
          const { x: destinationX, y: destinationY } =
            videos[0].containerRef.current.getBoundingClientRect();

          photoControls.start({
            opacity: [0, 1, 1, 1, 1],
            top: destinationY + 3,
            left: destinationX + 3,
            filter: [
              'brightness(0)',
              'brightness(4)',
              'brightness(1)',
              'brightness(1)',
              'brightness(1)',
            ],
            transition: {
              times: [0, 0.02, 0.06, 0.8, 1],
              duration: 3.5,
            },
          });
        }
        initRef.current = true;
        setTimeout(handleClickRoot, PhotoInterval);
      });
  }, [photoControls, initialized]);

  useEffect(() => {
    if (firstClick && !initialized) {
      console.log('Get media devices (video)');
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: false,
        })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();

          setTimeout(handleClickRoot, PhotoInterval);
        });
    }
  }, [firstClick, initialized]);

  const videos = [
    {
      id: 0,
      containerRef: videoContainerRef0,
    },
    {
      id: 1,
      containerRef: videoContainerRef1,
    },
    {
      id: 2,
      containerRef: videoContainerRef2,
    },
    {
      id: 3,
      containerRef: videoContainerRef3,
    },
    {
      id: 4,
      containerRef: videoContainerRef4,
    },
    {
      id: 5,
      containerRef: videoContainerRef5,
    },
    {
      id: 6,
      videoRef: videoRef,
      containerRef: videoContainerRef6,
    },
    {
      id: 7,
      containerRef: videoContainerRef7,
    },
  ];

  return (
    <Root>
      <TopBar />
      <MainContent>
        <VideoGrid>
          {videos.map(({ id, videoRef, containerRef }) => (
            <VideoBox
              key={id}
              selected={!!videoRef}
              ref={containerRef}
            >
              <StyledSpinner size={60} strokeWidth={2} />
              {!!videoRef ? (
                <>
                  <video loop autoPlay ref={videoRef} muted />
                  <PhotoWrapper animate={photoControls}>
                    <motion.canvas ref={canvasRef}></motion.canvas>
                    <motion.canvas
                      ref={canvasOverlayRef}
                    ></motion.canvas>
                  </PhotoWrapper>
                </>
              ) : null}
            </VideoBox>
          ))}
        </VideoGrid>
        <StyledChatBar />
      </MainContent>
    </Root>
  );
}

export default Classroom;
