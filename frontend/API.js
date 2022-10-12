const API_URL = 'http://localhost:5000';

export async function fetcher(...args) {
    const res = await fetch(...args);

    if (!res.ok) {
        const error = new Error(res.statusText);
        error.info = await res.json();
        throw error;
    }

    return res.json();
}

export default {
    GET_HOME_POSTS: `${API_URL}/api/v1/posts/home/0`
}