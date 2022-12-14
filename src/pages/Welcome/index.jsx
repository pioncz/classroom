import React from 'react';
import { Box, Heading, Spinner } from 'theme-ui';

function Welcome({ onClick }) {
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
          Welcome to Teamz
        </Heading>
        <Spinner size={60} strokeWidth={2} />
      </Box>
    </>
  );
}

export default Welcome;
