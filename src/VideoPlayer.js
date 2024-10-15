import React, { useState } from 'react';

function VideoPlayer() {
  const [videoSrc, setVideoSrc] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" accept="video/mp4" onChange={handleFileChange} />
      {videoSrc && (
        <video width="320" height="240" controls>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        
</video>
      )}
    </div>
  );
}

export default VideoPlayer;