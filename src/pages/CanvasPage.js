import React, { useEffect, useState } from 'react'
import FlowDesigner from '../components/flow-designer/FlowDesigner.tsx'
import './CanvasPage.css';

const CanvasPage = () => {
  const [orientation] = useState('x');

  useEffect( () => {
    // sliderRef.current.style.height = orientation === 'x' ? '5em' : '10em';
    // sliderRef.current.style.width = orientation === 'x' ? '10em' : '5em';
  },[orientation]) 

  return (
    <>
     {/* <button onClick={() => orientation ==='x' ? setOrientation('y') : setOrientation('x')}>Change Orientation</button>
    <div ref={sliderRef} className='canvasdiv'>
     
      <Slider title={'no title'} orientation={ orientation } minimum={0} maximum={100} callback={setPosition}/>
      <FlowDesigner />

      <p>Position: {position}</p>
    </div> */}
    <div className='canvasdiv'>
      <FlowDesigner />
      </div>

    </>
  )
}

export default CanvasPage
