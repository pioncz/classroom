import { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import styled from '@emotion/styled';
import './App.css';
import Welcome from './pages/Welcome';
import Classroom from './pages/Classroom';

const Root = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const modelsPath =
  process.env.NODE_ENV === 'development'
    ? '/models'
    : '/classroom/models';

const App = () => {
  const [faceApiReady, setFaceApiReady] = useState(false);
  const [timeoutReady, setTimeoutReady] = useState(false);
  const [firstClick, setFirstClick] = useState(false);
  const [videoInitialized, setVideoInitialized] = useState(false);

  useEffect(() => {
    faceapi
      .loadTinyFaceDetectorModel(modelsPath)
      .then((x) => {
        setFaceApiReady(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setTimeoutReady(true);
    }, 2000);
  }, []);

  const appReady =
    videoInitialized && timeoutReady && faceApiReady && false;

  const welcomeClickHandler = () => {
    if (!firstClick) {
      setFirstClick(true);
    }
  };

  return (
    <Root>
      <Classroom
        firstClick={firstClick}
        onInitialized={() => {
          console.log('setVideoInitialized');
          setVideoInitialized(true);
        }}
      />
      {!appReady ? (
        <Welcome onClick={welcomeClickHandler} clicked={firstClick} />
      ) : null}
    </Root>
  );
};

export default App;
