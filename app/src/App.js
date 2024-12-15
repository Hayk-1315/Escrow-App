import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateContracts from './CreateContracts';
import ContractStorage from './ContractStorage';
import Navbar from './Navbar';

function App() {

  return (
    <Router>
      <Navbar />
      <div className='contract'>
        <Routes>
        <Route path='/' element={<CreateContracts />} />
        <Route path='/contracts' element={<ContractStorage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
