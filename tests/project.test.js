"use strict";

const {
    generateRequestBody,
    normalizeEmail,
    isValidEmail,
    isValidPassword,
    resolveRole,
    validateResponse,
    roundToTwoDecimals,
    calculatePercentageDiff,
    isWithinTolerance,
    average,
    sum,
    clamp,
    formatBytes,
    calculatePassRate,
    isValidHttpStatusCode,
    generateRandomInRange,
    maskEmail,
    maskCardNumber,
    slugify,
    truncateWithEllipsis,
    capitalizeWords,
    extractDomainFromEmail,
    countWords,
    normalizeWhitespace,
    toSnakeCase,
    isValidUsername,
    pickFields,
    omitFields,
    deepEqual,
    flattenObject,
    mergeConfigs,
    groupBy,
    countByField,
    sortByField,
    findDuplicates,
    calculateCartTotal
} = require('../js/tasks');
const configData = require('../js/configData');

// ==================================================================
// ТЕСТИ: Підготовка даних запиту (tasks.js)
// ==================================================================
describe('Підготовка даних запиту (tasks.js)', () => {

    describe('Email', () => {
        test('normalizeEmail обрізає пробіли', () => {
            expect(normalizeEmail('  user@test.com  ')).toBe('user@test.com');
        });

        test('normalizeEmail повертає "" для відсутнього email', () => {
            expect(normalizeEmail(null)).toBe('');
            expect(normalizeEmail(undefined)).toBe('');
        });

        test('isValidEmail вимагає наявність "@"', () => {
            expect(isValidEmail('user@test.com')).toBe(true);
            expect(isValidEmail('invalid-email')).toBe(false);
            expect(isValidEmail('')).toBe(false);
        });

        test('generateRequestBody повертає null, якщо email невалідний', () => {
            expect(generateRequestBody('invalid-email', '12345678')).toBeNull();
            expect(generateRequestBody('', '12345678')).toBeNull();
        });
    });

    describe('Password', () => {
        test('isValidPassword вимагає мінімальну довжину з configData', () => {
            expect(isValidPassword('12345678')).toBe(true);
            expect(isValidPassword('12345')).toBe(false);
            expect(isValidPassword(null)).toBe(false);
            expect(isValidPassword('')).toBe(false);
        });

        test('generateRequestBody повертає null, якщо пароль коротший за 8 символів', () => {
            expect(generateRequestBody('user@test.com', '12345')).toBeNull();
            expect(generateRequestBody('user@test.com', null)).toBeNull();
        });
    });

    describe('Role', () => {
        test('resolveRole підставляє defaultRole, якщо роль порожня/відсутня', () => {
            expect(resolveRole(undefined)).toBe(configData.env.defaultRole);
            expect(resolveRole('')).toBe(configData.env.defaultRole);
            expect(resolveRole('   ')).toBe(configData.env.defaultRole);
        });

        test('resolveRole обрізає пробіли навколо переданої ролі', () => {
            expect(resolveRole('  admin  ')).toBe('admin');
        });

        test('generateRequestBody підставляє "tester", якщо роль не передана', () => {
            const jsonString = generateRequestBody('user@test.com', '12345678');
            const parsed = JSON.parse(jsonString);

            expect(parsed.role).toBe(configData.env.defaultRole);
        });
    });

    describe('Інтеграція generateRequestBody', () => {
        test('Успіх: повертає валідний JSON з очищеним email та паролем', () => {
            const jsonString = generateRequestBody('  user@test.com  ', '12345678', 'admin');
            const parsed = JSON.parse(jsonString);

            expect(parsed.email).toBe('user@test.com');
            expect(parsed.password).toBe('12345678');
            expect(parsed.role).toBe('admin');
            expect(parsed).toHaveProperty('createdAt');
        });
    });
});


// ==================================================================
// ТЕСТИ: Валідація відповіді сервера (tasks.js)
// ==================================================================
describe('Валідація відповіді сервера (tasks.js)', () => {

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


// ==================================================================
// ТЕСТИ: Практичні задачі — числа, рядки, об'єкти (tasks.js)
// ==================================================================
describe('Практичні задачі: числа, рядки, об\'єкти (tasks.js)', () => {

    test('roundToTwoDecimals округлює до 2 знаків після коми', () => {
        expect(roundToTwoDecimals(19.996)).toBe(20);
        expect(roundToTwoDecimals(10.005)).toBe(10.01);
        expect(roundToTwoDecimals(5)).toBe(5);
    });

    test('calculatePercentageDiff рахує відсоткове відхилення', () => {
        expect(calculatePercentageDiff(110, 100)).toBe(10);
        expect(calculatePercentageDiff(90, 100)).toBe(-10);
        expect(calculatePercentageDiff(100, 0)).toBeNull();
    });

    test('isWithinTolerance перевіряє відхилення в межах допуску', () => {
        expect(isWithinTolerance(102, 100, 5)).toBe(true);
        expect(isWithinTolerance(110, 100, 5)).toBe(false);
        expect(isWithinTolerance(95, 100, 5)).toBe(true);
    });

    test('average рахує середнє арифметичне масиву', () => {
        expect(average([1, 2, 3])).toBe(2);
        expect(average([10, 20])).toBe(15);
        expect(average([])).toBe(0);
    });

    test('sum рахує суму масиву чисел', () => {
        expect(sum([10, 20, 30])).toBe(60);
        expect(sum([])).toBe(0);
        expect(sum([-5, 5])).toBe(0);
    });

    test('clamp обмежує значення діапазоном', () => {
        expect(clamp(15, 0, 10)).toBe(10);
        expect(clamp(-5, 0, 10)).toBe(0);
        expect(clamp(5, 0, 10)).toBe(5);
    });

    test('formatBytes форматує розмір у людський вигляд', () => {
        expect(formatBytes(500)).toBe('500 B');
        expect(formatBytes(1536)).toBe('1.50 KB');
        expect(formatBytes(1048576)).toBe('1.00 MB');
    });

    test('calculatePassRate рахує відсоток пройдених тестів', () => {
        expect(calculatePassRate(8, 10)).toBe(80);
        expect(calculatePassRate(0, 0)).toBe(0);
        expect(calculatePassRate(3, 3)).toBe(100);
    });

    test('isValidHttpStatusCode перевіряє валідність HTTP-статус-коду', () => {
        expect(isValidHttpStatusCode(200)).toBe(true);
        expect(isValidHttpStatusCode(700)).toBe(false);
        expect(isValidHttpStatusCode(99)).toBe(false);
        expect(isValidHttpStatusCode('200')).toBe(false);
        expect(isValidHttpStatusCode(200.5)).toBe(false);
    });

    test('generateRandomInRange повертає ціле число в заданих межах', () => {
        for (let i = 0; i < 20; i++) {
            const result = generateRandomInRange(1, 5);
            expect(result).toBeGreaterThanOrEqual(1);
            expect(result).toBeLessThanOrEqual(5);
            expect(Number.isInteger(result)).toBe(true);
        }
        expect(generateRandomInRange(3, 3)).toBe(3);
    });

    test('maskEmail маскує локальну частину email', () => {
        expect(maskEmail('user@test.com')).toBe('us**@test.com');
        expect(maskEmail('invalid-email')).toBe('');
        expect(maskEmail(null)).toBe('');
    });

    test('maskCardNumber лишає видимими лише останні 4 цифри', () => {
        expect(maskCardNumber('4111111111111111')).toBe('**** **** **** 1111');
        expect(maskCardNumber('123')).toBe('');
        expect(maskCardNumber(null)).toBe('');
    });

    test('slugify перетворює текст на URL-slug', () => {
        expect(slugify('  New Product Name!! ')).toBe('new-product-name');
        expect(slugify('Hello World')).toBe('hello-world');
        expect(slugify(null)).toBe('');
    });

    test('truncateWithEllipsis обрізає задовгий текст', () => {
        expect(truncateWithEllipsis('Hello world', 5)).toBe('Hello...');
        expect(truncateWithEllipsis('Hi', 5)).toBe('Hi');
        expect(truncateWithEllipsis(null, 5)).toBe('');
    });

    test('capitalizeWords приводить текст до Title Case', () => {
        expect(capitalizeWords('jOHN sMITH')).toBe('John Smith');
        expect(capitalizeWords(null)).toBe('');
    });

    test('extractDomainFromEmail повертає домен email', () => {
        expect(extractDomainFromEmail('User@Test.COM')).toBe('test.com');
        expect(extractDomainFromEmail('invalid-email')).toBe('');
        expect(extractDomainFromEmail(null)).toBe('');
    });

    test('countWords рахує кількість слів у тексті', () => {
        expect(countWords('  Great product, will buy again  ')).toBe(5);
        expect(countWords('')).toBe(0);
        expect(countWords(null)).toBe(0);
    });

    test('normalizeWhitespace схлопує зайві пробіли', () => {
        expect(normalizeWhitespace('Hello    world\n\tfoo')).toBe('Hello world foo');
        expect(normalizeWhitespace('  padded  ')).toBe('padded');
        expect(normalizeWhitespace(null)).toBe('');
    });

    test('toSnakeCase перетворює camelCase на snake_case', () => {
        expect(toSnakeCase('userFirstName')).toBe('user_first_name');
        expect(toSnakeCase('isValid')).toBe('is_valid');
        expect(toSnakeCase('id')).toBe('id');
    });

    test('isValidUsername перевіряє коректність імені користувача', () => {
        expect(isValidUsername('qa_user1')).toBe(true);
        expect(isValidUsername('1user')).toBe(false);
        expect(isValidUsername('ab')).toBe(false);
        expect(isValidUsername('user name')).toBe(false);
    });

    test('pickFields лишає тільки вказані поля об\'єкта', () => {
        expect(pickFields({ id: 1, name: 'A', password: 'x' }, ['id', 'name']))
            .toEqual({ id: 1, name: 'A' });
        expect(pickFields(null, ['id'])).toEqual({});
    });

    test('omitFields прибирає вказані поля об\'єкта', () => {
        expect(omitFields({ id: 1, password: 'x', token: 'y' }, ['password', 'token']))
            .toEqual({ id: 1 });
        expect(omitFields(null, ['id'])).toEqual({});
    });

    test('deepEqual глибоко порівнює значення', () => {
        expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
        expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
        expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
        expect(deepEqual([1, 2, 3], [1, 2])).toBe(false);
    });

    test('flattenObject перетворює вкладений об\'єкт на плаский', () => {
        expect(flattenObject({ user: { name: 'A', address: { city: 'Kyiv' } } }))
            .toEqual({ 'user.name': 'A', 'user.address.city': 'Kyiv' });
        expect(flattenObject({})).toEqual({});
    });

    test('mergeConfigs рекурсивно зливає конфіги з оверрайдами', () => {
        expect(mergeConfigs(
            { env: { baseUrl: 'a', timeout: 5000 }, retries: 1 },
            { env: { timeout: 8000 } }
        )).toEqual({ env: { baseUrl: 'a', timeout: 8000 }, retries: 1 });
    });

    test('groupBy групує масив об\'єктів за значенням поля', () => {
        const items = [{ status: 'ok' }, { status: 'fail' }, { status: 'ok' }];
        expect(groupBy(items, 'status')).toEqual({
            ok: [{ status: 'ok' }, { status: 'ok' }],
            fail: [{ status: 'fail' }]
        });
        expect(groupBy([], 'status')).toEqual({});
    });

    test('countByField рахує кількість елементів по кожному значенню поля', () => {
        const items = [{ status: 'passed' }, { status: 'failed' }, { status: 'passed' }];
        expect(countByField(items, 'status')).toEqual({ passed: 2, failed: 1 });
        expect(countByField([], 'status')).toEqual({});
    });

    test('sortByField сортує масив за полем, не мутуючи оригінал', () => {
        const items = [{ price: 30 }, { price: 10 }, { price: 20 }];
        const sortedAsc = sortByField(items, 'price');
        expect(sortedAsc).toEqual([{ price: 10 }, { price: 20 }, { price: 30 }]);
        expect(items).toEqual([{ price: 30 }, { price: 10 }, { price: 20 }]);

        const sortedDesc = sortByField(items, 'price', 'desc');
        expect(sortedDesc).toEqual([{ price: 30 }, { price: 20 }, { price: 10 }]);
    });

    test('findDuplicates знаходить значення поля, що повторюються', () => {
        expect(findDuplicates([{ id: 1 }, { id: 2 }, { id: 1 }], 'id')).toEqual([1]);
        expect(findDuplicates([{ id: 1 }, { id: 2 }], 'id')).toEqual([]);
    });

    test('calculateCartTotal рахує суму кошика', () => {
        expect(calculateCartTotal([
            { price: 19.99, quantity: 2 },
            { price: 5, quantity: 1 }
        ])).toBe(44.98);
        expect(calculateCartTotal([{ price: 10 }])).toBe(10);
        expect(calculateCartTotal([])).toBe(0);
    });
});