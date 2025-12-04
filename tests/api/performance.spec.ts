import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/api-client';
import { Validators } from '../../utils/validators';
import { Tags } from '../../utils/tags';
import { Helpers } from '../../utils/helpers';

test.describe('JSONPlaceholder Performance Tests', () => {
    let api: ApiClient;

    test.beforeEach(({ request }) => {
        api = new ApiClient(request);
    });

    // Performance test for retrieving all posts
    test('GET /posts - performance test', { tag: [Tags.PERFORMANCE, Tags.POSTS] }, async () => {
        const startTime = performance.now();
        const response = await api.getPosts();
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(`Response time for GET /posts: ${duration} ms`);
        expect(duration).toBeLessThan(3000);

        Validators.validateStatusCode(response, 200);
    });

    // Performance test for retrieving all users
    test('GET /users - performance test', { tag: [Tags.PERFORMANCE, Tags.USERS] }, async () => {
        const startTime = performance.now();
        const response = await api.getUsers();
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(`Response time for GET /users: ${duration} ms`);
        expect(duration).toBeLessThan(3000);

        Validators.validateStatusCode(response, 200);
    });

    // Performance test for retrieving a single post by ID
    test('GET posts/1 - performance test', { tag: [Tags.PERFORMANCE, Tags.POSTS] }, async () => {
        const startTime = performance.now();
        const response = await api.getPostById(1);

        Validators.validateStatusCode(response, 200);

        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(`Response time for GET /posts/1: ${duration} ms`);
        expect(duration).toBeLessThan(2000);
    });

    // Performance test for retrieving a single user by ID
    test('GET /users/1 - performance test', { tag: [Tags.PERFORMANCE, Tags.USERS] }, async () => {
        const startTime = performance.now();
        const response = await api.getUserById(1);

        Validators.validateStatusCode(response, 200);

        const endTime = performance.now();
        const responseTime = endTime - startTime;

        console.log(`Response time for GET /users/1: ${responseTime} ms`);
        expect(responseTime).toBeLessThan(3000);
    });

    // Performance test for post creation
    test('POST /posts - performance test', { tag: [Tags.PERFORMANCE] }, async () => {
        const postData = Helpers.generateRandomPostData();

        const startTime = performance.now();
        const response = await api.createPost(postData);
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(`Response time for POST /posts: ${duration} ms`);
        expect(duration).toBeLessThan(2000);

        Validators.validateStatusCode(response, 201);
    });

    // Performance test for user creation
    test('POST /users - performance test', { tag: [Tags.PERFORMANCE] }, async () => {
        const userData = Helpers.generateRandomUserData();

        const startTime = performance.now();
        const response = await api.createUser(userData);
        const endTime = performance.now();
        const responseTime = endTime - startTime;

        console.log(`Response time for POST /users: ${responseTime} ms`);
        expect(responseTime).toBeLessThan(3500);

        Validators.validateStatusCode(response, 201);
    });
});
