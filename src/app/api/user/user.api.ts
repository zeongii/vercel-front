
import { User } from "src/app/model/user.model";


const fetchUserExists = async (id: string): Promise<boolean> => {
    const response = await fetch(`http://localhost:8081/api/user/existsById?id=${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user existence');
    }
    return response.json();
};

const fetchUserById = async (id: string): Promise<User> => {
    const response = await fetch(`http://localhost:8081/api/user/findById?id=${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user by ID');
    }
    return response.json();
};

export const fetchAllUsers = async (): Promise<User[]> => {
    const token = localStorage.getItem('token'); // JWT 토큰 가져오기

    // 토큰 값 출력 (디버깅용)
    console.log('Token:', token);

    const response = await fetch(`http://localhost:8081/api/user/findAll`, {
        method: 'GET',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '', // JWT 토큰을 Bearer 형식으로 추가
            'Content-Type': 'application/json',
        },
    });

    // 응답이 실패하면 오류를 던짐
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch error:', errorText);  // 에러 메시지 출력
        throw new Error('Failed to fetch all users');
    }

    // 응답이 JSON이면 파싱하여 반환
    return response.json();
};

const fetchUserCount = async (): Promise<number> => {
    const response = await fetch(`http://localhost:8081/api/user/count`);
    if (!response.ok) {
        throw new Error('Failed to fetch user count');
    }
    return response.json();
};

const deleteUserById = async (id: string): Promise<void> => {
    const response = await fetch(`http://localhost:8081/api/user/deleteById?id=${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete user');
    }
};

const updateUser = async (user: User): Promise<User> => {
    const response = await fetch(`http://localhost:8081/api/user/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error('Failed to update user');
    }
    return response.json();
};

const registerUser = async (user: User, thumbnails: File[]): Promise<User> => {
    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(user)], { type: 'application/json' }));

    thumbnails.forEach((thumbnail, index) => {
        formData.append(`thumbnails`, thumbnail);
    });

    const response = await fetch(`http://localhost:8081/api/user/join`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to register user');
    }
    return response.json();
};



const loginUser = async (username: string, password: string): Promise<string> => {
    const response = await fetch(`http://localhost:8081/api/user/login?username=${username}&password=${password}`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Failed to log in');
    }


    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data.token;
    } else {
        return response.text();
    }
};
const uploadThumbnailApi = async (thumbnails: File[]): Promise<number[]> => {
    const formData = new FormData();
    thumbnails.forEach(thumbnail => {
        formData.append('images', thumbnail);
    });

    const response = await fetch('http://localhost:8081/api/thumbnails/upload', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload thumbnails');
    }

    const data = await response.json();
    return data.imgIds;
};

const refreshTokenApi = async (oldToken: string): Promise<string> => {
    const response = await fetch(`http://localhost:8081/api/token/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldToken }),
    });

    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return data;
};

// logoutApi에서 customFetch 사용
export const logoutApi = async (): Promise<void> => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰 가져오기

    // 로그아웃 요청을 customFetch를 통해 호출
    await fetch(`http://localhost:8081/api/token/logout`, {
        method: 'POST',
        body: JSON.stringify({ token }), // 바디에 토큰을 포함하여 전달
    });
};


const checkUsernameExists = async (username: string): Promise<boolean> => {
    const response = await fetch(`http://localhost:8081/api/user/check-username?username=${username}`);
    if (!response.ok) {
        throw new Error('Failed to check username existence');
    }
    return response.json();
};

export const UserApi = {
    fetchUserExists,
    fetchUserById,
    fetchAllUsers,
    fetchUserCount,
    deleteUserById,
    updateUser,
    registerUser,
    loginUser,
    uploadThumbnailApi,
    refreshTokenApi,
    logoutApi,
    checkUsernameExists
};

