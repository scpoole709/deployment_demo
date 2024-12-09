import React, { useEffect, useState } from 'react'

const SongList = [ { title: 'Patriotic Medly', name: 'patmed', src: './videos/CoachSteve.mp4', comment: 'How about some good ole fashioned patriotism...', key: 1},
                   { title: 'Broken Wings', name: 'browin', src: './videos/BrokenWings.mp4', comment: 'For my kids...', key: 2},
                   { title: 'Whispers', name: 'whispe', src: './videos/Whispers.mp4', comment: 'Political commentary...', key: 3},
                   { title: 'Ancient Soul', name: 'ancsou', src: './videos/AncientSoul.mp4', comment: 'Wrote this after the 2012 election...', key: 4},
                   { title: 'Bellyfull of Love', name: 'belofv', src: './videos/BellyFull.mp4', comment: 'Dramatized auto-biography...', key: 5},
                   { title: 'A Good Night to Rome', name: 'agonig', src: './videos/Boulevard.mp4', comment: 'Societal warning...', key: 6},
                   { title: 'Rain', name: 'rain', src: './videos/rain.mp4', comment: 'rain', key: 7}
];

const NavBar = ({handler, name}) => {
  const [songName, setSongName] = useState(name);

  useEffect( () => {
   if (songName) {
     let choice = SongList.find((i) => i.name === songName);
     if (choice) {
       handler(choice);
       setSongName("");
     }
   }
  }, [handler, name, songName]);
  return (
    <div className='nav-list-container'>
        <ul>
            {   
                SongList.map( l => {
                        return <li key={'' + l.key} onClick={()=> {handler(l)}}>{l.title}</li>
                    })
            }
            
        </ul>
      
    </div>
  )
}

export default NavBar
