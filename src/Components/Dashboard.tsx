import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";

const Dashboard = () => {
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const userId = localStorage.getItem("userid");
                const res = await axios.get(`http://localhost:8080/get-boards`, {
                    params: {userId},
                });
                console.log(res.data);
                setBoards(res.data);
            } catch (e) {
                console.error("Błąd podczas pobierania boards:", e);
            }
        };

        fetchBoards();
    }, []);

    return (
        <>
            <nav style={{display: "flex", justifyContent: "space-around"}}>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/login">Logout</Link>
            </nav>
            <h1>Dashboard</h1>
            <ol>
                {boards ? boards.map((board) => (
                    <li style={{border: "2px solid green", padding: "10px", margin: "5px"}}>
                        ID: {board.id}, Nazwa: {board.name}, ID creatora: {board.boardCreatorId}
                    </li>
                )) : <p>Brak boards</p>}
            </ol>
        </>
    )
}

export default Dashboard;