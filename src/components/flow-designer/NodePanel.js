import React from 'react'

const NodePanel = ({nodeSelection, path, deviceDrag}) => {
  return (
    <div style={ {height: '100%', width: '100%', color:'black'}}>
      
      {/* { nodeSelection.map ( d => {     
          { d.class === 'image' &&        
              <img src={ path(d) } style={{width:'64px', height:'32px'}} onDrag={ (ev) => deviceDrag(ev, d)} draggable />
          }
          { d.class == 'button' && 
            <button className="fd-button">{d.name}</button>      
          }
        })
      }     */}
      {nodeSelection.length === 0 && <p style={{height: '100%', width: '100%', color:'black', textAlign:'center'}} >No user items</p>}
    )
  
    </div>
  )
}

export default NodePanel
