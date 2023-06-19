import React from 'react';
import { Box, Heading, Spinner } from 'theme-ui';

function Welcome({ onClick, clicked }) {
  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          fontWeight: 100,
          width: '100%',
          height: '100%',
          color: '#fff',
        }}
        onClick={onClick}
      >
        <Heading
          as="h1"
          sx={{
            position: 'absolute',
            top: '20%',
          }}
        >
          Welcome to the Classroom
        </Heading>
        {clicked && <Spinner size={60} strokeWidth={2} />}
        {!clicked && (
          <Heading
            as="h5"
            sx={{
              position: 'absolute',
              top: '60%',
            }}
          >
            Tap anywhere to start
          </Heading>
        )}
      </Box>
    </>
  );
}

export default Welcome;
