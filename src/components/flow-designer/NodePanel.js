import React from 'react'

const NodePanel = ({nodeSelection, path, deviceDrag}) => {
  return (
    <div>
      
      { nodeSelection.map ( d => {     
          { d.class === 'image' &&        
              <img src={ path(d) } style={{width:'64px', height:'32px'}} onDrag={ (ev) => deviceDrag(ev, d)} draggable />
          }
          { d.class == 'button' && 
            <button className="fd-button">{d.name}</button>      
          }
        })
      }    
    )
  
    </div>
  )
}

export default NodePanel
