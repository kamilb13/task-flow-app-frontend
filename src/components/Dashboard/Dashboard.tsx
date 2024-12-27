import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Modal, Button, Form, Container, Image} from 'react-bootstrap';
import axiosInstance from "../../api/axiosInstance.tsx";

const Dashboard = () => {
    const [boards, setBoards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [boardName, setBoardName] = useState('');
    const [showModalAvatar, setShowModalAvatar] = useState(false);

    const toggleModalAvatar = () => {
        setShowModalAvatar(!showModalAvatar);
    };

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
            <div
                style={{
                    display: "flex",
                    backgroundColor: "#f8f8f8",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px"
                }}
            >
                <h1>Dashboard</h1>
                <Form>
                    <Form.Group controlId="exampleInput" className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Search something"
                            className="shadow-sm"
                        />
                    </Form.Group>
                </Form>
                <div style={{position: "relative"}}>
                    <Image
                        src="https://via.placeholder.com/150"
                        roundedCircle
                        alt="Avatar"
                        style={{width: "100px", height: "100px", cursor: "pointer"}}
                        className="shadow-sm"
                        onClick={toggleModalAvatar}
                    />
                    {showModalAvatar && (
                        <div
                            style={{
                                position: "absolute",
                                top: "110px",
                                right: "0",
                                backgroundColor: "#fff",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                borderRadius: "5px",
                                padding: "10px",
                                zIndex: 1000,
                                width: "200px"
                            }}
                        >
                            <p style={{margin: "10px 0", cursor: "pointer"}}>Profile</p>
                            <p style={{margin: "10px 0", cursor: "pointer"}}>Settings</p>
                            <p
                                style={{margin: "10px 0", cursor: "pointer", color: "red"}}
                                onClick={() => alert("Logged out")}
                            >
                                Logout
                            </p>
                        </div>
                    )}
                </div>
            </div>
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