import React  from 'react'

const SongList = [ { title: 'Patriotic Medly', src: './videos/CoachSteve.mp4', comment: 'How about some good ole fashioned patriotism...', key: 1},
                   { title: 'Broken Wings', src: './videos/BrokenWings.mp4', comment: 'For my kids...', key: 2},
                   { title: 'Whispers', src: './videos/Whispers.mp4', comment: 'Political commentary...', key: 3},
                   { title: 'Ancient Soul', src: './videos/AncientSoul.mp4', comment: 'Wrote this after the 2012 election...', key: 4},
                   { title: 'Bellyfull of Love', src: './videos/BellyFull.mp4', comment: 'Dramatized auto-biography...', key: 5},
                   { title: 'A Good Night to Rome', src: './videos/Boulevard.mp4', comment: 'Societal warning...', key: 6}
];

const NavBar = ({handler, title}) => {
  return (
    <div className='nav-list-container'>
        <ul>
            {   
                SongList.map( l => {
                        return <li key={'' + l.key} onClick={()=> {handler(l)}}>{l.title}</li>
                    })
            }
            
        </ul>

        { title && <p>Now Playing: { title }</p>}
      
    </div>
  )
}

export default NavBar
