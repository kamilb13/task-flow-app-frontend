import React from 'react';
import {Button} from "react-bootstrap";
import './DeleteButton.css';

interface DeleteButtonProps {
    onClick: (itemId: number) => void;
    itemId: number;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, itemId }) => {
    return(
        <Button
            variant="outline-danger"
            size="sm"
            onClick={(e) => {
                e.stopPropagation();
                onClick(itemId);
            }}
            className="button"
        >
            Delete
        </Button>
    )
}

export default DeleteButton;