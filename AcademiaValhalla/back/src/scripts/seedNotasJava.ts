/**
 * seedNotasJava.ts — Siembra 10 apuntes de comunidad para aprender Java desde cero.
 * Se crean como notas del primer ADMIN con community_status 'approved',
 * de modo que aparecen directamente en la pestaña Comunidad.
 * Ejecutar: npm run seed:notas-java
 */
import { db } from '../config/db.js';
import { NotaUsuario, Usuario } from '../modelos/Modelos.js';
import { RolUsuario, BloqueContenidoNota } from '../types/types.js';

interface NotaSemilla {
    title: string;
    description: string;
    summary: string;
    difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
    tags: string[];
    content: BloqueContenidoNota[];
}

const java = (value: string): BloqueContenidoNota => ({ type: 'code', value, language: 'java' });
const texto = (value: string): BloqueContenidoNota => ({ type: 'text', value });

const NOTAS_JAVA: NotaSemilla[] = [
    {
        title: 'Java 01 — Tu primer programa',
        description: 'Qué es Java, cómo funciona la JVM y tu primer Hola Mundo.',
        summary: 'Introducción a Java: JDK, JVM, compilación y el clásico Hola Mundo explicado línea a línea.',
        difficulty: 'Básico',
        tags: ['java', 'curso-java', 'introducción'],
        content: [
            texto('# ¿Qué es Java?\n\nJava es un lenguaje **compilado e interpretado a la vez**: tu código se compila a *bytecode* y la **JVM** (Java Virtual Machine) lo ejecuta en cualquier sistema operativo. De ahí su lema: *"write once, run anywhere"*.\n\nPara programar necesitas el **JDK** (Java Development Kit), que incluye el compilador `javac` y la JVM.'),
            texto('## Tu primer programa\n\nTodo programa Java vive dentro de una **clase**, y la ejecución siempre empieza en el método `main`:'),
            java('public class HolaMundo {\n    public static void main(String[] args) {\n        System.out.println("¡Hola, Valhalla!");\n    }\n}'),
            texto('## Línea a línea\n\n- `public class HolaMundo` → declara una clase pública. El archivo **debe** llamarse igual: `HolaMundo.java`.\n- `public static void main(String[] args)` → el punto de entrada. La JVM busca exactamente esta firma.\n- `System.out.println(...)` → imprime por consola y salta de línea.\n\n## Compilar y ejecutar\n\n```\njavac HolaMundo.java   → genera HolaMundo.class (bytecode)\njava HolaMundo         → la JVM ejecuta el bytecode\n```\n\n!!Recuerda: cada sentencia termina en punto y coma (;) y las llaves {} delimitan bloques.!!'),
        ],
    },
    {
        title: 'Java 02 — Variables y tipos primitivos',
        description: 'Los 8 tipos primitivos de Java, declaración de variables y conversiones.',
        summary: 'Tipos primitivos (int, double, boolean, char...), declaración de variables, constantes con final y casting.',
        difficulty: 'Básico',
        tags: ['java', 'curso-java', 'variables', 'tipos'],
        content: [
            texto('# Variables y tipos\n\nJava es de **tipado estático**: toda variable declara su tipo y no puede cambiarlo. Hay **8 tipos primitivos**:\n\n- `byte` (8 bits), `short` (16), `int` (32), `long` (64) → enteros\n- `float` (32), `double` (64) → decimales\n- `char` → un único carácter entre comillas simples\n- `boolean` → `true` o `false`'),
            java('int edad = 25;\ndouble precio = 19.99;\nchar inicial = \'A\';\nboolean activo = true;\nlong poblacion = 8_000_000_000L; // sufijo L para long\nfloat pi = 3.14f;                // sufijo f para float\n\n// Constantes: no se pueden reasignar\nfinal int MAX_VIDAS = 3;'),
            texto('## Casting (conversión de tipos)\n\nDe tipo pequeño a grande es **automático** (widening); al revés hay que forzarlo (narrowing) y se puede perder información:'),
            java('int entero = 10;\ndouble decimal = entero;        // automático: 10.0\n\ndouble nota = 8.9;\nint redondeada = (int) nota;    // forzado: 8 (trunca, no redondea)'),
            texto('!!Cuidado: (int) 8.9 da 8, no 9. Para redondear usa Math.round().!!\n\n## String no es primitivo\n\n`String` es una **clase** (por eso va en mayúscula), pero se usa como si fuera un tipo más:\n\n`String nombre = "Odin";`'),
        ],
    },
    {
        title: 'Java 03 — Operadores y Strings',
        description: 'Operadores aritméticos, de comparación y lógicos, y los métodos esenciales de String.',
        summary: 'Operadores de Java y manejo de cadenas: concatenación, equals vs ==, y los métodos de String que usarás a diario.',
        difficulty: 'Básico',
        tags: ['java', 'curso-java', 'strings', 'operadores'],
        content: [
            texto('# Operadores\n\n- Aritméticos: `+ - * / %` (el módulo `%` da el resto)\n- Comparación: `== != < > <= >=`\n- Lógicos: `&&` (y), `||` (o), `!` (no)\n- Incremento: `i++` y `i--`\n\n!!La división entre enteros trunca: 7 / 2 da 3. Para obtener 3.5, al menos un operando debe ser double: 7 / 2.0!!'),
            texto('## Strings: lo esencial\n\nLas cadenas son **inmutables**: cada operación crea una nueva.'),
            java('String saludo = "Hola";\nString nombre = "Freya";\nString frase = saludo + ", " + nombre + "!"; // concatenación\n\nfrase.length();         // 12\nfrase.toUpperCase();    // "HOLA, FREYA!"\nfrase.contains("Freya");// true\nfrase.substring(0, 4);  // "Hola"\nfrase.replace("a", "o");// "Holo, Freyo!"\nfrase.trim();           // quita espacios de los extremos\nfrase.split(", ");      // ["Hola", "Freya!"]'),
            texto('## equals vs ==\n\nPara comparar el **contenido** de dos Strings usa siempre `equals`. El operador `==` compara referencias de memoria y da sustos:'),
            java('String a = "java";\nString b = new String("java");\n\nSystem.out.println(a == b);      // false (referencias distintas)\nSystem.out.println(a.equals(b)); // true  (mismo contenido)'),
            texto('**Regla de oro:** Strings se comparan con `equals()` (o `equalsIgnoreCase()`), nunca con `==`.'),
        ],
    },
    {
        title: 'Java 04 — Condicionales: if, else y switch',
        description: 'Toma de decisiones con if/else if/else, operador ternario y switch.',
        summary: 'Estructuras condicionales en Java: if-else, operador ternario y el switch clásico y mejorado (flecha).',
        difficulty: 'Básico',
        tags: ['java', 'curso-java', 'condicionales'],
        content: [
            texto('# if / else if / else\n\nLa estructura de decisión básica. La condición siempre va entre paréntesis y debe ser un `boolean`:'),
            java('int nota = 7;\n\nif (nota >= 9) {\n    System.out.println("Sobresaliente");\n} else if (nota >= 5) {\n    System.out.println("Aprobado");\n} else {\n    System.out.println("Suspenso");\n}'),
            texto('## Operador ternario\n\nUn if-else compacto para asignaciones: `condicion ? valorSiTrue : valorSiFalse`'),
            java('int edad = 20;\nString acceso = (edad >= 18) ? "Adulto" : "Menor";'),
            texto('## switch\n\nIdeal cuando comparas una variable contra varios valores concretos. No olvides el `break` en la sintaxis clásica:'),
            java('int dia = 3;\n\n// Sintaxis clásica\nswitch (dia) {\n    case 1: System.out.println("Lunes"); break;\n    case 2: System.out.println("Martes"); break;\n    case 3: System.out.println("Miércoles"); break;\n    default: System.out.println("Otro día");\n}\n\n// Sintaxis moderna (Java 14+): sin break, más segura\nString nombre = switch (dia) {\n    case 1 -> "Lunes";\n    case 2 -> "Martes";\n    case 3 -> "Miércoles";\n    default -> "Otro día";\n};'),
            texto('!!Si olvidas el break en un switch clásico, la ejecución "cae" al siguiente case (fall-through). Es la fuente de bugs más típica del switch.!!'),
        ],
    },
    {
        title: 'Java 05 — Bucles: for, while y for-each',
        description: 'Repetir código con for, while, do-while y el for mejorado. break y continue.',
        summary: 'Todos los bucles de Java con ejemplos: for clásico, while, do-while, for-each, y control con break/continue.',
        difficulty: 'Básico',
        tags: ['java', 'curso-java', 'bucles'],
        content: [
            texto('# El bucle for\n\nPerfecto cuando **sabes cuántas veces** quieres repetir. Tres partes: inicialización; condición; actualización.'),
            java('for (int i = 1; i <= 5; i++) {\n    System.out.println("Vuelta " + i);\n}\n// Vuelta 1, Vuelta 2, ... Vuelta 5'),
            texto('## while y do-while\n\n`while` evalúa la condición **antes** de cada vuelta; `do-while` la evalúa **después**, así que ejecuta el cuerpo al menos una vez.'),
            java('int vidas = 3;\nwhile (vidas > 0) {\n    System.out.println("Te quedan " + vidas + " vidas");\n    vidas--;\n}\n\nint intento;\ndo {\n    intento = (int) (Math.random() * 10);\n    System.out.println("Probando: " + intento);\n} while (intento != 7);'),
            texto('## for-each\n\nPara recorrer arrays y colecciones sin índices:'),
            java('String[] guerreros = {"Thor", "Freya", "Loki"};\nfor (String g : guerreros) {\n    System.out.println(g);\n}'),
            texto('## break y continue\n\n- `break` → sale del bucle inmediatamente.\n- `continue` → salta a la siguiente vuelta.'),
            java('for (int i = 1; i <= 10; i++) {\n    if (i % 2 == 0) continue; // salta los pares\n    if (i > 7) break;         // corta en el 9\n    System.out.println(i);    // imprime 1, 3, 5, 7\n}'),
        ],
    },
    {
        title: 'Java 06 — Arrays y ArrayList',
        description: 'Colecciones básicas: arrays de tamaño fijo y listas dinámicas con ArrayList.',
        summary: 'Diferencias entre array y ArrayList, operaciones típicas (añadir, recorrer, buscar) y cuándo usar cada uno.',
        difficulty: 'Básico',
        tags: ['java', 'curso-java', 'arrays', 'colecciones'],
        content: [
            texto('# Arrays: tamaño fijo\n\nUn array guarda elementos **del mismo tipo** y su tamaño **no puede cambiar** una vez creado. Los índices empiezan en 0.'),
            java('int[] puntos = new int[3];   // [0, 0, 0]\npuntos[0] = 100;\npuntos[2] = 50;\n\nString[] dias = {"lunes", "martes", "miércoles"};\nSystem.out.println(dias.length);  // 3\nSystem.out.println(dias[1]);      // "martes"\n\n// Recorrido clásico\nfor (int i = 0; i < dias.length; i++) {\n    System.out.println(i + ": " + dias[i]);\n}'),
            texto('!!Acceder a un índice que no existe lanza ArrayIndexOutOfBoundsException. El último índice válido es length - 1.!!\n\n## ArrayList: tamaño dinámico\n\nCuando no sabes cuántos elementos tendrás, usa `ArrayList`. Solo acepta **objetos**, así que para números se usan los wrappers (`Integer`, `Double`...):'),
            java('import java.util.ArrayList;\n\nArrayList<String> inventario = new ArrayList<>();\ninventario.add("espada");        // añadir\ninventario.add("escudo");\ninventario.get(0);               // "espada"\ninventario.size();               // 2\ninventario.contains("escudo");   // true\ninventario.remove("espada");     // eliminar por valor\ninventario.set(0, "hacha");      // reemplazar\n\nfor (String item : inventario) {\n    System.out.println(item);\n}'),
            texto('## ¿Cuál uso?\n\n- **Array** → tamaño conocido y fijo, máximo rendimiento.\n- **ArrayList** → tamaño variable, API cómoda (`add`, `remove`, `contains`).\n\nEn la práctica, `ArrayList` es lo habitual en código de aplicación.'),
        ],
    },
    {
        title: 'Java 07 — Métodos',
        description: 'Definir y llamar métodos: parámetros, retorno, sobrecarga y ámbito de variables.',
        summary: 'Anatomía de un método en Java, paso de parámetros, valores de retorno, sobrecarga y scope.',
        difficulty: 'Intermedio',
        tags: ['java', 'curso-java', 'métodos', 'funciones'],
        content: [
            texto('# Anatomía de un método\n\n`modificador tipoRetorno nombre(parámetros) { cuerpo }`\n\nSi el método no devuelve nada, el tipo de retorno es `void`.'),
            java('public class Calculadora {\n\n    // Devuelve un int y recibe dos parámetros\n    public static int sumar(int a, int b) {\n        return a + b;\n    }\n\n    // void: no devuelve nada\n    public static void saludar(String nombre) {\n        System.out.println("Hola, " + nombre);\n    }\n\n    public static void main(String[] args) {\n        int resultado = sumar(3, 4);  // 7\n        saludar("Tyr");\n    }\n}'),
            texto('## Sobrecarga (overloading)\n\nPuedes tener **varios métodos con el mismo nombre** si sus parámetros son distintos. Java elige cuál llamar según los argumentos:'),
            java('public static int sumar(int a, int b)        { return a + b; }\npublic static double sumar(double a, double b) { return a + b; }\npublic static int sumar(int a, int b, int c)  { return a + b + c; }\n\nsumar(2, 3);       // llama a la 1ª → 5\nsumar(2.5, 3.5);   // llama a la 2ª → 6.0\nsumar(1, 2, 3);    // llama a la 3ª → 6'),
            texto('## Ámbito (scope)\n\nUna variable declarada dentro de un método **solo existe ahí**. Los parámetros primitivos se pasan **por valor**: el método recibe una copia y no puede modificar la variable original.\n\n**Buenas prácticas:**\n- Un método = una responsabilidad.\n- Nombres en verbo: `calcularTotal`, `enviarCorreo`.\n- Si pasa de ~20 líneas, plantéate dividirlo.'),
        ],
    },
    {
        title: 'Java 08 — POO: clases y objetos',
        description: 'El corazón de Java: clases, objetos, atributos, constructores y encapsulación.',
        summary: 'Programación orientada a objetos desde cero: cómo definir clases, crear objetos, constructores, getters/setters y encapsulación.',
        difficulty: 'Intermedio',
        tags: ['java', 'curso-java', 'poo', 'clases'],
        content: [
            texto('# Clases y objetos\n\nUna **clase** es el plano; un **objeto** es cada cosa construida a partir de ese plano. La clase define **atributos** (estado) y **métodos** (comportamiento).'),
            java('public class Guerrero {\n    // Atributos (privados: encapsulación)\n    private String nombre;\n    private int vida;\n\n    // Constructor: se ejecuta al crear el objeto\n    public Guerrero(String nombre, int vida) {\n        this.nombre = nombre;\n        this.vida = vida;\n    }\n\n    // Métodos\n    public void atacar() {\n        System.out.println(nombre + " ataca con furia");\n    }\n\n    public void recibirDanio(int puntos) {\n        vida = Math.max(0, vida - puntos);\n    }\n\n    // Getter y setter\n    public int getVida() { return vida; }\n    public String getNombre() { return nombre; }\n}'),
            java('// Crear y usar objetos\nGuerrero thor = new Guerrero("Thor", 100);\nGuerrero loki = new Guerrero("Loki", 80);\n\nthor.atacar();             // "Thor ataca con furia"\nloki.recibirDanio(30);\nSystem.out.println(loki.getVida()); // 50'),
            texto('## Conceptos clave\n\n- `this` → se refiere al objeto actual; distingue el atributo `this.nombre` del parámetro `nombre`.\n- **Encapsulación** → atributos `private` + getters/setters `public`. Así controlas cómo se lee y modifica el estado.\n- **Constructor** → mismo nombre que la clase, sin tipo de retorno. Si no escribes ninguno, Java crea uno vacío por defecto.\n\n!!Cada objeto tiene su propia copia de los atributos: thor y loki tienen vidas independientes.!!'),
        ],
    },
    {
        title: 'Java 09 — Herencia y polimorfismo',
        description: 'Reutilizar código con extends, sobrescribir métodos con @Override y polimorfismo.',
        summary: 'Herencia con extends, super, sobrescritura de métodos (@Override) y polimorfismo: tratar objetos distintos de forma uniforme.',
        difficulty: 'Intermedio',
        tags: ['java', 'curso-java', 'poo', 'herencia', 'polimorfismo'],
        content: [
            texto('# Herencia\n\nUna clase puede **heredar** atributos y métodos de otra con `extends`. La hija puede añadir cosas nuevas o **sobrescribir** las heredadas.'),
            java('public class Animal {\n    protected String nombre;\n\n    public Animal(String nombre) {\n        this.nombre = nombre;\n    }\n\n    public void hacerSonido() {\n        System.out.println(nombre + " hace un sonido");\n    }\n}\n\npublic class Perro extends Animal {\n    public Perro(String nombre) {\n        super(nombre); // llama al constructor del padre\n    }\n\n    @Override\n    public void hacerSonido() {\n        System.out.println(nombre + " dice: ¡Guau!");\n    }\n}\n\npublic class Gato extends Animal {\n    public Gato(String nombre) {\n        super(nombre);\n    }\n\n    @Override\n    public void hacerSonido() {\n        System.out.println(nombre + " dice: Miau");\n    }\n}'),
            texto('## Polimorfismo\n\nLa misma llamada se comporta distinto según el objeto real. Puedes tratar a todos como `Animal`:'),
            java('Animal[] animales = { new Perro("Fenrir"), new Gato("Freyja") };\n\nfor (Animal a : animales) {\n    a.hacerSonido();\n}\n// Fenrir dice: ¡Guau!\n// Freyja dice: Miau'),
            texto('## Claves\n\n- `super(...)` → llama al constructor del padre; debe ser la **primera línea** del constructor hijo.\n- `@Override` → anotación que avisa al compilador de que sobrescribes; si te equivocas en la firma, da error en vez de fallar en silencio.\n- `protected` → visible para la clase y sus hijas.\n- Java solo permite **herencia simple**: una clase solo puede extender de una.\n\n!!Herencia es "es un": Perro ES UN Animal. Si la relación es "tiene un", usa composición (un atributo).!!'),
        ],
    },
    {
        title: 'Java 10 — Interfaces y excepciones',
        description: 'Contratos con interface/implements y manejo de errores con try-catch-finally.',
        summary: 'Interfaces como contratos, diferencia con clases abstractas, y manejo de excepciones: try, catch, finally y throw.',
        difficulty: 'Intermedio',
        tags: ['java', 'curso-java', 'interfaces', 'excepciones'],
        content: [
            texto('# Interfaces\n\nUna **interfaz** es un contrato: define **qué** métodos debe tener una clase, sin implementarlos. Una clase puede implementar **varias** interfaces (a diferencia de la herencia).'),
            java('public interface Volador {\n    void volar(); // implícitamente public y abstract\n}\n\npublic interface Nadador {\n    void nadar();\n}\n\n// Un pato vuela Y nada\npublic class Pato implements Volador, Nadador {\n    @Override\n    public void volar() {\n        System.out.println("El pato vuela bajo");\n    }\n\n    @Override\n    public void nadar() {\n        System.out.println("El pato nada en el lago");\n    }\n}'),
            texto('## Excepciones\n\nCuando algo falla en tiempo de ejecución, Java lanza una **excepción**. Si nadie la captura, el programa muere. Se manejan con `try-catch`:'),
            java('try {\n    int[] nums = {1, 2, 3};\n    System.out.println(nums[10]);      // ¡boom!\n} catch (ArrayIndexOutOfBoundsException e) {\n    System.out.println("Índice fuera de rango: " + e.getMessage());\n} catch (Exception e) {\n    System.out.println("Error genérico");  // red de seguridad\n} finally {\n    System.out.println("Esto se ejecuta SIEMPRE");\n}'),
            texto('## Lanzar tus propias excepciones'),
            java('public void retirar(double cantidad) {\n    if (cantidad > saldo) {\n        throw new IllegalArgumentException("Saldo insuficiente");\n    }\n    saldo -= cantidad;\n}'),
            texto('## Claves\n\n- `try` → código que puede fallar. `catch` → qué hacer si falla. `finally` → limpieza que se ejecuta siempre (cerrar ficheros, conexiones...).\n- Captura primero las excepciones **más específicas** y luego las genéricas.\n- `throw` lanza; `throws` en la firma declara que el método puede lanzar una excepción *checked*.\n\n¡Enhorabuena! Con estos 10 apuntes ya tienes la base completa de Java. El siguiente paso: practicar con las misiones de la academia. 🚀'),
        ],
    },
];

async function sembrar() {
    try {
        await db.authenticate();

        const admin = await Usuario.findOne({ where: { role: RolUsuario.ADMIN } });
        if (!admin) {
            console.error('✗ No hay ningún usuario ADMIN. Ejecuta antes "npm run seed:admins".');
            process.exit(1);
        }

        let creadas = 0;
        for (const semilla of NOTAS_JAVA) {
            const existente = await NotaUsuario.findOne({ where: { title: semilla.title } });
            if (existente) {
                continue;
            }

            await NotaUsuario.create({
                user_id: admin.user_id,
                title: semilla.title,
                description: semilla.description,
                summary: semilla.summary,
                language: 'java',
                tags: semilla.tags,
                difficulty: semilla.difficulty,
                content: semilla.content,
                community_status: 'approved',
            } as any);

            creadas++;
        }

        console.log(`✓ Apuntes de Java sembrados: ${creadas} nuevos de ${NOTAS_JAVA.length} totales.`);
        await db.close();
        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error al sembrar apuntes de Java:', error);
        await db.close().catch(() => {});
        process.exit(1);
    }
}

sembrar();
