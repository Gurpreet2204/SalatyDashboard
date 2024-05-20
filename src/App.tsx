import './App.css';
import SalaryTable from './components/SalaryTable';
import Chat from './components/Chat';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SalaryTable />
        <Chat />
      </header>
    </div>
  );
}

export default App;
