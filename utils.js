// utils.js

/**
 * Возвращает случайное целое число от min (включительно) до max (включительно)
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
