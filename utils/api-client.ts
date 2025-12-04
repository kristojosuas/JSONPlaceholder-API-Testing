import { APIRequestContext } from "@playwright/test";

export class ApiClient {
    constructor(private request: APIRequestContext) { }

    // Generic HTTP methods
    async get(endpoint: string, options?: any) {
        return this.request.get(endpoint, options);
    }

    async post(endpoint: string, data: any, options?: any) {
        return this.request.post(endpoint, { data, ...options });
    }

    async put(endpoint: string, data: any, options?: any) {
        return this.request.put(endpoint, { data, ...options });
    }

    async patch(endpoint: string, data: any, options?: any) {
        return this.request.patch(endpoint, { data, ...options });
    }

    async delete(endpoint: string, options?: any) {
        return this.request.delete(endpoint, options);
    }

    // JSONPlaceholder specific methods
    async getPosts(params?: any) {
        return this.get('/posts', params);
    }

    async getPostByUserId(userId: any) {
        return this.get(`/posts?userId=${userId}`);
    }

    async getPostById(id: any) {
        return this.get(`/posts/${id}`);
    }

    async createPost(data: any) {
        return this.post('/posts', data);
    }

    async updatePost(id: number, data: any) {
        return this.put(`/posts/${id}`, data);
    }

    async deletePost(id: number) {
        return this.delete(`/posts/${id}`);
    }

    async getPostComments(postId: number) {
        return this.get(`/posts/${postId}/comments`);
    }

    async getUsers(params?: any) {
        return this.get('/users', params);
    }

    async getUserById(id: any) {
        return this.get(`/users/${id}`);
    }

    async getUserPosts(userId: number) {
        return this.get(`/users/${userId}/posts`);
    }

    async getUserAlbums(userId: number) {
        return this.get(`/users/${userId}/albums`);
    }

    async getUserTodos(userId: number) {
        return this.get(`/users/${userId}/todos`);
    }

    async createUser(data: any) {
        return this.post('/users', data);
    }

    async updateUser(id: number, data: any) {
        return this.put(`/users/${id}`, data);
    }

    async deleteUser(id: number) {
        return this.delete(`/users/${id}`);
    }

    // Helper method to parse JSON response
    async parseJsonResponse(response: any) {
        const contentType = response.headers()['content-type'];

        if (contentType?.includes('application/json')) {
            const data = await response.json();
            return {
                status: response.status(),
                data,
                headers: response.headers(),
                ok: response.ok()
            };
        }

        return {
            status: response.status(),
            data: await response.text(),
            headers: response.headers(),
            ok: response.ok()
        }
    }
}