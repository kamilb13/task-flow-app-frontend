import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from "./pages/Login/Login.tsx";
import Register from "./pages/Register/Register.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import Dashboard from "./components/Dashboard/Dashboard.tsx";
import Tasks from "./components/Tasks/Tasks.tsx";

const OtherPage = () => <div>Other Page</div>;

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/main/*" element={<HomePage/>}>
                        <Route path="" element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="tasks" element={<Tasks />} />
                        <Route path="other" element={<OtherPage />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
