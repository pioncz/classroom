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
import { getNextNonRefVideoIdx } from './Helpers';
import { Howl } from 'howler';

const stutterSound = new Howl({
  src: ['/stutter.mp3'],
});

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
    width: 100%;
    height: 100%;
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

const BetweenPhotosInterval = 5 * 1000;
const MovePhotoDurationInSeconds = 3.5;

function Classroom({ firstClick, onInitialized }) {
  const [initialized, setInitialized] = useState(false);
  const [photos, setPhotos] = useState([]);
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
  const initRef = useRef(false);
  const currentPhoto = useRef(0);
  const photoControls = useAnimation();
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
      containerRef: videoContainerRef6,
    },
    {
      id: 7,
      videoRef: videoRef,
      containerRef: videoContainerRef7,
    },
  ];

  useEffect(() => {
    if (initialized) {
      onInitialized();
    }
  }, [initialized, onInitialized]);

  const handleClickRoot = useCallback(() => {
    console.log('Start making photo');
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const { videoHeight: height, videoWidth: width } = video;

    if (!width || !height) return;

    const { width: elWidth, height: elHeight } =
      video.getBoundingClientRect();

    const videoContainer = videos.find((vC) => !!vC.videoRef);

    if (!videoContainer?.containerRef?.current) return;

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

    const diffWidth = elWidth - newWidth;
    const diffHeight = elHeight - newHeight;

    canvas.width = elWidth;
    canvas.height = elHeight;

    const canvasCtx = canvasRef.current.getContext('2d');
    canvasCtx.beginPath();
    canvasCtx.rect(0, 0, elWidth, elHeight);
    canvasCtx.fillStyle = 'black';
    canvasCtx.fill();
    canvasCtx.drawImage(
      videoRef.current,
      diffWidth / 2,
      diffHeight / 2,
      newWidth,
      newHeight,
    );
    canvasCtx.closePath();

    faceapi
      .detectAllFaces(
        canvasRef.current,
        new faceapi.TinyFaceDetectorOptions(),
      )
      .then((detections) => {
        setInitialized(true);
        if (!detections.length) {
          initRef.current = true;
          setTimeout(handleClickRoot, BetweenPhotosInterval);
          return;
        }

        const { borderWidth } = window.getComputedStyle(
          videoContainer.containerRef.current,
        );
        const borderWidthParsed = parseInt(borderWidth, 10);
        const {
          x: videoContainerX,
          y: videoContainerY,
          width: videoContainerWidth,
          height: videoContainerHeight,
        } = videoContainer.containerRef.current.getBoundingClientRect();

        photoControls.set({
          width: videoContainerWidth - 6,
          height: videoContainerHeight - 6,
          top: videoContainerY + borderWidthParsed,
          left: videoContainerX + borderWidthParsed,
          opacity: 0,
          filter: 'brightness(0)',
          scale: 1,
        });

        // Draw rectange
        const {
          left,
          top,
          width: widthDetection,
          height: heightDetection,
        } = detections[0].box;

        canvasCtx.beginPath();
        canvasCtx.strokeStyle = 'red';
        canvasCtx.lineWidth = 2;
        canvasCtx.rect(left, top, widthDetection, heightDetection);
        canvasCtx.stroke();
        canvasCtx.closePath();

        if (initRef.current) {
          const { x: destinationX, y: destinationY } =
            videos[
              currentPhoto.current
            ].containerRef.current.getBoundingClientRect();

          stutterSound.play();

          photoControls
            .start({
              opacity: [0, 1, 1, 1, 1],
              top: destinationY + borderWidthParsed,
              left: destinationX + borderWidthParsed,
              filter: [
                'brightness(0)',
                'brightness(4)',
                'brightness(1)',
                'brightness(1)',
                'brightness(1)',
              ],
              transition: {
                times: [0, 0.02, 0.06, 0.8, 1],
                duration: MovePhotoDurationInSeconds,
              },
            })
            .then(() => {
              const imageDataURL = canvasRef.current.toDataURL();
              setPhotos((p) =>
                p.length <= currentPhoto.current
                  ? [...p, imageDataURL]
                  : p.map((item, i) =>
                      i === currentPhoto.current
                        ? imageDataURL
                        : item,
                    ),
              );
              currentPhoto.current = getNextNonRefVideoIdx(
                currentPhoto.current,
                videos,
              );
              photoControls.set({
                width: videoContainerWidth - 6,
                height: videoContainerHeight - 6,
                top: videoContainerY + borderWidthParsed,
                left: videoContainerX + borderWidthParsed,
                opacity: 0,
                filter: 'brightness(0)',
                scale: 1,
              });
            });
        }
        initRef.current = true;
        setTimeout(handleClickRoot, BetweenPhotosInterval);
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

          setTimeout(handleClickRoot, BetweenPhotosInterval);
        });
    }
  }, [firstClick, initialized]);

  return (
    <Root>
      <TopBar />
      <MainContent>
        <VideoGrid>
          {videos.map(({ id, videoRef, containerRef }, i) => (
            <VideoBox
              key={id}
              selected={!!videoRef}
              ref={containerRef}
            >
              {photos[i] ? (
                <img
                  src={photos[i]}
                  style={{ width: '100%', height: '100%' }}
                  alt="from camera"
                />
              ) : (
                <StyledSpinner size={60} strokeWidth={2} />
              )}
              {!!videoRef ? (
                <>
                  <video loop autoPlay ref={videoRef} muted />
                </>
              ) : null}
            </VideoBox>
          ))}
          <PhotoWrapper animate={photoControls}>
            <motion.canvas ref={canvasRef}></motion.canvas>
          </PhotoWrapper>
        </VideoGrid>
        <StyledChatBar />
      </MainContent>
    </Root>
  );
}

export default Classroom;
