"use client";
import React, {useEffect, useState} from "react";
import {fetchAllUsers} from "@/app/api/user/user.api";
import {User} from "@/app/model/user.model";

const UserTable = ({users = []}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 페이지당 항목 수

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(users.length / itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const role = localStorage.getItem('role');

    if (role !== 'ADMIN') {
        return (
            <div className="unauthorized text-center mt-5">
                <h2>권한이 없습니다</h2>
                <p>You do not have permission to view this content.</p>
            </div>
        );
    }

    return (
        <div className="list overflow-x-auto w-full mt-5">
            <table className="w-full max-[1400px]:w-[700px] max-md:w-[700px]">
                <thead className="border-b border-line">
                <tr>
                    <th scope="col"
                        className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap">username
                    </th>
                    <th scope="col"
                        className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap">nickname
                    </th>
                    <th scope="col"
                        className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap">role
                    </th>
                    <th scope="col"
                        className="pb-3 text-right text-sm font-bold uppercase text-secondary whitespace-nowrap">score
                    </th>
                </tr>
                </thead>
                <tbody>
                {currentUsers.map((u) => (
                    <tr className="item duration-300 border-b border-line" key={u.username}>
                        <th scope="row" className="py-3 text-left">
                            <strong className="text-title">{u.username}</strong>
                        </th>
                        <td className="py-3">
                            <div className="info flex flex-col">
                                <strong className="product_name text-button">{u.nickname}</strong>
                                <span className="product_tag caption1 text-secondary"></span>
                            </div>
                        </td>
                        <td className="py-3 price">{u.role}</td>
                        <td className="py-3 text-right">
                             <span
                                 className={`tag px-4 py-1.5 rounded-full bg-opacity-10 ${
                                     u.score < 40 ? 'bg-sky-500 text-sky-500' :
                                         u.score < 50 ? 'bg-green-400 text-green-400' :
                                             u.score < 60 ? 'bg-yellow-500 text-yellow-500' :
                                                 u.score < 80 ? 'bg-orange-400 text-orange-400' :
                                                     u.score < 100 ? 'bg-red-500 text-red-500' :
                                                 'bg-gray text-gray' // 기본 색상 (옵션)
                                 } caption1 font-semibold`}
                             >
                                {u.score}
                                     </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="pagination mt-4 flex justify-between">
                <button onClick={handlePrevious} disabled={currentPage === 1}
                        className="bg-[#4fc8cc] text-white py-1 px-3 rounded">
                    이전
                </button>
                <span>페이지 {currentPage} / {totalPages}</span>
                <button onClick={handleNext} disabled={currentPage === totalPages}
                        className="bg-[#4fc8cc] text-white py-1 px-3 rounded">
                    다음
                </button>
            </div>
        </div>
    );
};

export default function UserList() {
    const [user, setUser] = useState<User[]>([]);

    useEffect(() => {
        const userList = async () => {
            const data = await fetchAllUsers();
            setUser(data);
            console.log(data);
        };
        userList();
    }, []);

    return (
        <div>
            <UserTable users={user}/>
        </div>
    );
}
