// import { useEffect, useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [klasa, setKlasa] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

// // Fetch data when the component mounts
// useEffect(() => {
//   // Replace this with your actual API endpoint
//   axios.get('http://localhost:5050/api/Klasat') 
//     .then(response => {
//       setKlasa(response.data);  // Set the state with the fetched data
//       setLoading(false);
//     })
//     .catch(err => {
//       setError('Failed to load data', err);
//       setLoading(false);
//     });
// }, []);

// if (loading) return <p>Loading...</p>;
// if (error) return <p>{error}</p>;

// console.log(klasa);


// return (
//   <div>
//     <h1>Klaset:</h1>
//     <ul>
//       {klasa.map(item => (
//         <li key={item.id}>{item.name} - {item.role}</li>
//       ))}
//     </ul>
//   </div>
// );
// };

// export default App;


import { useEffect, useState } from 'react';
import fetchKlasat from './api';  // Import the fetchKlasat function

function App() {
  const [klasa, setKlasa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data when the component mounts
  useEffect(() => {
    fetchKlasat()
      .then(data => {
        setKlasa(data);  // Set the state with the fetched data
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);  // Set error message
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Klaset:</h1>
      <ul>
        {klasa.map(item => (
          <li key={item.id}>{item.name} - {item.role}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
