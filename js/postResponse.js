"use strict";

function validateResponse(jsonString) {
    /*
      🟠 СТУДЕНТ 2: Post-response Script
      Мета: Розпарсити JSON, перевірити статус, код і токен. Повернути true або false.
    */

    // 1. ПАРСИНГ: Якщо jsonString відсутній — поверни false. Розпарсь через JSON.parse() (бажано в try...catch).
    // 2. СТАТУС І КОД: Перевір, щоб status був "success" ТА code був 200. Якщо ні — поверни false.
    // 3. ТОКЕН: Перевір, щоб token існував і після .trim() містив "bearer" (.includes("bearer")). Якщо ні — поверни false.
    // 4. УСПІХ: Якщо всі перевірки пройшли — поверни true.

    // ✍️ ТУТ НАПИШИ СВІЙ КОД:


    return false;
}

module.exports = { validateResponse };