import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./CalendarPage.css";
import NavBar from "../../components/NavBar/NavBar.tsx";

interface RootState {
    boards: {
        boards: {
            id: number;
            name: string;
            boardCreatorId: number;
            createdAt?: string;
            estimatedEndDate?: string;
        }[];
    };
}

const CalendarPage: React.FC = () => {
    const boards = useSelector((state: RootState) => state.boards.boards);
    const [markedDates, setMarkedDates] = useState<any>([]);

    useEffect(() => {
        const datesWithTitles = boards
            .filter((board) => board.estimatedEndDate)
            .map((board) => ({
                date: new Date(board.estimatedEndDate!),
                title: board.name,
            }));
        setMarkedDates(datesWithTitles);
    }, [boards]);

    useEffect(() => {
        console.log("boards",boards);
        console.log("markedDates",markedDates);
    }, [boards]);

    const tileContent = ({ date }: { date: Date }) => {
        const marked = markedDates.find(
            (markedDate: any) => markedDate.date.toDateString() === date.toDateString()
        );
        if (marked) {
            return (
                <div className="highlight">
                    <span title={marked.title}>{marked.title}</span>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="calendarPage">
            <NavBar headerName={"Calendar Page"} />
            <div className="calendar">
                <Calendar tileContent={tileContent}/>
            </div>
        </div>
    );
};

export default CalendarPage;