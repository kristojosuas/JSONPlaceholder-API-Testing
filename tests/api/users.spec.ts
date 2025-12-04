import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/api-client';
import { Helpers } from '../../utils/helpers';
import { Validators } from '../../utils/validators';
import { TestData } from '../fixtures/test-data';
import { Tags } from '../../utils/Tags';
import userSchema from '../../schemas/user.schema.json' assert { type: 'json' };

test.describe('JSONPlaceholder Users API', () => {
    let api: ApiClient;

    test.beforeEach(({ request }) => {
        api = new ApiClient(request);
    });

    test('GET /users - should retrieve all users', { tag: [Tags.SMOKE, Tags.READ, Tags.USERS] }, async () => {
        const response = await api.getUsers();

        Validators.validateStatusCode(response, 200);

        const result = await api.parseJsonResponse(response);

        Validators.validateArray(result.data, TestData.constants.totalUsers);

        if (result.data.length > 0) {
            Validators.validateUserFields(result.data[0]);
            Validators.validateSchema(result.data[0], userSchema);
        }
    });

    test('GET /users/1 - should retrieve a single user by ID', { tag: [Tags.SMOKE, Tags.READ, Tags.USERS] }, async () => {
        const response = await api.getUserById(1);

        Validators.validateStatusCode(response, 200);

        const result = await api.parseJsonResponse(response);

        Validators.validateUserFields(result.data);
        Validators.validateSchema(result.data, userSchema);
        expect(result.data.id).toBe(1);
    });

    test('GET /users/1/posts - should retrieve posts for a user', { tag: [Tags.FUNCTIONAL, Tags.READ, Tags.USERS, Tags.POSTS] }, async () => {
        const response = await api.getUserPosts(1);

        Validators.validateStatusCode(response, 200);

        const result = await api.parseJsonResponse(response);

        for (const post of result.data) {
            Validators.validatePostFields(post);
            expect(post.userId).toBe(1);
        }
    });

    test('GET /users/1/albums - should retrieve albums for a user', { tag: [Tags.FUNCTIONAL, Tags.READ, Tags.USERS] }, async () => {
        const response = await api.getUserAlbums(1);

        Validators.validateStatusCode(response, 200);

        const result = await api.parseJsonResponse(response);

        for (const album of result.data) {
            Validators.validateAlbumFields(album);
            expect(album.userId).toBe(1);
        }
    });

    test('GET /users/1/todos - should retrieve todos for a user', { tag: [Tags.FUNCTIONAL, Tags.READ, Tags.USERS] }, async () => {
        const response = await api.getUserTodos(1);

        Validators.validateStatusCode(response, 200);

        const result = await api.parseJsonResponse(response);

        for (const todo of result.data) {
            Validators.validateTodoFields(todo);
            expect(todo.userId).toBe(1);
        }
    });

    test('POST /users - should create a new user', { tag: [Tags.SMOKE, Tags.CREATE, Tags.USERS] }, async () => {
        const userData = Helpers.generateRandomUserData();

        const response = await api.createUser(userData);

        Validators.validateStatusCode(response, 201);

        const result = await api.parseJsonResponse(response);

        Validators.validateUserFields(result.data);
        Validators.validateSchema(result.data, userSchema);
        expect(result.data.name).toBe(userData.name);
        expect(result.data.username).toBe(userData.username);
        expect(result.data.email).toBe(userData.email);
    });

    test('PUT /users/1 - should update an existing user', { tag: [Tags.PUT, Tags.UPDATE, Tags.FUNCTIONAL, Tags.USERS] }, async () => {
        const getResponse = await api.getUserById(1);
        const getResult = await api.parseJsonResponse(getResponse);

        const updatedData = {
            ...getResult.data,
            name: 'Updated Name',
            email: 'updatedemail@example.com',
        };

        const response = await api.updateUser(1, updatedData);

        Validators.validateStatusCode(response, 200);

        const result = await api.parseJsonResponse(response);

        Validators.validateUserFields(result.data);
        Validators.validateSchema(result.data, userSchema);
        expect(result.data.name).toBe(updatedData.name);
        expect(result.data.email).toBe(updatedData.email);
    });

    test('PATCH /users/1 - should partially update a user', { tag: [Tags.PATCH, Tags.UPDATE, Tags.FUNCTIONAL, Tags.USERS] }, async () => {
        const partialData = {
            username: 'PartiallyUpdatedUsername',
        };

        const response = await api.updateUser(1, partialData);

        Validators.validateStatusCode(response, 200);

        const result = await api.parseJsonResponse(response);

        Validators.validateUserFields(result.data, { checkAllFields: false });

        const patchSchema = {
            ...userSchema,
            "required": ['id']
        };

        Validators.validateSchema(result.data, patchSchema);
        expect(result.data.username).toBe(partialData.username);
    });

    test('DELETE /users/1 - should delete a user', { tag: [Tags.DELETE, Tags.FUNCTIONAL, Tags.USERS] }, async () => {
        const response = await api.deleteUser(1);

        Validators.validateStatusCode(response, 200);

        const result = await api.parseJsonResponse(response);

        expect(Object.keys(result.data).length).toBe(0);
    });

    // Additional test case
    // Negative test cases
    for (const invalidId of TestData.testIds.invalid) {
        test(`GET /users/${invalidId} - should return 404 for non-existent user`, { tag: [Tags.VALIDATION, Tags.NEGATIVE, Tags.READ, Tags.USERS] }, async () => {
            const response = await api.getUserById(invalidId);
            Validators.validateStatusCode(response, 404);
        });
    }

    test('POST /users - should fail to create user with invalid email', { tag: [Tags.VALIDATION, Tags.NEGATIVE, Tags.CREATE, Tags.USERS] }, async () => {
        const invalidUserData = {
            name: 'Valid Name',
            username: 'validusername',
            email: 'invalidemail',
        };

        const response = await api.createUser(invalidUserData);

        Validators.validateStatusCode(response, 400);
    });

    test('POST /users - should fail to create user with missing required fields', { tag: [Tags.VALIDATION, Tags.NEGATIVE, Tags.CREATE, Tags.USERS] }, async () => {
        const incompleteUserData = {
            username: 'validusername',
        };

        const response = await api.createUser(incompleteUserData);

        Validators.validateStatusCode(response, 400);
    });

    test('POST /users - should fail to create user with empty fields', { tag: [Tags.VALIDATION, Tags.NEGATIVE, Tags.CREATE, Tags.USERS] }, async () => {
        const emptyUserData = {
            name: '',
            username: '',
            email: '',
        };

        const response = await api.createUser(emptyUserData);

        Validators.validateStatusCode(response, 400);
    });

    // Pagination test
    test('GET /users?_limit=3 - should retrieve limited users', { tag: [Tags.FUNCTIONAL, Tags.READ, Tags.USERS] }, async () => {
        const response = await api.get('/users?_limit=3');

        Validators.validateStatusCode(response, 200);
        const result = await api.parseJsonResponse(response);

        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBeLessThanOrEqual(3);
        if (result.data.length > 0) {
            Validators.validateUserFields(result.data[0]);
        }
    });
});