import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Modal, Button, Form, Container, Image} from 'react-bootstrap';
import axiosInstance from "../../api/axiosInstance.tsx";

const Dashboard = () => {
    const [boards, setBoards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [boardName, setBoardName] = useState('');
    const [showModalAvatar, setShowModalAvatar] = useState(false);
    const [showModalEditBoard, setShowModalEditBoard] = useState(false);
    const [boardToEditId, setBoardToEditId] = useState();

    const toggleModalAvatar = () => {
        setShowModalAvatar(!showModalAvatar);
    };

    const toggleModalEditBoard = () => {
        setShowModalEditBoard(!showModalEditBoard);
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
        if(boardName === ''){
            return;
        }
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
                data: {
                    id: boardId
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            fetchBoards();
        } catch (error) {
            console.error('Error deleting board:', error);
        }
    }

    const handleEditBoard = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axiosInstance.put(`/edit-board?boardId=${boardToEditId}`,
                {
                    name: boardName
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                toggleModalEditBoard();
                setBoardName('');
                fetchBoards();
            }
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
                        src="../../public/avatar.png"
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
                            <Form.Control
                                onChange={(e) => setBoardName(e.target.value)}
                                type="text"
                                placeholder="Enter board name"
                                required
                            />
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
            <Modal show={showModalEditBoard} onHide={toggleModalEditBoard}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Board</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="boardName">
                            <Form.Label>Board Name</Form.Label>
                            <Form.Control
                                value={boardName}
                                onChange={(e) => setBoardName(e.target.value)}
                                type="text"
                                placeholder="Enter board name"
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleModalEditBoard}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" form="boardForm" onClick={handleEditBoard}>
                        Edit Board
                    </Button>
                </Modal.Footer>
            </Modal>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px'}}>
                {boards ? boards.map((board) => (
                    <div
                        key={board.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            padding: "15px",
                            backgroundColor: "#f9f9f9",
                            textAlign: "center"
                        }}
                    >
                        <h5 style={{margin: "10px 0", color: "#333"}}>Nazwa: {board.name}</h5>
                        <p style={{margin: "5px 0", fontSize: "14px", color: "#555"}}>
                            ID: {board.id} <br/> ID creatora: {board.boardCreatorId}
                        </p>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteBoard(board.id)}
                                style={{margin: "5px"}}>
                            Delete
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                                toggleModalEditBoard();
                                setBoardToEditId(board.id);
                                setBoardName(board.name);
                            }}
                            style={{margin: "5px"}}
                        >
                            Edit board
                        </Button>
                    </div>
                )) : <p>Brak boards</p>}
            </div>

        </div>
    )
}

export default Dashboard;