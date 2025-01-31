import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from "./pages/Login/Login.tsx";
import Register from "./pages/Register/Register.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import Dashboard from "./components/Dashboard/Dashboard.tsx";
import Tasks from "./components/Tasks/Tasks.tsx";
import CalendarPage from "./pages/CalendarPage/CalendarPage.tsx";
import {Provider} from "react-redux";
import {store, persistor} from "./store/store.ts";
import {PersistGate} from "redux-persist/integration/react";

const MembersPage = () => <div>members Page</div>;
const MessagesPage = () => <div>messages Page</div>;

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Login/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/main/*" element={<HomePage/>}>
                            <Route path="" element={<Dashboard/>}/>
                            <Route path="dashboard" element={<Dashboard/>}/>
                            <Route path="tasks" element={<Tasks/>}/>
                            <Route path="calendar" element={<CalendarPage/>}/>
                            <Route path="members" element={<MembersPage/>}/>
                            <Route path="messages" element={<MessagesPage/>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    );
};

export default App;