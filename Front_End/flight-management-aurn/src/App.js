import './componentCssFiles/App.scss';
import{BrowserRouter, Routes,Route} from "react-router-dom"
import Home from './componentsHtmlFIles/home'
import NavBar from "./componentsHtmlFIles/naveBar"

function App() {
  return (
   <BrowserRouter>
   <NavBar/>
   <Routes>
    <Route  path="/" element={<Home />} />
   </Routes>
   
   </BrowserRouter>
  );
}

export default App;
