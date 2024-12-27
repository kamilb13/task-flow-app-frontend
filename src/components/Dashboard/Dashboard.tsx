import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import {Modal, Button, Form} from 'react-bootstrap';
import axiosInstance from "../../api/axiosInstance.tsx";

const Dashboard = () => {
    const [boards, setBoards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [boardName, setBoardName] = useState('');

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const fetchBoards = async () => {
        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userid");

            const res = await axiosInstance.get("/get-boards", {
                params: {userId},
                headers: {
                    Authorization: `Bearer ${token}`
                },
                //withCredentials: true
            });
            setBoards(res.data);
        } catch (e) {
            console.error("Błąd podczas pobierania boards:", e);
        }
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log("handleFormSubmit");
        const newBoard = {
            name: boardName,
            boardCreatorId: localStorage.getItem("userid"),
        };

        try {
            const response = await axios.post('http://localhost:8080/create-board', newBoard);
            if (response.status === 201) {
                toggleModal();
                setBoardName(null);
                fetchBoards();
            }
        } catch (error) {
            console.error('Error creating board:', error);
        }
    };

    const handleDeleteBoard = async (boardId) => {
        const token = localStorage.getItem("token");

        try {
            const res = await axiosInstance.delete(`/delete-board`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {id: boardId}
            });
            fetchBoards();
        } catch (error) {
            console.error('Error deleting board:', error);
        }
    }

    return (
        <div className="dashboard">
            <nav style={{display: "flex", justifyContent: "space-around"}}>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/login">Logout</Link>
            </nav>
            <h1>Dashboard</h1>
            <Button variant="primary" onClick={toggleModal} size="lg">Add board</Button>
            <Modal show={showModal} onHide={toggleModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Board</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="boardName">
                            <Form.Label>Board Name</Form.Label>
                            <Form.Control onChange={(e) => setBoardName(e.target.value)} type="text"
                                          placeholder="Enter board name" required/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleModal}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" form="boardForm" onClick={handleFormSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
            <ol>
                {boards ? boards.map((board) => (
                    <li style={{border: "2px solid green", padding: "10px", margin: "5px"}} key={board.id}>
                        ID: {board.id}, Nazwa: {board.name}, ID creatora: {board.boardCreatorId}
                        <Button variant="danger" size="sm" onClick={() => handleDeleteBoard(board.id)}>
                            Delete
                        </Button>
                    </li>
                )) : <p>Brak boards</p>}
            </ol>
        </div>
    )
}

export default Dashboard;