import React, {useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import Sidebar from "../../components/Sidebar/Sidebar.tsx";
import './HomePage.css';
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";

const HomePage = () => {
    const user: any = useSelector((state: RootState) => state.user.user);
    const navigate = useNavigate();

    useEffect(() => {
        if(!user){
            navigate("/login");
        }
    }, []);

    return (
        <div className="main-container">
            <div className="content">
                <Sidebar/>
                <Outlet/>
            </div>
        </div>
    );
}

export default HomePage;
