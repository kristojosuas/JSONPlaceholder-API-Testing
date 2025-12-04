import { expect } from "@playwright/test";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

export class Validators {
    // Basic validations
    static validateStatusCode(response: any, expectedStatus: number) {
        expect(response.status()).toBe(expectedStatus);
    }

    static async validateJson(response: any) {
        expect(response.headers()['content-type']).toContain('application/json');
    }

    // Schema validation using AJV
    static async validateSchema(data: any, schema: object, context: string = '') {
        const validate = ajv.compile(schema);
        const valid = validate(data);

        if (!valid) {
            const errorMessage = `Schema validation failed${context ? ` for ${context}` : ''}:\n` +
                `Errors: ${JSON.stringify(validate.errors, null, 2)}\n` +
                `Data: ${JSON.stringify(data, null, 2)}`;

            expect(valid, errorMessage).toBeTruthy();
        }

        return valid;
    }

    // Specific field validations
    static validatePostFields(post: any, options: {
        checkUserId?: boolean;
        checkBody?: boolean;
    } = {}) {
        const { checkUserId = true, checkBody = true } = options;

        // Required fields
        expect(post).toHaveProperty('id');
        expect(typeof post.id).toBe('number');

        expect(post).toHaveProperty('title');
        expect(typeof post.title).toBe('string');

        if (checkUserId) {
            expect(post).toHaveProperty('userId');
            expect(typeof post.userId).toBe('number');
        }

        if (checkBody) {
            expect(post).toHaveProperty('body');
            expect(typeof post.body).toBe('string');
        }
    }

    static validateUserFields(user: any, options: {
        checkAllFields?: boolean;
    } = {}) {
        const { checkAllFields = true } = options;
        const requiredFields = ['id', 'name', 'username', 'email', 'address', 'phone', 'website', 'company'];
        const expectedTypes: Record<string, string> = {
            id: 'number',
            name: 'string',
            username: 'string',
            email: 'string',
            address: 'object',
            phone: 'string',
            website: 'string',
            company: 'object'
        };

        if (checkAllFields) {
            requiredFields.forEach(field => {
                expect(user).toHaveProperty(field);
                expect(typeof user[field]).toBe(expectedTypes[field]);
            });
        } else {
            expect(user).toHaveProperty('id');
            expect(typeof user.id).toBe('number');
        }
    }

    static validateArray(data: any[], minLength: number = 1, maxLength?: number) {
        expect(Array.isArray(data)).toBeTruthy();
        expect(data.length).toBeGreaterThanOrEqual(minLength);

        if (maxLength !== undefined) {
            expect(data.length).toBeLessThanOrEqual(maxLength);
        }
    }

    static validateAlbumFields(album: any) {
        expect(album).toHaveProperty('userId');
        expect(typeof album.userId).toBe('number');
        expect(album).toHaveProperty('id');
        expect(typeof album.id).toBe('number');
        expect(album).toHaveProperty('title');
        expect(typeof album.title).toBe('string');
    }

    static validateTodoFields(todo: any) {
        expect(todo).toHaveProperty('userId');
        expect(typeof todo.userId).toBe('number');
        expect(todo).toHaveProperty('id');
        expect(typeof todo.id).toBe('number');
        expect(todo).toHaveProperty('title');
        expect(typeof todo.title).toBe('string');
        expect(todo).toHaveProperty('completed');
        expect(typeof todo.completed).toBe('boolean');
    }
}   