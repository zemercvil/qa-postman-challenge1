const { validateResponse } = require('../js/postResponse');

describe('🟠 Тести для Студента 2 (postResponse.js)', () => {

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