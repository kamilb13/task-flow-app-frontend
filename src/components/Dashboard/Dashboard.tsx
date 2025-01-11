import React, {useEffect, useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {createBoard, deleteBoard, editBoard, fetchBoards} from '../../api/boards';
import {useNavigate} from "react-router-dom";
import NavBar from "../NavBar/NavBar.tsx";

interface Board {
    id: string;
    name: string;
    boardCreatorId: string;
}

const Dashboard: React.FC = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [boardName, setBoardName] = useState<string>('');
    const [showModalEditBoard, setShowModalEditBoard] = useState<boolean>(false);
    const [boardToEditId, setBoardToEditId] = useState<string | null>(null);
    const navigate = useNavigate();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [window.innerHeight]);

    const getAvailableHeight = () => windowHeight - 350; // !!!


    useEffect(() => {
        fetchBoardsData();
    }, []);

    const fetchBoardsData = async () => {
        const boards = await fetchBoards();
        setBoards(boards);
    };

    const toggleModalCreateBoard = () => {
        setShowModal((prev) => !prev);
    };

    const toggleModalEditBoard = () => {
        setShowModalEditBoard((prev) => !prev);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userId = localStorage.getItem('userid');
        if (!boardName) return;

        const newBoard = {
            name: boardName,
            boardCreatorId: userId,
        };

        const response = await createBoard(newBoard);
        if (response?.status === 201) {
            toggleModalCreateBoard();
            setBoardName('');
            await fetchBoardsData();
        }
    };

    const handleDeleteBoard = async (boardId: string) => {
        const response = await deleteBoard(boardId);
        if (response?.status === 200) {
            await fetchBoardsData();
        }
    };

    const handleEditBoard = async () => {
        if (!boardToEditId) return;

        const response = await editBoard(boardToEditId, boardName);
        if (response?.status === 200) {
            toggleModalEditBoard();
            setBoardName('');
            await fetchBoardsData();
        }
    };

    return (
        <div className="dashboard">
            <NavBar/>
            <Button
                variant="primary"
                onClick={toggleModalCreateBoard}
                size="lg"
                style={{
                    position: 'fixed',
                    bottom: '150px',
                    right: '150px',
                    borderRadius: '10px',
                    width: '140px',
                    height: '60px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                    if (e.target instanceof HTMLElement) {
                        e.target.style.backgroundColor = 'lightblue';
                        e.target.style.transform = 'scale(1.02)';
                        e.target.style.transition = 'background-color 0.3s ease';
                    }
                }}
                onMouseLeave={(e) => {
                    if (e.target instanceof HTMLElement) {
                        e.target.style.backgroundColor = '';
                        e.target.style.transform = 'scale(1.00)';
                        e.target.style.transition = 'background-color 0.3s ease';
                    }
                }}
            >
                Add Board
            </Button>
            <Modal show={showModal} onHide={toggleModalCreateBoard}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Board</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="boardName">
                            <Form.Label>Board Name</Form.Label>
                            <Form.Control
                                onChange={(e) => setBoardName(e.target.value)}
                                type="text"
                                placeholder="Enter board name"
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-between mt-3 ">
                            <Button variant="secondary" onClick={toggleModalCreateBoard}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
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
                    <Button variant="primary" type="button" onClick={handleEditBoard}>
                        Edit Board
                    </Button>
                </Modal.Footer>
            </Modal>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '5px',
                    maxHeight: getAvailableHeight(),
                    overflowY: 'auto',
                }}
            >
                {boards.length ? (
                    boards.map((board) => (
                        <>
                            <div
                                key={board.id}
                                style={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '12px',
                                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                                    padding: '20px',
                                    backgroundColor: '#ffffff',
                                    textAlign: 'left',
                                    margin: '15px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease, box-shadow 0.3s',
                                    maxWidth: '300px',
                                }}
                                onClick={(e) => {
                                    e.currentTarget.style.transform = 'scale(0.95)';
                                    setTimeout(() => {
                                        navigate('/main/tasks', {state: {boardId: board.id}});
                                    }, 250);
                                }}

                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                    e.currentTarget.style.transform = 'scale(1.00)';
                                }}
                            >
                                <h5
                                    style={{
                                        margin: '10px 0',
                                        color: '#333',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                    }}
                                >
                                    {board.name}
                                </h5>
                                <p style={{margin: '10px 0', fontSize: '14px', color: '#555', lineHeight: '1.6'}}>
                                    <strong>ID:</strong> {board.id} <br/>
                                    <strong>ID Creatora:</strong> {board.boardCreatorId} <br/>
                                    <strong>Data utworzenia:</strong>{' '}
                                    {board.createdAt ? new Date(board.createdAt).toLocaleString() : 'Brak'} <br/>
                                    <strong>Przewidywana data zakończenia:</strong>{' '}
                                    {board.estimatedEndDate
                                        ? new Date(board.estimatedEndDate).toLocaleString()
                                        : 'Brak'}
                                </p>

                                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteBoard(board.id)
                                        }}
                                        style={{margin: '5px'}}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleModalEditBoard();
                                            setBoardToEditId(board.id);
                                            setBoardName(board.name);
                                        }}
                                        style={{margin: '5px'}}
                                    >
                                        Edit board
                                    </Button>
                                </div>
                            </div>
                        </>
                    ))
                ) : (
                    <p>Brak boards</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;