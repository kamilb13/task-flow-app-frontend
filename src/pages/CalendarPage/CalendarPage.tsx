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

    const tileContent = ({ date }: { date: Date }) => {
        const marked = markedDates.filter(
            (markedDate: any) => markedDate.date.toDateString() === date.toDateString()
        );
        if (marked.length > 0) {
            return (
                <div className="highlight">
                    {marked.map((m: any, index: number) => (
                        <span key={index} title={m.title}>{m.title}{index < marked.length - 1 ? ', ' : ''}</span>
                        ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="calendarPage">
            <NavBar headerName={"Calendar Page"} boardName={""} />
            <div className="calendar">
                <Calendar tileContent={tileContent}/>
            </div>
        </div>
    );
};

export default CalendarPage;