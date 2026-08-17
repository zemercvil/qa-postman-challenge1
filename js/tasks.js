"use strict";

const configData = require('./configData.js');

// ==================================================================
// ПІДГОТОВКА ДАНИХ ЗАПИТУ
// Задачі 1-4 — маленькі незалежні функції.
// Задача 5 (generateRequestBody) об'єднує їх у результат.
// Виконуйте по порядку — тести відповідного блоку почервоніють,
// поки функція не реалізована, і позеленіють, коли все правильно.
// ==================================================================

/**
 * ЗАДАЧА 1: normalizeEmail
 * Мета: прибрати зайві пробіли на початку/в кінці email.
 * Вхід: rawEmail — рядок або відсутнє значення (null/undefined).
 * Вихід: рядок без пробілів по краях; якщо rawEmail відсутній — "".
 * Приклад: "  test@mail.com  " -> "test@mail.com"
 */
function normalizeEmail(rawEmail) {
    if (rawEmail === null || rawEmail === undefined)
        {
            return rawEmail = "";
        }
    rawEmail = rawEmail.trim();
    
    return rawEmail;
}

/**
 * ЗАДАЧА 2: isValidEmail
 * Мета: перевірити, що email — рядок і містить символ "@".
 * Вхід: email — рядок (очікується вже після normalizeEmail).
 * Вихід: true / false.
 * Приклад: "test@mail.com" -> true, "invalid-email" -> false
 */
function isValidEmail(email) {
    return email.includes("@") ? true : false;
    
}

/**
 * ЗАДАЧА 3: isValidPassword
 * Мета: перевірити, що пароль не порожній і має достатню довжину 8 символів.
 * Вхід: rawPassword — рядок або відсутнє значення.
 * Мінімальна довжина береться з configData.env.minPasswordLength.
 * Вихід: true / false.
 * Приклад: "12345678" -> true, "12345" -> false, null -> false
 */
function isValidPassword(rawPassword) {
    if (
        typeof rawPassword === "string" &&
        rawPassword.length >= configData.env.minPasswordLength) 
     {
            return true;
        } 
    else  
        {
            return false;
        }
}

/**
 * ЗАДАЧА 4: resolveRole
 * Мета: обрізати пробіли навколо ролі; якщо роль порожня/відсутня —
 * підставити значення за замовчуванням з configData.env.defaultRole.
 * Вхід: rawRole — рядок або відсутнє значення.
 * Вихід: непорожній рядок ролі.
 * Приклад: "  admin  " -> "admin", "" -> configData.env.defaultRole
 */
function resolveRole(rawRole) {
    if (rawRole === null || rawRole === undefined) {
        return configData.env.defaultRole;
    }

    rawRole = rawRole.trim();

    if (rawRole === "") {
        return configData.env.defaultRole;
    }

    return rawRole;
}

/**
 * ЗАДАЧА 5: generateRequestBody
 * Мета: об'єднати задачі 1-4, щоб зібрати готове тіло запиту.
 * Кроки:
 *   1. Очистити email через normalizeEmail.
 *   2. Якщо email невалідний (isValidEmail) — повернути null.
 *   3. Якщо пароль невалідний (isValidPassword) — повернути null.
 *   4. Визначити роль через resolveRole.
 *   5. Повернути JSON.stringify({ email, password, role, createdAt }),
 *      де createdAt — поточний час у форматі new Date().toISOString().
 * Вхід: rawEmail, rawPassword, role.
 * Вихід: рядок JSON або null.
 */
function generateRequestBody(rawEmail, rawPassword, role) {
    
    let email = normalizeEmail(rawEmail);
    if (!isValidEmail(email)) {
        return null;
    }

    if (!isValidPassword(rawPassword)) {
        return null;
    }
    
    let resolvedRole = resolveRole(role);

    let sumStr = JSON.stringify({
        email: email,
        password: rawPassword,
        role: resolvedRole,
        createdAt: new Date().toISOString()
})
    return sumStr;

}

// ==================================================================
// ВАЛІДАЦІЯ ВІДПОВІДІ СЕРВЕРА
// ==================================================================

/**
 * ЗАДАЧА 6: validateResponse
 * Мета: розпарсити JSON-відповідь і перевірити, що вона успішна.
 * Кроки:
 *   1. Якщо jsonString порожній/відсутній — повернути false.
 *   2. Спробувати JSON.parse; якщо парсинг падає — повернути false.
 *   3. Перевірити data.status === "success" і data.code === 200.
 *   4. Перевірити, що є data.token і після .trim() він містить "bearer".
 *   5. Якщо всі перевірки пройшли — повернути true, інакше false.
 * Вхід: jsonString — рядок JSON.
 * Вихід: true / false.
 */
function validateResponse(jsonString) {
    if (
        jsonString === null ||
        jsonString === undefined ||
        jsonString === "" ||
        jsonString.trim() === ""
    ) {
        return false;
    }

    let data;

    try {
        data = JSON.parse(jsonString);
    } catch {
        return false;
    }

    if (data.status !== "success" || data.code !== 200) {
        return false;
    }

    if (
        typeof data.token !== "string" ||
        !data.token.trim().includes("bearer")
    ) {
        return false;
    }

    return true;

}

// ==================================================================
// ПРАКТИЧНІ ЗАДАЧІ: числа, рядки, об'єкти
// Задачі 7-36 незалежні одна від одної — виконуйте в будь-якому
// порядку, орієнтуючись на те, що вам зараз цікавіше.
// ==================================================================

/**
 * ЗАДАЧА 7: roundToTwoDecimals
 * Мета: округлити суму/ціну до 2 знаків після коми (щоб уникнути
 * артефактів float на кшталт 19.999999999998).
 * Вхід: value — число.
 * Вихід: число, округлене до 2 знаків.
 * Приклад: 19.996 -> 20, 10.005 -> 10.01
 */
function roundToTwoDecimals(value) {
    // TODO: реалізуйте цю функцію
    throw new Error('roundToTwoDecimals: не реалізовано');
}

/**
 * ЗАДАЧА 8: calculatePercentageDiff
 * Мета: порахувати відсоткове відхилення фактичного значення від
 * очікуваного (корисно для перевірки метрик у звітах).
 * Вхід: actual, expected — числа.
 * Вихід: відсоток відхилення (може бути від'ємним), округлений до 2
 * знаків; якщо expected === 0 — повернути null.
 * Приклад: (110, 100) -> 10, (90, 100) -> -10
 */
function calculatePercentageDiff(actual, expected) {
    // TODO: реалізуйте цю функцію
    throw new Error('calculatePercentageDiff: не реалізовано');
}

/**
 * ЗАДАЧА 9: isWithinTolerance
 * Мета: перевірити, чи фактичне значення в межах допустимого відсотка
 * відхилення від очікуваного (корисно для нестабільних числових
 * метрик, напр. часу відповіді сервера).
 * Вхід: actual, expected, tolerancePercent — числа.
 * Вихід: true / false.
 * Приклад: (102, 100, 5) -> true, (110, 100, 5) -> false
 */
function isWithinTolerance(actual, expected, tolerancePercent) {
    // TODO: реалізуйте цю функцію
    throw new Error('isWithinTolerance: не реалізовано');
}

/**
 * ЗАДАЧА 10: average
 * Мета: порахувати середнє арифметичне масиву чисел (напр. середній
 * час відповіді за кілька запитів).
 * Вхід: numbers — масив чисел.
 * Вихід: число; для порожнього масиву — 0.
 * Приклад: [1, 2, 3] -> 2
 */
function average(numbers) {
    // TODO: реалізуйте цю функцію
    throw new Error('average: не реалізовано');
}

/**
 * ЗАДАЧА 11: sum
 * Мета: порахувати суму масиву чисел.
 * Вхід: numbers — масив чисел.
 * Вихід: число; для порожнього масиву — 0.
 * Приклад: [10, 20, 30] -> 60
 */
function sum(numbers) {
    // TODO: реалізуйте цю функцію
    throw new Error('sum: не реалізовано');
}

/**
 * ЗАДАЧА 12: clamp
 * Мета: обмежити значення діапазоном [min, max] (напр. ліміт
 * елементів на сторінці в пагінації).
 * Вхід: value, min, max — числа.
 * Вихід: число в межах [min, max].
 * Приклад: clamp(15, 0, 10) -> 10, clamp(-5, 0, 10) -> 0
 */
function clamp(value, min, max) {
    // TODO: реалізуйте цю функцію
    throw new Error('clamp: не реалізовано');
}

/**
 * ЗАДАЧА 13: formatBytes
 * Мета: перетворити розмір у байтах у зручний для читання формат
 * (для логів/звітів про розмір файлів).
 * Вхід: bytes — число.
 * Вихід: рядок; якщо bytes < 1024 -> "{ціле число} B", інакше
 * "{число з 2 знаками} KB" / "MB" / "GB" (база 1024).
 * Приклад: 500 -> "500 B", 1536 -> "1.50 KB", 1048576 -> "1.00 MB"
 */
function formatBytes(bytes) {
    // TODO: реалізуйте цю функцію
    throw new Error('formatBytes: не реалізовано');
}

/**
 * ЗАДАЧА 14: calculatePassRate
 * Мета: порахувати відсоток пройдених тестів для звіту про прогін.
 * Вхід: passed, total — числа.
 * Вихід: ціле число (відсоток), округлене; якщо total === 0 -> 0.
 * Приклад: (8, 10) -> 80
 */
function calculatePassRate(passed, total) {
    // TODO: реалізуйте цю функцію
    throw new Error('calculatePassRate: не реалізовано');
}

/**
 * ЗАДАЧА 15: isValidHttpStatusCode
 * Мета: перевірити, що значення — валідний HTTP-статус-код.
 * Вхід: code — будь-яке значення.
 * Вихід: true, якщо code — ціле число в діапазоні 100-599, інакше false.
 * Приклад: 200 -> true, 700 -> false, "200" -> false, 200.5 -> false
 */
function isValidHttpStatusCode(code) {
    // TODO: реалізуйте цю функцію
    throw new Error('isValidHttpStatusCode: не реалізовано');
}

/**
 * ЗАДАЧА 16: generateRandomInRange
 * Мета: згенерувати випадкове ціле число в діапазоні (для тестових
 * даних: випадковий id, затримка перед повторною спробою запиту).
 * Вхід: min, max — цілі числа (max >= min).
 * Вихід: ціле число в межах [min, max] включно.
 * Приклад: generateRandomInRange(1, 5) -> одне з 1, 2, 3, 4, 5
 */
function generateRandomInRange(min, max) {
    // TODO: реалізуйте цю функцію
    throw new Error('generateRandomInRange: не реалізовано');
}

/**
 * ЗАДАЧА 17: maskEmail
 * Мета: замаскувати email перед виводом у логи (не показувати повну
 * адресу).
 * Вхід: email — рядок.
 * Вихід: перші min(2, довжина локальної частини - 1 або 1) символи
 * локальної частини лишаються видимими, решта замінюється на "*",
 * домен не змінюється; якщо email невалідний (немає "@",
 * null/undefined) -> "".
 * Приклад: "user@test.com" -> "us**@test.com"
 */
function maskEmail(email) {
    // TODO: реалізуйте цю функцію
    throw new Error('maskEmail: не реалізовано');
}

/**
 * ЗАДАЧА 18: maskCardNumber
 * Мета: замаскувати номер картки перед виводом у логи/UI, лишивши
 * видимими тільки останні 4 цифри.
 * Вхід: cardNumber — рядок (цифри, можливо з пробілами).
 * Вихід: рядок виду "**** **** **** 1234" (нецифрові символи
 * прибираються, лишаються видимими тільки останні 4 цифри, решта — "*",
 * згруповано по 4 через пробіл); якщо цифр менше 4 -> "".
 * Приклад: "4111111111111111" -> "**** **** **** 1111"
 */
function maskCardNumber(cardNumber) {
    // TODO: реалізуйте цю функцію
    throw new Error('maskCardNumber: не реалізовано');
}

/**
 * ЗАДАЧА 19: slugify
 * Мета: перетворити назву товару/статті на URL-slug.
 * Вхід: title — рядок.
 * Вихід: рядок у нижньому регістрі, лише [a-z0-9], всі інші символи
 * замінені на "-", повтори "-" схлопнуті в один, дефіси по краях
 * прибрані; для null/undefined -> "".
 * Приклад: "  New Product Name!! " -> "new-product-name"
 */
function slugify(title) {
    // TODO: реалізуйте цю функцію
    throw new Error('slugify: не реалізовано');
}

/**
 * ЗАДАЧА 20: truncateWithEllipsis
 * Мета: обрізати задовгий текст для відображення в UI чи звіті.
 * Вхід: str — рядок, maxLength — число.
 * Вихід: якщо str.length <= maxLength -> str без змін; інакше перші
 * maxLength символів + "..."; якщо maxLength <= 0 -> "..."; для
 * null/undefined -> "".
 * Приклад: truncateWithEllipsis("Hello world", 5) -> "Hello..."
 */
function truncateWithEllipsis(str, maxLength) {
    // TODO: реалізуйте цю функцію
    throw new Error('truncateWithEllipsis: не реалізовано');
}

/**
 * ЗАДАЧА 21: capitalizeWords
 * Мета: привести ім'я/назву до Title Case для відображення.
 * Вхід: str — рядок.
 * Вихід: кожне слово починається з великої літери, решта літер малі,
 * зайві пробіли по краях прибрані; для null/undefined -> "".
 * Приклад: "jOHN sMITH" -> "John Smith"
 */
function capitalizeWords(str) {
    // TODO: реалізуйте цю функцію
    throw new Error('capitalizeWords: не реалізовано');
}

/**
 * ЗАДАЧА 22: extractDomainFromEmail
 * Мета: дістати домен з email (напр. щоб згрупувати користувачів за
 * компанією).
 * Вхід: email — рядок.
 * Вихід: домен у нижньому регістрі; якщо email невалідний
 * (немає "@", null/undefined) -> "".
 * Приклад: "User@Test.COM" -> "test.com"
 */
function extractDomainFromEmail(email) {
    // TODO: реалізуйте цю функцію
    throw new Error('extractDomainFromEmail: не реалізовано');
}

/**
 * ЗАДАЧА 23: countWords
 * Мета: порахувати кількість слів у тексті (напр. для перевірки
 * мінімальної/максимальної довжини відгуку чи коментаря).
 * Вхід: str — рядок.
 * Вихід: кількість слів, розділених пробілами; для порожнього
 * рядка/null/undefined -> 0.
 * Приклад: "  Great product, will buy again  " -> 5
 */
function countWords(str) {
    // TODO: реалізуйте цю функцію
    throw new Error('countWords: не реалізовано');
}

/**
 * ЗАДАЧА 24: normalizeWhitespace
 * Мета: прибрати зайві пробіли з тексту (чистка тестових даних чи
 * рядків логів перед порівнянням).
 * Вхід: str — рядок.
 * Вихід: рядок без пробілів по краях, усі внутрішні послідовності
 * пробілів/табуляцій/переносів рядків замінені на один пробіл; для
 * null/undefined -> "".
 * Приклад: "Hello    world\n\tfoo" -> "Hello world foo"
 */
function normalizeWhitespace(str) {
    // TODO: реалізуйте цю функцію
    throw new Error('normalizeWhitespace: не реалізовано');
}

/**
 * ЗАДАЧА 25: toSnakeCase
 * Мета: перетворити camelCase-ключ (напр. з JS-об'єкта) на
 * snake_case (напр. для порівняння з іменуванням полів в API).
 * Вхід: str — рядок у camelCase.
 * Вихід: рядок у snake_case (усі літери малі, "_" перед кожною
 * попередньою великою літерою, крім першого символу).
 * Приклад: "userFirstName" -> "user_first_name", "isValid" -> "is_valid"
 */
function toSnakeCase(str) {
    // TODO: реалізуйте цю функцію
    throw new Error('toSnakeCase: не реалізовано');
}

/**
 * ЗАДАЧА 26: isValidUsername
 * Мета: перевірити коректність імені користувача при реєстрації.
 * Вхід: username — рядок.
 * Вихід: true, якщо довжина 3-20 символів, лише латинські літери,
 * цифри та "_", і починається з літери; інакше false.
 * Приклад: "qa_user1" -> true, "1user" -> false, "ab" -> false
 */
function isValidUsername(username) {
    // TODO: реалізуйте цю функцію
    throw new Error('isValidUsername: не реалізовано');
}

/**
 * ЗАДАЧА 27: pickFields
 * Мета: залишити в об'єкті лише потрібні поля (напр. для часткової
 * перевірки відповіді API).
 * Вхід: obj — об'єкт, fields — масив назв ключів.
 * Вихід: новий об'єкт лише з тих ключів із fields, які є в obj; якщо
 * obj відсутній -> {}.
 * Приклад: pickFields({id:1, name:"A", password:"x"}, ["id","name"])
 * -> {id:1, name:"A"}
 */
function pickFields(obj, fields) {
    // TODO: реалізуйте цю функцію
    throw new Error('pickFields: не реалізовано');
}

/**
 * ЗАДАЧА 28: omitFields
 * Мета: прибрати з об'єкта чутливі поля перед логуванням (password,
 * token тощо).
 * Вхід: obj — об'єкт, fields — масив назв ключів для видалення.
 * Вихід: новий об'єкт без ключів із fields; якщо obj відсутній -> {}.
 * Приклад: omitFields({id:1, password:"x"}, ["password"]) -> {id:1}
 */
function omitFields(obj, fields) {
    // TODO: реалізуйте цю функцію
    throw new Error('omitFields: не реалізовано');
}

/**
 * ЗАДАЧА 29: deepEqual
 * Мета: глибоко порівняти два значення (напр. очікувану й фактичну
 * відповідь API з вкладеними об'єктами).
 * Вхід: a, b — будь-які значення (примітиви, об'єкти, масиви).
 * Вихід: true, якщо a і b рекурсивно однакові за структурою й
 * значеннями, інакше false.
 * Приклад: deepEqual({a:1,b:{c:2}}, {a:1,b:{c:2}}) -> true
 */
function deepEqual(a, b) {
    // TODO: реалізуйте цю функцію
    throw new Error('deepEqual: не реалізовано');
}

/**
 * ЗАДАЧА 30: flattenObject
 * Мета: перетворити вкладений об'єкт на плаский з dot-notation
 * ключами (напр. для експорту в CSV чи плаский звіт).
 * Вхід: obj — об'єкт (можливо вкладений).
 * Вихід: новий плаский об'єкт, де ключі — шляхи через крапку; масиви
 * лишаються як є (не розгортаються).
 * Приклад: {user:{name:"A", address:{city:"Kyiv"}}} ->
 * {"user.name":"A", "user.address.city":"Kyiv"}
 */
function flattenObject(obj) {
    // TODO: реалізуйте цю функцію
    throw new Error('flattenObject: не реалізовано');
}

/**
 * ЗАДАЧА 31: mergeConfigs
 * Мета: об'єднати дефолтний тестовий конфіг з оверрайдами для
 * конкретного середовища.
 * Вхід: defaultConfig, overrides — об'єкти.
 * Вихід: новий об'єкт: значення з overrides перекривають значення з
 * defaultConfig; якщо значення для ключа в обох — звичайні об'єкти,
 * вони зливаються рекурсивно так само; масиви/примітиви з overrides
 * повністю замінюють значення з defaultConfig.
 * Приклад: mergeConfigs({env:{baseUrl:"a",timeout:5000}}, {env:{timeout:8000}})
 * -> {env:{baseUrl:"a", timeout:8000}}
 */
function mergeConfigs(defaultConfig, overrides) {
    // TODO: реалізуйте цю функцію
    throw new Error('mergeConfigs: не реалізовано');
}

/**
 * ЗАДАЧА 32: groupBy
 * Мета: згрупувати масив об'єктів за значенням поля (напр. замовлення
 * за статусом).
 * Вхід: items — масив об'єктів, key — назва поля.
 * Вихід: об'єкт, де ключі — значення поля key, а значення — масиви
 * елементів з таким значенням; для порожнього масиву -> {}.
 * Приклад: groupBy([{status:"ok"},{status:"fail"},{status:"ok"}], "status")
 * -> {ok:[...2 елементи...], fail:[...1 елемент...]}
 */
function groupBy(items, key) {
    // TODO: реалізуйте цю функцію
    throw new Error('groupBy: не реалізовано');
}

/**
 * ЗАДАЧА 33: countByField
 * Мета: порахувати кількість елементів масиву для кожного значення
 * поля (напр. статистика прогону тестів: passed/failed/skipped).
 * Вхід: items — масив об'єктів, key — назва поля.
 * Вихід: об'єкт {значення: кількість}; для порожнього масиву -> {}.
 * Приклад: countByField([{status:"passed"},{status:"failed"},{status:"passed"}], "status")
 * -> {passed:2, failed:1}
 */
function countByField(items, key) {
    // TODO: реалізуйте цю функцію
    throw new Error('countByField: не реалізовано');
}

/**
 * ЗАДАЧА 34: sortByField
 * Мета: відсортувати масив об'єктів за значенням поля (напр.
 * товари за ціною) без зміни оригінального масиву.
 * Вхід: items — масив об'єктів, field — назва поля, direction —
 * "asc" (за замовч.) або "desc".
 * Вихід: НОВИЙ відсортований масив; items не мутується.
 * Приклад: sortByField([{price:30},{price:10}], "price") ->
 * [{price:10},{price:30}]
 */
function sortByField(items, field, direction) {
    // TODO: реалізуйте цю функцію
    throw new Error('sortByField: не реалізовано');
}

/**
 * ЗАДАЧА 35: findDuplicates
 * Мета: знайти дублікати за значенням поля в наборі даних (напр.
 * повторювані id чи email у списку користувачів).
 * Вхід: items — масив об'єктів, key — назва поля.
 * Вихід: масив значень key, які зустрічаються більше одного разу
 * (кожне значення один раз); якщо дублікатів немає -> [].
 * Приклад: findDuplicates([{id:1},{id:2},{id:1}], "id") -> [1]
 */
function findDuplicates(items, key) {
    // TODO: реалізуйте цю функцію
    throw new Error('findDuplicates: не реалізовано');
}

/**
 * ЗАДАЧА 36: calculateCartTotal
 * Мета: порахувати загальну суму кошика замовлення.
 * Вхід: items — масив об'єктів {price, quantity}; quantity
 * необов'язковий, за замовчуванням 1.
 * Вихід: сума price*quantity по всіх елементах, округлена до 2
 * знаків; для порожнього масиву -> 0.
 * Приклад: [{price:19.99, quantity:2}, {price:5, quantity:1}] -> 44.98
 */
function calculateCartTotal(items) {
    // TODO: реалізуйте цю функцію
    throw new Error('calculateCartTotal: не реалізовано');
}

module.exports = {
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
};
