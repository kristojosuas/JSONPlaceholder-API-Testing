import { test, expect } from "@playwright/test";
import { ApiClient } from "../../utils/api-client";
import { Helpers } from "../../utils/helpers";
import { Validators } from "../../utils/validators";
import { TestData } from "../fixtures/test-data";
import { Tags } from "../../utils/tags";
import postSchema from "../../schemas/post.schema.json" assert { type: "json" };

test.describe('JSONPlaceholder Posts API', () => {
    let api: ApiClient;

    test.beforeEach(({ request }) => {
        api = new ApiClient(request);
    });

    test('GET /posts - should retrieve all posts', { tag: [Tags.SMOKE, Tags.READ, Tags.POSTS] }, async () => {
        const response = await api.getPosts();

        Validators.validateStatusCode(response, 200);
        Validators.validateJson(response);

        const result = await api.parseJsonResponse(response);

        Validators.validateArray(result.data, TestData.constants.totalPosts);

        if (result.data.length > 0) {
            Validators.validatePostFields(result.data[0]);
            Validators.validateSchema(result.data[0], postSchema);
        }
    });

    test('GET /posts?userId=5 - should retrieve posts by user ID', { tag: [Tags.FUNCTIONAL, Tags.READ, Tags.POSTS] }, async () => {
        const response = await api.getPostByUserId(5);

        Validators.validateStatusCode(response, 200);

        const result = await api.parseJsonResponse(response);

        for (const post of result.data) {
            Validators.validatePostFields(post);
            Validators.validateSchema(post, postSchema);
            expect(post.userId).toBe(5);
        }
    });

    test('GET posts/1 - should retrieve a single post by ID', { tag: [Tags.SMOKE, Tags.READ, Tags.POSTS] }, async () => {
        const response = await api.getPostById(1);

        Validators.validateStatusCode(response, 200);

        const result = await api.parseJsonResponse(response);

        Validators.validatePostFields(result.data);
        Validators.validateSchema(result.data, postSchema);
        expect(result.data.id).toBe(1);
    });

    test('GET /posts/1/comments - should retrieve comments for a post', { tag: [Tags.FUNCTIONAL, Tags.READ, Tags.POSTS] }, async () => {
        const response = await api.getPostComments(1);

        Validators.validateStatusCode(response, 200);

        const result = await api.parseJsonResponse(response);

        Validators.validateArray(result.data);

        if (result.data.length > 0) {
            expect(result.data[0]).toHaveProperty('postId');
            expect(result.data[0]).toHaveProperty('id');
            expect(result.data[0]).toHaveProperty('name');
            expect(result.data[0]).toHaveProperty('email');
            expect(result.data[0]).toHaveProperty('body');
        }
    });


    test('POST /posts - should create a new post', { tag: [Tags.SMOKE, Tags.CREATE, Tags.POSTS] }, async () => {
        const postData = Helpers.generateRandomPostData();

        const response = await api.createPost(postData);

        Validators.validateStatusCode(response, 201);

        const result = await api.parseJsonResponse(response);

        Validators.validatePostFields(result.data, {
            checkUserId: false,
            checkBody: false,
        });
        Validators.validateSchema(result.data, postSchema);
        expect(result.data.title).toBe(postData.title);
        expect(result.data.body).toBe(postData.body);
    });

    test('PUT /posts/1 - should update an existing post', { tag: [Tags.FUNCTIONAL, Tags.UPDATE, Tags.PUT, Tags.POSTS] }, async () => {
        const updatedData = {
            id: 1,
            userId: 1,
            title: "Updated Title",
            body: "Updated body content.",
        };

        const response = await api.updatePost(1, updatedData);

        Validators.validateStatusCode(response, 200);

        const result = await api.parseJsonResponse(response);

        Validators.validatePostFields(result.data);
        Validators.validateSchema(result.data, postSchema);
        expect(result.data.title).toBe(updatedData.title);
        expect(result.data.body).toBe(updatedData.body);
    });

    test('PATCH /posts/1 - should partially update a post', { tag: [Tags.FUNCTIONAL, Tags.UPDATE, Tags.PATCH, Tags.POSTS] }, async () => {
        const partialData = {
            title: "Partially Updated Title",
        };

        const response = await api.updatePost(1, partialData);

        Validators.validateStatusCode(response, 200);
        const result = await api.parseJsonResponse(response);

        Validators.validatePostFields(result.data, {
            checkUserId: false,
            checkBody: false,
        });

        // Create a modified schema for PATCH response validation
        const patchSchema = {
            ...postSchema,
            required: ['id']
        };

        Validators.validateSchema(result.data, patchSchema);
        expect(result.data.title).toBe(partialData.title);
    });

    test('DELETE /posts/1 - should delete a post', { tag: [Tags.FUNCTIONAL, Tags.DELETE, Tags.POSTS] }, async () => {
        const response = await api.deletePost(1);

        Validators.validateStatusCode(response, 200);

        const result = await api.parseJsonResponse(response);

        expect(Object.keys(result.data).length).toBe(0);
    });

    // Additional test case
    // Negative test cases
    for (const invalidId of TestData.testIds.invalid) {
        test(`GET /posts/${invalidId} - should return 404 for non-existent post`, { tag: [Tags.VALIDATION, Tags.NEGATIVE, Tags.READ, Tags.POSTS] }, async () => {
            const response = await api.getPostById(invalidId);
            Validators.validateStatusCode(response, 404);
        });
    }

    test('POST /posts - should fail to create post with invalid data', { tag: [Tags.VALIDATION, Tags.NEGATIVE, Tags.CREATE, Tags.POSTS] }, async () => {
        const invalidPostData = {
            title: 12345,
            body: true,
        };
        const response = await api.createPost(invalidPostData);

        Validators.validateStatusCode(response, 400);
    });

    test('POST /posts - should fail to create post with missing required fields', { tag: [Tags.VALIDATION, Tags.NEGATIVE, Tags.CREATE, Tags.POSTS] }, async () => {
        const incompletePostData = {
            title: '',
            body: '',
        };
        const response = await api.createPost(incompletePostData);

        Validators.validateStatusCode(response, 400);
    });

    // Pagination test case
    test('GET /posts?_limit=5 - should retrieve paginated posts', { tag: [Tags.FUNCTIONAL, Tags.READ, Tags.POSTS] }, async () => {
        const response = await api.get('/posts?_limit=5');

        Validators.validateStatusCode(response, 200);
        const result = await api.parseJsonResponse(response);

        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBeLessThanOrEqual(5);
        if (result.data.length > 0) {
            Validators.validatePostFields(result.data[0]);
        }
    });
});