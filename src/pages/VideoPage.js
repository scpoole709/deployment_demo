import React, { useState } from 'react'
import ReactVideoPlayer from '../ReactVideoPlayer'
import NavBar from '../NavBar';
import classes from './VideoPage.module.css';
import { useParams } from 'react-router-dom';

const VideoPage = () => {

    const [title, setTitle] = useState('Select a song to play');
    const [comment, setComment] = useState('');
    const [src, setSrc] = useState(null);

    const { name } = useParams();

   function handler(newSrc){
    setTitle(newSrc.title)
    setComment(newSrc.comment);
    setSrc(newSrc.src);
  }
  return (
    <div className={`${classes.videoContainer}`}>
        <NavBar handler={handler} name={name}/>
        <div>
            {title && <h1>{title}</h1>}
            {comment && <h2>{comment}</h2>}
            {src && <ReactVideoPlayer srcIn={src} />}
        </div>
    </div>
  );
}

export default VideoPage
