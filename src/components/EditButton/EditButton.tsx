import React from 'react';
import {Button} from "react-bootstrap";

interface EditButtonProps {
    toggleModalEditItem: () => void;
    setItemToEditId: (id: number) => void;
    setItemName: (name: string) => void;
    setItemDescription: (description: string) => void;
    itemId: number;
    itemName: string;
    itemDescription: string;
}

const EditButton: React.FC<EditButtonProps> = ({toggleModalEditItem, setItemToEditId, setItemName, setItemDescription, itemId, itemName, itemDescription}) => {
    return (
        <Button
            variant="outline-primary"
            size="sm"
            onClick={(e) => {
                e.stopPropagation();
                toggleModalEditItem();
                setItemToEditId(itemId);
                setItemName(itemName);
                setItemDescription(itemDescription);
            }}
            style={{margin: '5px'}}
        >
            Edit board
        </Button>
    )
}

export default EditButton;