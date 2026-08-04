const { generateRequestBody } = require('./js/preRequest');
const { validateResponse } = require('./js/postResponse');

describe('--- ТЕСТУВАННЯ СТУДЕНТСЬКОГО КОДУ (Postman Scripting) ---', () => {

    describe('🟢 Модуль 1: Pre-request Script (generateRequestBody)', () => {

        test('Успішна генерація JSON з правильними даними', () => {
            const resultJson = generateRequestBody('  user@test.com ', '123456789', 'admin');
            expect(resultJson).not.toBeNull();

            const parsed = JSON.parse(resultJson);
            expect(parsed.email).toBe('user@test.com');
            expect(parsed.role).toBe('admin');
            expect(parsed.password).toBe('123456789');
            expect(parsed.createdAt).toBeDefined();
        });

        test('Підстановка ролі за замовчуванням (дефолтної), якщо роль порожня', () => {
            const resultJson = generateRequestBody('user@test.com', '123456789', '');
            const parsed = JSON.parse(resultJson);
            expect(parsed.role).toBe('tester');
        });

        test('Помилка валідації: некоректний email (без @)', () => {
            const resultJson = generateRequestBody('invalid-email.com', '123456789', 'admin');
            expect(resultJson).toBeNull();
        });

        test('Помилка валідації: занадто короткий пароль (< 8 символів)', () => {
            const resultJson = generateRequestBody('user@test.com', '12345', 'admin');
            expect(resultJson).toBeNull();
        });
    });

    describe('🟠 Модуль 2: Post-response Script (validateResponse)', () => {

        test('Успішна валідація правильної відповіді сервера', () => {
            const validJson = JSON.stringify({
                status: "success",
                code: 200,
                token: "  bearer_secret_123  "
            });
            expect(validateResponse(validJson)).toBe(true);
        });

        test('Відхилення відповіді з помилковим статусом', () => {
            const invalidJson = JSON.stringify({
                status: "error",
                code: 400,
                token: "bearer_123"
            });
            expect(validateResponse(invalidJson)).toBe(false);
        });

        test('Відхилення відповіді без токена або з токеном без "bearer"', () => {
            const noBearerJson = JSON.stringify({
                status: "success",
                code: 200,
                token: "  secret_123  "
            });
            expect(validateResponse(noBearerJson)).toBe(false);
        });

        test('Обробка бітого / некоректного JSON', () => {
            const brokenJson = '{"status": "success", code: }';
            expect(validateResponse(brokenJson)).toBe(false);
        });
    });
});