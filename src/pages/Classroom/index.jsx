import React, {
  useEffect,
  useRef,
  useState,
  memo,
  useCallback,
} from 'react';
import styled from '@emotion/styled';
import * as faceapi from 'face-api.js';
import { motion, useAnimation } from 'framer-motion';
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

  border: 3px solid
    ${(props) => (props.selected ? '#69ffac' : 'transparent')};

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

  canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transform-origin: top right;
  }

  #test {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;

const StyledChatBar = styled(ChatBar)`
  flex: 0 0 350px;
`;

const PhotoInterval = 10 * 1000;

function Classroom({ firstClick, onInitialized }) {
  const [initialized, setInitialized] = useState(false);
  const videoRef = useRef();
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

    photoControls.set({
      opacity: 0,
      filter: 'brightness(0)',
      scale: 1,
    });

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
          photoControls.start({
            opacity: [0, 1, 1, 1, 1],
            filter: [
              'brightness(0)',
              'brightness(4)',
              'brightness(1)',
              'brightness(1)',
              'brightness(1)',
            ],
            scale: [1, 1, 1, 1, 0],
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
      type: 'video/mp4',
      src: './mov_bbb.webm',
    },
    {
      id: 1,
      type: 'video/webm',
      src: './flower.webm',
    },
    {
      id: 2,
      type: 'video/mp4',
      src: './mov_bbb.mp4',
    },
    {
      id: 3,
      type: 'video/webm',
      src: './flower.webm',
    },
    {
      id: 4,
      type: 'video/mp4',
      src: './mov_bbb.mp4',
    },
    {
      id: 5,
      type: 'video/webm',
      src: './flower.webm',
    },
    {
      id: 6,
      ref: videoRef,
    },
    {
      id: 7,
      type: 'video/mp4',
      src: './mov_bbb.mp4',
    },
  ];

  return (
    <Root>
      <TopBar />
      <MainContent>
        <VideoGrid>
          {videos.map(({ id, type, src, ref }) => (
            <VideoBox key={id} selected={!!ref}>
              <video loop autoPlay ref={ref} muted>
                {src && type ? (
                  <source src={src} type={type}></source>
                ) : null}
              </video>
              {!!ref ? (
                <>
                  <motion.canvas
                    ref={canvasRef}
                    animate={photoControls}
                    transformTemplate={({ scale }) =>
                      `translate(-50%, -50%) scale(${scale})`
                    }
                  ></motion.canvas>
                  <motion.canvas
                    ref={canvasOverlayRef}
                    animate={photoControls}
                    transformTemplate={({ scale }) =>
                      `translate(-50%, -50%) scale(${scale})`
                    }
                  ></motion.canvas>
                  <motion.div
                    id="test"
                    animate={photoControls}
                  ></motion.div>
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
