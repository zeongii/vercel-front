"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NoticeModel } from "src/app/model/notice.model";
import { fetchNoticeList } from "src/app/service/notice/notice.service";
import Link from "next/link";

export default function ShowNotice() {
    const [notice, setNotice] = useState<NoticeModel[]>([]);
    const router = useRouter();

    const role = localStorage.getItem('role') || null;

    useEffect(() => {
        const loadNotices = async () => {
            try {
                const notices = await fetchNoticeList();
                setNotice(notices);
            } catch (error) {
                console.error("공지사항을 불러오는 데 오류가 발생했습니다:", error);
            }
        };

        loadNotices(); // 함수 호출
    }, []);

    const moveToOne = (id: number) => {
        router.push(`/notice/details/${id}`);
    };

    const moveToInsert = () => {
        router.push('/notice/register'); // 공지사항 추가 페이지로 이동
    };

    const moveDashboard = () => {
        router.push('/admin/dashboard')
    }

    return (
        <main className="flex min-h-screen flex-col items-center" style={{ marginTop: '30px' }}>
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                    <tr className="bg-[#F46119] text-white">
                        <th className="py-3 px-4 border-b">번호</th>
                        <th className="py-3 px-4 border-b">제목</th>
                        <th className="py-3 px-4 border-b">조회수</th>
                        <th className="py-3 px-4 border-b">날짜</th>
                    </tr>
                    </thead>
                    <tbody>
                    {notice.map((n) => (
                        <tr key={n.id}
                            className="item duration-300 border-b border-gray-200 hover:bg-gray-50 cursor-pointer text-center"
                            onClick={() => moveToOne(n.id)}>
                            <td className="py-3 px-4 border-b">
                                <strong className="text-title">{n.id}</strong>
                            </td>
                            <td className="py-3 px-4 border-b">
                                <Link href={`/product/default/${n.id}`}>
                                    <div className="info flex flex-col">
                                       {n.title}
                                    </div>
                                </Link>
                            </td>
                            <td className="py-3 px-4 border-b">{n.hits}</td>
                            <td className="py-3 px-4 border-b">{n.date}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {role === 'ADMIN' && (
            <div className="flex flex-col mt-6 space-y-4">
                <button onClick={moveToInsert}
                        className="p-2 bg-[#41B3A3] text-white rounded hover:bg-blue-700 transition duration-200">
                    공지사항 추가하기
                </button>
            </div>
            )}
        </main>

    );
}
