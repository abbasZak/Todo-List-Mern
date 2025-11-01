import axios from "axios";
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    function getBackendApi() {
      axios.get("http://localhost:5000/Signup").then(response => {
        setData(response.data.message);

        console.log(response.data.message);
      }).catch(err => {
        console.error("CORS or network error ", err);
        
      })
    }

    getBackendApi();
  }, []);

  
  
  return (

    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{data || "Loading..."}</h1>
    </div>
  )
}

export default App
