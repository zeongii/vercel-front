"use client";
import axios from "axios";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {fetchReceiptRegister} from "src/app/service/receipt/receipt.service";
import nookies from "nookies";

export default function InsertReceipt() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null); // ref 생성

    const cookies = nookies.get();
    const id = cookies.userId;


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            if (file.size > 10 * 1024 * 1024) { // 10MB
                alert('파일 크기가 10MB를 초과할 수 없습니다.');
                setSelectedFile(null);
                setPreview(null);
                return;
            }
            setSelectedFile(file);
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                setPreview(fileReader.result as string);
            };
            fileReader.readAsDataURL(file);
        }
    };

    const sendReceipt = async () => {
        if (selectedFile && !isUploading) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const resp = await fetchReceiptRegister(formData, id);
                console.log(resp);

                    const restaurantId = resp.id;

                    if (restaurantId == null) {
                        alert("이미 등록된 정보입니다");
                        router.push(`/`);
                    } else {
                        router.push(`/receipt/receiptRestaurant/${restaurantId}`);
                    }

            } catch (error) {
                alert("형식에 맞지 않는 영수증입니다")
                console.error('파일 업로드 오류:', error);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (

        <div className="profile-block md:py-20 py-10 mt-10">
            <div className="container rounded-border"
                 style={{border: '2px dashed #FFA500', borderRadius: '12px', padding: '16px'}}>
                <h4 className="text-center text-orange-700">직접 방문한 장소 영수증의 결제 정보가 잘 나오게 사진을 찍어 올려주세요</h4>
                <div className="content-main flex gap-y-8 max-md:flex-col w-full">
                    <div
                        className="left md:w-2/3 w-full xl:pr-[3.125rem] lg:pr-[28px] md:pr-[16px] flex justify-center items-center">
                        <img
                            src="/images/save.jpg"
                            alt="사진 첨부"
                            onClick={handleImageClick}
                            style={{cursor: 'pointer'}}
                            width={300}
                            height={300}
                        />
                        <input
                            ref={fileInputRef}
                            className="hidden"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="right w-full pl-2.5">
                        {preview && (
                            <div>
                                <h3>영수증 미리보기</h3>
                                <img src={preview} alt="미리보기" style={{width: '200px', height: 'auto'}}/>
                                <button
                                    type="submit"
                                    className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-200"
                                    onClick={sendReceipt}
                                    disabled={isUploading}
                                >
                                    사진 첨부
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}