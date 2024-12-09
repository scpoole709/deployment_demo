import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';

const Home = () => {
  
  const [ searchParams ] = useSearchParams();
  const navigate = useNavigate();

  useEffect( () => {
    let qp = searchParams.get("name");
    if (qp) {
      navigate("songs/" + qp);
    }
  });
 

  return (
    <div>
      <h1>Welcome</h1>
    </div>
  )
}

export default Home
