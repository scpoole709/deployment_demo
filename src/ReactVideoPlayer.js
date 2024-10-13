import React from 'react'
import { DefaultPlayer as Video } from 'react-html5video'
import bop from './videos/CoachSteve.mp3';

const ReactVideoPlayer = () => {
  return (
    <div>
      <Video autoPlay loop>
        <source src={bop} type="video/webm" />
      </Video>
    </div>
  )
}

export default ReactVideoPlayer
