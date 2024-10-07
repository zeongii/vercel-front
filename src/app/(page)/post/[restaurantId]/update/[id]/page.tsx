"use client";

import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Star from 'src/app/components/Star';
import { initialPost, PostModel } from 'src/app/model/post.model';
import { TagModel } from 'src/app/model/tag.model';
import {postService} from 'src/app/service/post/post.service';
import { tagService } from 'src/app/service/tag/tag.service';

export default function PostUpdate() {
  const router = useRouter();
  const { restaurantId, id } = useParams();
  const [allTags, setAllTags] = useState<{ [category: string]: TagModel[] }>({});
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [prevImages, setPrevImages] = useState<ImageModel[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [formData, setFormData] = useState<PostModel>(initialPost);

  useEffect(() => {
    if (typeof id === 'string' && id) {
      loadData(Number(id));
    } else {
      console.error("invalid ID: ", id);
    }
  }, [id]);

  useEffect(()=> {
    console.log("allTags 상태 변경되었습니다.: ", allTags); 
  },[allTags]);

  const loadData = async (id: number) => {
    try {
      const post = await postService.getPostDetails(id);
      const uniqueTags = Array.isArray(post.tags) ? Array.from(new Set(post.tags)) : [];

      setFormData({ ...post, tags: uniqueTags });
      setTags(uniqueTags);
      setPrevImages(post.images || []);

      const tagList = await tagService.fetchTag();
      setAllTags(tagList);

    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const uniqueTags = Array.from(new Set(tags));
      const updatePost = {
        ...formData,
        id: formData.id,
        tags: uniqueTags,
      };

      await postService.update(Number(id), updatePost, images, imagesToDelete);
      router.push(`/post/${restaurantId}/details/${id}`);

    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagSelect = (tag: string) => {
    console.log("Tag Selected: ", tag);
    setTags((prevSelected) => {
      const tagSet = new Set(prevSelected);
      if (tagSet.has(tag)) {
        tagSet.delete(tag);
      } else {
        tagSet.add(tag);
      }
      return Array.from(tagSet);
    });
  };

  const handleStar = (value: number, field: keyof PostModel) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }));
  };

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleDeleteImage = (imageId: number) => {
    if (!imageId) {
      console.error('Invalid image ID:', imageId);
      return;
    }
    setImagesToDelete((prev) => [...prev, imageId]);
    setPrevImages((prevImages) => prevImages.filter(img => img.id !== imageId));
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6" style={{ marginTop: '30px' }}>
      <div className="'heading4 mb-2'">게시글 수정하기</div>
      <form onSubmit={handleSubmit} className="pace-y-4 p-6 bg-gray-100 rounded-lg shadow-lg w-full max-w-3xl" encType="multipart/form-data">
        <div className="border-b-2 pb-4">
          <h2 className="font-bold text-lg mb-2">◦ 항목별 평점</h2>
        <div className="flex items-center mb-4">
          <label className="block font-bold w-24">맛</label>
          <Star
            w="w-8" h="h-8"
            readonly={false}
            rate={formData?.taste}
            onChange={(rating) => handleStar(rating, "taste")}
          />
        </div>
        <div className="flex items-center mb-4">
          <label className="block font-bold w-24">청결</label>
          <Star
            w="w-8" h="h-8"
            readonly={false}
            rate={formData?.clean}
            onChange={(rating) => handleStar(rating, "clean")}
          />
        </div>
        <div className="flex items-center mb-4">
          <label className="block font-bold w-24">서비스</label>
          <Star
            w="w-8" h="h-8"
            readonly={false}
            rate={formData?.service}
            onChange={(rating) => handleStar(rating, "service")}
          />
        </div>
        </div>

        <div className="border-b-2 pb-4">
          <h2 className="font-bold text-lg mb-2">◦ 음식점 키워드</h2>
          {Object.keys(allTags).length > 0 ? (
            Object.keys(allTags).map(category => (
              <div key={category} className="mb-4">
                <div className="font-semibold mb-2">{category}</div>

                <div className="flex flex-wrap gap-4">
                  {(allTags[category] as TagModel[]).map(t => (
                    <div key={t.name} className="flex items-center mr-2 mb-2">
                      <input
                        type="checkbox"
                        id={t.name}
                        name={t.name} value={t.name}
                        checked={tags.includes(t.name)}
                        onChange={() => handleTagSelect(t.name)}
                        className="absolute opacity-0 peer"
                      />
                      <label htmlFor={t.name}  className="peer-checked:bg-[#FDE8D8] peer-checked:text-[#F46119] peer-checked:border-[#F46119] flex items-center justify-center cursor-pointer rounded-full border border-gray-400 bg-white text-gray-600 px-3 py-1 transition duration-200 ease-in-out shadow-sm hover:bg-[#FDE8D8] hover:text-[#F46119]"
                      style={{ whiteSpace: 'nowrap', display: 'inline-flex' }}>{t.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>태그가 없습니다.</p>
          )}
        </div>

        <div className="mb-4">
          <label className="font-bold">◦ 방문후기</label>
          <textarea
            id="content"
            name="content"
            value={formData?.content}
            onChange={handleChange}
            className="border rounded p-2 w-full mt-2"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="font-bold">◦ 이미지</label>
          <div className="flex flex-wrap gap-4">
            {prevImages.length > 0 ? (
              prevImages.map((image, index) => (
                <div key={index}  className="flex flex-col items-center">
                  <img
                    src={`http://localhost:8080/uploads/${image.storedFileName}`}
                    alt={`이미지 ${index + 1}`}
                    className="aspect-square object-cover rounded-lg"
                  />
                  <button type="button" onClick={() => handleDeleteImage(image.id)} 
                  className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded mt-2">
                    삭제
                  </button>
                </div>
              ))
            ) : (<p className="text-gray-500">이미지 없음</p>)}
          </div>
        </div>

        <div className="mb-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={uploadImage}
            className="border rounded p-2 w-full mt-2"
          />
        </div>

        <button type="submit"  className="button-main custom-button mr-2 px-4 py-2 bg-green-500 text-white rounded">
          수정
        </button>
      </form>
    </main>
  );
}