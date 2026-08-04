"use strict";

const configData = require('./configData.js');

function generateRequestBody(rawEmail, rawPassword, role) {
    /*
      🟢 СТУДЕНТ 1: Pre-request Script
      Мета: Очистити дані, перевірити email/пароль та повернути JSON.
    */
    let email = rawEmail ? rawEmail.trim() : "";
    if (!email.includes("@")) {
        return null;
    }
    if (!rawPassword || rawPassword.length < configData.env.minPasswordLength) {
        return null;
    }
    if (!role || role.trim() === "") {
        role = configData.env.defaultRole;
    } else {
        role = role.trim();
    }
    const res = {
        email,
        password: rawPassword,
        role,
        createdAt: new Date().toISOString()
    };
    return JSON.stringify(res);
}

function processUserProfile(rawData) {
    /*
      🟡 СТУДЕНТ 2: User Profile Normalizer
      Мета: Обробити профіль, перевірити вік та порахувати знижку через цикл.

      1. ІМ'Я: Обріж пробіли у rawData.fullName. Якщо імені немає/порожнє — установи "Anonymous".
      2. ВІК: Якщо rawData.age не є числом або менше 18 — isAdult: false, інакше true.
      3. ЗНИЖКА (через цикл while): За кожні 100 балів (rawData.points) додається 5% знижки (макс 25%).
      4. СТАТУС: якщо discount >= 20 -> "VIP", інакше "Standard".
      5. РЕЗУЛЬТАТ: Поверни JSON.stringify({ name, isAdult, discount, status }).
    */

    // ✍️ ТУТ НАПИШИ СВІЙ КОД:
    let name = rawData && rawData.fullName ? rawData.fullName.trim() : "";
    if (name === "") {
        name = "Anonymous";
    }

    const age = rawData ? rawData.age : null;
    const isAdult = typeof age === "number" && age >= 18;

    let points = (rawData && typeof rawData.points === "number") ? rawData.points : 0;
    let discount = 0;

    while (points >= 100) {
        discount += 5;
        points -= 100;
        if (discount >= 25) {
            discount = 25;
            break;
        }
    }

    const status = discount >= 20 ? "VIP" : "Standard";

    return JSON.stringify({ name, isAdult, discount, status });
}

function calculateOrderTotal(price, quantity, promoCode) {
    /*
      🔴 СТУДЕНТ 3: Billing & Tax Calculator
      Мета: Обчислити фінальну вартість замовлення з урахуванням промокоду та податку.

      1. ВАЛІДАЦІЯ: Якщо price <= 0 або quantity <= 0 (чи не є числами) — поверни null.
      2. БАЗОВА СУМА: Розрахуй суму (price * quantity).
      3. ПРОМОКОД:
         - Якщо promoCode === "SALE10" — знижка 10%
         - Якщо promoCode === "SALE20" — знижка 20%
         - Інакше знижка 0%.
      4. ПОДАТОК: Додати 20% податку (VAT) ДО СУМИ ПІСЛЯ ЗНИЖКИ.
      5. РЕЗУЛЬТАТ: Поверни об'єкт { subtotal, discountAmount, tax, total } (числа округли до 2 знаків: Number(val.toFixed(2))).
    */

    // ✍️ ТУТ НАПИШИ СВІЙ КОД:
    if (typeof price !== "number" || price <= 0 || typeof quantity !== "number" || quantity <= 0) {
        return null;
    }

    const subtotal = price * quantity;
    let discountPercent = 0;

    if (promoCode === "SALE10") discountPercent = 10;
    if (promoCode === "SALE20") discountPercent = 20;

    const discountAmount = (subtotal * discountPercent) / 100;
    const amountAfterDiscount = subtotal - discountAmount;
    const tax = amountAfterDiscount * 0.20;
    const total = amountAfterDiscount + tax;

    return {
        subtotal: Number(subtotal.toFixed(2)),
        discountAmount: Number(discountAmount.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        total: Number(total.toFixed(2))
    };
}

module.exports = {
    generateRequestBody,
    processUserProfile,
    calculateOrderTotal
};