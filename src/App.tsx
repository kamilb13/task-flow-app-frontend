import React from 'react';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import Login from "./pages/Login/Login.tsx";
import Register from "./pages/Register/Register.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/main" element={<HomePage />} />
                    {/*<Route path="/dashboard" element={<Dashboard />} />*/}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
