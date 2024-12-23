import React from 'react';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import Login from "./Components/Login.tsx";
import Register from "./Components/Register.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <div>
                {/*<nav>*/}
                {/*    <ul>*/}
                {/*        <li><Link to="/">Home</Link></li>*/}
                {/*        <li><Link to="/about">About</Link></li>*/}
                {/*        <li><Link to="/login">Login</Link></li>*/}
                {/*    </ul>*/}
                {/*</nav>*/}

                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
