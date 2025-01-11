import React from 'react';
import {Button} from "react-bootstrap";
import './DeleteButton.css';

interface DeleteButtonProps {
    onClick: (boardId: number) => void;
    boardId: number;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, boardId }) => {
    return(
        <Button
            variant="outline-danger"
            size="sm"
            onClick={(e) => {
                e.stopPropagation();
                onClick(boardId);
            }}
            className="button"
        >
            Delete
        </Button>
    )
}

export default DeleteButton;