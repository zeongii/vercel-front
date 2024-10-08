"use client";
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventContentArg } from "@fullcalendar/core";
import { Dropdown } from "react-bootstrap";
import { ReceiptModel } from "src/app/model/receipt.model";
import { fetchReceiptWallet } from "@/app/service/receipt/receipt.service";
import nookies from "nookies";

interface Todo {
    todo: string[];
}

interface CalendarEvent {
    title: string;
    date: string;
    color?: string;
    extendedProps?: Todo;
}

const MyCalendar: React.FC = () => {
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
    const [wallet, setWallet] = useState<ReceiptModel[]>([]);
    const cookies = nookies.get();
    const id = cookies.userId;


    // 현재 월과 연도를 추적하기 위한 상태
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // 이벤트가 발생했을 때 토글 처리
    const handleToggle = (eventId: string) => {
        setOpenDropdowns(prevState => ({
            ...prevState,
            [eventId]: !prevState[eventId]
        }));
    };

    // 서버에서 지출 데이터를 불러오는 로직
    useEffect(() => {
        const loadWalletData = async () => {
            try {
                const updatedData = await fetchReceiptWallet(id);
                console.log(updatedData); // 데이터가 올바르게 불러와지는지 확인
                setWallet(updatedData);
            } catch (error) {
                console.error("Error fetching wallet data:", error);
            }
        };

        loadWalletData();
    }, [id]);

    // 이벤트 필터링 로직
    const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        const events: CalendarEvent[] = wallet.map((item) => ({
            title: item.name,
            date: item.date,  // entryDate를 사용해 이벤트 날짜로 설정
            color: '#f17746',
            extendedProps: {
                todo: [`지출: ${item.price}`]
            }
        }));

        // 현재 월과 연도에 해당하는 이벤트만 필터링
        const currentMonthEvents = events.filter(event => {
            const eventDate = new Date(event.date + 'T00:00:00+09:00');
            return eventDate.getMonth() + 1 === currentMonth && eventDate.getFullYear() === currentYear;
        });

        setFilteredEvents(currentMonthEvents);
    }, [wallet, currentMonth, currentYear]);

    // 이벤트 렌더링 로직
    const renderEventContent = (eventInfo: EventContentArg) => {
        const todos = eventInfo.event.extendedProps?.todo || [];
        const eventId = eventInfo.event.title;

        return (
            <Dropdown show={openDropdowns[eventId]} onToggle={() => handleToggle(eventId)}>
                <Dropdown.Toggle onClick={() => handleToggle(eventId)}>
                    <span style={{ fontSize: '0.8rem' }}>{eventInfo.event.title}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {todos.map((todoItem: string, index: number) => (
                        <Dropdown.Item key={index}>{todoItem}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    // 날짜가 변경될 때 (월 이동 등) 호출되는 핸들러
    const handleDateChange = (dateInfo: { start: Date; end: Date }) => {
        const month = dateInfo.start.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해줌
        const year = dateInfo.start.getFullYear();

        console.log("Month:", month);  // 현재 월을 콘솔에 찍어 확인
        console.log("Year:", year);    // 현재 연도도 함께 확인

        setCurrentMonth(month);  // 상태 업데이트
        setCurrentYear(year);
    };

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={filteredEvents}
                eventContent={renderEventContent}
                editable={true}
                droppable={true}
                datesSet={handleDateChange}
                fixedWeekCount={false}
            />
        </div>
    );
};

export default MyCalendar;
