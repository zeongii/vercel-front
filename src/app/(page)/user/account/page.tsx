"use client";
import React, {useEffect, useState} from 'react';
import Image from "next/image";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { User } from "@/app/model/user.model";
import nookies from "nookies";
import Link from "next/link";

interface AccountProps {
    user: User;
}

interface Users {
    nickname: string;
    username: string;
    role: string;
    score: string;
}

export default function Account( user : AccountProps) {
    const [users, setUsers] = useState<Users | null>(null);
    const cookie = nookies.get();
    const userId = cookie.userId;

    useEffect(() => {

        if (userId) {
            const username = localStorage.getItem('username');
            const nickname = localStorage.getItem('nickname');
            const role = localStorage.getItem('role');
            const score = localStorage.getItem('score')

            if (username && nickname && role && score) {
                const storedUser = {
                    username,
                    nickname,
                    role,
                    score
                };
                setUsers(storedUser);
            }
        }})

    return (
        <div className="w-full xl:pr-[3.125rem] lg:pr-[28px] md:pr-[16px]">
            <div className="user-infor bg-surface lg:px-7 px-4 lg:py-10 py-5 md:rounded-[20px] rounded-xl">
                <div className="heading flex flex-col items-center justify-center">
                    <div className="avatar">
                        <Image
                            src={'/assets/img/profile.png'}
                            width={300}
                            height={300}
                            alt='avatar'
                            className='md:w-[140px] w-[120px] md:h-[140px] h-[120px] rounded-full'
                        />
                    </div>
                    <div className="name heading6 mt-4 text-left">{user?.user.nickname}</div>
                    <div
                        className="mail heading6 font-normal normal-case text-secondary mt-1 text-sm text-left">냠냠온도: {user?.user.score}</div>
                </div>
                <div className="menu-tab w-full max-w-none lg:mt-10 mt-6">
                    <div className="item flex items-center gap-3 w-full px-5 py-4 rounded-lg">
                        <h5 className="heading6"></h5>
                    </div>
                </div>
                {users?.role === 'ADMIN' ? (
                    <Link href="/admin/follow" passHref>
                        <button type="submit" className="px-4 py-2 bg-[#41B3A3] text-white rounded hover:bg-[#178E7F]">
                            팔로우
                        </button>
                    </Link>
                ) : user.user.id === userId ? (
                    <Link href="/user/follow" passHref>
                        <button type="submit" className="px-4 py-2 bg-[#41B3A3] text-white rounded hover:bg-[#178E7F]">
                            팔로우
                        </button>
                    </Link>
                ) : (
                    <Link href="/user/following" passHref>
                        <button type="submit" className="px-4 py-2 bg-[#41B3A3] text-white rounded hover:bg-[#178E7F]">
                            팔로우하기
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
}