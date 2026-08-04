"use strict";

const { generateRequestBody } = require('../js/preRequest');
const { validateResponse } = require('../js/postResponse');
const configData = require('../js/configData');

// ==================================================================
// 🟢 ТЕСТИ ДЛЯ СТУДЕНТА 1 (Pre-request Script)
// ==================================================================
describe('🟢 СТУДЕНТ 1: Підготовка даних (preRequest.js)', () => {

    test('1. Успіх: повертає валідний JSON з очищеним email та паролем', () => {
        const jsonString = generateRequestBody('  user@test.com  ', '12345678', 'admin');
        const parsed = JSON.parse(jsonString);

        expect(parsed.email).toBe('user@test.com');
        expect(parsed.password).toBe('12345678');
        expect(parsed.role).toBe('admin');
        expect(parsed).toHaveProperty('createdAt');
    });

    test('2. Роль за замовчуванням: підставляє "tester", якщо роль не передана', () => {
        const jsonString = generateRequestBody('user@test.com', '12345678');
        const parsed = JSON.parse(jsonString);

        expect(parsed.role).toBe(configData.env.defaultRole);
    });

    test('3. Помилка Email: повертає null, якщо немає @ або email порожній', () => {
        expect(generateRequestBody('invalid-email', '12345678')).toBeNull();
        expect(generateRequestBody('', '12345678')).toBeNull();
    });

    test('4. Помилка Пароля: повертає null, якщо пароль коротший за 8 символів', () => {
        expect(generateRequestBody('user@test.com', '12345')).toBeNull();
        expect(generateRequestBody('user@test.com', null)).toBeNull();
    });
});


// ==================================================================
// 🟠 ТЕСТИ ДЛЯ СТУДЕНТА 2 (Post-response Script)
// ==================================================================
describe('🟠 СТУДЕНТ 2: Валідація відповіді (postResponse.js)', () => {

    test('1. Успіх: повертає true для валідного JSON (status "success", code 200, bearer token)', () => {
        const validJson = JSON.stringify({
            status: "success",
            code: 200,
            token: "  bearer_xyz123  "
        });
        expect(validateResponse(validJson)).toBe(true);
    });

    test('2. Помилка статусу/коду: повертає false, якщо status не "success" або code не 200', () => {
        const badStatus = JSON.stringify({ status: "error", code: 200, token: "bearer_123" });
        const badCode = JSON.stringify({ status: "success", code: 400, token: "bearer_123" });

        expect(validateResponse(badStatus)).toBe(false);
        expect(validateResponse(badCode)).toBe(false);
    });

    test('3. Помилка токена: повертає false, якщо немає токена або в ньому відсутній "bearer"', () => {
        const noToken = JSON.stringify({ status: "success", code: 200 });
        const invalidToken = JSON.stringify({ status: "success", code: 200, token: "basic_123" });

        expect(validateResponse(noToken)).toBe(false);
        expect(validateResponse(invalidToken)).toBe(false);
    });

    test('4. Некоректний JSON / порожній вхід: повертає false', () => {
        expect(validateResponse("")).toBe(false);
        expect(validateResponse(null)).toBe(false);
        expect(validateResponse("not a json string")).toBe(false);
    });
});