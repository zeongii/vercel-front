"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteTag, fetchAllTags } from "src/app/api/tag/tag.api";
import {initialTag, TagModel } from "src/app/model/tag.model";
import { deleteTagService } from "src/app/service/tag/tag.service";

export default function TagList() {
  const [tags, setTags] = useState<{[category: string]: TagModel[]}>({});
  const [selectTags, setSelectTags] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchTag();
  }, []);

  const fetchTag = async () => {
      const data = await fetchAllTags(); 
      setTags(data.sort((a: TagModel, b: TagModel) => a.tagCategory.localeCompare(b.tagCategory)));
  };

  const allTags: TagModel[] = Object.values(tags).flat(); // 태그 객체를 배열로 변환

  const handleCheck = (name: string) => {
    setSelectTags((prevSelected) =>
      prevSelected.includes(name)
        ? prevSelected.filter((tagName) => tagName !== name)
        : [...prevSelected, name]
    );
  };

  const handleDetails = (name: string) => {
    router.push(`tags/details/${name}`);
  };

  const handleDelete = async () => {
    if (selectTags.length === 0) {
      alert("삭제할 태그를 선택해주세요.");
      return;
    }
  
    const name = selectTags[0];
    if (!name) {
      alert("삭제할 태그 이름이 올바르지 않습니다.");
      return;
    }
  
    if (window.confirm("선택한 태그를 삭제하시겠습니까?")) {
      try {
        const updatedTags = await deleteTagService(name, tags);
        if (updatedTags) {
          setTags(updatedTags);
          alert("태그가 삭제되었습니다.");
          setSelectTags([]);
          fetchTag();
        }
      } catch (error) {
        console.error("태그 삭제 중 문제가 발생했습니다:", error);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-3 px-4 border-b"></th>
              <th className="py-3 px-4 border-b">Tag Category</th>
              <th className="py-3 px-4 border-b">Tag Name</th>
            </tr>
          </thead>
          <tbody>
            {allTags.map((t) => (
              <tr key={t.name} className="border border-indigo-600">
                <td className="py-3 px-4 border-b">
                  <input
                    type="checkbox"
                    checked={selectTags.includes(t.name)}
                    onChange={() => handleCheck(t.name)}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <span>{t.tagCategory}</span>
                </td>
                <td className="py-3 px-4 border-b">
                  <Link
                    href={`/tag/details/${t.name}`}
                    className="text-blue-600 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDetails(t.name);
                    }}
                  >
                    {t.name}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mr-2"
            onClick={() => router.push("/tag/register")}
          >
            등록하기
          </button>
          <button
            className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
            onClick={handleDelete}
          >
            삭제하기
          </button>
        </div>
      </div>
    </main>
  );
}
