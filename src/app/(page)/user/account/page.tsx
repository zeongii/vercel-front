"use client";
import React, {useEffect, useState} from 'react';
import Image from "next/image";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import {User} from "@/app/model/user.model";
import nookies from "nookies";
import Link from "next/link";
import {fetchDeleteFollow, fetchIsFollow, fetchRegisterFollow} from "@/app/service/follow/follow.service";
import {FollowModel} from "@/app/model/follow.model";

interface AccountProps {
    user: User;
}


export default function Account(user: Partial<AccountProps>) {
    const [users, setUsers] = useState<User | null>(null);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const cookie = nookies.get();
    const userId = cookie.userId;
    const [nickname, setNickname] = useState<string | null>(null);


    useEffect(() => {

        if (userId) {

                setUsers(users);

            const checkFollowStatus = async () => {
                const followingUser = users.nickname;
                const result = await fetchIsFollow(followingUser, nickname);
                setIsFollowing(result);
            };

            checkFollowStatus();


        }


    }, [userId, user])

    const handleFollow = async () => {
        const followModel: FollowModel = {
            id : 0,
            follower: users.nickname,
            following: nickname,
        };

        try {
            await fetchRegisterFollow(followModel);
            setIsFollowing(true);
        } catch (error) {
            console.error("Failed to follow:", error);
        }
    };

    const handleUnfollow = async () => {

        const follower = users.nickname
        const following = nickname


        try {
            await fetchDeleteFollow(follower, following);
            setIsFollowing(false);
        } catch (error) {
            console.error('Failed to unfollow:', error);
        }
    };


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
                    <div className="name heading6 mt-4 text-left">{users.nickname}</div>
                    <div className="mail heading6 font-normal normal-case text-secondary mt-1 text-sm text-left">
                        냠냠온도: {users.score}
                    </div>
                </div>
                <div className="menu-tab w-full max-w-none lg:mt-10 mt-6">
                    <div className="item flex items-center gap-3 w-full px-5 py-4 rounded-lg">
                        <h5 className="heading6"></h5>
                    </div>
                </div>
                {
                    users.id === userId ? (
                        <Link href="/user/follow" passHref>
                            <button type="submit"
                                    className="px-4 py-2 bg-[#41B3A3] text-white rounded hover:bg-[#178E7F]">
                                팔로우
                            </button>
                        </Link>
                    ) : isFollowing ? (
                        <button
                            onClick={handleUnfollow}
                            className="px-4 py-2 bg-[#41B3A3] text-white rounded hover:bg-[#178E7F]">
                            언팔로우
                        </button>
                    ) : (
                        <button onClick={handleFollow}
                                className="px-4 py-2 bg-[#41B3A3] text-white rounded hover:bg-[#178E7F]">
                            팔로우하기
                        </button>
                    )
                }
            </div>
        </div>
    );
}
