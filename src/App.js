
import './App.css';
import NavBar from './NavBar';
import ReactVideoPlayer from './ReactVideoPlayer';
import { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';

function App() {
  const [src, setSrc] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('Welcome');

  function handler(newSrc){
    setSrc(newSrc.src);
    setTitle(newSrc.title);
    setComment(newSrc.comment);
  }

  return (
    <div className="App">
      <nav>
      <NavBar handler={handler} title={title}/>
      </nav>
      <header className="App-header">
        <h1>{title}</h1>
        <h2>{comment}</h2>
        {/* <VideoPlayer /> */}
        <ReactVideoPlayer srcIn={src} />
      </header>
    </div>
  );
}

export default App;
