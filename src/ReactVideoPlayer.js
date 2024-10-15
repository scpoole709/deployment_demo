import React, { useEffect, useState } from 'react'
import { DefaultPlayer as Video } from 'react-html5video'

const ReactVideoPlayer = ({srcIn}) => {
  const [mp, setMp] = useState(null);
   
  useEffect( () => {
    if (srcIn && srcIn.length > 0) {
      import(`${srcIn}`).then( mp4 => {
        setMp(mp4.default);
      })
      .catch(e => {
        alert(e.message);
      })
    }
  },[srcIn])

  return (
    <div className='react-video'>
      {mp &&  <Video src={mp} autoPlay></Video>} 
    </div>
  )
}

export default ReactVideoPlayer
