import React, { useEffect, useRef, useState } from 'react'
import FlowDesigner from '../components/flow-designer/FlowDesigner'
import Slider from '../components/slider/Slider'
import './CanvasPage.css';

const CanvasPage = () => {
  const [orientation, setOrientation] = useState('x');
  const [position, setPosition] = useState(0);
  const sliderRef = useRef(null);

  useEffect( () => {
    sliderRef.current.style.height = orientation === 'x' ? '5em' : '10em';
    sliderRef.current.style.width = orientation === 'x' ? '10em' : '5em';
  },[orientation]) 

  return (
    <>
     <button onClick={() => orientation == 'x' ? setOrientation('y') : setOrientation('x')}>Change Orientation</button>
    <div ref={sliderRef} className='canvasdiv'>
     
      <Slider title={'no title'} orientation={ orientation } minimum={0} maximum={100} callback={setPosition}/>

      <p>Position: {position}</p>
    </div>
    </>
  )
}

export default CanvasPage
