"use client";

import { PostModel } from "@/app/model/post.model";
import { fetchCurrentPost } from "@/app/service/admin/admin.service";
import { useEffect, useState } from "react";
import Modal from "@/app/components/Modal";
import Image from 'next/image'
import Star from "@/app/components/Star";
import { fetchRestaurantService } from "@/app/service/restaurant/restaurant.service";

export default function TodayPost() {
    const [todayPosts, setTodayPosts] = useState<PostModel[]>([]);
    const [currentImg, setCurrentImg] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const todayData = await fetchCurrentPost();
                setTodayPosts(todayData);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    const openModal = (imageURL: string) => {
        setCurrentImg(imageURL);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    }

    const formDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: "2-digit", month: "2-digit", day: "2-digit" };
        const formattedDate = new Intl.DateTimeFormat("ko-KR", options).format(date);
        const [year, month, day] = formattedDate.split(".").map((part) => part.trim());
        return `${year}년 ${month}월 ${day}일`;
    };

    return (
        <main className="product-detail default" style={{ marginTop: '20px' }}>
            <div className="heading4">
                <span style={{ color: '#F46119', fontSize: 'inherit', fontWeight: 'inherit' }}>
                    오늘
                </span>
                <span style={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
                    의 리뷰
                </span>
            </div>

            {todayPosts.length > 0 ? (
                todayPosts.map((post, index) => (
                    <div key={index} className="flex flex-col md:flex-row border border-[#F46119] rounded-lg p-4 shadow-lg bg-white mb-4 mt-4">
                        <div className="list-review flex flex-col lg:flex-row gap-4">
                            <div className="left lg:w-1/4 w-full lg:pr-[15px]">
                                <div className="mb-4">
                                    {post.images && post.images.length > 0 ? (
                                        <div className="flex flex-wrap gap-4">
                                            {post.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image.uploadURL}
                                                    alt={`이미지 ${index + 1}`}
                                                    className="w-[60px] aspect-square rounded-lg"
                                                    onClick={() => openModal(image.uploadURL)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p>이미지 없음</p>
                                    )}
                                </div>
                                <Modal isOpen={isOpen} onClose={closeModal} closeButton={false}>
                                    <div className='relative'>
                                        <Image
                                            src={currentImg} alt="Modal Image"
                                            width={800} height={800}
                                            className='rounded-lg' />
                                    </div>
                                </Modal>

                                <div className="user mt-3">
                                {/* <div className="text-title">{post?.restaurantName}</div> */}
                                    <div className="text-title">{post?.nickname || '닉네임 없음'}</div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-secondary2">{post?.entryDate && formDate(post.entryDate)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="right lg:w-3/4 w-full lg:pl-[15px]">
                                <div className='flex items-center'>
                                    <Star w="w-6" h="h-6" readonly={true} rate={post?.averageRating} />
                                    <p className='ml-2'>{post?.averageRating.toFixed(1)} / 5</p>
                                </div>

                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center">
                                        <p className="text-sm font-medium mb-0 mr-1 leading-none align-middle">맛: </p>
                                        <div className="flex items-center">
                                            <Star w="w-4" h="h-4" readonly={true} rate={post?.taste} />
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-sm font-medium mb-0 mr-1 leading-none align-middle whitespace-nowrap">청결: </p>
                                        <div className="flex items-center">
                                            <Star w="w-4" h="h-4" readonly={true} rate={post?.clean} />
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-sm font-medium mb-0 mr-1 leading-none align-middle whitespace-nowrap">서비스: </p>
                                        <div className="flex items-center">
                                            <Star w="w-4" h="h-4" readonly={true} rate={post?.service} />
                                        </div>
                                    </div>
                                </div>

                                <div className="body1 mt-3 mb-3">{post?.content}</div>

                                <div className="flex items-center justify-start h-auto">
                                    {post?.tags && post.tags.length > 0 ? (
                                        <ul className="flex flex-wrap gap-2 items-center justify-center h-full">
                                            {post.tags.map((tag, index) => (
                                                <li
                                                    key={index}
                                                    style={{ marginLeft: index === 0 ? 0 : "8px", lineHeight: "32px" }}
                                                    className="rounded-full border border-gray-300 bg-white px-3 py-1 text-gray-600 font-semibold shadow-sm hover:bg-gray-100">
                                                    {tag}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>태그 없음</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ):(
                <p>오늘은 리뷰가 없습니다.</p>
            )}
        </main>
    )
}