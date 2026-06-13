/**
 * seedMisiones.ts — Siembra 30 misiones (retos) con dificultades variadas.
 * Distribución: 10 FÁCIL (50 XP) · 10 MEDIO (100 XP) · 6 DIFÍCIL (200 XP) · 4 EXPERTO (300 XP)
 * Ejecutar: npm run seed:misiones
 */
import { db } from '../config/db.js';
import {
    Reto, LenguajeProgramacion, LenguajeReto,
    Etiqueta, EtiquetaReto, Usuario,
} from '../modelos/Modelos.js';
import { Dificultad, Categoria, RolUsuario } from '../types/types.js';

interface VarianteSemilla {
    language: string;
    starter_code: string;
    solution_code: string;
    test_code: string;
}

interface RetoSemilla {
    title: string;
    description: string;
    difficulty: Dificultad;
    category: Categoria;
    experience_reward: number;
    example_output?: string;
    tags: string[];
    variants: VarianteSemilla[];
}

// ─────────────────────────────────────────────────────────────────
// FÁCIL — 10 misiones · 50 XP
// ─────────────────────────────────────────────────────────────────
const MISIONES_FACIL: RetoSemilla[] = [
    {
        title: 'FizzBuzz Clásico',
        description: 'Devuelve un array con los números del 1 al n, sustituyendo los múltiplos de 3 por "Fizz", los de 5 por "Buzz" y los de ambos por "FizzBuzz". Los demás números van como strings.',
        difficulty: Dificultad.FACIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 50,
        example_output: 'Input: 5\nOutput: ["1", "2", "Fizz", "4", "Buzz"]',
        tags: ['lógica', 'bucles'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function fizzBuzz(n) {\n  // Tu código aquí\n  return [];\n}',
                solution_code: 'function fizzBuzz(n) {\n  const res = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) res.push("FizzBuzz");\n    else if (i % 3 === 0) res.push("Fizz");\n    else if (i % 5 === 0) res.push("Buzz");\n    else res.push(String(i));\n  }\n  return res;\n}',
                test_code: `try {
  const r = fizzBuzz(15);
  if (r[2] !== 'Fizz') throw 'El 3 debe ser Fizz';
  if (r[4] !== 'Buzz') throw 'El 5 debe ser Buzz';
  if (r[14] !== 'FizzBuzz') throw 'El 15 debe ser FizzBuzz';
  if (r[0] !== '1') throw 'El 1 debe ser "1"';
  if (r.length !== 15) throw 'Longitud incorrecta';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def fizz_buzz(n):\n    # Tu código aquí\n    return []',
                solution_code: 'def fizz_buzz(n):\n    res = []\n    for i in range(1, n + 1):\n        if i % 15 == 0:\n            res.append("FizzBuzz")\n        elif i % 3 == 0:\n            res.append("Fizz")\n        elif i % 5 == 0:\n            res.append("Buzz")\n        else:\n            res.append(str(i))\n    return res',
                test_code: `try:
    r = fizz_buzz(15)
    assert r[2] == "Fizz", "El 3 debe ser Fizz"
    assert r[4] == "Buzz", "El 5 debe ser Buzz"
    assert r[14] == "FizzBuzz", "El 15 debe ser FizzBuzz"
    assert r[0] == "1", "El 1 debe ser '1'"
    assert len(r) == 15, "Longitud incorrecta"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Invertir una Cadena',
        description: 'Escribe una función que reciba una cadena de texto y la devuelva invertida, sin usar métodos de inversión integrados como reverse().',
        difficulty: Dificultad.FACIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 50,
        example_output: 'Input: "valhalla"\nOutput: "allahlav"',
        tags: ['strings', 'bucles'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function invertir(texto) {\n  // Tu código aquí (sin usar .reverse())\n  return texto;\n}',
                solution_code: 'function invertir(texto) {\n  let res = "";\n  for (let i = texto.length - 1; i >= 0; i--) res += texto[i];\n  return res;\n}',
                test_code: `try {
  if (invertir("valhalla") !== 'allahlav') throw 'Fallo con "valhalla"';
  if (invertir("a") !== 'a') throw 'Fallo con un solo carácter';
  if (invertir("") !== '') throw 'Fallo con cadena vacía';
  if (invertir("Odin") !== 'nidO') throw 'Fallo con mayúsculas';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def invertir(texto):\n    # Tu código aquí (sin usar [::-1] ni reversed())\n    return texto',
                solution_code: 'def invertir(texto):\n    res = ""\n    for c in texto:\n        res = c + res\n    return res',
                test_code: `try:
    assert invertir("valhalla") == "allahlav", "Fallo con valhalla"
    assert invertir("a") == "a", "Un solo carácter"
    assert invertir("") == "", "Cadena vacía"
    assert invertir("Odin") == "nidO", "Mayúsculas"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Contador de Vocales',
        description: 'Cuenta cuántas vocales (a, e, i, o, u) contiene una cadena, sin distinguir mayúsculas de minúsculas.',
        difficulty: Dificultad.FACIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 50,
        example_output: 'Input: "Programacion"\nOutput: 5',
        tags: ['strings', 'lógica'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function contarVocales(texto) {\n  // Tu código aquí\n  return 0;\n}',
                solution_code: 'function contarVocales(texto) {\n  return (texto.match(/[aeiou]/gi) || []).length;\n}',
                test_code: `try {
  if (contarVocales("Programacion") !== 5) throw 'Fallo con "Programacion"';
  if (contarVocales("xyz") !== 0) throw 'Sin vocales debe ser 0';
  if (contarVocales("AEIOU") !== 5) throw 'Fallo con mayúsculas';
  if (contarVocales("") !== 0) throw 'Cadena vacía debe ser 0';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def contar_vocales(texto):\n    # Tu código aquí\n    return 0',
                solution_code: 'def contar_vocales(texto):\n    return sum(1 for c in texto.lower() if c in "aeiou")',
                test_code: `try:
    assert contar_vocales("Programacion") == 5, "Fallo con Programacion"
    assert contar_vocales("xyz") == 0, "Sin vocales"
    assert contar_vocales("AEIOU") == 5, "Mayúsculas"
    assert contar_vocales("") == 0, "Cadena vacía"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Máximo y Mínimo',
        description: 'Dado un array de números no vacío, devuelve un array de dos posiciones con el mínimo y el máximo: [min, max]. No uses Math.max/Math.min ni min()/max().',
        difficulty: Dificultad.FACIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 50,
        example_output: 'Input: [3, 7, 1, 9, 4]\nOutput: [1, 9]',
        tags: ['arrays', 'bucles'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function maxMin(nums) {\n  // Tu código aquí\n  return [0, 0];\n}',
                solution_code: 'function maxMin(nums) {\n  let min = nums[0], max = nums[0];\n  for (const n of nums) {\n    if (n < min) min = n;\n    if (n > max) max = n;\n  }\n  return [min, max];\n}',
                test_code: `try {
  if (JSON.stringify(maxMin([3, 7, 1, 9, 4])) !== '[1,9]') throw 'Caso básico falló';
  if (JSON.stringify(maxMin([5])) !== '[5,5]') throw 'Un elemento falló';
  if (JSON.stringify(maxMin([-2, -8, -1])) !== '[-8,-1]') throw 'Negativos falló';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def max_min(nums):\n    # Tu código aquí (sin usar min() ni max())\n    return [0, 0]',
                solution_code: 'def max_min(nums):\n    mn = mx = nums[0]\n    for n in nums:\n        if n < mn:\n            mn = n\n        if n > mx:\n            mx = n\n    return [mn, mx]',
                test_code: `try:
    assert max_min([3, 7, 1, 9, 4]) == [1, 9], "Caso básico"
    assert max_min([5]) == [5, 5], "Un elemento"
    assert max_min([-2, -8, -1]) == [-8, -1], "Negativos"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Suma de Dígitos',
        description: 'Calcula la suma de los dígitos de un número entero no negativo. Por ejemplo, 1234 → 1+2+3+4 = 10.',
        difficulty: Dificultad.FACIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 50,
        example_output: 'Input: 1234\nOutput: 10',
        tags: ['matemáticas', 'lógica'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function sumaDigitos(n) {\n  // Tu código aquí\n  return 0;\n}',
                solution_code: 'function sumaDigitos(n) {\n  let suma = 0;\n  while (n > 0) {\n    suma += n % 10;\n    n = Math.floor(n / 10);\n  }\n  return suma;\n}',
                test_code: `try {
  if (sumaDigitos(1234) !== 10) throw '1234 debe dar 10';
  if (sumaDigitos(0) !== 0) throw '0 debe dar 0';
  if (sumaDigitos(9) !== 9) throw '9 debe dar 9';
  if (sumaDigitos(999) !== 27) throw '999 debe dar 27';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def suma_digitos(n):\n    # Tu código aquí\n    return 0',
                solution_code: 'def suma_digitos(n):\n    suma = 0\n    while n > 0:\n        suma += n % 10\n        n //= 10\n    return suma',
                test_code: `try:
    assert suma_digitos(1234) == 10, "1234 debe dar 10"
    assert suma_digitos(0) == 0, "0 debe dar 0"
    assert suma_digitos(9) == 9, "9 debe dar 9"
    assert suma_digitos(999) == 27, "999 debe dar 27"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Número Capicúa',
        description: 'Determina si un número entero positivo es capicúa, es decir, si se lee igual de izquierda a derecha que de derecha a izquierda.',
        difficulty: Dificultad.FACIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 50,
        example_output: 'Input: 12321\nOutput: true\n\nInput: 123\nOutput: false',
        tags: ['matemáticas', 'lógica'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function esCapicua(n) {\n  // Tu código aquí\n  return false;\n}',
                solution_code: 'function esCapicua(n) {\n  const s = String(n);\n  return s === s.split("").reverse().join("");\n}',
                test_code: `try {
  if (esCapicua(12321) !== true) throw '12321 es capicúa';
  if (esCapicua(123) !== false) throw '123 no es capicúa';
  if (esCapicua(7) !== true) throw 'Un dígito siempre es capicúa';
  if (esCapicua(1001) !== true) throw '1001 es capicúa';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def es_capicua(n):\n    # Tu código aquí\n    return False',
                solution_code: 'def es_capicua(n):\n    s = str(n)\n    return s == s[::-1]',
                test_code: `try:
    assert es_capicua(12321) == True, "12321 es capicúa"
    assert es_capicua(123) == False, "123 no es capicúa"
    assert es_capicua(7) == True, "Un dígito"
    assert es_capicua(1001) == True, "1001 es capicúa"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Conversor de Temperaturas',
        description: 'Convierte grados Celsius a Fahrenheit con la fórmula F = C × 9/5 + 32. Redondea el resultado a 1 decimal.',
        difficulty: Dificultad.FACIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 50,
        example_output: 'Input: 25\nOutput: 77.0',
        tags: ['matemáticas'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function celsiusAFahrenheit(c) {\n  // Tu código aquí\n  return 0;\n}',
                solution_code: 'function celsiusAFahrenheit(c) {\n  return Math.round((c * 9 / 5 + 32) * 10) / 10;\n}',
                test_code: `try {
  if (celsiusAFahrenheit(25) !== 77) throw '25°C debe ser 77°F';
  if (celsiusAFahrenheit(0) !== 32) throw '0°C debe ser 32°F';
  if (celsiusAFahrenheit(-40) !== -40) throw '-40°C debe ser -40°F';
  if (celsiusAFahrenheit(36.6) !== 97.9) throw '36.6°C debe ser 97.9°F';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def celsius_a_fahrenheit(c):\n    # Tu código aquí\n    return 0',
                solution_code: 'def celsius_a_fahrenheit(c):\n    return round(c * 9 / 5 + 32, 1)',
                test_code: `try:
    assert celsius_a_fahrenheit(25) == 77.0, "25°C debe ser 77°F"
    assert celsius_a_fahrenheit(0) == 32.0, "0°C debe ser 32°F"
    assert celsius_a_fahrenheit(-40) == -40.0, "-40°C debe ser -40°F"
    assert celsius_a_fahrenheit(36.6) == 97.9, "36.6°C debe ser 97.9°F"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Año Bisiesto',
        description: 'Determina si un año es bisiesto: es divisible entre 4, excepto los divisibles entre 100 que no lo sean entre 400.',
        difficulty: Dificultad.FACIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 50,
        example_output: 'Input: 2024\nOutput: true\n\nInput: 1900\nOutput: false',
        tags: ['lógica', 'condicionales'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function esBisiesto(anio) {\n  // Tu código aquí\n  return false;\n}',
                solution_code: 'function esBisiesto(anio) {\n  return (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0;\n}',
                test_code: `try {
  if (esBisiesto(2024) !== true) throw '2024 es bisiesto';
  if (esBisiesto(1900) !== false) throw '1900 no es bisiesto';
  if (esBisiesto(2000) !== true) throw '2000 es bisiesto';
  if (esBisiesto(2023) !== false) throw '2023 no es bisiesto';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def es_bisiesto(anio):\n    # Tu código aquí\n    return False',
                solution_code: 'def es_bisiesto(anio):\n    return (anio % 4 == 0 and anio % 100 != 0) or anio % 400 == 0',
                test_code: `try:
    assert es_bisiesto(2024) == True, "2024 es bisiesto"
    assert es_bisiesto(1900) == False, "1900 no es bisiesto"
    assert es_bisiesto(2000) == True, "2000 es bisiesto"
    assert es_bisiesto(2023) == False, "2023 no es bisiesto"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Contador de Palabras',
        description: 'Cuenta cuántas palabras tiene una frase. Las palabras están separadas por uno o más espacios; ignora los espacios al inicio y al final.',
        difficulty: Dificultad.FACIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 50,
        example_output: 'Input: "  hola   mundo cruel  "\nOutput: 3',
        tags: ['strings'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function contarPalabras(frase) {\n  // Tu código aquí\n  return 0;\n}',
                solution_code: 'function contarPalabras(frase) {\n  const limpia = frase.trim();\n  if (!limpia) return 0;\n  return limpia.split(/\\s+/).length;\n}',
                test_code: `try {
  if (contarPalabras("  hola   mundo cruel  ") !== 3) throw 'Espacios múltiples falló';
  if (contarPalabras("una") !== 1) throw 'Una palabra falló';
  if (contarPalabras("") !== 0) throw 'Cadena vacía falló';
  if (contarPalabras("   ") !== 0) throw 'Solo espacios falló';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def contar_palabras(frase):\n    # Tu código aquí\n    return 0',
                solution_code: 'def contar_palabras(frase):\n    return len(frase.split())',
                test_code: `try:
    assert contar_palabras("  hola   mundo cruel  ") == 3, "Espacios múltiples"
    assert contar_palabras("una") == 1, "Una palabra"
    assert contar_palabras("") == 0, "Cadena vacía"
    assert contar_palabras("   ") == 0, "Solo espacios"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Máximo Común Divisor',
        description: 'Calcula el máximo común divisor de dos enteros positivos usando el algoritmo de Euclides.',
        difficulty: Dificultad.FACIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 50,
        example_output: 'Input: 48, 18\nOutput: 6',
        tags: ['matemáticas', 'recursión'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function mcd(a, b) {\n  // Tu código aquí\n  return 1;\n}',
                solution_code: 'function mcd(a, b) {\n  return b === 0 ? a : mcd(b, a % b);\n}',
                test_code: `try {
  if (mcd(48, 18) !== 6) throw 'mcd(48,18) debe ser 6';
  if (mcd(7, 13) !== 1) throw 'Primos entre sí debe ser 1';
  if (mcd(100, 25) !== 25) throw 'mcd(100,25) debe ser 25';
  if (mcd(5, 5) !== 5) throw 'mcd(5,5) debe ser 5';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def mcd(a, b):\n    # Tu código aquí\n    return 1',
                solution_code: 'def mcd(a, b):\n    while b:\n        a, b = b, a % b\n    return a',
                test_code: `try:
    assert mcd(48, 18) == 6, "mcd(48,18) debe ser 6"
    assert mcd(7, 13) == 1, "Primos entre sí"
    assert mcd(100, 25) == 25, "mcd(100,25)"
    assert mcd(5, 5) == 5, "mcd(5,5)"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
];

// ─────────────────────────────────────────────────────────────────
// MEDIO — 10 misiones · 100 XP
// ─────────────────────────────────────────────────────────────────
const MISIONES_MEDIO: RetoSemilla[] = [
    {
        title: '¿Son Anagramas?',
        description: 'Determina si dos cadenas son anagramas: contienen exactamente las mismas letras con la misma frecuencia. Ignora espacios y mayúsculas.',
        difficulty: Dificultad.MEDIO,
        category: Categoria.ALGORITMOS,
        experience_reward: 100,
        example_output: 'Input: "Roma", "amor"\nOutput: true',
        tags: ['strings', 'hash-map'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function sonAnagramas(a, b) {\n  // Tu código aquí\n  return false;\n}',
                solution_code: 'function sonAnagramas(a, b) {\n  const norm = (s) => s.toLowerCase().replace(/\\s/g, "").split("").sort().join("");\n  return norm(a) === norm(b);\n}',
                test_code: `try {
  if (sonAnagramas("Roma", "amor") !== true) throw 'Roma/amor son anagramas';
  if (sonAnagramas("hola", "halo") !== true) throw 'hola/halo son anagramas';
  if (sonAnagramas("hola", "adios") !== false) throw 'hola/adios no lo son';
  if (sonAnagramas("aa", "a") !== false) throw 'Frecuencias distintas';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def son_anagramas(a, b):\n    # Tu código aquí\n    return False',
                solution_code: 'def son_anagramas(a, b):\n    norm = lambda s: sorted(s.lower().replace(" ", ""))\n    return norm(a) == norm(b)',
                test_code: `try:
    assert son_anagramas("Roma", "amor") == True, "Roma/amor"
    assert son_anagramas("hola", "halo") == True, "hola/halo"
    assert son_anagramas("hola", "adios") == False, "hola/adios"
    assert son_anagramas("aa", "a") == False, "Frecuencias distintas"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Fibonacci Eficiente',
        description: 'Calcula el n-ésimo número de Fibonacci (F(0)=0, F(1)=1) de forma iterativa. La solución recursiva simple no pasará el test con n=50 por tiempo.',
        difficulty: Dificultad.MEDIO,
        category: Categoria.ALGORITMOS,
        experience_reward: 100,
        example_output: 'Input: 10\nOutput: 55',
        tags: ['matemáticas', 'programación-dinámica'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function fibonacci(n) {\n  // Tu código aquí\n  return 0;\n}',
                solution_code: 'function fibonacci(n) {\n  let a = 0, b = 1;\n  for (let i = 0; i < n; i++) [a, b] = [b, a + b];\n  return a;\n}',
                test_code: `try {
  if (fibonacci(0) !== 0) throw 'F(0) = 0';
  if (fibonacci(1) !== 1) throw 'F(1) = 1';
  if (fibonacci(10) !== 55) throw 'F(10) = 55';
  if (fibonacci(50) !== 12586269025) throw 'F(50) = 12586269025';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def fibonacci(n):\n    # Tu código aquí\n    return 0',
                solution_code: 'def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a',
                test_code: `try:
    assert fibonacci(0) == 0, "F(0)"
    assert fibonacci(1) == 1, "F(1)"
    assert fibonacci(10) == 55, "F(10)"
    assert fibonacci(50) == 12586269025, "F(50)"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Cifrado César',
        description: 'Implementa el cifrado César: desplaza cada letra minúscula n posiciones en el alfabeto (a-z, circular). Los caracteres que no sean letras minúsculas se dejan igual.',
        difficulty: Dificultad.MEDIO,
        category: Categoria.ALGORITMOS,
        experience_reward: 100,
        example_output: 'Input: "abc z", 3\nOutput: "def c"',
        tags: ['strings', 'criptografía'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function cifrarCesar(texto, n) {\n  // Tu código aquí\n  return texto;\n}',
                solution_code: 'function cifrarCesar(texto, n) {\n  return texto.split("").map(c => {\n    const code = c.charCodeAt(0);\n    if (code < 97 || code > 122) return c;\n    return String.fromCharCode(((code - 97 + n) % 26 + 26) % 26 + 97);\n  }).join("");\n}',
                test_code: `try {
  if (cifrarCesar("abc", 3) !== 'def') throw 'abc+3 debe ser def';
  if (cifrarCesar("xyz", 3) !== 'abc') throw 'xyz+3 debe dar la vuelta a abc';
  if (cifrarCesar("hola mundo!", 1) !== 'ipmb nvoep!') throw 'Espacios y signos se mantienen';
  if (cifrarCesar("abc", 0) !== 'abc') throw 'Desplazamiento 0';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def cifrar_cesar(texto, n):\n    # Tu código aquí\n    return texto',
                solution_code: 'def cifrar_cesar(texto, n):\n    res = []\n    for c in texto:\n        if "a" <= c <= "z":\n            res.append(chr((ord(c) - 97 + n) % 26 + 97))\n        else:\n            res.append(c)\n    return "".join(res)',
                test_code: `try:
    assert cifrar_cesar("abc", 3) == "def", "abc+3"
    assert cifrar_cesar("xyz", 3) == "abc", "xyz+3 circular"
    assert cifrar_cesar("hola mundo!", 1) == "ipmb nvoep!", "Signos se mantienen"
    assert cifrar_cesar("abc", 0) == "abc", "Desplazamiento 0"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Búsqueda Binaria',
        description: 'Implementa búsqueda binaria sobre un array ordenado ascendentemente. Devuelve el índice del objetivo o -1 si no existe. Debe ser O(log n): la búsqueda lineal no es válida conceptualmente.',
        difficulty: Dificultad.MEDIO,
        category: Categoria.ALGORITMOS,
        experience_reward: 100,
        example_output: 'Input: [1, 3, 5, 7, 9, 11], 7\nOutput: 3',
        tags: ['búsqueda-binaria', 'arrays'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function busquedaBinaria(arr, objetivo) {\n  // Tu código aquí\n  return -1;\n}',
                solution_code: 'function busquedaBinaria(arr, objetivo) {\n  let izq = 0, der = arr.length - 1;\n  while (izq <= der) {\n    const mid = Math.floor((izq + der) / 2);\n    if (arr[mid] === objetivo) return mid;\n    if (arr[mid] < objetivo) izq = mid + 1;\n    else der = mid - 1;\n  }\n  return -1;\n}',
                test_code: `try {
  if (busquedaBinaria([1, 3, 5, 7, 9, 11], 7) !== 3) throw 'Buscar 7 debe dar 3';
  if (busquedaBinaria([1, 3, 5], 4) !== -1) throw 'Inexistente debe dar -1';
  if (busquedaBinaria([5], 5) !== 0) throw 'Un elemento';
  if (busquedaBinaria([], 1) !== -1) throw 'Array vacío';
  if (busquedaBinaria([1, 3, 5, 7], 1) !== 0) throw 'Primer elemento';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def busqueda_binaria(arr, objetivo):\n    # Tu código aquí\n    return -1',
                solution_code: 'def busqueda_binaria(arr, objetivo):\n    izq, der = 0, len(arr) - 1\n    while izq <= der:\n        mid = (izq + der) // 2\n        if arr[mid] == objetivo:\n            return mid\n        if arr[mid] < objetivo:\n            izq = mid + 1\n        else:\n            der = mid - 1\n    return -1',
                test_code: `try:
    assert busqueda_binaria([1, 3, 5, 7, 9, 11], 7) == 3, "Buscar 7"
    assert busqueda_binaria([1, 3, 5], 4) == -1, "Inexistente"
    assert busqueda_binaria([5], 5) == 0, "Un elemento"
    assert busqueda_binaria([], 1) == -1, "Array vacío"
    assert busqueda_binaria([1, 3, 5, 7], 1) == 0, "Primer elemento"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Números Romanos a Enteros',
        description: 'Convierte un número romano (I, V, X, L, C, D, M) a entero. Recuerda la regla sustractiva: IV=4, IX=9, XL=40, XC=90, CD=400, CM=900.',
        difficulty: Dificultad.MEDIO,
        category: Categoria.ALGORITMOS,
        experience_reward: 100,
        example_output: 'Input: "MCMXCIV"\nOutput: 1994',
        tags: ['strings', 'hash-map'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function romanoAEntero(s) {\n  // Tu código aquí\n  return 0;\n}',
                solution_code: 'function romanoAEntero(s) {\n  const v = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };\n  let total = 0;\n  for (let i = 0; i < s.length; i++) {\n    if (i + 1 < s.length && v[s[i]] < v[s[i + 1]]) total -= v[s[i]];\n    else total += v[s[i]];\n  }\n  return total;\n}',
                test_code: `try {
  if (romanoAEntero("III") !== 3) throw 'III = 3';
  if (romanoAEntero("IV") !== 4) throw 'IV = 4';
  if (romanoAEntero("LVIII") !== 58) throw 'LVIII = 58';
  if (romanoAEntero("MCMXCIV") !== 1994) throw 'MCMXCIV = 1994';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def romano_a_entero(s):\n    # Tu código aquí\n    return 0',
                solution_code: 'def romano_a_entero(s):\n    v = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}\n    total = 0\n    for i, c in enumerate(s):\n        if i + 1 < len(s) and v[c] < v[s[i + 1]]:\n            total -= v[c]\n        else:\n            total += v[c]\n    return total',
                test_code: `try:
    assert romano_a_entero("III") == 3, "III"
    assert romano_a_entero("IV") == 4, "IV"
    assert romano_a_entero("LVIII") == 58, "LVIII"
    assert romano_a_entero("MCMXCIV") == 1994, "MCMXCIV"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Aplanar Lista Anidada',
        description: 'Dada una lista que puede contener números y otras listas anidadas a cualquier profundidad, devuelve una lista plana con todos los números en orden.',
        difficulty: Dificultad.MEDIO,
        category: Categoria.ALGORITMOS,
        experience_reward: 100,
        example_output: 'Input: [1, [2, [3, 4]], 5]\nOutput: [1, 2, 3, 4, 5]',
        tags: ['recursión', 'arrays'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function aplanar(lista) {\n  // Tu código aquí (sin usar .flat(Infinity))\n  return [];\n}',
                solution_code: 'function aplanar(lista) {\n  const res = [];\n  for (const item of lista) {\n    if (Array.isArray(item)) res.push(...aplanar(item));\n    else res.push(item);\n  }\n  return res;\n}',
                test_code: `try {
  if (JSON.stringify(aplanar([1, [2, [3, 4]], 5])) !== '[1,2,3,4,5]') throw 'Anidado profundo falló';
  if (JSON.stringify(aplanar([])) !== '[]') throw 'Lista vacía falló';
  if (JSON.stringify(aplanar([1, 2, 3])) !== '[1,2,3]') throw 'Ya plana falló';
  if (JSON.stringify(aplanar([[[[7]]]])) !== '[7]') throw 'Muy anidado falló';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def aplanar(lista):\n    # Tu código aquí\n    return []',
                solution_code: 'def aplanar(lista):\n    res = []\n    for item in lista:\n        if isinstance(item, list):\n            res.extend(aplanar(item))\n        else:\n            res.append(item)\n    return res',
                test_code: `try:
    assert aplanar([1, [2, [3, 4]], 5]) == [1, 2, 3, 4, 5], "Anidado profundo"
    assert aplanar([]) == [], "Lista vacía"
    assert aplanar([1, 2, 3]) == [1, 2, 3], "Ya plana"
    assert aplanar([[[[7]]]]) == [7], "Muy anidado"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Carácter Más Frecuente',
        description: 'Encuentra el carácter que más veces aparece en una cadena no vacía. Si hay empate, devuelve el que aparece primero en la cadena. Distingue mayúsculas de minúsculas.',
        difficulty: Dificultad.MEDIO,
        category: Categoria.ALGORITMOS,
        experience_reward: 100,
        example_output: 'Input: "programacion"\nOutput: "r"  (aparece 2 veces y antes que las otras repetidas... en realidad "r", "o" y "a" aparecen 2 veces; gana "r" por posición)',
        tags: ['strings', 'hash-map'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function masFrecuente(texto) {\n  // Tu código aquí\n  return "";\n}',
                solution_code: 'function masFrecuente(texto) {\n  const freq = {};\n  for (const c of texto) freq[c] = (freq[c] || 0) + 1;\n  let mejor = texto[0];\n  for (const c of texto) {\n    if (freq[c] > freq[mejor]) mejor = c;\n  }\n  return mejor;\n}',
                test_code: `try {
  if (masFrecuente("programacion") !== 'r') throw 'Empate: gana el primero ("r")';
  if (masFrecuente("aabbb") !== 'b') throw '"b" aparece más veces';
  if (masFrecuente("x") !== 'x') throw 'Un solo carácter';
  if (masFrecuente("abab") !== 'a') throw 'Empate a/b: gana "a"';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def mas_frecuente(texto):\n    # Tu código aquí\n    return ""',
                solution_code: 'def mas_frecuente(texto):\n    freq = {}\n    for c in texto:\n        freq[c] = freq.get(c, 0) + 1\n    mejor = texto[0]\n    for c in texto:\n        if freq[c] > freq[mejor]:\n            mejor = c\n    return mejor',
                test_code: `try:
    assert mas_frecuente("programacion") == "r", "Empate: gana el primero"
    assert mas_frecuente("aabbb") == "b", "b aparece más"
    assert mas_frecuente("x") == "x", "Un carácter"
    assert mas_frecuente("abab") == "a", "Empate a/b"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'snake_case a camelCase',
        description: 'Convierte un identificador en snake_case a camelCase. La primera palabra queda en minúscula y el resto empiezan con mayúscula. Ejemplo: "mi_variable_larga" → "miVariableLarga".',
        difficulty: Dificultad.MEDIO,
        category: Categoria.BACKEND,
        experience_reward: 100,
        example_output: 'Input: "mi_variable_larga"\nOutput: "miVariableLarga"',
        tags: ['strings'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function aCamelCase(s) {\n  // Tu código aquí\n  return s;\n}',
                solution_code: 'function aCamelCase(s) {\n  return s.split("_").filter(Boolean).map((p, i) =>\n    i === 0 ? p : p[0].toUpperCase() + p.slice(1)\n  ).join("");\n}',
                test_code: `try {
  if (aCamelCase("mi_variable_larga") !== 'miVariableLarga') throw 'Caso básico falló';
  if (aCamelCase("nombre") !== 'nombre') throw 'Sin guiones falló';
  if (aCamelCase("a_b_c") !== 'aBC') throw 'Palabras de una letra falló';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def a_camel_case(s):\n    # Tu código aquí\n    return s',
                solution_code: 'def a_camel_case(s):\n    partes = [p for p in s.split("_") if p]\n    return partes[0] + "".join(p.capitalize() for p in partes[1:])',
                test_code: `try:
    assert a_camel_case("mi_variable_larga") == "miVariableLarga", "Caso básico"
    assert a_camel_case("nombre") == "nombre", "Sin guiones"
    assert a_camel_case("a_b_c") == "aBC", "Una letra"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Total del Carrito',
        description: 'Recibe una lista de productos, cada uno con precio (price) y cantidad (qty), y devuelve el total a pagar redondeado a 2 decimales.',
        difficulty: Dificultad.MEDIO,
        category: Categoria.BACKEND,
        experience_reward: 100,
        example_output: 'Input: [{price: 2.5, qty: 2}, {price: 1.25, qty: 4}]\nOutput: 10.0',
        tags: ['arrays', 'objetos'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function totalCarrito(items) {\n  // items = [{ price, qty }, ...]\n  return 0;\n}',
                solution_code: 'function totalCarrito(items) {\n  const total = items.reduce((acc, it) => acc + it.price * it.qty, 0);\n  return Math.round(total * 100) / 100;\n}',
                test_code: `try {
  if (totalCarrito([{ price: 2.5, qty: 2 }, { price: 1.25, qty: 4 }]) !== 10) throw 'Caso básico debe ser 10';
  if (totalCarrito([]) !== 0) throw 'Carrito vacío debe ser 0';
  if (totalCarrito([{ price: 0.1, qty: 3 }]) !== 0.3) throw 'Redondeo a 2 decimales falló';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def total_carrito(items):\n    # items = [{"price": ..., "qty": ...}, ...]\n    return 0',
                solution_code: 'def total_carrito(items):\n    total = sum(it["price"] * it["qty"] for it in items)\n    return round(total, 2)',
                test_code: `try:
    assert total_carrito([{"price": 2.5, "qty": 2}, {"price": 1.25, "qty": 4}]) == 10.0, "Caso básico"
    assert total_carrito([]) == 0, "Carrito vacío"
    assert total_carrito([{"price": 0.1, "qty": 3}]) == 0.3, "Redondeo"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Rotar Array',
        description: 'Rota un array k posiciones hacia la derecha. k puede ser mayor que la longitud del array. Devuelve un array nuevo.',
        difficulty: Dificultad.MEDIO,
        category: Categoria.ALGORITMOS,
        experience_reward: 100,
        example_output: 'Input: [1, 2, 3, 4, 5], k=2\nOutput: [4, 5, 1, 2, 3]',
        tags: ['arrays', 'lógica'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function rotar(arr, k) {\n  // Tu código aquí\n  return arr;\n}',
                solution_code: 'function rotar(arr, k) {\n  if (arr.length === 0) return [];\n  const n = k % arr.length;\n  return [...arr.slice(-n || arr.length), ...arr.slice(0, arr.length - (n || arr.length))].slice(0, arr.length);\n}',
                test_code: `try {
  if (JSON.stringify(rotar([1, 2, 3, 4, 5], 2)) !== '[4,5,1,2,3]') throw 'k=2 falló';
  if (JSON.stringify(rotar([1, 2, 3], 0)) !== '[1,2,3]') throw 'k=0 falló';
  if (JSON.stringify(rotar([1, 2, 3], 3)) !== '[1,2,3]') throw 'k=longitud falló';
  if (JSON.stringify(rotar([1, 2, 3], 4)) !== '[3,1,2]') throw 'k mayor que longitud falló';
  if (JSON.stringify(rotar([], 5)) !== '[]') throw 'Array vacío falló';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def rotar(arr, k):\n    # Tu código aquí\n    return arr',
                solution_code: 'def rotar(arr, k):\n    if not arr:\n        return []\n    n = k % len(arr)\n    return arr[-n:] + arr[:-n] if n else list(arr)',
                test_code: `try:
    assert rotar([1, 2, 3, 4, 5], 2) == [4, 5, 1, 2, 3], "k=2"
    assert rotar([1, 2, 3], 0) == [1, 2, 3], "k=0"
    assert rotar([1, 2, 3], 3) == [1, 2, 3], "k=longitud"
    assert rotar([1, 2, 3], 4) == [3, 1, 2], "k > longitud"
    assert rotar([], 5) == [], "Vacío"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
];

// ─────────────────────────────────────────────────────────────────
// DIFÍCIL — 6 misiones · 200 XP
// ─────────────────────────────────────────────────────────────────
const MISIONES_DIFICIL: RetoSemilla[] = [
    {
        title: 'Suma Máxima de Subarray',
        description: 'Dado un array de enteros (con negativos), encuentra la suma del subarray contiguo con la suma máxima. Pista: algoritmo de Kadane, O(n).',
        difficulty: Dificultad.DIFICIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 200,
        example_output: 'Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nOutput: 6  (subarray [4, -1, 2, 1])',
        tags: ['programación-dinámica', 'arrays', 'kadane'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function sumaMaximaSubarray(nums) {\n  // Tu código aquí\n  return 0;\n}',
                solution_code: 'function sumaMaximaSubarray(nums) {\n  let mejor = nums[0], actual = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    actual = Math.max(nums[i], actual + nums[i]);\n    mejor = Math.max(mejor, actual);\n  }\n  return mejor;\n}',
                test_code: `try {
  if (sumaMaximaSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) !== 6) throw 'Caso clásico debe ser 6';
  if (sumaMaximaSubarray([1]) !== 1) throw 'Un elemento';
  if (sumaMaximaSubarray([-3, -1, -2]) !== -1) throw 'Todos negativos debe ser -1';
  if (sumaMaximaSubarray([5, 4, -1, 7, 8]) !== 23) throw 'Suma completa debe ser 23';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def suma_maxima_subarray(nums):\n    # Tu código aquí\n    return 0',
                solution_code: 'def suma_maxima_subarray(nums):\n    mejor = actual = nums[0]\n    for n in nums[1:]:\n        actual = max(n, actual + n)\n        mejor = max(mejor, actual)\n    return mejor',
                test_code: `try:
    assert suma_maxima_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6, "Caso clásico"
    assert suma_maxima_subarray([1]) == 1, "Un elemento"
    assert suma_maxima_subarray([-3, -1, -2]) == -1, "Todos negativos"
    assert suma_maxima_subarray([5, 4, -1, 7, 8]) == 23, "Suma completa"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Fusionar Intervalos',
        description: 'Dada una lista de intervalos [inicio, fin], fusiona todos los que se solapen y devuelve la lista resultante ordenada por inicio.',
        difficulty: Dificultad.DIFICIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 200,
        example_output: 'Input: [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]',
        tags: ['arrays', 'ordenación', 'intervalos'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function fusionarIntervalos(intervalos) {\n  // Tu código aquí\n  return [];\n}',
                solution_code: 'function fusionarIntervalos(intervalos) {\n  if (intervalos.length === 0) return [];\n  const ordenados = [...intervalos].sort((a, b) => a[0] - b[0]);\n  const res = [ordenados[0].slice()];\n  for (let i = 1; i < ordenados.length; i++) {\n    const ultimo = res[res.length - 1];\n    if (ordenados[i][0] <= ultimo[1]) ultimo[1] = Math.max(ultimo[1], ordenados[i][1]);\n    else res.push(ordenados[i].slice());\n  }\n  return res;\n}',
                test_code: `try {
  const r1 = fusionarIntervalos([[1,3],[2,6],[8,10],[15,18]]);
  if (JSON.stringify(r1) !== '[[1,6],[8,10],[15,18]]') throw 'Caso clásico falló: ' + JSON.stringify(r1);
  const r2 = fusionarIntervalos([[1,4],[4,5]]);
  if (JSON.stringify(r2) !== '[[1,5]]') throw 'Intervalos que se tocan falló';
  const r3 = fusionarIntervalos([[4,7],[1,2]]);
  if (JSON.stringify(r3) !== '[[1,2],[4,7]]') throw 'Desordenados falló';
  if (JSON.stringify(fusionarIntervalos([])) !== '[]') throw 'Vacío falló';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def fusionar_intervalos(intervalos):\n    # Tu código aquí\n    return []',
                solution_code: 'def fusionar_intervalos(intervalos):\n    if not intervalos:\n        return []\n    ordenados = sorted(intervalos)\n    res = [list(ordenados[0])]\n    for ini, fin in ordenados[1:]:\n        if ini <= res[-1][1]:\n            res[-1][1] = max(res[-1][1], fin)\n        else:\n            res.append([ini, fin])\n    return res',
                test_code: `try:
    assert fusionar_intervalos([[1,3],[2,6],[8,10],[15,18]]) == [[1,6],[8,10],[15,18]], "Caso clásico"
    assert fusionar_intervalos([[1,4],[4,5]]) == [[1,5]], "Se tocan"
    assert fusionar_intervalos([[4,7],[1,2]]) == [[1,2],[4,7]], "Desordenados"
    assert fusionar_intervalos([]) == [], "Vacío"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Recorrido en Espiral',
        description: 'Dada una matriz m×n, devuelve todos sus elementos en orden espiral horario, empezando por la esquina superior izquierda.',
        difficulty: Dificultad.DIFICIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 200,
        example_output: 'Input: [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [1,2,3,6,9,8,7,4,5]',
        tags: ['matrices', 'simulación'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function espiral(matriz) {\n  // Tu código aquí\n  return [];\n}',
                solution_code: 'function espiral(matriz) {\n  const res = [];\n  if (matriz.length === 0) return res;\n  let arriba = 0, abajo = matriz.length - 1, izq = 0, der = matriz[0].length - 1;\n  while (arriba <= abajo && izq <= der) {\n    for (let i = izq; i <= der; i++) res.push(matriz[arriba][i]);\n    arriba++;\n    for (let i = arriba; i <= abajo; i++) res.push(matriz[i][der]);\n    der--;\n    if (arriba <= abajo) {\n      for (let i = der; i >= izq; i--) res.push(matriz[abajo][i]);\n      abajo--;\n    }\n    if (izq <= der) {\n      for (let i = abajo; i >= arriba; i--) res.push(matriz[i][izq]);\n      izq++;\n    }\n  }\n  return res;\n}',
                test_code: `try {
  const r1 = espiral([[1,2,3],[4,5,6],[7,8,9]]);
  if (JSON.stringify(r1) !== '[1,2,3,6,9,8,7,4,5]') throw '3x3 falló: ' + JSON.stringify(r1);
  const r2 = espiral([[1,2],[3,4]]);
  if (JSON.stringify(r2) !== '[1,2,4,3]') throw '2x2 falló';
  const r3 = espiral([[1,2,3,4]]);
  if (JSON.stringify(r3) !== '[1,2,3,4]') throw 'Una fila falló';
  const r4 = espiral([[1],[2],[3]]);
  if (JSON.stringify(r4) !== '[1,2,3]') throw 'Una columna falló';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def espiral(matriz):\n    # Tu código aquí\n    return []',
                solution_code: 'def espiral(matriz):\n    res = []\n    if not matriz:\n        return res\n    arriba, abajo = 0, len(matriz) - 1\n    izq, der = 0, len(matriz[0]) - 1\n    while arriba <= abajo and izq <= der:\n        for i in range(izq, der + 1):\n            res.append(matriz[arriba][i])\n        arriba += 1\n        for i in range(arriba, abajo + 1):\n            res.append(matriz[i][der])\n        der -= 1\n        if arriba <= abajo:\n            for i in range(der, izq - 1, -1):\n                res.append(matriz[abajo][i])\n            abajo -= 1\n        if izq <= der:\n            for i in range(abajo, arriba - 1, -1):\n                res.append(matriz[i][izq])\n            izq += 1\n    return res',
                test_code: `try:
    assert espiral([[1,2,3],[4,5,6],[7,8,9]]) == [1,2,3,6,9,8,7,4,5], "3x3"
    assert espiral([[1,2],[3,4]]) == [1,2,4,3], "2x2"
    assert espiral([[1,2,3,4]]) == [1,2,3,4], "Una fila"
    assert espiral([[1],[2],[3]]) == [1,2,3], "Una columna"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Agrupar Anagramas',
        description: 'Dada una lista de palabras, agrúpalas por anagramas. Devuelve una lista de grupos: cada grupo mantiene el orden de aparición de sus palabras, y los grupos van en orden de aparición de su primera palabra.',
        difficulty: Dificultad.DIFICIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 200,
        example_output: 'Input: ["eat","tea","tan","ate","nat","bat"]\nOutput: [["eat","tea","ate"],["tan","nat"],["bat"]]',
        tags: ['hash-map', 'strings'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function agruparAnagramas(palabras) {\n  // Tu código aquí\n  return [];\n}',
                solution_code: 'function agruparAnagramas(palabras) {\n  const mapa = new Map();\n  for (const p of palabras) {\n    const clave = p.split("").sort().join("");\n    if (!mapa.has(clave)) mapa.set(clave, []);\n    mapa.get(clave).push(p);\n  }\n  return [...mapa.values()];\n}',
                test_code: `try {
  const r1 = agruparAnagramas(["eat","tea","tan","ate","nat","bat"]);
  if (JSON.stringify(r1) !== '[["eat","tea","ate"],["tan","nat"],["bat"]]') throw 'Caso clásico falló: ' + JSON.stringify(r1);
  const r2 = agruparAnagramas([""]);
  if (JSON.stringify(r2) !== '[[""]]') throw 'Cadena vacía falló';
  const r3 = agruparAnagramas(["a"]);
  if (JSON.stringify(r3) !== '[["a"]]') throw 'Una palabra falló';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def agrupar_anagramas(palabras):\n    # Tu código aquí\n    return []',
                solution_code: 'def agrupar_anagramas(palabras):\n    mapa = {}\n    for p in palabras:\n        clave = "".join(sorted(p))\n        mapa.setdefault(clave, []).append(p)\n    return list(mapa.values())',
                test_code: `try:
    assert agrupar_anagramas(["eat","tea","tan","ate","nat","bat"]) == [["eat","tea","ate"],["tan","nat"],["bat"]], "Caso clásico"
    assert agrupar_anagramas([""]) == [[""]], "Cadena vacía"
    assert agrupar_anagramas(["a"]) == [["a"]], "Una palabra"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Subcadena Sin Repetidos',
        description: 'Encuentra la longitud de la subcadena más larga sin caracteres repetidos. Debe resolverse en O(n) con la técnica de ventana deslizante.',
        difficulty: Dificultad.DIFICIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 200,
        example_output: 'Input: "abcabcbb"\nOutput: 3  ("abc")',
        tags: ['ventana-deslizante', 'strings'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function sinRepetidos(s) {\n  // Tu código aquí\n  return 0;\n}',
                solution_code: 'function sinRepetidos(s) {\n  const ultimaPos = new Map();\n  let inicio = 0, mejor = 0;\n  for (let i = 0; i < s.length; i++) {\n    if (ultimaPos.has(s[i]) && ultimaPos.get(s[i]) >= inicio) {\n      inicio = ultimaPos.get(s[i]) + 1;\n    }\n    ultimaPos.set(s[i], i);\n    mejor = Math.max(mejor, i - inicio + 1);\n  }\n  return mejor;\n}',
                test_code: `try {
  if (sinRepetidos("abcabcbb") !== 3) throw '"abcabcbb" debe ser 3';
  if (sinRepetidos("bbbbb") !== 1) throw '"bbbbb" debe ser 1';
  if (sinRepetidos("pwwkew") !== 3) throw '"pwwkew" debe ser 3';
  if (sinRepetidos("") !== 0) throw 'Vacía debe ser 0';
  if (sinRepetidos("abcdef") !== 6) throw 'Sin repetidos debe ser 6';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def sin_repetidos(s):\n    # Tu código aquí\n    return 0',
                solution_code: 'def sin_repetidos(s):\n    ultima_pos = {}\n    inicio = mejor = 0\n    for i, c in enumerate(s):\n        if c in ultima_pos and ultima_pos[c] >= inicio:\n            inicio = ultima_pos[c] + 1\n        ultima_pos[c] = i\n        mejor = max(mejor, i - inicio + 1)\n    return mejor',
                test_code: `try:
    assert sin_repetidos("abcabcbb") == 3, "abcabcbb"
    assert sin_repetidos("bbbbb") == 1, "bbbbb"
    assert sin_repetidos("pwwkew") == 3, "pwwkew"
    assert sin_repetidos("") == 0, "Vacía"
    assert sin_repetidos("abcdef") == 6, "Sin repetidos"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Caminos en una Cuadrícula',
        description: 'Un robot está en la esquina superior izquierda de una cuadrícula m×n y solo puede moverse hacia la derecha o hacia abajo. ¿Cuántos caminos únicos hay hasta la esquina inferior derecha? Resuélvelo con programación dinámica (la fuerza bruta no escala).',
        difficulty: Dificultad.DIFICIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 200,
        example_output: 'Input: m=3, n=7\nOutput: 28',
        tags: ['programación-dinámica', 'combinatoria'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function caminosUnicos(m, n) {\n  // Tu código aquí\n  return 0;\n}',
                solution_code: 'function caminosUnicos(m, n) {\n  const fila = new Array(n).fill(1);\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) fila[j] += fila[j - 1];\n  }\n  return fila[n - 1];\n}',
                test_code: `try {
  if (caminosUnicos(3, 7) !== 28) throw '3x7 debe ser 28';
  if (caminosUnicos(3, 2) !== 3) throw '3x2 debe ser 3';
  if (caminosUnicos(1, 1) !== 1) throw '1x1 debe ser 1';
  if (caminosUnicos(10, 10) !== 48620) throw '10x10 debe ser 48620';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def caminos_unicos(m, n):\n    # Tu código aquí\n    return 0',
                solution_code: 'def caminos_unicos(m, n):\n    fila = [1] * n\n    for _ in range(1, m):\n        for j in range(1, n):\n            fila[j] += fila[j - 1]\n    return fila[-1]',
                test_code: `try:
    assert caminos_unicos(3, 7) == 28, "3x7"
    assert caminos_unicos(3, 2) == 3, "3x2"
    assert caminos_unicos(1, 1) == 1, "1x1"
    assert caminos_unicos(10, 10) == 48620, "10x10"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
];

// ─────────────────────────────────────────────────────────────────
// EXPERTO — 4 misiones · 300 XP
// ─────────────────────────────────────────────────────────────────
const JAVA_NREINAS_STARTER = `public class Main {
    public static int contarSolucionesNReinas(int n) {
        // Tu código aquí
        return 0;
    }`;

const JAVA_NREINAS_SOLUTION = `public class Main {
    public static int contarSolucionesNReinas(int n) {
        return resolver(n, 0, 0, 0, 0);
    }

    private static int resolver(int n, int fila, long cols, long diag1, long diag2) {
        if (fila == n) return 1;
        int total = 0;
        for (int col = 0; col < n; col++) {
            long c = 1L << col;
            long d1 = 1L << (fila + col);
            long d2 = 1L << (fila - col + n - 1);
            if ((cols & c) != 0 || (diag1 & d1) != 0 || (diag2 & d2) != 0) continue;
            total += resolver(n, fila + 1, cols | c, diag1 | d1, diag2 | d2);
        }
        return total;
    }
    public static void main(String[] args) {}
}`;

const JAVA_NREINAS_TEST = `    public static void main(String[] args) {
        try {
            if (contarSolucionesNReinas(1) != 1)
                throw new Exception("fallo: n=1 tiene 1 solución");
            if (contarSolucionesNReinas(4) != 2)
                throw new Exception("fallo: n=4 tiene 2 soluciones");
            if (contarSolucionesNReinas(6) != 4)
                throw new Exception("fallo: n=6 tiene 4 soluciones");
            if (contarSolucionesNReinas(8) != 92)
                throw new Exception("fallo: n=8 tiene 92 soluciones");
            System.out.println("SUCCESS_TOKEN");
        } catch (Exception e) {
            System.out.println("FAILED_TOKEN: " + e.getMessage());
        }
    }
}`;

const CSHARP_AGUA_STARTER = `using System;

public class Main {
    public static int AguaAtrapada(int[] alturas) {
        // Tu código aquí
        return 0;
    }`;

const CSHARP_AGUA_SOLUTION = `using System;

public class Main {
    public static int AguaAtrapada(int[] alturas) {
        if (alturas.Length == 0) return 0;
        int izq = 0, der = alturas.Length - 1;
        int maxIzq = 0, maxDer = 0, agua = 0;
        while (izq < der) {
            if (alturas[izq] < alturas[der]) {
                maxIzq = Math.Max(maxIzq, alturas[izq]);
                agua += maxIzq - alturas[izq];
                izq++;
            } else {
                maxDer = Math.Max(maxDer, alturas[der]);
                agua += maxDer - alturas[der];
                der--;
            }
        }
        return agua;
    }
    static void Main() {}
}`;

const CSHARP_AGUA_TEST = `    static void Main() {
        try {
            if (AguaAtrapada(new int[]{0,1,0,2,1,0,1,3,2,1,2,1}) != 6)
                throw new Exception("fallo: caso clásico esperaba 6");
            if (AguaAtrapada(new int[]{4,2,0,3,2,5}) != 9)
                throw new Exception("fallo: [4,2,0,3,2,5] esperaba 9");
            if (AguaAtrapada(new int[]{1,2,3}) != 0)
                throw new Exception("fallo: creciente esperaba 0");
            if (AguaAtrapada(new int[]{}) != 0)
                throw new Exception("fallo: vacío esperaba 0");
            Console.WriteLine("SUCCESS_TOKEN");
        } catch (Exception e) {
            Console.WriteLine("FAILED_TOKEN: " + e.Message);
        }
    }
}`;

const MISIONES_EXPERTO: RetoSemilla[] = [
    {
        title: 'Distancia de Levenshtein',
        description: 'Calcula la distancia de edición entre dos cadenas: el mínimo número de inserciones, borrados o sustituciones de un carácter para transformar una en la otra. Resuélvelo con programación dinámica.',
        difficulty: Dificultad.EXPERTO,
        category: Categoria.ALGORITMOS,
        experience_reward: 300,
        example_output: 'Input: "horse", "ros"\nOutput: 3',
        tags: ['programación-dinámica', 'strings'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function distanciaEdicion(a, b) {\n  // Tu código aquí\n  return 0;\n}',
                solution_code: 'function distanciaEdicion(a, b) {\n  const m = a.length, n = b.length;\n  const dp = Array.from({ length: m + 1 }, (_, i) => {\n    const fila = new Array(n + 1).fill(0);\n    fila[0] = i;\n    return fila;\n  });\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);\n    }\n  }\n  return dp[m][n];\n}',
                test_code: `try {
  if (distanciaEdicion("horse", "ros") !== 3) throw 'horse→ros debe ser 3';
  if (distanciaEdicion("intention", "execution") !== 5) throw 'intention→execution debe ser 5';
  if (distanciaEdicion("", "abc") !== 3) throw 'Vacía→abc debe ser 3';
  if (distanciaEdicion("igual", "igual") !== 0) throw 'Iguales debe ser 0';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def distancia_edicion(a, b):\n    # Tu código aquí\n    return 0',
                solution_code: 'def distancia_edicion(a, b):\n    m, n = len(a), len(b)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m + 1):\n        dp[i][0] = i\n    for j in range(n + 1):\n        dp[0][j] = j\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if a[i - 1] == b[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1]\n            else:\n                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])\n    return dp[m][n]',
                test_code: `try:
    assert distancia_edicion("horse", "ros") == 3, "horse→ros"
    assert distancia_edicion("intention", "execution") == 5, "intention→execution"
    assert distancia_edicion("", "abc") == 3, "Vacía→abc"
    assert distancia_edicion("igual", "igual") == 0, "Iguales"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Mediana de Dos Arrays Ordenados',
        description: 'Dados dos arrays ordenados, encuentra la mediana del conjunto combinado. La solución óptima es O(log(m+n)) con búsqueda binaria, aunque el test acepta cualquier solución correcta.',
        difficulty: Dificultad.EXPERTO,
        category: Categoria.ALGORITMOS,
        experience_reward: 300,
        example_output: 'Input: [1, 3], [2]\nOutput: 2.0\n\nInput: [1, 2], [3, 4]\nOutput: 2.5',
        tags: ['búsqueda-binaria', 'arrays'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function medianaDosArrays(a, b) {\n  // Tu código aquí\n  return 0;\n}',
                solution_code: 'function medianaDosArrays(a, b) {\n  if (a.length > b.length) return medianaDosArrays(b, a);\n  const m = a.length, n = b.length;\n  const mitad = Math.floor((m + n + 1) / 2);\n  let izq = 0, der = m;\n  while (izq <= der) {\n    const i = Math.floor((izq + der) / 2);\n    const j = mitad - i;\n    const aIzq = i === 0 ? -Infinity : a[i - 1];\n    const aDer = i === m ? Infinity : a[i];\n    const bIzq = j === 0 ? -Infinity : b[j - 1];\n    const bDer = j === n ? Infinity : b[j];\n    if (aIzq <= bDer && bIzq <= aDer) {\n      if ((m + n) % 2 === 1) return Math.max(aIzq, bIzq);\n      return (Math.max(aIzq, bIzq) + Math.min(aDer, bDer)) / 2;\n    }\n    if (aIzq > bDer) der = i - 1;\n    else izq = i + 1;\n  }\n  return 0;\n}',
                test_code: `try {
  if (medianaDosArrays([1, 3], [2]) !== 2) throw '[1,3]+[2] debe ser 2';
  if (medianaDosArrays([1, 2], [3, 4]) !== 2.5) throw '[1,2]+[3,4] debe ser 2.5';
  if (medianaDosArrays([], [1]) !== 1) throw 'Uno vacío debe ser 1';
  if (medianaDosArrays([2, 2, 2], [2, 2]) !== 2) throw 'Todos iguales debe ser 2';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def mediana_dos_arrays(a, b):\n    # Tu código aquí\n    return 0',
                solution_code: 'def mediana_dos_arrays(a, b):\n    if len(a) > len(b):\n        a, b = b, a\n    m, n = len(a), len(b)\n    mitad = (m + n + 1) // 2\n    izq, der = 0, m\n    while izq <= der:\n        i = (izq + der) // 2\n        j = mitad - i\n        a_izq = a[i - 1] if i > 0 else float("-inf")\n        a_der = a[i] if i < m else float("inf")\n        b_izq = b[j - 1] if j > 0 else float("-inf")\n        b_der = b[j] if j < n else float("inf")\n        if a_izq <= b_der and b_izq <= a_der:\n            if (m + n) % 2 == 1:\n                return max(a_izq, b_izq)\n            return (max(a_izq, b_izq) + min(a_der, b_der)) / 2\n        if a_izq > b_der:\n            der = i - 1\n        else:\n            izq = i + 1\n    return 0',
                test_code: `try:
    assert mediana_dos_arrays([1, 3], [2]) == 2, "[1,3]+[2]"
    assert mediana_dos_arrays([1, 2], [3, 4]) == 2.5, "[1,2]+[3,4]"
    assert mediana_dos_arrays([], [1]) == 1, "Uno vacío"
    assert mediana_dos_arrays([2, 2, 2], [2, 2]) == 2, "Todos iguales"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'N-Reinas: Contar Soluciones',
        description:
            'Implementa el método `contarSolucionesNReinas(int n)` que devuelva cuántas formas hay de colocar n reinas ' +
            'en un tablero n×n sin que se amenacen entre sí (ni fila, ni columna, ni diagonal). ' +
            'Usa backtracking. El test llega hasta n=8 (92 soluciones), así que la poda debe ser eficiente. ' +
            'No cierres la clase ni escribas el método main: el sistema de tests lo añade automáticamente.',
        difficulty: Dificultad.EXPERTO,
        category: Categoria.ALGORITMOS,
        experience_reward: 300,
        example_output:
            'contarSolucionesNReinas(1) → 1\n' +
            'contarSolucionesNReinas(4) → 2\n' +
            'contarSolucionesNReinas(8) → 92',
        tags: ['backtracking', 'java'],
        variants: [{ language: 'java', starter_code: JAVA_NREINAS_STARTER, solution_code: JAVA_NREINAS_SOLUTION, test_code: JAVA_NREINAS_TEST }],
    },
    {
        title: 'Agua de Lluvia Atrapada',
        description:
            'Dado un array de alturas que representa un mapa de elevación donde cada barra tiene ancho 1, ' +
            'implementa el método `AguaAtrapada(int[] alturas)` que calcule cuántas unidades de agua quedan atrapadas tras llover. ' +
            'La solución óptima usa dos punteros en O(n) y O(1) de espacio. ' +
            'No cierres la clase ni escribas el método Main: el sistema de tests lo añade automáticamente.',
        difficulty: Dificultad.EXPERTO,
        category: Categoria.ALGORITMOS,
        experience_reward: 300,
        example_output:
            'AguaAtrapada([0,1,0,2,1,0,1,3,2,1,2,1]) → 6\n' +
            'AguaAtrapada([4,2,0,3,2,5])             → 9',
        tags: ['dos-punteros', 'arrays', 'csharp'],
        variants: [{ language: 'csharp', starter_code: CSHARP_AGUA_STARTER, solution_code: CSHARP_AGUA_SOLUTION, test_code: CSHARP_AGUA_TEST }],
    },
];

// ─────────────────────────────────────────────────────────────────
// Ejecución
// ─────────────────────────────────────────────────────────────────
const TODAS_LAS_MISIONES = [
    ...MISIONES_FACIL,
    ...MISIONES_MEDIO,
    ...MISIONES_DIFICIL,
    ...MISIONES_EXPERTO,
];

async function sembrar() {
    try {
        await db.authenticate();

        const admin = await Usuario.findOne({ where: { role: RolUsuario.ADMIN } });
        if (!admin) {
            console.error('✗ No hay ningún usuario ADMIN. Ejecuta antes "npm run seed:admins".');
            process.exit(1);
        }

        const cacheLenguajes = new Map<string, string>();
        const cacheEtiquetas = new Map<string, string>();
        let creadas = 0;

        for (const semilla of TODAS_LAS_MISIONES) {
            const existente = await Reto.findOne({ where: { title: semilla.title } });
            if (existente) {
                continue;
            }

            const reto = await Reto.create({
                title:             semilla.title,
                description:       semilla.description,
                difficulty:        semilla.difficulty,
                category:          semilla.category,
                experience_reward: semilla.experience_reward,
                example_output:    semilla.example_output,
                created_by:        admin.user_id,
            });

            for (const v of semilla.variants) {
                let langId = cacheLenguajes.get(v.language);
                if (!langId) {
                    const [lang] = await LenguajeProgramacion.findOrCreate({
                        where:    { name: v.language },
                        defaults: { name: v.language },
                    });
                    langId = (lang as any).language_id;
                    cacheLenguajes.set(v.language, langId!);
                }
                await LenguajeReto.create({
                    challenge_id:    (reto as any).challenge_id,
                    language_id:     langId!,
                    initial_code:    v.starter_code,
                    solution_code:   v.solution_code,
                    validation_code: v.test_code,
                });
            }

            for (const tagName of semilla.tags) {
                let tagId = cacheEtiquetas.get(tagName);
                if (!tagId) {
                    const [tag] = await Etiqueta.findOrCreate({
                        where:    { name: tagName },
                        defaults: { name: tagName },
                    });
                    tagId = (tag as any).tag_id;
                    cacheEtiquetas.set(tagName, tagId!);
                }
                await EtiquetaReto.create({
                    challenge_id: (reto as any).challenge_id,
                    tag_id:       tagId!,
                });
            }

            creadas++;
        }

        console.log(`✓ Misiones sembradas: ${creadas} nuevas de ${TODAS_LAS_MISIONES.length} totales.`);
        await db.close();
        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error al sembrar misiones:', error);
        await db.close().catch(() => {});
        process.exit(1);
    }
}

sembrar();
