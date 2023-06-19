export const getNextNonRefVideoIdx = (currentIdx, videos) => {
  const newIdx = (currentIdx + 1) % videos.length;

  if (!!videos[newIdx].videoRef) {
    return getNextNonRefVideoIdx(newIdx, videos);
  } else {
    return newIdx;
  }
};
