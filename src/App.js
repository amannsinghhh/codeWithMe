import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Compiler from './pages/compiler';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              theme: {
                primary: '#4aed88'
              }
            }
          }}

        />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/compiler/:roomId" element={<Compiler />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;  
