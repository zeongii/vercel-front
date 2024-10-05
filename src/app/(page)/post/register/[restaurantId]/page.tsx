"use client"

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter, useParams } from "next/navigation";
import Star from "../../../../components/Star";
import { PostModel } from "src/app/model/post.model";
import { postService } from "src/app/service/post/post.service";
import { tag } from "src/app/api/tag/tag.api";
import { TagModel } from "src/app/model/tag.model";
import { restaurant } from '@/app/api/restaurant/restaurant.api';

export default function PostRegister() {
  const router = useRouter();
  const { restaurantId } = useParams();
  const [restaurantName, setRestaurantName] = useState<RestaurantModel | null>(null);
  const [formData, setFormData] = useState<PostModel>({} as PostModel);
  const [tagsByCategory, setTagsCategory] = useState<{ [key: string]: TagModel[] }>({});
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      restaurantId: Number(restaurantId)
    }));
    fetchTagCategory();
    fetchRestaurant(Number(restaurantId));
  }, [restaurantId]);

  const fetchRestaurant = async (restaurantId: number) => {
    const data = await restaurant.fetchRestaurantById(restaurantId);
    setRestaurantName(data);
  }

  const fetchTagCategory = async () => {
    try {
      const result = await tag.getByCategories();
      setTagsCategory(result);
      setTags([]);
    } catch (error) {
      console.error("태그 목록을 불러오는데 실패했습니다.", error);
    }
  };

  const handleTagSelect = (tag: string) => {
    setTags(prevSelected =>
      prevSelected.includes(tag)
        ? prevSelected.filter(t => t !== tag)
        : [...prevSelected, tag]
    );
  };

  const handleStar = (value: number, field: keyof PostModel) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const postId: number = await postService.insert({
        content: formData.content,
        taste: formData.taste,
        clean: formData.clean,
        service: formData.service,
        tags: tags,
        restaurantId: formData.restaurantId
      }, images);

      if (postId) {
        setTags([]);
        router.push(`/post/${restaurantId}/details/${postId}`);
      }
    } catch (error) {
      console.error('Post submission failed:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6" style={{ marginTop: '30px' }}>
      <div className='heading4 mb-2'>
        <span style={{ color: '#F46119', fontSize: 'inherit', fontWeight: 'inherit' }}>
          {restaurantName?.name}
        </span> 리뷰 작성하기
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-gray-100 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="border-b-2 pb-4">
          <h2 className="font-bold text-lg mb-2">◦ 항목별 평점</h2>
          <div className="flex items-center mb-4">
            <label className="block font-bold w-24">맛</label>
            <Star
              w="w-8" h="h-8"
              readonly={false}
              rate={formData.taste}
              onChange={(rating) => handleStar(rating, "taste")}
            />
          </div>
          <div className="flex items-center mb-4">
            <label className="block font-bold w-24">청결</label>
            <Star
              w="w-8" h="h-8"
              readonly={false}
              rate={formData.clean}
              onChange={(rating) => handleStar(rating, "clean")}
            />
          </div>
          <div className="flex items-center mb-4">
            <label className="block font-bold w-24">서비스</label>
            <Star
              w="w-8" h="h-8"
              readonly={false}
              rate={formData.service}
              onChange={(rating) => handleStar(rating, "service")}
            />
          </div>
        </div>

        <div className="border-b-2 pb-4">
          <h2 className="font-bold text-lg mb-2">◦ 음식점 키워드</h2>
          {Object.keys(tagsByCategory).map(category => (
            <div key={category} className="mb-4">
              <div className="font-semibold mb-2">
                {category === "방문목적" && "이 식당은 어떤 방문목적에 적합한가요?"}
                {category === "분위기" && "이 식당의 분위기를 선택해주세요."}
                {category === "편의시설" && "이 식당은 어떤 편의시설이 있나요?"}
              </div>
              <div className="flex flex-wrap gap-2">
                {tagsByCategory[category].map(tag => (
                  <div key={tag.name} className="flex items-center mr-2 mb-2">
                    <input
                      type="checkbox"
                      id={tag.name}
                      name={tag.name}
                      value={tag.name}
                      onChange={() => handleTagSelect(tag.name)}
                      className="absolute opacity-0 peer"
                    />
                    <label
                      htmlFor={tag.name}
                      className="peer-checked:bg-[#FDE8D8] peer-checked:text-[#F46119] peer-checked:border-[#F46119] flex items-center justify-center cursor-pointer rounded-full border border-gray-400 bg-white text-gray-600 px-3 py-1 transition duration-200 ease-in-out shadow-sm hover:bg-[#FDE8D8] hover:text-[#F46119]"
                      style={{ whiteSpace: 'nowrap', display: 'inline-flex' }}
                    >
                      {tag.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="font-bold">◦ 방문후기</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="border rounded p-2 w-full mt-2"
          />
        </div>

        <div className="mb-4">
          <label className="font-bold">◦ 이미지 첨부</label>
          <input
            type="file"
            multiple accept="image/*"
            onChange={uploadImage}
            className="border rounded p-2 w-full mt-2"
          />
        </div>
      </form>
      <div className="flex justify-end mt-6">
        <button type="submit" className="button-main custom-button mr-2 px-4 py-2 bg-green-500 text-white rounded">
          등록하기
        </button>
        <button
          type="button" className="button-main custom-button px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => router.push(`/post/${restaurantId}`)}>
          뒤로가기
        </button>
      </div>
    </main>
  );
}
