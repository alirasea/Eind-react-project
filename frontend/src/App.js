import './App.css';
import Nav from './components/nav';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Router>
      <Nav />
      <Routes>
          <Route path="/help" component={Nav} />
          <Route path="/login" component={Nav} />
          <Route path="/shoppingbag" component={Nav} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;
