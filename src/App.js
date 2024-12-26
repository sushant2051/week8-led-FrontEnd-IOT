import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const wsRef = useRef(null);
  const [ws, setWs] = useState(null);
  const [bulbState, setBulbState] = useState('OFF'); // Initial state of the bulb

  useEffect(() => {
    wsRef.current = new WebSocket('wss://week8-ws.onrender.com:443');
    setWs(wsRef.current);
  }, []);

  useEffect(() => {
    if (!ws) return;

    ws.onopen = () => {
      console.log('Connected to the server');
      ws.send(JSON.stringify({ message: 'fetch' }));
    };

    ws.onmessage = (message) => {
      console.log('Received message:', message.data);
      const data = JSON.parse(message.data);
      setBulbState(data?.state);
    };

    ws.onclose = () => {
      console.log('Disconnected from the server');
    };

    return () => {
      ws.close();
    };
  }, [ws]);

  const toggleBulbState = () => {
    const state = bulbState === 'OFF' ? 'ON' : 'OFF';

    // Send the new state to the server
    try {
      ws.send(
        JSON.stringify({ message: 'update', name: 'bulb', state: state })
      );
    } catch (error) {
      console.log('Error:', error.message);
    }
  };

  return (
    <div
      style={{ height: '100vh' }}
      className='container pt-5 d-flex justify-content-center align-items-center'
    >
      <div className='gadget-card d-flex justify-content-between align-items-center p-4 w-50'>
        <img
          src={
            bulbState === 'ON'
              ? 'https://github.com/officialmembypoudel/dummy/blob/main/light-bulb-on.svg?raw=true'
              : 'https://github.com/officialmembypoudel/dummy/blob/main/light-bulb-off.svg?raw=true'
          }
          alt='Bulb'
          onClick={toggleBulbState}
          style={{ cursor: 'pointer', width: '100px', height: 'auto' }}
        />

        <h3 className='mt-4'>Bulb is {bulbState}</h3>
      </div>
    </div>
  );
}

export default App;
