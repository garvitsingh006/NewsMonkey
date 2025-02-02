import './App.css';

import React, {useState} from 'react'
import Navbar from './components/Navbar';
import News from './components/News';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

const App = () => {
  const pageSize = 12
  const apiKey = process.env.REACT_APP_NEWS_API
  const [progress, setProgress] = useState(0)

    return (
      <div>
        <Router>
        <LoadingBar
        height={3}
        color="#f11946"
        // color='#A882DD'
        progress={progress}/>
          <Navbar />
          <Routes>
            <Route path="/" element={<News setProgress={setProgress} apiKey={apiKey} pageSize={pageSize} country="us" category="general" key="general" />} />
            <Route path="/business" element={<News setProgress={setProgress} apiKey={apiKey} pageSize={pageSize} country="us" category="business" key="business" />} />
            <Route path="/entertainment" element={<News setProgress={setProgress} apiKey={apiKey} pageSize={pageSize} country="us" category="entertainment" key="entertainment" />} />
            <Route path="/health" element={<News setProgress={setProgress} apiKey={apiKey} pageSize={pageSize} country="us" category="health" key="health" />} />
            <Route path="/science" element={<News setProgress={setProgress} apiKey={apiKey} pageSize={pageSize} country="us" category="science" key="science" />} />
            <Route path="/sports" element={<News setProgress={setProgress} apiKey={apiKey} pageSize={pageSize} country="us" category="sports" key="sports" />} />
            <Route path="/technology" element={<News setProgress={setProgress} apiKey={apiKey} pageSize={pageSize} country="us" category="technology" key="technology" />} />
          </Routes>
        </Router>
      </div>
    )
}


export default App