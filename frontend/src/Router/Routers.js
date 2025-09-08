import {Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import PastReports from '../pages/PastReports/index.jsx';
import About from '../pages/About/index.jsx';


const Routers = ({isDarkMode}) => {
  return (
    <>
        <Routes>
            <Route index element={<Home isDarkMode={isDarkMode}/>}/>
            <Route path='/reports' element={<PastReports isDarkMode={isDarkMode}/>}/>
            <Route path='/about' element={<About isDarkMode={isDarkMode}/>}/>
        </Routes>
    </>
  )
}

export default Routers