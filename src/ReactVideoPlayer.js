import React from 'react'
import { DefaultPlayer as Video } from 'react-html5video'
import bop from './videos/CoachSteve.mp4';

const ReactVideoPlayer = () => {
  return (
    <div>
      <Video src={bop}>
      </Video>
    </div>
  )
}

export default ReactVideoPlayer
