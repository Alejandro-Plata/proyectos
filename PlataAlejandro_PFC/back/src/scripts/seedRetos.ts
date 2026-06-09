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
// Retos básicos / intermedios
// ─────────────────────────────────────────────────────────────────
const RETOS_BASICOS: RetoSemilla[] = [
    {
        title: 'Detector de Palíndromos',
        description: 'Escribe una función que determine si una cadena de texto es un palíndromo (se lee igual de izquierda a derecha que de derecha a izquierda). Debe ignorar espacios y mayúsculas.',
        difficulty: Dificultad.FACIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 50,
        example_output: 'Input: "Anita lava la tina"\nOutput: true',
        tags: ['strings', 'lógica'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function esPalindromo(texto) {\n  // Tu código aquí\n  return false;\n}',
                solution_code: 'function esPalindromo(texto) {\n  const limpio = texto.toLowerCase().replace(/[\\W_]/g, \'\');\n  return limpio === limpio.split(\'\').reverse().join(\'\');\n}',
                test_code: `try {
  if (esPalindromo("anita lava la tina") !== true) throw 'Fallo en frase estándar';
  if (esPalindromo("Hola mundo") !== false) throw 'Fallo en frase no palíndroma';
  if (esPalindromo("Oso") !== true) throw 'Fallo con mayúsculas';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'import re\n\ndef es_palindromo(texto):\n    # Tu código aquí\n    return False',
                solution_code: 'import re\n\ndef es_palindromo(texto):\n    limpio = re.sub(r\'[\\W_]\', \'\', texto.lower())\n    return limpio == limpio[::-1]',
                test_code: `try:
    assert es_palindromo("anita lava la tina") == True, "Fallo en frase estándar"
    assert es_palindromo("Hola mundo") == False, "Fallo en frase no palíndroma"
    assert es_palindromo("Oso") == True, "Fallo con mayúsculas"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Factorial de un Número',
        description: 'Crea una función que calcule el factorial de un número entero no negativo. El factorial de n (n!) es el producto de todos los enteros positivos menores o iguales a n.',
        difficulty: Dificultad.FACIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 50,
        example_output: 'Input: 5\nOutput: 120',
        tags: ['matemáticas', 'recursión'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function factorial(n) {\n  // Tu código aquí\n  return 1;\n}',
                solution_code: 'function factorial(n) {\n  if (n === 0 || n === 1) return 1;\n  return n * factorial(n - 1);\n}',
                test_code: `try {
  if (factorial(5) !== 120) throw '5! debe ser 120';
  if (factorial(0) !== 1) throw '0! debe ser 1';
  if (factorial(1) !== 1) throw '1! debe ser 1';
  if (factorial(7) !== 5040) throw '7! debe ser 5040';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def factorial(n):\n    # Tu código aquí\n    return 1',
                solution_code: 'def factorial(n):\n    if n == 0 or n == 1:\n        return 1\n    return n * factorial(n - 1)',
                test_code: `try:
    assert factorial(5) == 120, "5! debe ser 120"
    assert factorial(0) == 1, "0! debe ser 1"
    assert factorial(1) == 1, "1! debe ser 1"
    assert factorial(7) == 5040, "7! debe ser 5040"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Eliminar Duplicados',
        description: 'Dada una lista de números, devuelve una nueva lista con los elementos únicos en el mismo orden de aparición.',
        difficulty: Dificultad.FACIL,
        category: Categoria.ALGORITMOS,
        experience_reward: 50,
        example_output: 'Input: [1, 2, 2, 3, 1, 4]\nOutput: [1, 2, 3, 4]',
        tags: ['arrays', 'sets'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function eliminarDuplicados(arr) {\n  // Tu código aquí\n  return arr;\n}',
                solution_code: 'function eliminarDuplicados(arr) {\n  return [...new Set(arr)];\n}',
                test_code: `try {
  const r1 = eliminarDuplicados([1, 2, 2, 3, 1, 4]);
  if (JSON.stringify(r1) !== JSON.stringify([1, 2, 3, 4])) throw 'Caso básico falló: ' + JSON.stringify(r1);
  const r2 = eliminarDuplicados([]);
  if (JSON.stringify(r2) !== JSON.stringify([])) throw 'Array vacío falló';
  const r3 = eliminarDuplicados([5, 5, 5, 5]);
  if (JSON.stringify(r3) !== JSON.stringify([5])) throw 'Todos iguales falló';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def eliminar_duplicados(lista):\n    # Tu código aquí\n    return lista',
                solution_code: 'def eliminar_duplicados(lista):\n    vistos = set()\n    resultado = []\n    for x in lista:\n        if x not in vistos:\n            vistos.add(x)\n            resultado.append(x)\n    return resultado',
                test_code: `try:
    assert eliminar_duplicados([1, 2, 2, 3, 1, 4]) == [1, 2, 3, 4], "Caso básico"
    assert eliminar_duplicados([]) == [], "Lista vacía"
    assert eliminar_duplicados([5, 5, 5, 5]) == [5], "Todos iguales"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Two Sum',
        description: 'Dado un array de enteros y un valor objetivo, devuelve los índices de los dos números cuya suma sea igual al objetivo. Puedes asumir que cada entrada tiene exactamente una solución.',
        difficulty: Dificultad.MEDIO,
        category: Categoria.ALGORITMOS,
        experience_reward: 100,
        example_output: 'Input: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]  (porque nums[0] + nums[1] = 9)',
        tags: ['arrays', 'hash-map'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function twoSum(nums, target) {\n  // Tu código aquí\n  return [];\n}',
                solution_code: 'function twoSum(nums, target) {\n  const mapa = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complemento = target - nums[i];\n    if (mapa.has(complemento)) return [mapa.get(complemento), i];\n    mapa.set(nums[i], i);\n  }\n  return [];\n}',
                test_code: `try {
  const r1 = twoSum([2, 7, 11, 15], 9);
  if (JSON.stringify(r1) !== JSON.stringify([0, 1])) throw 'Caso 1 falló';
  const r2 = twoSum([3, 2, 4], 6);
  if (JSON.stringify(r2) !== JSON.stringify([1, 2])) throw 'Caso 2 falló';
  const r3 = twoSum([3, 3], 6);
  if (JSON.stringify(r3) !== JSON.stringify([0, 1])) throw 'Duplicados falló';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def two_sum(nums, target):\n    # Tu código aquí\n    return []',
                solution_code: 'def two_sum(nums, target):\n    mapa = {}\n    for i, n in enumerate(nums):\n        complemento = target - n\n        if complemento in mapa:\n            return [mapa[complemento], i]\n        mapa[n] = i\n    return []',
                test_code: `try:
    assert two_sum([2, 7, 11, 15], 9) == [0, 1], "Caso 1"
    assert two_sum([3, 2, 4], 6) == [1, 2], "Caso 2"
    assert two_sum([3, 3], 6) == [0, 1], "Duplicados"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
    {
        title: 'Paréntesis Válidos',
        description: 'Dada una cadena que contiene solo los caracteres "(", ")", "{", "}", "[" y "]", determina si la cadena de paréntesis es válida. Una cadena es válida si los paréntesis se cierran en el orden correcto.',
        difficulty: Dificultad.MEDIO,
        category: Categoria.ALGORITMOS,
        experience_reward: 100,
        example_output: 'Input: "()[]{}"\nOutput: true\n\nInput: "([)]"\nOutput: false',
        tags: ['stack', 'strings'],
        variants: [
            {
                language: 'javascript',
                starter_code: 'function parentesisValidos(s) {\n  // Tu código aquí\n  return false;\n}',
                solution_code: 'function parentesisValidos(s) {\n  const pila = [];\n  const par = { \')\': \'(\', \']\': \'[\', \'}\': \'{\' };\n  for (const c of s) {\n    if (\'([{\'.includes(c)) pila.push(c);\n    else if (pila.pop() !== par[c]) return false;\n  }\n  return pila.length === 0;\n}',
                test_code: `try {
  if (parentesisValidos("()") !== true) throw 'Simple ()';
  if (parentesisValidos("()[]{}") !== true) throw 'Multiples tipos';
  if (parentesisValidos("(]") !== false) throw 'Mal cerrado (]';
  if (parentesisValidos("([)]") !== false) throw 'Cruzados';
  if (parentesisValidos("{[]}") !== true) throw 'Anidado';
  console.log('SUCCESS_TOKEN');
} catch (e) {
  console.log('FAILED_TOKEN: ' + e);
}`,
            },
            {
                language: 'python',
                starter_code: 'def parentesis_validos(s):\n    # Tu código aquí\n    return False',
                solution_code: 'def parentesis_validos(s):\n    pila = []\n    par = {")": "(", "]": "[", "}": "{"}\n    for c in s:\n        if c in "([{":\n            pila.append(c)\n        elif not pila or pila.pop() != par[c]:\n            return False\n    return len(pila) == 0',
                test_code: `try:
    assert parentesis_validos("()") == True, "Simple"
    assert parentesis_validos("()[]{}") == True, "Múltiples"
    assert parentesis_validos("(]") == False, "Mal cerrado"
    assert parentesis_validos("([)]") == False, "Cruzados"
    assert parentesis_validos("{[]}") == True, "Anidado"
    print("SUCCESS_TOKEN")
except Exception as e:
    print(f"FAILED_TOKEN: {e}")`,
            },
        ],
    },
];

// ─────────────────────────────────────────────────────────────────
// Retos avanzados / experto
// ─────────────────────────────────────────────────────────────────
const JAVA_STARTER = `public class Main {
    public static int buscarEnRotado(int[] nums, int target) {
        // Tu código aquí
        return -1;
    }`;

const JAVA_SOLUTION = `public class Main {
    public static int buscarEnRotado(int[] nums, int target) {
        int izq = 0, der = nums.length - 1;
        while (izq <= der) {
            int mid = (izq + der) / 2;
            if (nums[mid] == target) return mid;
            if (nums[izq] <= nums[mid]) {
                if (nums[izq] <= target && target < nums[mid]) der = mid - 1;
                else izq = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[der]) izq = mid + 1;
                else der = mid - 1;
            }
        }
        return -1;
    }
    public static void main(String[] args) {}
}`;

const JAVA_TEST = `    public static void main(String[] args) {
        try {
            if (buscarEnRotado(new int[]{4,5,6,7,0,1,2}, 0) != 4)
                throw new Exception("fallo: [4,5,6,7,0,1,2] target=0, esperaba indice 4");
            if (buscarEnRotado(new int[]{4,5,6,7,0,1,2}, 3) != -1)
                throw new Exception("fallo: target 3 no existe, esperaba -1");
            if (buscarEnRotado(new int[]{1}, 0) != -1)
                throw new Exception("fallo: array de un elemento, target ausente");
            if (buscarEnRotado(new int[]{1,3}, 3) != 1)
                throw new Exception("fallo: [1,3] target=3, esperaba indice 1");
            if (buscarEnRotado(new int[]{3,1}, 1) != 1)
                throw new Exception("fallo: [3,1] target=1, esperaba indice 1");
            System.out.println("SUCCESS_TOKEN");
        } catch (Exception e) {
            System.out.println("FAILED_TOKEN: " + e.getMessage());
        }
    }
}`;

const CSHARP_STARTER = `using System;

public class Main {
    public static int ProductoMaximo(int[] nums) {
        // Tu código aquí
        return 0;
    }`;

const CSHARP_SOLUTION = `using System;

public class Main {
    public static int ProductoMaximo(int[] nums) {
        int maxProd = nums[0], minProd = nums[0], resultado = nums[0];
        for (int i = 1; i < nums.Length; i++) {
            if (nums[i] < 0) { int t = maxProd; maxProd = minProd; minProd = t; }
            maxProd = Math.Max(nums[i], maxProd * nums[i]);
            minProd = Math.Min(nums[i], minProd * nums[i]);
            resultado = Math.Max(resultado, maxProd);
        }
        return resultado;
    }
    static void Main() {}
}`;

const CSHARP_TEST = `    static void Main() {
        try {
            if (ProductoMaximo(new int[]{2,3,-2,4}) != 6)
                throw new Exception("fallo: [2,3,-2,4] esperaba 6");
            if (ProductoMaximo(new int[]{-2,0,-1}) != 0)
                throw new Exception("fallo: [-2,0,-1] esperaba 0");
            if (ProductoMaximo(new int[]{-2,3,-4}) != 24)
                throw new Exception("fallo: [-2,3,-4] esperaba 24");
            if (ProductoMaximo(new int[]{2,-5,-2,-4,3}) != 24)
                throw new Exception("fallo: [2,-5,-2,-4,3] esperaba 24");
            if (ProductoMaximo(new int[]{-3}) != -3)
                throw new Exception("fallo: [-3] esperaba -3");
            Console.WriteLine("SUCCESS_TOKEN");
        } catch (Exception e) {
            Console.WriteLine("FAILED_TOKEN: " + e.Message);
        }
    }
}`;

const RETOS_AVANZADOS: RetoSemilla[] = [
    {
        title: 'Búsqueda en Array Rotado',
        description:
            'Un array de enteros sin duplicados fue ordenado ascendentemente y luego rotado en un pivote desconocido. ' +
            'Implementa el método `buscarEnRotado(int[] nums, int target)` que devuelva el índice del target, ' +
            'o -1 si no existe. La solución debe tener complejidad O(log n). ' +
            'No cierres la clase ni escribas el método main: el sistema de tests lo añade automáticamente.',
        difficulty: Dificultad.EXPERTO,
        category: Categoria.ALGORITMOS,
        experience_reward: 300,
        example_output:
            'buscarEnRotado([4,5,6,7,0,1,2], 0) → 4\n' +
            'buscarEnRotado([4,5,6,7,0,1,2], 3) → -1\n' +
            'buscarEnRotado([3,1], 1)            → 1',
        tags: ['búsqueda-binaria', 'arrays', 'java'],
        variants: [{ language: 'java', starter_code: JAVA_STARTER, solution_code: JAVA_SOLUTION, test_code: JAVA_TEST }],
    },
    {
        title: 'Producto Máximo de Subarray',
        description:
            'Dado un array de enteros no vacío (puede contener negativos y ceros), ' +
            'implementa el método `ProductoMaximo(int[] nums)` que devuelva el producto del subarray contiguo ' +
            'con el mayor producto posible. ' +
            'No cierres la clase ni escribas el método Main: el sistema de tests lo añade automáticamente.',
        difficulty: Dificultad.EXPERTO,
        category: Categoria.ALGORITMOS,
        experience_reward: 300,
        example_output:
            'ProductoMaximo([2, 3, -2, 4])     → 6\n' +
            'ProductoMaximo([-2, 3, -4])        → 24\n' +
            'ProductoMaximo([-2, 0, -1])        → 0',
        tags: ['programación-dinámica', 'arrays', 'csharp'],
        variants: [{ language: 'csharp', starter_code: CSHARP_STARTER, solution_code: CSHARP_SOLUTION, test_code: CSHARP_TEST }],
    },
];

// ─────────────────────────────────────────────────────────────────
// Ejecución
// ─────────────────────────────────────────────────────────────────
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

        for (const semilla of [...RETOS_BASICOS, ...RETOS_AVANZADOS]) {
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

        }

        await db.close();
        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error al sembrar retos:', error);
        await db.close().catch(() => {});
        process.exit(1);
    }
}

sembrar();
