import Map from './app/map/Map';
import './App.css';
import { Header, Text, Footer } from '@mantine/core';

function App() {
  return (
      <div className="App">
        <Header height={60} p="xs">
          <Text>Chinatown Sound Map</Text>
        </Header>
        <Map></Map>
        <Footer height={60} p="md">
        </Footer>
      </div>
  );
}

export default App;
