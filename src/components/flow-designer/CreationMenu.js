import React, { useEffect } from 'react'
import './FlowDesigner.css';

const CreationMenu = ({menuClicked}) => {

  useEffect( () => {
    console.log('here');
  });
  return (
    <ul className="fd-ul">
      <li onClick={() => menuClicked('Start', 'clicked')}>Start</li>
      <li onClick={() => menuClicked('End', 'clicked')}>End</li>
      <li onClick={() => menuClicked('Decision', 'clicked')}>Decision</li>
      <li onClick={() => menuClicked('Process', 'clicked')}>Process</li>
    </ul>  
  )
}

export default CreationMenu
