# QA Postman Challenge

Навчальний проєкт для тренування навичок написання pre-request та
post-response скриптів у стилі Postman. У проєкті вже є готові тести —
ваше завдання реалізувати функції в `js/tasks.js` так, щоб усі тести
стали зеленими.

## Встановлення

```bash
git clone <адреса вашого форку/репозиторію>
cd qa-postman-challenge
npm install
```

## Запуск тестів

```bash
npx jest
```

або

```bash
npm test
```

Одразу після клонування **усі тести будуть червоними (FAIL)** — це
нормально, так і має бути. Ваша задача — робити їх зеленими одну за
одною, реалізовуючи функції в `js/tasks.js`.

## Де писати код

Уся робота відбувається в одному файлі: [`js/tasks.js`](js/tasks.js).
Кожна функція там має докоментар з описом задачі, вхідними/вихідними
даними та прикладом. Поки функція не реалізована, вона кидає
`Error('<назва функції>: не реалізовано')` — тест впаде саме з цим
повідомленням, щоб було зрозуміло, над чим працювати далі.

Константи (мінімальна довжина пароля, роль за замовчуванням) лежать у
[`js/configData.js`](js/configData.js) — використовуйте їх замість
захардкоджених значень.

## Порядок виконання задач

Задачі 1-6 варто виконувати по порядку (задача 5 використовує задачі
1-4). Задачі 7-36 незалежні одна від одної — беріться за будь-яку.

1. `normalizeEmail(rawEmail)` — прибрати пробіли по краях email.
2. `isValidEmail(email)` — перевірити наявність `"@"`.
3. `isValidPassword(rawPassword)` — перевірити мінімальну довжину пароля.
4. `resolveRole(rawRole)` — підставити роль за замовчуванням, якщо порожньо.
5. `generateRequestBody(rawEmail, rawPassword, role)` — зібрати все разом
   і повернути готовий JSON тіла запиту (або `null`, якщо дані невалідні).
6. `validateResponse(jsonString)` — перевірити відповідь сервера: статус,
   код і токен.
7. `roundToTwoDecimals(value)` — округлити суму до 2 знаків після коми.
8. `calculatePercentageDiff(actual, expected)` — відсоткове відхилення
   факту від очікування.
9. `isWithinTolerance(actual, expected, tolerancePercent)` — чи відхилення
   в межах допуску.
10. `average(numbers)` — середнє арифметичне масиву чисел.
11. `sum(numbers)` — сума масиву чисел.
12. `clamp(value, min, max)` — обмежити значення діапазоном.
13. `formatBytes(bytes)` — розмір файлу у людському форматі (KB/MB/GB).
14. `calculatePassRate(passed, total)` — відсоток пройдених тестів.
15. `isValidHttpStatusCode(code)` — перевірити валідність HTTP-статус-коду.
16. `generateRandomInRange(min, max)` — випадкове ціле число в діапазоні.
17. `maskEmail(email)` — замаскувати email для логів.
18. `maskCardNumber(cardNumber)` — замаскувати номер картки, лишивши
    останні 4 цифри.
19. `slugify(title)` — перетворити назву на URL-slug.
20. `truncateWithEllipsis(str, maxLength)` — обрізати довгий текст.
21. `capitalizeWords(str)` — привести текст до Title Case.
22. `extractDomainFromEmail(email)` — дістати домен з email.
23. `countWords(str)` — порахувати кількість слів у тексті.
24. `normalizeWhitespace(str)` — прибрати зайві пробіли з тексту.
25. `toSnakeCase(str)` — перетворити camelCase на snake_case.
26. `isValidUsername(username)` — перевірити коректність імені користувача.
27. `pickFields(obj, fields)` — лишити в об'єкті тільки вказані поля.
28. `omitFields(obj, fields)` — прибрати з об'єкта вказані поля.
29. `deepEqual(a, b)` — глибоко порівняти два значення.
30. `flattenObject(obj)` — перетворити вкладений об'єкт на плаский.
31. `mergeConfigs(defaultConfig, overrides)` — рекурсивно злити конфіги.
32. `groupBy(items, key)` — згрупувати масив об'єктів за значенням поля.
33. `countByField(items, key)` — порахувати кількість елементів по
    кожному значенню поля.
34. `sortByField(items, field, direction)` — відсортувати масив об'єктів
    за полем.
35. `findDuplicates(items, key)` — знайти дублікати за значенням поля.
36. `calculateCartTotal(items)` — порахувати суму кошика замовлення.

## Перевірка прогресу

Запускайте `npx jest` після кожної реалізованої функції — тести
відповідного блоку покажуть, чи все правильно.

## CI

При кожному push/PR у `main`/`master` GitHub Actions
(`.github/workflows/test.yml`) автоматично запускає ці ж тести.
