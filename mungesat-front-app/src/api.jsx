import axios from 'axios';

const fetchKlasat = async () => {
  try {
    const response = await axios.get('http://localhost:5050/api/Klasat');
    return response.data;
  } catch (err) {
    throw new Error('Failed to load data');
  }
};

export default fetchKlasat;
