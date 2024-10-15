import React from 'react'
import ReactVideoPlayer from '../ReactVideoPlayer'

const VideoPage = (props) => {
  return (
    <div>
        <h1>{props.title}</h1>
        <h2>{props.comment}</h2>
        {props && <ReactVideoPlayer srcIn={props.src} />}
    </div>
  )
}

export default VideoPage
