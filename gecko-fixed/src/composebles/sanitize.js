// Защита от XSS — экранирует опасные HTML-символы в строке
function sanitize(str) {
  if (!str) {
    return str
  }
  if (str.constructor !== String) {
    return str
  }
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  let result = ''
  for (let charIndex = 0; charIndex < str.length; charIndex = charIndex + 1) {
    const char = str[charIndex]
    if (map[char]) {
      result = result + map[char]
    } else {
      result = result + char
    }
  }
  return result
}

// Очищает объект — применяет sanitize ко всем строковым полям
function sanitizeObject(obj) {
  const clean = {}
  for (const key in obj) {
    clean[key] = sanitize(obj[key])
  }
  return clean
}

export { sanitize, sanitizeObject }
