"use strict";

const configData = require('./configData.js');

function generateRequestBody(rawEmail, rawPassword, role) {
    /*
      🟢 СТУДЕНТ 1: Pre-request Script
      Мета: Очистити дані, перевірити email/пароль та повернути JSON.
    */

    // 1. EMAIL: Якщо немає '@' після .trim() — поверни null.
    // 2. ПАРОЛЬ: Якщо довжина < configData.env.minPasswordLength (8) — поверни null.
    // 3. РОЛЬ: Якщо role порожня/відсутня — візьми configData.env.defaultRole ("tester"), інакше обріж пробіли (.trim()).
    // 4. РЕЗУЛЬТАТ: Поверни JSON.stringify({ email, password, role, createdAt: new Date().toISOString() }).

    // ✍️ ТУТ НАПИШИ СВІЙ КОД:

    let email = rawEmail.trim();
    if (!email.includes("@")) {
        return null;
    }
    if (!rawPassword || rawPassword.length < configData.env.minPasswordLength) {
        return null;
    }
    if (!role) {
        role = configData.env.defaultRole;
    }
    const res = {
        email,
        password: rawPassword,
        role,
        createdAt: new Date().toISOString()
    };
    return JSON.stringify(res);



    return null;
}

module.exports = { generateRequestBody };