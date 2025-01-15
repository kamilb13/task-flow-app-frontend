import React, {useEffect, useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {createBoard, deleteBoard, editBoard, fetchBoards} from '../../api/boards';
import NavBar from "../NavBar/NavBar.tsx";
import BoardCard from "../BoardCard/BoardCard.tsx";
import {useDispatch} from "react-redux";
import {setBoards} from "../../store/boardsSlice";

interface Board {
    id: number;
    name: string;
    boardCreatorId: number;
    createdAt?: string;
    estimatedEndDate?: string;
}

const Dashboard: React.FC = () => {
    const [boards, setBoardsState] = useState<Board[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [boardName, setBoardName] = useState<string>('');
    const [showModalEditBoard, setShowModalEditBoard] = useState<boolean>(false);
    const [boardToEditId, setBoardToEditId] = useState<number | null>(null);
    const [estimatedEndDate, setEstimatedEndDate] = useState<string>();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const dispatch = useDispatch();

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

    useEffect(() => {
        const loadBoards = async () => {
            const boards = await fetchBoards();
            if (boards) {
                dispatch(setBoards(boards));
            }
        };

        loadBoards();
    }, [dispatch]);

    const fetchBoardsData = async () => {
        const boards = await fetchBoards();
        setBoardsState(boards);
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
            estimatedEndDate: estimatedEndDate,
        };

        const response = await createBoard(newBoard);
        if (response?.status === 201) {
            toggleModalCreateBoard();
            setBoardName('');
            await fetchBoardsData();
        }
    };

    const handleDeleteBoard = async (boardId: number) => {
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
            <NavBar headerName={"Dashboard"}/>
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
                            <Form.Label>Estimated end date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={estimatedEndDate}
                                onChange={(e) => setEstimatedEndDate(e.target.value)}
                                required
                                placeholder="Select estimated end date"
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
                    boards.map((board, index) => (
                        <BoardCard
                            key={index}
                            board={board}
                            handleDeleteBoard={handleDeleteBoard}
                            toggleModalEditBoard={toggleModalEditBoard}
                            setBoardToEditId={setBoardToEditId}
                            setBoardName={setBoardName}
                        />
                    ))
                ) : (
                    <p>Brak boards</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;