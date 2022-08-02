import './App.css';
import MintToken from './components/MintToken';
import MintNft from './components/MintNft';
import SendSol from './components/SendSol';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MintToken />
        <MintNft />
        <SendSol />
      </header>
    </div>
  );
}

export default App;
