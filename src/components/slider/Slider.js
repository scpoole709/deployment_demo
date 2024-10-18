import React, { useEffect, useRef, useState } from 'react';
import './Slider.css'

const Slider = ({title, orientation, minimum, maximum, callback}) => {
    const [position, setPosition] = useState(minimum);
    const container = useRef(null);
    const sliderdivY = useRef(null);
    const sliderdivX = useRef(null);
    const canvasX = useRef(null);
    const canvasY = useRef(null);

    useEffect( () => {
      if (orientation === 'x')
      {
        drawX();
      }
      else
      {
        drawY();
      }
      if (callback)
        callback(position);
    },[ position, orientation] );
    
  function slideY(ev)
  {
    let b = canvas().getBoundingClientRect();
    let vh = getVisibleHeight();

    let test = ((ev.clientY - b.top) / vh) * (maximum - minimum);
    setPosition(Math.floor(Math.max(Math.min(test, maximum), minimum)));

    document.onmousemove = (ev) => {
      let test = ((ev.clientY - b.top) / vh) * (maximum - minimum);
      setPosition(Math.floor(Math.max(Math.min(test, maximum), minimum)));
    }

    document.onmouseup = (ev) => {
      document.onmousemove = undefined;
      document.onmouseup = undefined;
      //onChange(position);
    }
  }
  
  function drawY()
  {
    let dr = container.current.getBoundingClientRect();
    let dc = canvas().getBoundingClientRect();
    let w = Math.min(dr.width, dr.height);
    let h = Math.max(dr.width, dr.height);    
    
    canvas().width = w;
    canvas().height = h;

    let ctx = canvas().getContext('2d');
    ctx.font =  "8px Arial";

    
    let range = maximum - minimum;
    let rangeOffset = position - minimum;
    let sliderWidth = w - (w % 2);
    let sliderX = w / 2;
    let ballWidth = sliderWidth - 6 - (w % 2);

    let sliderStart = ballWidth / 2 + 2;
    let sliderEnd = h - sliderStart; //h - (2 * sliderStart);

    let center = sliderStart + ballWidth / 2 + (rangeOffset / range * (sliderEnd - sliderStart));

    // ctx.strokeStyle = '#000000';    
    ctx.strokeStyle = "#DDDDDD";
    ctx.lineWidth = sliderWidth;
    
    ctx.beginPath();    
    ctx.lineCap = "round";
    ctx.moveTo(sliderX, sliderStart);
    ctx.lineTo(sliderX, sliderEnd);
    ctx.stroke();

    ctx.strokeStyle = "#0000FF";
    ctx.lineWidth = Math.max(w * 0.2, 2);
    
    ctx.beginPath();    
    ctx.lineCap = "round";
    ctx.moveTo(sliderX, sliderStart);
    ctx.lineTo(sliderX, sliderEnd);
    ctx.stroke();
    
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(sliderX, center - ballWidth / 2, ballWidth / 2, 0, 2 * Math.PI);
    ctx.fill();
   
    ctx.strokeStyle = '#000000';  
    ctx.fillStyle = '#000000';  
    
    //ctx.fillText(position.toFixed(2), sliderOffset + ballWidth * 2 / 3, center + 4); 
  }

  function slideX(ev)
  {
    let b = canvas().getBoundingClientRect();
    let vw = getVisibleWidth();

    let test = ((ev.clientX - b.left) / vw) * (maximum - minimum);
    setPosition(Math.floor(Math.max(Math.min(test, maximum), minimum)));

    document.onmousemove = (ev) => {
      let test = ((ev.clientX - b.left) / vw) * (maximum - minimum);
      setPosition(Math.floor(Math.max(Math.min(test, maximum), minimum)));
    }

    document.onmouseup = (ev) => {
      document.onmousemove = undefined;
      document.onmouseup = undefined;
    }
  }
  
  function canvas(){
    let c = (orientation === 'x') ? canvasX : canvasY;
    return c.current;
  }

  function getVisibleHeight(){
    let h = canvas().height;
    return h - (0.5 * canvas().width);
  }

  function getVisibleWidth()
  {
    let w = canvas().width;
    return w - (0.5 * canvas().height);
  }

  function doDrawing()
  {    
    if (orientation === 'x')
    {
      drawX();
    }
    else
    {
      drawY();
    }
  }

  function drawX()
  {
    let dr = container.current.getBoundingClientRect();
    let dc = canvas().getBoundingClientRect();
    let h = Math.min(dr.width, dr.height);
    let w = Math.max(dr.width, dr.height);        
    
    canvas().width = w;
    canvas().height = h;

    let ctx = canvas().getContext('2d');
    ctx.font =  "8px Arial";
    
    let range = maximum - minimum;
    let rangeOffset = position - minimum;
    let sliderWidth = h - (h % 2);
    let sliderY = h / 2;
    let ballWidth = sliderWidth - 6 - (h % 2);
   
    let sliderStart = ballWidth / 2 + 2;
    let sliderEnd = w - sliderStart;

     let center = ballWidth / 2 + 2 + (rangeOffset / range * (sliderEnd - sliderStart));
 
    ctx.strokeStyle = "#DDDDDD";
    ctx.lineWidth = sliderWidth;
    
    ctx.beginPath();    
    ctx.lineCap = "round";
    ctx.moveTo(sliderStart, sliderY);
    ctx.lineTo(sliderEnd, sliderY);
    ctx.stroke();

    ctx.strokeStyle = "#0000FF";
    ctx.lineWidth = h * 0.2;
    
    ctx.beginPath();    
    ctx.lineCap = "round";
    ctx.moveTo(sliderStart, sliderY);
    ctx.lineTo(sliderEnd, sliderY);
    ctx.stroke();
    
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(center, sliderY, ballWidth / 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  return (
    <>
      <div ref={container} className='fill-div'>
          { orientation === 'y' && 
              <div ref={sliderdivY} className='sliderdivY' >
                  <canvas ref={canvasY} onMouseDown={slideY}></canvas>
              </div>
          }
          { orientation === 'x' &&
              <div ref={sliderdivX} className='sliderdivY' onMouseDown={slideX}>
                  <canvas ref={canvasX}></canvas>
              </div>
          }
      </div>     
    </> 
  )
}

export default Slider
