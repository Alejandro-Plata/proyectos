window.DB = {
  "meta": {
    "titulacion": "Grado en Ingeniería Informática en Tecnologías de la Información (GIITI)",
    "centro": "Centro Universitario de Mérida – Universidad de Extremadura",
    "curso_academico": "2025/2026",
    "plan": "1514",
    "total_asignaturas": 25,
    "restriccion_usuario": "Puede asistir a las sesiones PRÁCTICAS (laboratorio/seminarios/tutorías ECTS) pero NO a las clases de teoría (Grupo Grande). La valoración prioriza esta situación.",
    "leyenda_compensa": {
      "global": "Conviene la evaluación global (examen final). La continua exige asistir a las CLASES DE TEORÍA (que no puedes cumplir), normalmente con un límite de faltas, o los trabajos se hacen dentro de la clase de teoría.",
      "continua": "Conviene la evaluación continua: las prácticas de laboratorio (a las que SÍ puedes acudir) y/o las entregas bajan mucho el peso del examen.",
      "indiferente": "Ambas vías son viables y de peso similar; eliges según comodidad."
    }
  },
  "asignaturas": [
    {
      "codigo": "501422",
      "nombre": "Álgebra Lineal",
      "nombre_en": "Linear Algebra",
      "curso": 1,
      "semestre": 1,
      "caracter": "Básica",
      "ects": 6,
      "modulo": "Formación Básica",
      "materia": "Matemáticas",
      "area": "Matemática Aplicada",
      "profesores": [
        "Jose Diamantino Hernández Guillén"
      ],
      "descripcion": "Álgebra lineal y Geometría.",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Matrices y Determinantes",
          "descripcion": "Operaciones y tipos de matrices, rango, determinantes y matrices regulares. Software matemático."
        },
        {
          "unidad": 2,
          "nombre": "Sistemas de Ecuaciones Lineales",
          "descripcion": "Clasificación, Rouché-Frobenius, Cramer, método de Gauss y sistemas homogéneos."
        },
        {
          "unidad": 3,
          "nombre": "Espacio Vectorial",
          "descripcion": "Subespacios, dependencia/independencia lineal, bases y cambio de base."
        },
        {
          "unidad": 4,
          "nombre": "Aplicaciones Lineales",
          "descripcion": "Matriz asociada, núcleo e imagen y clasificación."
        },
        {
          "unidad": 5,
          "nombre": "Diagonalización",
          "descripcion": "Autovalores, autovectores, polinomio característico y diagonalización."
        },
        {
          "unidad": 6,
          "nombre": "Espacio Vectorial Euclídeo",
          "descripcion": "Producto escalar, matriz de Gram, normas, ángulos, distancias y ortogonalidad."
        }
      ],
      "practicas_seminarios": "Prácticas con software matemático integradas en los temas (cálculo de determinantes, resolución de sistemas, autovalores, normas).",
      "evaluacion_continua": {
        "resumen": "Examen final escrito 70% (mín. 4/10) + actividades de evaluación continua 30% (recuperables).",
        "componentes": [
          {
            "nombre": "Examen final escrito",
            "peso": 70,
            "nota_minima": 4,
            "recuperable": true
          },
          {
            "nombre": "Actividades (posibles parciales, cuestionarios, ejercicios)",
            "peso": 30,
            "recuperable": true
          }
        ]
      },
      "examenes_parciales": "Las actividades de continua pueden incluir exámenes parciales teórico/prácticos, a criterio del profesor.",
      "asistencia_obligatoria": {
        "obligatoria": false,
        "detalle": "No se exige asistencia; las actividades de continua pueden realizarse de forma flexible."
      },
      "evaluacion_global": {
        "resumen": "Un único examen final escrito teórico-práctico (100%). Aprueba con 5/10.",
        "componentes": [
          {
            "nombre": "Examen final escrito",
            "peso": 100
          }
        ]
      },
      "criterios_evaluacion": "Conocimientos teórico-prácticos de álgebra lineal. Se aprueba con 5/10 en cualquier convocatoria.",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Media-alta (matemática abstracta)",
        "tiempo": "Alto",
        "razon": "Sin laboratorio que bloquee y con un 30% de actividades recuperables que rebajan la presión del examen, la continua es la mejor opción. No depende de asistir a teoría."
      }
    },
    {
      "codigo": "501424",
      "nombre": "Física",
      "nombre_en": "Physics",
      "curso": 1,
      "semestre": 1,
      "caracter": "Básica",
      "ects": 6,
      "modulo": "Formación Básica",
      "materia": "Física",
      "area": "Física Aplicada",
      "profesores": [
        "Mª del Pilar Rubio Montero",
        "José Ángel Corbacho Merino"
      ],
      "descripcion": "Mecánica, termodinámica, campos y ondas electromagnéticos, corriente y circuitos eléctricos de corriente continua.",
      "temario": [
        {
          "unidad": 0,
          "nombre": "Introducción a la teoría de campos",
          "descripcion": "Álgebra vectorial y teoría elemental de campos."
        },
        {
          "unidad": 1,
          "nombre": "Introducción a la mecánica y termodinámica",
          "descripcion": "Conceptos básicos y relación con electricidad y magnetismo."
        },
        {
          "unidad": 2,
          "nombre": "Campo eléctrico en el vacío",
          "descripcion": "Carga, ley de Coulomb, flujo, teorema de Gauss y potencial eléctrico."
        },
        {
          "unidad": 3,
          "nombre": "Campo eléctrico en medios materiales",
          "descripcion": "Conductores, capacidad, condensadores, dieléctricos y polarización."
        },
        {
          "unidad": 4,
          "nombre": "Corriente eléctrica",
          "descripcion": "Ley de Ohm, resistencias, efecto Joule y fuerza electromotriz."
        },
        {
          "unidad": 5,
          "nombre": "Propiedades magnéticas de la materia",
          "descripcion": "Fuerza magnética, inducción, imanación e histéresis."
        },
        {
          "unidad": 6,
          "nombre": "Campos electromagnéticos y ondas",
          "descripcion": "Ecuaciones de Maxwell, ondas EM y vector de Poynting."
        },
        {
          "unidad": 7,
          "nombre": "Análisis de redes",
          "descripcion": "Leyes de Kirchhoff, mallas, nudos, Thévenin y Norton."
        }
      ],
      "practicas_seminarios": "Prácticas de laboratorio (2 sesiones introductorias + 4 de laboratorio) con asistencia OBLIGATORIA y memorias por práctica.",
      "evaluacion_continua": {
        "resumen": "2 exámenes parciales eliminatorios 65% + prácticas de laboratorio 20% (asistencia obligatoria) + seguimiento 15% (test + asistencia).",
        "componentes": [
          {
            "nombre": "Exámenes parciales eliminatorios (Parcial 1: T2,3,5,6 / Parcial 2: T4,7)",
            "peso": 65,
            "recuperable": false,
            "nota_minima": 5,
            "nota": "Eliminatorios todo el curso si ≥5. NO recuperables en extraordinaria (se recuperan vía examen final)."
          },
          {
            "nombre": "Trabajos dirigidos: prácticas de laboratorio (memorias + test)",
            "peso": 20,
            "recuperable": true,
            "nota": "Asistencia obligatoria; 2 faltas no justificadas = inasistencia. 2 memorias no entregadas = pierde toda la puntuación."
          },
          {
            "nombre": "Seguimiento (test 1 pto + asistencia 0,5 pto)",
            "peso": 15
          }
        ]
      },
      "examenes_parciales": "SÍ. Dos parciales eliminatorios (32,5% cada uno).",
      "asistencia_obligatoria": {
        "obligatoria": true,
        "detalle": "Asistencia obligatoria a las prácticas de laboratorio; parte de seguimiento valora asistencia al 75% de clases."
      },
      "evaluacion_global": {
        "resumen": "Itinerario 2: examen único de certificación (100%) con Parte 1 (teoría/problemas) y Parte 2 (prueba sustitutoria de prácticas + test de prácticas).",
        "componentes": [
          {
            "nombre": "Examen único (teoría/problemas + prueba de prácticas)",
            "peso": 100
          }
        ]
      },
      "criterios_evaluacion": "Resolución de problemas claramente explicada. La global incluye prueba que sustituye al trabajo de laboratorio.",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Alta (física no trivial para informática)",
        "tiempo": "Alto",
        "razon": "Como SÍ puedes asistir a las prácticas, el 20% de laboratorio deja de ser un problema y los parciales eliminatorios (65%) reparten la carga frente a un único examen global. Solo pierdes ~0,5 pto de asistencia a teoría en el seguimiento. Sigue siendo dura: prepárala con tiempo."
      }
    },
    {
      "codigo": "501429",
      "nombre": "Estructuras de Datos y de la Información",
      "nombre_en": "Data Structures and Information",
      "curso": 1,
      "semestre": 2,
      "caracter": "Básica/Obligatoria",
      "ects": 6,
      "modulo": "Formación Básica",
      "materia": "Informática",
      "area": "Lenguajes y Sistemas Informáticos",
      "profesores": [
        "Luis J. Arévalo Rosado"
      ],
      "descripcion": "Programación Orientada a Objetos, estructuras de datos lineales y complejas e introducción a la Ingeniería del Software (en Java).",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Programación Orientada a Objetos",
          "descripcion": "Introducción a la IS, TADs, conceptos OO, herencia y polimorfismo."
        },
        {
          "unidad": 2,
          "nombre": "Complejidad",
          "descripcion": "Conceptos fundamentales y complejidad de algoritmos de ordenación y búsqueda."
        },
        {
          "unidad": 3,
          "nombre": "TADs lineales",
          "descripcion": "Pilas, colas y listas (implementación estática y dinámica), API de colecciones Java."
        },
        {
          "unidad": 4,
          "nombre": "TADs funcionales",
          "descripcion": "Conjuntos, diccionarios y tablas de dispersión."
        },
        {
          "unidad": 5,
          "nombre": "TADs no lineales",
          "descripcion": "Árboles AVL e introducción a grafos."
        }
      ],
      "practicas_seminarios": "15 prácticas en Java (arrays, OO, herencia, interfaces, TADs lineales/funcionales/árbol) + examen de práctica.",
      "evaluacion_continua": {
        "resumen": "Actividades GG 10% + Actividades de laboratorio 15% + Entregas de laboratorio (PL) 30% + Examen final 45% (mín. 5).",
        "componentes": [
          {
            "nombre": "Actividades de Grupo Grande (AG)",
            "peso": 10,
            "recuperable": true
          },
          {
            "nombre": "Actividades de laboratorio (AL)",
            "peso": 15,
            "recuperable": true,
            "nota": "Presenciales o virtuales; penalización 40% por entrega tardía."
          },
          {
            "nombre": "Entregas de Laboratorio (PL)",
            "peso": 30,
            "recuperable": true,
            "nota_minima": 5,
            "nota": "Hay que aprobar PL y el examen de autoría."
          },
          {
            "nombre": "Examen final (EF)",
            "peso": 45,
            "nota_minima": 5,
            "recuperable": true
          }
        ]
      },
      "examenes_parciales": "No hay parciales eliminatorios; un examen final.",
      "asistencia_obligatoria": {
        "obligatoria": false,
        "detalle": "Entregas presenciales o virtuales; no se exige porcentaje de asistencia."
      },
      "evaluacion_global": {
        "resumen": "Entregas de Laboratorio (PL) 40% + Examen final 60% (mín. 5).",
        "componentes": [
          {
            "nombre": "Entregas de Laboratorio (PL)",
            "peso": 40,
            "nota": "La práctica final debe funcionar + examen de autoría."
          },
          {
            "nombre": "Examen final (EF)",
            "peso": 60,
            "nota_minima": 5
          }
        ]
      },
      "criterios_evaluacion": "Aprobar la parte práctica (PL) y el examen (≥5). Las entregas pueden ser virtuales.",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Media (programación Java base)",
        "tiempo": "Medio-alto",
        "razon": "Las entregas pueden ser virtuales y no exigen asistencia, así que la continua es factible sin ir a clase y reduce el peso del examen al 45% (vs 60% en global). Asignatura troncal de programación: aprobarla pronto sostiene casi todo lo demás."
      }
    },
    {
      "codigo": "501430",
      "nombre": "Fundamentos de Computadores",
      "nombre_en": "Computer Foundations",
      "curso": 1,
      "semestre": 2,
      "caracter": "Básica",
      "ects": 6,
      "modulo": "Formación Básica",
      "materia": "Informática",
      "area": "Arquitectura y Tecnología de Computadores",
      "profesores": [
        "Francisco Fernández de Vega",
        "Raúl Lérida Cintas"
      ],
      "descripcion": "Funcionamiento del computador, módulos e interconexión, jerarquía de memoria y principios de los sistemas operativos. Ensamblador (CODE-2 y x86-64 NASM).",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Introducción",
          "descripcion": "Concepto de computador, máquina de Von Neumann y clasificación."
        },
        {
          "unidad": 2,
          "nombre": "Representación de la información",
          "descripcion": "Sistemas de numeración, códigos y detección de errores."
        },
        {
          "unidad": 3,
          "nombre": "Transferencias en la ruta de datos",
          "descripcion": "ALU, unidad de control y arquitecturas RISC."
        },
        {
          "unidad": 4,
          "nombre": "El procesador",
          "descripcion": "Memoria de control, microprogramación y microinstrucciones."
        },
        {
          "unidad": 5,
          "nombre": "Instrucciones y direccionamientos",
          "descripcion": "Ejecución de instrucciones, interrupciones y estructuras básicas."
        },
        {
          "unidad": 6,
          "nombre": "La memoria",
          "descripcion": "Jerarquía, memoria principal, caché, secundaria y virtual."
        },
        {
          "unidad": 7,
          "nombre": "Entrada/Salida",
          "descripcion": "Controladores, E/S programada, interrupciones y periféricos."
        }
      ],
      "practicas_seminarios": "Laboratorio de ensamblador: CODE-2 y programación x86-64 con NASM (transferencia, aritmética, lógica, control de flujo, llamadas al sistema/BIOS).",
      "evaluacion_continua": {
        "resumen": "Examen de teoría 50% (mín. 5) + Seminario/Laboratorio 50% (valoración continua de ejercicios en clase, mín. 5).",
        "componentes": [
          {
            "nombre": "Examen (teoría)",
            "peso": 50,
            "nota_minima": 5,
            "recuperable": true
          },
          {
            "nombre": "Seminario/Laboratorio",
            "peso": 50,
            "nota_minima": 5,
            "recuperable": true,
            "nota": "Media ponderada de los ejercicios valorados en las clases de prácticas."
          }
        ]
      },
      "examenes_parciales": "No.",
      "asistencia_obligatoria": {
        "obligatoria": true,
        "detalle": "La parte práctica de continua se basa en la valoración de ejercicios realizados en las clases de prácticas (presencial)."
      },
      "evaluacion_global": {
        "resumen": "Examen de teoría 50% (mín. 5) + examen práctico de Seminario/Laboratorio 50%. Misma nota máxima (10).",
        "componentes": [
          {
            "nombre": "Examen (teoría)",
            "peso": 50,
            "nota_minima": 5
          },
          {
            "nombre": "Examen práctico de laboratorio",
            "peso": 50
          }
        ]
      },
      "criterios_evaluacion": "Aprobar teoría y prácticas por separado (≥5).",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Media-alta (ensamblador)",
        "tiempo": "Medio-alto",
        "razon": "La parte práctica (50%) se valora con los ejercicios hechos en el laboratorio, al que sí puedes acudir, así que la continua es viable y más llevadera que el examen práctico de la global. Domina NASM."
      }
    },
    {
      "codigo": "501431",
      "nombre": "Fundamentos de Electrónica",
      "nombre_en": "Fundamentals of Electronics",
      "curso": 1,
      "semestre": 2,
      "caracter": "Básica",
      "ects": 6,
      "modulo": "Formación Básica",
      "materia": "Física / Electrónica",
      "area": "Electrónica",
      "profesores": [
        "Antonio García Manso"
      ],
      "descripcion": "Fundamentos de teoría de circuitos (CC y CA), amplificación y realimentación, amplificadores operacionales y aplicaciones.",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Conceptos básicos de electrónica",
          "descripcion": "Señales, sistemas electrónicos y respuesta en frecuencia."
        },
        {
          "unidad": 2,
          "nombre": "Amplificación",
          "descripcion": "Amplificador ideal, modelos lineales, amplificadores con transistores y realimentados."
        },
        {
          "unidad": 3,
          "nombre": "El amplificador operacional",
          "descripcion": "OPAMPs ideales y reales, circuitos básicos (LM741C)."
        },
        {
          "unidad": 4,
          "nombre": "Generadores de señal",
          "descripcion": "Osciladores sinusoidales y generadores de ondas cuadradas/triangulares."
        },
        {
          "unidad": 5,
          "nombre": "Filtros activos",
          "descripcion": "Filtros activos de primer, segundo y orden superior."
        }
      ],
      "practicas_seminarios": "10 prácticas de simulación (LTSpice, CircuitJS1) y montaje de circuitos en el Laboratorio de Electrónica (2 h cada una).",
      "evaluacion_continua": {
        "resumen": "C (cuestionarios + asistencia) 30% + Laboratorio 20% + Test teórico 20% + Problemas 30%. Nota mínima 3 en cada prueba (salvo C).",
        "componentes": [
          {
            "nombre": "Calificación C (asistencia 20% del 30% + cuestionarios)",
            "peso": 30,
            "recuperable": false
          },
          {
            "nombre": "Laboratorio (examen de montaje/simulación)",
            "peso": 20,
            "nota_minima": 3
          },
          {
            "nombre": "Test teórico",
            "peso": 20,
            "nota_minima": 3
          },
          {
            "nombre": "Problemas",
            "peso": 30,
            "nota_minima": 3
          }
        ]
      },
      "examenes_parciales": "No eliminatorios; pruebas de test, problemas y laboratorio en el periodo de exámenes.",
      "asistencia_obligatoria": {
        "obligatoria": true,
        "detalle": "Parte de la nota C (20% de ese 30%) es asistencia con controles en días aleatorios; no recuperable."
      },
      "evaluacion_global": {
        "resumen": "Examen final dividido en teoría y problemas (70%) + práctica de laboratorio o simulación (30%).",
        "componentes": [
          {
            "nombre": "Examen teoría + problemas",
            "peso": 70
          },
          {
            "nombre": "Práctica de laboratorio o simulación",
            "peso": 30
          }
        ]
      },
      "criterios_evaluacion": "No superar la nota mínima en alguna prueba implica suspenso (acta máx. 4).",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Alta (electrónica, ajena al perfil informático)",
        "tiempo": "Alto",
        "razon": "Puedes asistir al laboratorio, así que la continua (laboratorio + test + problemas) es viable; solo pierdes ~6% de la nota de asistencia a clases de teoría. Asignatura dura y ajena al perfil: reserva tiempo extra."
      }
    },
    {
      "codigo": "501309",
      "nombre": "Metodología y Desarrollo de Programas",
      "nombre_en": "Methodology for Software Development",
      "curso": 2,
      "semestre": 3,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Común a la Rama de Informática",
      "materia": "Programación",
      "area": "Lenguajes y Sistemas Informáticos",
      "profesores": [
        "Luis J. Arévalo Rosado"
      ],
      "descripcion": "Diseño y uso de estructuras de datos avanzadas, lenguajes y paradigmas de programación (Java), análisis y diseño OO con UML, patrones, pruebas y E/S.",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Desarrollo de Software",
          "descripcion": "Metodología, calidad del software, parámetros y ciclo de vida."
        },
        {
          "unidad": 2,
          "nombre": "Análisis y Diseño OO mediante UML",
          "descripcion": "Requisitos, casos de uso, diagramas de secuencia y de clase."
        },
        {
          "unidad": 3,
          "nombre": "Patrones de diseño OO",
          "descripcion": "Patrones de creación, estructurales y de comportamiento."
        },
        {
          "unidad": 4,
          "nombre": "Prueba y Documentación",
          "descripcion": "Verificación, métodos de prueba y documentación del software."
        },
        {
          "unidad": 5,
          "nombre": "Flujos",
          "descripcion": "E/S orientada a bytes y caracteres, serialización y lectura de archivos remotos."
        },
        {
          "unidad": 6,
          "nombre": "Programación Orientada a Eventos",
          "descripcion": "GUIs e interfaces gráficas con JavaFX."
        }
      ],
      "practicas_seminarios": "10 prácticas: POO, relaciones, colecciones, patrones, excepciones, pruebas/documentación, flujos e interfaces gráficas.",
      "evaluacion_continua": {
        "resumen": "Actividades de laboratorio (AS) 15% + Entregas de Laboratorio (PL) 35% + Examen de Certificación 50% (mín. 5).",
        "componentes": [
          {
            "nombre": "Actividades de sesión de laboratorio (AS)",
            "peso": 15,
            "recuperable": true
          },
          {
            "nombre": "Entregas de Laboratorio (PL)",
            "peso": 35,
            "recuperable": true,
            "nota": "Hay que aprobar PL + examen de autoría; penalización por retraso."
          },
          {
            "nombre": "Examen de Certificación (EC)",
            "peso": 50,
            "nota_minima": 5,
            "recuperable": true
          }
        ]
      },
      "examenes_parciales": "No.",
      "asistencia_obligatoria": {
        "obligatoria": false,
        "detalle": "Entregas presenciales o virtuales."
      },
      "evaluacion_global": {
        "resumen": "Entregas de Laboratorio (PL) 40% + Examen final 60% (mín. 5).",
        "componentes": [
          {
            "nombre": "Entregas de Laboratorio (PL)",
            "peso": 40
          },
          {
            "nombre": "Examen final (EF)",
            "peso": 60,
            "nota_minima": 5
          }
        ]
      },
      "criterios_evaluacion": "Aprobar la práctica final y el examen (≥5).",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Media",
        "tiempo": "Medio-alto",
        "razon": "Las entregas admiten formato virtual; la continua baja el examen al 50% (vs 60%) y reparte la carga. Continúa la línea de Estructuras de Datos: conviene encadenarlas."
      }
    },
    {
      "codigo": "501426",
      "nombre": "Fundamentos de Redes",
      "nombre_en": "Networking Fundamentals",
      "curso": 2,
      "semestre": 3,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Común a la Rama de Informática",
      "materia": "Redes",
      "area": "Ingeniería Telemática",
      "profesores": [
        "Miguel Á. Martín Tardío"
      ],
      "descripcion": "Introducción a las redes telemáticas, arquitectura de red, modelo OSI y familia de protocolos TCP/IP.",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Introducción a la comunicación en red",
          "descripcion": "Redes e Internet, ancho de banda y retardos."
        },
        {
          "unidad": 2,
          "nombre": "Normalización de las comunicaciones",
          "descripcion": "Modelo OSI y pila TCP/IP; Wireshark."
        },
        {
          "unidad": 3,
          "nombre": "La capa de aplicación",
          "descripcion": "Cliente-servidor y P2P; DNS y HTTP con Wireshark."
        },
        {
          "unidad": 4,
          "nombre": "La capa de transporte (TCP y UDP)",
          "descripcion": "Servicios de capa, TCP/UDP, netstat."
        },
        {
          "unidad": 5,
          "nombre": "La capa de red (I)",
          "descripcion": "IPv4, direccionamiento y subredes (VLSM)."
        },
        {
          "unidad": 6,
          "nombre": "La capa de red (II)",
          "descripcion": "IPv6, ICMPv6, enrutamiento estático y Packet Tracer."
        },
        {
          "unidad": 7,
          "nombre": "La capa de enlace de datos",
          "descripcion": "Topologías, control de acceso al medio y trama."
        },
        {
          "unidad": 8,
          "nombre": "Introducción a las redes Ethernet",
          "descripcion": "CSMA/CD, ARP, NDP y conmutación LAN."
        },
        {
          "unidad": 9,
          "nombre": "La capa física",
          "descripcion": "Principios y medios de red."
        }
      ],
      "practicas_seminarios": "Prácticas en sala de ordenador (Wireshark, Cisco Packet Tracer) autoevaluadas + cuaderno de prácticas con 2 entregas obligatorias.",
      "evaluacion_continua": {
        "resumen": "Exámenes (2 pruebas eliminatorias) 50% + trabajos dirigidos 30% + asistencia/participación 20%. Asistencia con máx. 3 faltas.",
        "componentes": [
          {
            "nombre": "Exámenes (2 pruebas eliminatorias: teoría ≥4 y prácticas ≥5)",
            "peso": 50,
            "nota_minima": 5,
            "recuperable": true,
            "nota": "No presentarse sin justificar = perder la modalidad continua."
          },
          {
            "nombre": "Trabajos dirigidos (cuaderno + asistencia a 3 tutorías programadas)",
            "peso": 30,
            "recuperable": false
          },
          {
            "nombre": "Asistencia y participación (máx. 3 faltas)",
            "peso": 20,
            "recuperable": false
          }
        ]
      },
      "examenes_parciales": "SÍ. Dos pruebas eliminatorias y obligatorias durante el semestre.",
      "asistencia_obligatoria": {
        "obligatoria": true,
        "detalle": "Asistencia computa 20% y se permiten solo 3 faltas; superarlas hace perder la continua."
      },
      "evaluacion_global": {
        "resumen": "Examen final de teoría 60% (≥5) + examen final de prácticas 40% (cada ejercicio ≥5).",
        "componentes": [
          {
            "nombre": "Examen final de teoría",
            "peso": 60,
            "nota_minima": 5
          },
          {
            "nombre": "Examen final de prácticas",
            "peso": 40,
            "nota_minima": 5
          }
        ]
      },
      "criterios_evaluacion": "Teoría y prácticas se aprueban por separado.",
      "veredicto": {
        "compensa": "global",
        "dificultad": "Media",
        "tiempo": "Medio",
        "razon": "Aunque puedas asistir a las prácticas, el 20% de asistencia de la continua cuenta también las clases de TEORÍA (Grupo Grande) con un máximo de 3 faltas: al no poder ir a teoría perderías la continua. Por eso la global (60% teoría + 40% prácticas) sigue siendo la vía."
      }
    },
    {
      "codigo": "501432",
      "nombre": "Ampliación de Matemáticas",
      "nombre_en": "Advanced Mathematics",
      "curso": 2,
      "semestre": 3,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Formación Básica",
      "materia": "Matemáticas",
      "area": "Matemática Aplicada",
      "profesores": [
        "Daniel Morales González"
      ],
      "descripcion": "Matemática Discreta y Métodos Numéricos.",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Teoría de Grafos",
          "descripcion": "Representación, caminos, grafos eulerianos/hamiltonianos, árboles, mapas y coloraciones."
        },
        {
          "unidad": 2,
          "nombre": "Introducción a la Teoría de Números",
          "descripcion": "Aritmética modular, congruencias y divisibilidad."
        },
        {
          "unidad": 3,
          "nombre": "Métodos Numéricos",
          "descripcion": "Raíces, sistemas lineales/no lineales, interpolación, derivación e integración numérica."
        }
      ],
      "practicas_seminarios": "Prácticas de laboratorio con software matemático (grafos, teoría de números, cálculo numérico). Asistencia obligatoria a laboratorio.",
      "evaluacion_continua": {
        "resumen": "2 exámenes (uno por parte) 70% (mín. 4 cada uno) + asistencia y trabajo de laboratorio 30% (no recuperable).",
        "componentes": [
          {
            "nombre": "Exámenes de las dos partes",
            "peso": 70,
            "nota_minima": 4,
            "recuperable": false,
            "nota": "En el examen final solo se presenta uno a las partes no aprobadas."
          },
          {
            "nombre": "Asistencia y prácticas de laboratorio",
            "peso": 30,
            "recuperable": false
          }
        ]
      },
      "examenes_parciales": "SÍ. Un examen por cada una de las dos partes.",
      "asistencia_obligatoria": {
        "obligatoria": true,
        "detalle": "Cada estudiante debe asistir a las prácticas de laboratorio y entregarlas (30%, no recuperable)."
      },
      "evaluacion_global": {
        "resumen": "Examen final 100%: 7 puntos de teoría/problemas + 3 puntos de casos prácticos con ordenador.",
        "componentes": [
          {
            "nombre": "Examen final (teoría/problemas + casos prácticos con software)",
            "peso": 100
          }
        ]
      },
      "criterios_evaluacion": "En continua, mínimo 4/10 en cada examen de parte. En global, examen único de 10.",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Media-alta",
        "tiempo": "Medio-alto",
        "razon": "El 30% de prácticas de laboratorio ya no es un obstáculo porque puedes asistir; junto con los dos parciales (70%) la continua reparte mejor la carga que el examen único de la global."
      }
    },
    {
      "codigo": "502369",
      "nombre": "Estructura de Computadores",
      "nombre_en": "Computer Structure",
      "curso": 2,
      "semestre": 3,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Común a la Rama de Informática",
      "materia": "Ingeniería de Computadores",
      "area": "Arquitectura y Tecnología de Computadores",
      "profesores": [
        "Javier Plaza Miguel"
      ],
      "descripcion": "Organización y arquitectura del computador, repertorio de instrucciones, rendimiento, jerarquía de memoria y procesamiento paralelo. Ensamblador MIPS.",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Introducción",
          "descripcion": "Arquitectura, ISA, organización y niveles de abstracción."
        },
        {
          "unidad": 2,
          "nombre": "Arquitectura del repertorio de instrucciones",
          "descripcion": "Instrucciones, compiladores, CISC-RISC, VLIW."
        },
        {
          "unidad": 3,
          "nombre": "Rendimiento y Coste",
          "descripcion": "MIPS, MFLOPS, aceleración y coste."
        },
        {
          "unidad": 4,
          "nombre": "El procesador",
          "descripcion": "Ruta de datos, unidad de control monociclo/multiciclo y microprogramación."
        },
        {
          "unidad": 5,
          "nombre": "Procesamiento segmentado",
          "descripcion": "Segmentación, riesgos y diseño del procesador segmentado."
        },
        {
          "unidad": 6,
          "nombre": "Sistema de memoria",
          "descripcion": "Memoria virtual y caché."
        },
        {
          "unidad": 7,
          "nombre": "Procesadores paralelos",
          "descripcion": "Taxonomía de Flynn, multihilo, multinúcleo, GPU y multiprocesadores."
        }
      ],
      "practicas_seminarios": "Programación en ensamblador del simulador MIPS R2000 (instrucciones, memoria, condicionales, bucles, pila).",
      "evaluacion_continua": {
        "resumen": "Examen teoría 55% (mín. 5) + ECTS teoría 5% (no recuperable) + Laboratorio 30% + ECTS prácticas 10% (no recuperable). Teoría y práctica ≥5 por separado.",
        "componentes": [
          {
            "nombre": "Examen de certificación (teoría)",
            "peso": 55,
            "nota_minima": 5,
            "recuperable": true
          },
          {
            "nombre": "ECTS teoría (trabajos tutorías programadas, asistencia obligatoria)",
            "peso": 5,
            "recuperable": false
          },
          {
            "nombre": "Seminario/Laboratorio",
            "peso": 30,
            "recuperable": true
          },
          {
            "nombre": "ECTS prácticas (tutorías programadas)",
            "peso": 10,
            "recuperable": false
          }
        ]
      },
      "examenes_parciales": "No.",
      "asistencia_obligatoria": {
        "obligatoria": true,
        "detalle": "Las tutorías programadas (ECTS, 15% total) son de asistencia obligatoria y no recuperables."
      },
      "evaluacion_global": {
        "resumen": "Examen teoría 60% (mín. 5) + examen práctico de laboratorio 40% (mín. 5). Sin componentes de asistencia.",
        "componentes": [
          {
            "nombre": "Examen (teoría)",
            "peso": 60,
            "nota_minima": 5
          },
          {
            "nombre": "Examen práctico de laboratorio",
            "peso": 40,
            "nota_minima": 5
          }
        ]
      },
      "criterios_evaluacion": "Aprobar teoría y práctica por separado (≥5).",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Media-alta (ensamblador MIPS)",
        "tiempo": "Medio-alto",
        "razon": "Puedes asistir al laboratorio y a las tutorías ECTS, así que recuperas el 15% no recuperable y el 30% de prácticas: la continua es claramente preferible. Practica MIPS en el simulador."
      }
    },
    {
      "codigo": "501307",
      "nombre": "Análisis y Diseño de Algoritmos",
      "nombre_en": "Analysis and Design of Computer Algorithms",
      "curso": 2,
      "semestre": 4,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Común a la Rama de Informática",
      "materia": "Programación",
      "area": "Lenguajes y Sistemas Informáticos",
      "profesores": [
        "Luis V. Calderita Estévez"
      ],
      "descripcion": "Algoritmia, complejidad computacional y resolución de problemas mediante esquemas algorítmicos.",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Introducción y análisis de algoritmos",
          "descripcion": "Notaciones asintóticas, análisis de algoritmos iterativos y recursivos."
        },
        {
          "unidad": 2,
          "nombre": "Divide y Vencerás",
          "descripcion": "Búsqueda binaria, multiplicación de enteros y matrices."
        },
        {
          "unidad": 3,
          "nombre": "Algoritmos voraces, heurísticos y aproximados",
          "descripcion": "Mochila, árbol de recubrimiento, Dijkstra, coloreado, viajante."
        },
        {
          "unidad": 4,
          "nombre": "Programación dinámica",
          "descripcion": "Dar cambio y mochila 0/1."
        },
        {
          "unidad": 5,
          "nombre": "Vuelta atrás",
          "descripcion": "Mochila 0/1, asignación de trabajos, N reinas, laberinto."
        },
        {
          "unidad": 6,
          "nombre": "Ramificación y poda",
          "descripcion": "Mochila 0/1, asignación de trabajos y resolución de juegos."
        },
        {
          "unidad": 7,
          "nombre": "Elección del esquema algorítmico",
          "descripcion": "Resumen de esquemas y caso de estudio."
        }
      ],
      "practicas_seminarios": "6 seminarios (uno por esquema algorítmico) con problemas computacionales; el seminario 1 compara complejidad empírica de algoritmos de ordenación.",
      "evaluacion_continua": {
        "resumen": "Trabajos dirigidos 80% + Examen de certificación 20%. La nota máxima de cada trabajo baja según los días de retraso. Si no te presentas al examen = 'No presentado'.",
        "componentes": [
          {
            "nombre": "Realización de trabajos dirigidos",
            "peso": 80,
            "nota": "Nota máxima depende de la rapidez de entrega; tras la fecha límite -0,5/día."
          },
          {
            "nombre": "Examen de certificación",
            "peso": 20,
            "nota": "Obligatorio presentarse para no quedar 'No presentado'."
          }
        ]
      },
      "examenes_parciales": "No.",
      "asistencia_obligatoria": {
        "obligatoria": false,
        "detalle": "No se exige asistencia; los trabajos dirigidos se entregan por fechas, no requieren presencia."
      },
      "evaluacion_global": {
        "resumen": "Examen de certificación final (100%, máx. 10): opción múltiple + desarrollo de teoría y práctica.",
        "componentes": [
          {
            "nombre": "Examen de certificación",
            "peso": 100
          }
        ]
      },
      "criterios_evaluacion": "En continua hay que presentarse al examen (20%) sí o sí. En extraordinaria, si los trabajos < 5 se evalúa por global.",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Media-alta (conceptual)",
        "tiempo": "Medio-alto",
        "razon": "La continua premia con un 80% los trabajos dirigidos (entregables a distancia) y solo 20% de examen: es muy ventajosa sin necesidad de asistir. La global concentra todo en un examen difícil. Entrega los trabajos cuanto antes para maximizar nota."
      }
    },
    {
      "codigo": "502363",
      "nombre": "Aspectos Sociales, Legales, Éticos y Profesionales de la Informática",
      "nombre_en": "Social, Legal, Ethical and Professional Implications in Computer Science",
      "curso": 2,
      "semestre": 4,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Común a la Rama de Informática",
      "materia": "Legislación TIC e Inglés",
      "area": "Lenguajes y Sistemas Informáticos",
      "profesores": [
        "Pablo Guerrero Castillo"
      ],
      "descripcion": "Ética y deontología profesional, protección de datos, propiedad intelectual y del software, comercio electrónico, delitos informáticos y peritaje.",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Introducción",
          "descripcion": "Aspectos legales, éticos y profesionales de la ingeniería informática."
        },
        {
          "unidad": 2,
          "nombre": "Deontología y responsabilidad profesional",
          "descripcion": "Códigos deontológicos, colegios profesionales y visados."
        },
        {
          "unidad": 3,
          "nombre": "Derecho informático y Protección de Datos",
          "descripcion": "LOPD, niveles de datos, infracciones y sanciones."
        },
        {
          "unidad": 4,
          "nombre": "Protección del software y propiedad intelectual",
          "descripcion": "Patentes, licencias, software libre y contratos."
        },
        {
          "unidad": 5,
          "nombre": "Comercio electrónico y LSSI",
          "descripcion": "Firma electrónica y servicios de la sociedad de la información."
        },
        {
          "unidad": 6,
          "nombre": "Delitos informáticos y peritajes",
          "descripcion": "Tipos de delitos, informática forense y peritajes."
        }
      ],
      "practicas_seminarios": "5 prácticas: dilema ético, debate sobre IA, LOPD, comparación de licencias y observatorio de la sociedad de la información.",
      "evaluacion_continua": {
        "resumen": "Examen 60% + trabajos prácticos 15% + exposición oral 10% + asistencia/participación 15%. Entrega de prácticas en tiempo y forma es necesaria.",
        "componentes": [
          {
            "nombre": "Examen final escrito",
            "peso": 60,
            "nota_minima": 4
          },
          {
            "nombre": "Trabajos dirigidos",
            "peso": 15
          },
          {
            "nombre": "Exposición oral de trabajos",
            "peso": 10,
            "nota": "Presentación en clase."
          },
          {
            "nombre": "Asistencia y participación",
            "peso": 15
          }
        ]
      },
      "examenes_parciales": "No.",
      "asistencia_obligatoria": {
        "obligatoria": true,
        "detalle": "Las prácticas se presentan en clase y la participación/asistencia pesa 15%; cerca del aprobado, un 80% de asistencia ayuda a llegar al 5."
      },
      "evaluacion_global": {
        "resumen": "Examen de teoría 60% + prueba escrita de conocimientos prácticos 40%. Mínimo 4/10 en teoría y 5/10 final.",
        "componentes": [
          {
            "nombre": "Examen de teoría",
            "peso": 60,
            "nota_minima": 4
          },
          {
            "nombre": "Prueba escrita de práctica",
            "peso": 40
          }
        ]
      },
      "criterios_evaluacion": "Nota final mínima 5; mínimo 4 en la parte teórica.",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Baja (contenido jurídico/ético, memorístico)",
        "tiempo": "Bajo",
        "razon": "Puedes asistir a los seminarios de prácticas y presentar los trabajos; la continua reparte la nota (examen 60% + prácticas y exposición 25%). Solo pierdes parte del 15% de asistencia a teoría. Contenido sencillo."
      }
    },
    {
      "codigo": "502370",
      "nombre": "Arquitectura y Organización de Computadores",
      "nombre_en": "Computer Architecture and Organization",
      "curso": 2,
      "semestre": 4,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Común a la Rama de Informática",
      "materia": "Ingeniería de Computadores",
      "area": "Arquitectura y Tecnología de Computadores",
      "profesores": [
        "Antonio Astillero Vivas",
        "Mercedes Eugenia Paoletti Ávila"
      ],
      "descripcion": "Técnicas de evaluación y mejora de la arquitectura (segmentación, multiprocesamiento), jerarquía de memoria y programación paralela (OpenMP/MPI).",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Fundamentos de arquitectura y organización",
          "descripcion": "Paralelismo y evaluación de prestaciones (Amdahl, Gustafson)."
        },
        {
          "unidad": 2,
          "nombre": "Introducción al procesamiento paralelo",
          "descripcion": "Arquitecturas paralelas, programación paralela y GPU. OpenMP."
        },
        {
          "unidad": 3,
          "nombre": "Procesadores superescalares (I)",
          "descripcion": "ILP y procesamiento superescalar."
        },
        {
          "unidad": 4,
          "nombre": "Procesadores superescalares (II)",
          "descripcion": "Microarquitecturas Intel, PowerPC, MIPS, UltraSPARC, Alpha. MPI."
        },
        {
          "unidad": 5,
          "nombre": "Procesadores VLIW",
          "descripcion": "Aprovechamiento del paralelismo en VLIW."
        },
        {
          "unidad": 6,
          "nombre": "Procesadores vectoriales",
          "descripcion": "Arquitectura vectorial y rendimiento. OpenMP + MPI."
        }
      ],
      "practicas_seminarios": "Programación paralela con OpenMP y MPI (rendimiento, ejemplos y combinación de ambas).",
      "evaluacion_continua": {
        "resumen": "Examen final de teoría 60% (mín. 5) + Seminario/Laboratorio 40% (entregar ≥80% de las prácticas). Aprobar teoría y práctica por separado.",
        "componentes": [
          {
            "nombre": "Examen final de teoría",
            "peso": 60,
            "nota_minima": 5,
            "recuperable": true
          },
          {
            "nombre": "Seminario/Laboratorio (entrega individual de prácticas)",
            "peso": 40,
            "recuperable": true,
            "nota": "Mínimo 80% de prácticas entregadas para superar por continua."
          }
        ]
      },
      "examenes_parciales": "No.",
      "asistencia_obligatoria": {
        "obligatoria": false,
        "detalle": "Se exige entregar ≥80% de las prácticas (evaluadas individualmente), no asistencia presencial explícita."
      },
      "evaluacion_global": {
        "resumen": "Examen final de teoría 60% + examen práctico en laboratorio 40%.",
        "componentes": [
          {
            "nombre": "Examen final de teoría",
            "peso": 60
          },
          {
            "nombre": "Examen práctico de laboratorio",
            "peso": 40
          }
        ]
      },
      "criterios_evaluacion": "Aprobar teoría y práctica por separado.",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Media-alta",
        "tiempo": "Medio-alto",
        "razon": "La continua exige entregar ≥80% de las prácticas, evaluadas individualmente en el laboratorio al que puedes acudir: es viable y rebaja la presión del examen. Refuerza OpenMP/MPI."
      }
    },
    {
      "codigo": "502375",
      "nombre": "Redes de Ordenadores",
      "nombre_en": "Computer Networks",
      "curso": 2,
      "semestre": 4,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Tecnologías de la Información",
      "materia": "Redes",
      "area": "Ingeniería Telemática",
      "profesores": [
        "Miguel Á. Martín Tardío"
      ],
      "descripcion": "Modelo jerárquico de red, diseño de redes empresariales, VLAN, redundancia, enrutamiento dinámico, ACL y conexión WAN (Cisco).",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Metodología para el diseño de redes",
          "descripcion": "Diseño jerárquico y modular de redes."
        },
        {
          "unidad": 2,
          "nombre": "Consideraciones de diseño de los módulos de red",
          "descripcion": "Caracterización de la red y administración de dispositivos Cisco."
        },
        {
          "unidad": 3,
          "nombre": "Segmentación con VLAN",
          "descripcion": "Configuración de VLAN e inter-VLAN."
        },
        {
          "unidad": 4,
          "nombre": "Escalabilidad, disponibilidad y redundancia LAN",
          "descripcion": "STP, EtherChannel y FHRP (PVST+/RPVST+)."
        },
        {
          "unidad": 5,
          "nombre": "Direccionamiento y enrutamiento IP",
          "descripcion": "Enrutamiento estático y OSPF de área única."
        },
        {
          "unidad": 6,
          "nombre": "Perímetro de Internet y conexión WAN",
          "descripcion": "Tecnologías WAN y NAT."
        },
        {
          "unidad": 7,
          "nombre": "Seguridad con ACL",
          "descripcion": "Listas de control de acceso estándar y extendidas."
        }
      ],
      "practicas_seminarios": "Prácticas Cisco (VLAN, redundancia, OSPF, NAT, ACL) + cuaderno de prácticas con 2 entregas obligatorias.",
      "evaluacion_continua": {
        "resumen": "Exámenes (2 pruebas eliminatorias) 50% + trabajos dirigidos 30% + asistencia/participación 20% (máx. 3 faltas).",
        "componentes": [
          {
            "nombre": "Exámenes (2 eliminatorias: teoría ≥4, prácticas ≥5)",
            "peso": 50,
            "nota_minima": 5,
            "recuperable": true
          },
          {
            "nombre": "Trabajos dirigidos (cuaderno + tutorías programadas)",
            "peso": 30,
            "recuperable": false
          },
          {
            "nombre": "Asistencia y participación (máx. 3 faltas)",
            "peso": 20,
            "recuperable": false
          }
        ]
      },
      "examenes_parciales": "SÍ. Dos pruebas eliminatorias y obligatorias.",
      "asistencia_obligatoria": {
        "obligatoria": true,
        "detalle": "Asistencia 20% con máximo 3 faltas; superarlas hace perder la continua."
      },
      "evaluacion_global": {
        "resumen": "Examen final de teoría 60% (≥5) + examen final de prácticas 40% (cada ejercicio ≥5).",
        "componentes": [
          {
            "nombre": "Examen final de teoría",
            "peso": 60,
            "nota_minima": 5
          },
          {
            "nombre": "Examen final de prácticas",
            "peso": 40,
            "nota_minima": 5
          }
        ]
      },
      "criterios_evaluacion": "Teoría y prácticas por separado. Recomienda haber cursado Fundamentos de Redes.",
      "veredicto": {
        "compensa": "global",
        "dificultad": "Media",
        "tiempo": "Medio",
        "razon": "Igual que Fundamentos de Redes: la asistencia de la continua (20%) cuenta las clases de TEORÍA con un máximo de 3 faltas, así que al no poder ir a teoría la pierdes. La global (60% teoría + 40% prácticas) es la opción."
      }
    },
    {
      "codigo": "501446",
      "nombre": "Sistemas Operativos",
      "nombre_en": "Operating Systems",
      "curso": 3,
      "semestre": 5,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Común a la Rama de Informática",
      "materia": "Sistemas Operativos, Sistemas Distribuidos",
      "area": "Arquitectura y Tecnología de los Computadores",
      "profesores": [
        "Josefa Díaz Álvarez",
        "Antonio Astillero Vivas"
      ],
      "descripcion": "Principios de los sistemas operativos: procesos, planificación, sincronización, gestión de memoria y memoria virtual. Unix/Linux y programación en C.",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Introducción a los Sistemas Operativos",
          "descripcion": "Concepto, funciones y evolución. Comandos y scripts."
        },
        {
          "unidad": 2,
          "nombre": "Procesos",
          "descripcion": "Estados, PCB y cooperación; gestión de procesos en C."
        },
        {
          "unidad": 3,
          "nombre": "Planificación de procesos",
          "descripcion": "Tipos de planificación y algoritmos."
        },
        {
          "unidad": 4,
          "nombre": "Sincronización de procesos",
          "descripcion": "Concurrencia, exclusión mutua y semáforos."
        },
        {
          "unidad": 5,
          "nombre": "Gestión de memoria",
          "descripcion": "Espacios lógico/físico, paginación y segmentación."
        },
        {
          "unidad": 6,
          "nombre": "Memoria virtual",
          "descripcion": "Demanda de páginas y algoritmos de reemplazo."
        },
        {
          "unidad": 7,
          "nombre": "Sistemas operativos móviles",
          "descripcion": "Android, iOS y Windows Phone."
        }
      ],
      "practicas_seminarios": "Laboratorio en Unix/Linux: scripts, señales, llamadas al sistema y comunicación entre procesos (PIPE, FIFO, memoria compartida) en C. Evaluación continua presencial en laboratorio.",
      "evaluacion_continua": {
        "resumen": "Examen 55% (mín. 5) + trabajos dirigidos/laboratorio 45%. No asistir al 15% de las sesiones de laboratorio obliga a examen global de prácticas.",
        "componentes": [
          {
            "nombre": "Examen (50% teoría + 50% problemas)",
            "peso": 55,
            "nota_minima": 5
          },
          {
            "nombre": "Trabajos dirigidos (supuestos prácticos en laboratorio) + memoria",
            "peso": 45,
            "nota": "Entrega presencial al final de cada sesión; falta >15% → examen global de prácticas."
          }
        ]
      },
      "examenes_parciales": "No.",
      "asistencia_obligatoria": {
        "obligatoria": true,
        "detalle": "La evaluación continua de prácticas es presencial; faltar a más del 15% de las sesiones obliga a un examen práctico global."
      },
      "evaluacion_global": {
        "resumen": "Examen de teoría 55% + parte práctica 45%. La asistencia a laboratorio sigue siendo obligatoria; si faltas >15%, examen práctico de los temas de prácticas.",
        "componentes": [
          {
            "nombre": "Examen de teoría",
            "peso": 55
          },
          {
            "nombre": "Prácticas (asistencia obligatoria o examen práctico)",
            "peso": 45
          }
        ]
      },
      "criterios_evaluacion": "Aprobar teoría y prácticas. Plagio = nota final 0.",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Media-alta (C en Unix)",
        "tiempo": "Medio-alto",
        "razon": "Clave: ahora que puedes asistir al laboratorio, la evaluación continua de prácticas (45%) es accesible y evitas el examen práctico de la global. Examen 55% + laboratorio 45%. Domina C en Unix."
      }
    },
    {
      "codigo": "501453",
      "nombre": "Seguridad de la Información",
      "nombre_en": "Information Security",
      "curso": 3,
      "semestre": 5,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Tecnologías de la Información",
      "materia": "Redes",
      "area": "Ingeniería Telemática",
      "profesores": [
        "Juan Arias Masa"
      ],
      "descripcion": "Integridad y confidencialidad de la información, criptografía clásica y moderna, firma digital, seguridad perimetral y normas ISO 27000.",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Introducción",
          "descripcion": "Conceptos de seguridad de la información."
        },
        {
          "unidad": 2,
          "nombre": "Criptografía Clásica",
          "descripcion": "Técnicas básicas de cifrado clásico."
        },
        {
          "unidad": 3,
          "nombre": "Criptografía Moderna",
          "descripcion": "Fundamentos de la criptografía actual."
        },
        {
          "unidad": 4,
          "nombre": "Criptografía de Clave Privada",
          "descripcion": "Cifrado simétrico."
        },
        {
          "unidad": 5,
          "nombre": "Criptografía de Clave Pública",
          "descripcion": "Cifrado asimétrico e infraestructura de clave pública."
        },
        {
          "unidad": 6,
          "nombre": "Firmas Digitales",
          "descripcion": "Certificados y firma digital."
        },
        {
          "unidad": 7,
          "nombre": "Seguridad Perimetral",
          "descripcion": "Cortafuegos y protección de red."
        },
        {
          "unidad": 8,
          "nombre": "Autenticación",
          "descripcion": "Mecanismos de autenticación."
        },
        {
          "unidad": 9,
          "nombre": "Seguridad en el Correo electrónico",
          "descripcion": "Protección del correo (PGP)."
        },
        {
          "unidad": 10,
          "nombre": "ISO 27000",
          "descripcion": "Normas de gestión de la seguridad de la información."
        }
      ],
      "practicas_seminarios": "4 prácticas: entornos de programación, herramientas de seguridad, codificación de un algoritmo de cifrado y herramienta PGP.",
      "evaluacion_continua": {
        "resumen": "Examen (teoría) 50% (mín. 5) + parte práctica 30% (tareas 20% + examen de prácticas 10%, mín. 5) + participación 10% + ECTS (memoria + exposición) 10%.",
        "componentes": [
          {
            "nombre": "Parte teórica (examen final)",
            "peso": 50,
            "nota_minima": 5
          },
          {
            "nombre": "Parte práctica (tareas + examen de prácticas)",
            "peso": 30,
            "nota_minima": 5
          },
          {
            "nombre": "Participación en clase/aula virtual",
            "peso": 10
          },
          {
            "nombre": "Actividades ECTS (memoria 5% + exposición 5%)",
            "peso": 10
          }
        ]
      },
      "examenes_parciales": "No.",
      "asistencia_obligatoria": {
        "obligatoria": false,
        "detalle": "Hay un 10% de participación y un 10% de ECTS (memoria + exposición) que favorecen la presencialidad, pero la práctica admite entrega no presencial + examen final."
      },
      "evaluacion_global": {
        "resumen": "Entregas de Laboratorio (PL) 30% + Examen final 70%. Ambas partes ≥5 e independientes, en la misma convocatoria.",
        "componentes": [
          {
            "nombre": "Entregas de Laboratorio (PL)",
            "peso": 30,
            "nota_minima": 5
          },
          {
            "nombre": "Examen final",
            "peso": 70,
            "nota_minima": 5
          }
        ]
      },
      "criterios_evaluacion": "En global, superar ambas partes (≥5) en la misma convocatoria; si una suspende, se recupera la asignatura completa.",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Media",
        "tiempo": "Medio",
        "razon": "Puedes asistir a las prácticas y a las sesiones ECTS, así que recuperas la parte práctica (30%) y el 10% de ECTS; la continua baja el examen al 50%. Solo el 10% de participación es parcialmente presencial en teoría."
      }
    },
    {
      "codigo": "502364",
      "nombre": "Sistemas de Información",
      "nombre_en": "Information Systems",
      "curso": 3,
      "semestre": 5,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Tecnologías de la Información",
      "materia": "Gestión de Proyectos y Sistemas de Información",
      "area": "Lenguajes y Sistemas Informáticos",
      "profesores": [
        "Francisco Chávez de la O"
      ],
      "descripcion": "Almacenamiento en bases de datos relacionales y no relacionales, indexación, NoSQL, Big Data y sistemas recomendadores.",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Introducción a los Sistemas de Información",
          "descripcion": "Estructura, desarrollo y acceso a los SI."
        },
        {
          "unidad": 2,
          "nombre": "Modelos de datos",
          "descripcion": "Bases de datos relacionales, OO y objeto-relacionales."
        },
        {
          "unidad": 3,
          "nombre": "Indexación en Bases de Datos",
          "descripcion": "Índices con árboles B y B+."
        },
        {
          "unidad": 4,
          "nombre": "Bases de Datos No-SQL",
          "descripcion": "Cassandra/DataStax, HBase/Cloudera."
        },
        {
          "unidad": 5,
          "nombre": "Big Data",
          "descripcion": "MapReduce y tratamiento de grandes volúmenes."
        },
        {
          "unidad": 6,
          "nombre": "Sistemas recomendadores",
          "descripcion": "Técnicas estándar de recomendación."
        }
      ],
      "practicas_seminarios": "2 prácticas: bases de datos No-SQL (local/remota) y MapReduce con Hadoop.",
      "evaluacion_continua": {
        "resumen": "Evaluación de prácticas de laboratorio 60% (mín. 5) + Evaluación final 40% (mín. 5). Si alguna < 5, suspenso.",
        "componentes": [
          {
            "nombre": "Evaluación prácticas de laboratorio (EPL)",
            "peso": 60,
            "nota_minima": 5,
            "recuperable": true,
            "nota": "Se entregan por campus virtual; no requiere examen práctico salvo que el profesor lo estime."
          },
          {
            "nombre": "Evaluación final (EVF)",
            "peso": 40,
            "nota_minima": 5,
            "recuperable": true
          }
        ]
      },
      "examenes_parciales": "No.",
      "asistencia_obligatoria": {
        "obligatoria": false,
        "detalle": "Las prácticas se entregan a través del campus virtual; no se exige asistencia."
      },
      "evaluacion_global": {
        "resumen": "Evaluación de prácticas de laboratorio 40% (mín. 5) + Evaluación final 60% (mín. 5).",
        "componentes": [
          {
            "nombre": "Evaluación prácticas de laboratorio (EPL)",
            "peso": 40,
            "nota_minima": 5
          },
          {
            "nombre": "Evaluación final (EVF)",
            "peso": 60,
            "nota_minima": 5
          }
        ]
      },
      "criterios_evaluacion": "Ambas partes ≥5; si no, suspenso.",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Media",
        "tiempo": "Medio",
        "razon": "Es de las más favorables sin asistir: las prácticas (60% en continua) se entregan por campus virtual y el examen pesa solo 40%. La global invierte los pesos (60% examen). Quédate en continua y cuida las entregas."
      }
    },
    {
      "codigo": "502367",
      "nombre": "Ingeniería de Software",
      "nombre_en": "Software Engineering",
      "curso": 3,
      "semestre": 5,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Común a la Rama de Informática",
      "materia": "Ingeniería de Software y Base de Datos",
      "area": "Lenguajes y Sistemas Informáticos",
      "profesores": [
        "Juan Ángel Contreras Vas"
      ],
      "descripcion": "Ingeniería del software: análisis de requisitos, diseño, metodologías (cascada, espiral, ágil), implementación, pruebas y mantenimiento. UML y Proceso Software Personal (PSP).",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Contexto de la Ingeniería de Software",
          "descripcion": "Necesidad de metodología, ciclos de vida y UML."
        },
        {
          "unidad": 2,
          "nombre": "Agilidad y proceso",
          "descripcion": "Scrum, XP, Kanban y DevOps."
        },
        {
          "unidad": 3,
          "nombre": "Fase de Requisitos",
          "descripcion": "Obtención, análisis, representación y validación de requisitos."
        },
        {
          "unidad": 4,
          "nombre": "Fase de Diseño",
          "descripcion": "Diseño estructurado y orientado a objetos; validación."
        },
        {
          "unidad": 5,
          "nombre": "Fase de Implementación",
          "descripcion": "Guías de estilo, depuración y documentación del código."
        },
        {
          "unidad": 6,
          "nombre": "Fase de Pruebas",
          "descripcion": "Verificación, validación y técnicas de prueba."
        },
        {
          "unidad": 7,
          "nombre": "Fase de Entrega y Mantenimiento",
          "descripcion": "Cierre del proyecto y documentación."
        }
      ],
      "practicas_seminarios": "Introducción al Proceso Software Personal (PSP): cuaderno de ingeniería, gestión del tiempo, defectos y calidad; trabajo en grupo con documentación completa.",
      "evaluacion_continua": {
        "resumen": "Prueba teórica (PT) 20% + Prueba práctica (PP) 40% + asistencia/participación (AC) 10% (no recup.) + entrega prácticas (ED) 15% (no recup.) + defensa de trabajos (DD) 15% (no recup.). Mínimos en PT y PP.",
        "componentes": [
          {
            "nombre": "Prueba teórica (PT, test)",
            "peso": 20,
            "nota_minima": 3.5,
            "recuperable": true
          },
          {
            "nombre": "Prueba práctica (PP)",
            "peso": 40,
            "nota_minima": 3.5,
            "recuperable": true
          },
          {
            "nombre": "Asistencia y participación (AC)",
            "peso": 10,
            "recuperable": false
          },
          {
            "nombre": "Entrega de prácticas/cuaderno (ED)",
            "peso": 15,
            "recuperable": false
          },
          {
            "nombre": "Defensa de trabajos (DD)",
            "peso": 15,
            "recuperable": false
          }
        ]
      },
      "examenes_parciales": "No (examen final con parte teórica y práctica).",
      "asistencia_obligatoria": {
        "obligatoria": true,
        "detalle": "En continua, AC (10%) valora asistencia y DD (15%) exige defensa en clase; ambos no recuperables."
      },
      "evaluacion_global": {
        "resumen": "Examen: Prueba teórica (PT) 30% (mín. 5) + Prueba práctica (PP) 50% (mín. 5) + Cuaderno de Ingeniería (ED) 20% (no recuperable, entregable).",
        "componentes": [
          {
            "nombre": "Prueba teórica (PT)",
            "peso": 30,
            "nota_minima": 5
          },
          {
            "nombre": "Prueba práctica (PP)",
            "peso": 50,
            "nota_minima": 5
          },
          {
            "nombre": "Cuaderno de Ingeniería (ED)",
            "peso": 20,
            "recuperable": false
          }
        ]
      },
      "criterios_evaluacion": "Nota final mínima 5. En global, mínimos de 5 en PT y PP.",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Media",
        "tiempo": "Medio-alto",
        "razon": "Puedes asistir a seminarios y tutorías ECTS para entregar y defender los trabajos (ED 15% + DD 15%); con PT 20% + PP 40% tienes ~90% de la nota accesible. Solo pierdes parte del 10% de asistencia a teoría (AC)."
      }
    },
    {
      "codigo": "501320",
      "nombre": "Gestión de las Organizaciones",
      "nombre_en": "Management of Organizations",
      "curso": 3,
      "semestre": 6,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Tecnologías de la Información",
      "materia": "Gestión de las Organizaciones",
      "area": "Economía Financiera y Contabilidad",
      "profesores": [
        "María Manuela Palacios González"
      ],
      "descripcion": "Administración integral de una organización: planificación, organización, dirección de personal, dirección estratégica, RRHH y responsabilidad social corporativa.",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Dirección y Gestión de una Organización",
          "descripcion": "Planificación, organización, control, niveles directivos e innovación."
        },
        {
          "unidad": 2,
          "nombre": "Toma de Decisiones y Sistema de Información",
          "descripcion": "Sistemas de información y tendencias digitales."
        },
        {
          "unidad": 3,
          "nombre": "Dirección Estratégica",
          "descripcion": "Análisis e implantación de la estrategia."
        },
        {
          "unidad": 4,
          "nombre": "La Dirección del siglo XXI",
          "descripcion": "Cuadro de Mando Integral y ERP."
        },
        {
          "unidad": 5,
          "nombre": "Gestión de Recursos Humanos",
          "descripcion": "Comportamiento organizativo, liderazgo y selección de personal."
        },
        {
          "unidad": 6,
          "nombre": "Responsabilidad Social Corporativa",
          "descripcion": "Grupos de interés y dimensiones de la RSC."
        }
      ],
      "practicas_seminarios": "Casos prácticos por tema (clasificación de empresas, sistemas de información, perfil estratégico, ratios, formación, RSC) + trabajo final con exposición.",
      "evaluacion_continua": {
        "resumen": "Examen final 60% (mín. 4 para ponderar) + trabajos dirigidos 30% (en clase) + exposición oral del trabajo final 10%. Nota final ≥5.",
        "componentes": [
          {
            "nombre": "Examen final",
            "peso": 60,
            "nota_minima": 4
          },
          {
            "nombre": "Trabajos dirigidos (casos en clase, asistencia a actividades)",
            "peso": 30,
            "recuperable": true
          },
          {
            "nombre": "Exposición oral del trabajo final",
            "peso": 10,
            "recuperable": false
          }
        ]
      },
      "examenes_parciales": "No.",
      "asistencia_obligatoria": {
        "obligatoria": true,
        "detalle": "Los trabajos dirigidos se realizan durante la clase y la exposición oral es presencial; difícil sin asistir."
      },
      "evaluacion_global": {
        "resumen": "Examen final único (100%) con preguntas teóricas y/o prácticas; mínimo 50% en cada parte y 5 en total.",
        "componentes": [
          {
            "nombre": "Examen final",
            "peso": 100
          }
        ]
      },
      "criterios_evaluacion": "En global, nota mínima 5 y al menos 50% en cada parte del examen.",
      "veredicto": {
        "compensa": "global",
        "dificultad": "Baja-media (contenido de empresa, memorístico)",
        "tiempo": "Bajo-medio",
        "razon": "Los trabajos dirigidos (30%) y la exposición oral (10%) se realizan DURANTE las clases (de teoría), a las que no puedes asistir; no son prácticas de laboratorio independientes. La global (examen único) sigue siendo la vía. Contenido sencillo."
      }
    },
    {
      "codigo": "501448",
      "nombre": "Habilidades Comunicativas",
      "nombre_en": "Communicative Skills in English",
      "curso": 3,
      "semestre": 6,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Común a la Rama de Informática / Legislación TIC e Inglés",
      "materia": "Inglés",
      "area": "Filología Inglesa",
      "profesores": [
        "Profesor por asignar (contacto: preyort@unex.es)"
      ],
      "descripcion": "Competencias comunicativas en inglés (nivel B1) aplicado a la ingeniería: lectura técnica, redacción de informes/CVs, presentaciones y comunicación profesional.",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Módulo 1 – General English (B1)",
          "descripcion": "Inglés general y competencias transversales (diversidad e interculturalidad)."
        },
        {
          "unidad": 2,
          "nombre": "Unit 1 – Reading & Technical Writing",
          "descripcion": "Comprensión lectora de textos especializados, abstracts y reports."
        },
        {
          "unidad": 3,
          "nombre": "Unit 2 – Oral Communication",
          "descripcion": "Competencia oral, lenguaje de gráficos y comunicación interpersonal."
        },
        {
          "unidad": 4,
          "nombre": "Unit 3 – Personal Communication",
          "descripcion": "Búsqueda de empleo: cartas, CV y entrevistas orales."
        },
        {
          "unidad": 5,
          "nombre": "Unit 4 – Professional Projects in Computing & ICT",
          "descripcion": "Comunicación escrita y oral en contextos profesionales (software, IoT, IA)."
        },
        {
          "unidad": 6,
          "nombre": "Unit 5 – Emerging Technologies",
          "descripcion": "Tendencias (ciberseguridad, computación cuántica) y prácticas."
        }
      ],
      "practicas_seminarios": "Lab Practice I (comunicación interpersonal/diversidad), Lab Practice II (procesamiento del lenguaje natural) y trabajo de investigación con presentación oral.",
      "evaluacion_continua": {
        "resumen": "Examen escrito 50% + prueba oral 10% + presentación oral de trabajo 10% + prácticas de laboratorio 15% (no recup.) + participación/trabajo de clase 15% (no recup.).",
        "componentes": [
          {
            "nombre": "Examen final escrito",
            "peso": 50,
            "recuperable": true
          },
          {
            "nombre": "Prueba de competencia oral",
            "peso": 10,
            "recuperable": true
          },
          {
            "nombre": "Presentación oral del trabajo final (research)",
            "peso": 15,
            "recuperable": true
          },
          {
            "nombre": "Prácticas de laboratorio (Lab Practices 1 y 2)",
            "peso": 15,
            "recuperable": false
          },
          {
            "nombre": "Participación / trabajo en aula",
            "peso": 10,
            "recuperable": false
          }
        ]
      },
      "examenes_parciales": "No.",
      "asistencia_obligatoria": {
        "obligatoria": false,
        "detalle": "Hay un 25% no recuperable (prácticas + participación) que favorece la presencialidad, pero la global no exige asistencia continuada."
      },
      "evaluacion_global": {
        "resumen": "Examen escrito 60% + examen oral 15% + prácticas 1 y 2 10% + trabajo de investigación (entrega + presentación) 15%.",
        "componentes": [
          {
            "nombre": "Examen escrito (comprensión y producción, B1)",
            "peso": 60
          },
          {
            "nombre": "Examen oral",
            "peso": 15
          },
          {
            "nombre": "Prácticas 1 y 2",
            "peso": 10
          },
          {
            "nombre": "Trabajo de investigación (memoria + presentación oral)",
            "peso": 15
          }
        ]
      },
      "criterios_evaluacion": "Evalúa las cuatro destrezas (reading, writing, listening, speaking) a nivel B1.",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Baja-media (depende de tu nivel de inglés)",
        "tiempo": "Bajo-medio",
        "razon": "Las prácticas de laboratorio (15%) y el trabajo de investigación se realizan en sesiones a las que puedes asistir; la continua baja el examen escrito al 50%. Solo el 10% de participación es parcialmente de clase. Llevadera si tu inglés ronda B1."
      }
    },
    {
      "codigo": "502368",
      "nombre": "Sistemas Distribuidos y de Tiempo Real",
      "nombre_en": "Distributed and Real-Time Systems",
      "curso": 3,
      "semestre": 6,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Común a la Rama de Informática",
      "materia": "Sistemas Operativos, Sistemas Distribuidos",
      "area": "Arquitectura y Tecnología de Computadores",
      "profesores": [
        "Violeta Hidalgo Izquierdo",
        "Mercedes Paoletti Ávila"
      ],
      "descripcion": "Principios de los sistemas distribuidos y de tiempo real: comunicación (RPC/RMI), sincronización, planificación y tolerancia a fallos. Programación en C/POSIX.",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Introducción a los Sistemas Distribuidos",
          "descripcion": "Definición, hardware, software y diseño."
        },
        {
          "unidad": 2,
          "nombre": "Comunicación en Sistemas Distribuidos",
          "descripcion": "RPC, RMI, mensajes y modelos de computación de Google."
        },
        {
          "unidad": 3,
          "nombre": "Sincronización",
          "descripcion": "Relojes, exclusión mutua y algoritmos de elección."
        },
        {
          "unidad": 4,
          "nombre": "Procesadores y procesos",
          "descripcion": "Cliente-servidor, sistemas paralelos y planificación."
        },
        {
          "unidad": 5,
          "nombre": "Introducción a los Sistemas de Tiempo Real",
          "descripcion": "Características y distribución."
        },
        {
          "unidad": 6,
          "nombre": "Concurrencia y tiempo real en POSIX/C",
          "descripcion": "Hebras, sincronización, señales y planificación."
        },
        {
          "unidad": 7,
          "nombre": "Planificación en Tiempo Real",
          "descripcion": "Ejecutivo cíclico, test de planificabilidad y techo de prioridad."
        },
        {
          "unidad": 8,
          "nombre": "Tolerancia a fallos",
          "descripcion": "Modos de fallo, prevención y manejo de excepciones."
        }
      ],
      "practicas_seminarios": "Programación de comunicación con RPC y de sistemas de tiempo real con C/POSIX (supuestos guiados + supuesto final autónomo a defender).",
      "evaluacion_continua": {
        "resumen": "Examen 50% + exposición oral 10% + trabajos dirigidos 35% + asistencia/participación 5%. Aprobar teoría y práctica.",
        "componentes": [
          {
            "nombre": "Examen",
            "peso": 50
          },
          {
            "nombre": "Exposición oral de trabajos",
            "peso": 10
          },
          {
            "nombre": "Trabajos dirigidos",
            "peso": 35
          },
          {
            "nombre": "Asistencia y participación",
            "peso": 5
          }
        ]
      },
      "examenes_parciales": "No.",
      "asistencia_obligatoria": {
        "obligatoria": true,
        "detalle": "La asistencia a laboratorio y la defensa de trabajos es obligatoria; si entregas todo + el supuesto final sin asistir, hay un examen de certificación global distinto."
      },
      "evaluacion_global": {
        "resumen": "Examen 55% + trabajos dirigidos 40% + asistencia/participación 5%. La parte práctica exige asistencia o, en su defecto, examen de certificación global + defensa de los trabajos entregados.",
        "componentes": [
          {
            "nombre": "Examen",
            "peso": 55
          },
          {
            "nombre": "Trabajos dirigidos (asistencia o examen de certificación + defensa)",
            "peso": 40
          },
          {
            "nombre": "Asistencia y participación",
            "peso": 5
          }
        ]
      },
      "criterios_evaluacion": "Aprobar teoría y práctica por separado. Plagio = nota final 0.",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Alta (C/POSIX, tiempo real)",
        "tiempo": "Alto",
        "razon": "Como puedes asistir al laboratorio y defender el supuesto final, la continua (examen 50% + trabajos 35% + oral 10% + asistencia 5%) es viable y evita el examen de certificación de la global. Asignatura técnica exigente: domina hilos y RPC en C."
      }
    },
    {
      "codigo": "502376",
      "nombre": "Diseño y Evaluación de Tecnologías Hardware",
      "nombre_en": "Design and Evaluation of Hardware Technology",
      "curso": 3,
      "semestre": 6,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Tecnologías de la Información",
      "materia": "Tecnologías Hardware",
      "area": "Arquitectura y Tecnología de Computadores",
      "profesores": [
        "Juan Ángel García Martínez"
      ],
      "descripcion": "Evolución y prestaciones de arquitecturas de procesadores, sistemas multiprocesador, SoC y desarrollo con dispositivos lógicos programables (HDL/VHDL, FPGA).",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Técnicas de aumento de prestaciones",
          "descripcion": "Mejoras en procesador, memoria y E/S."
        },
        {
          "unidad": 2,
          "nombre": "Sistemas multiprocesador y multicomputador",
          "descripcion": "Arquitecturas de memoria compartida y distribuida."
        },
        {
          "unidad": 3,
          "nombre": "Evaluación de prestaciones",
          "descripcion": "Métricas de rendimiento para arquitecturas multiprocesador."
        },
        {
          "unidad": 4,
          "nombre": "SoC (System On Chip)",
          "descripcion": "Arquitecturas de procesador y tipos de SoC."
        },
        {
          "unidad": 5,
          "nombre": "Herramientas de desarrollo de SoC",
          "descripcion": "Programación y diseño de SoC con entornos específicos (VHDL/FPGA)."
        }
      ],
      "practicas_seminarios": "Laboratorio: diseño e implementación de sistemas embebidos con hardware específico y pruebas de rendimiento con SoC.",
      "evaluacion_continua": {
        "resumen": "Examen 60% (Prueba 1: T1-3 30% + Prueba 2: T4-5 30%) + trabajos dirigidos 40% (no recuperable).",
        "componentes": [
          {
            "nombre": "Examen (2 pruebas, 30% + 30%)",
            "peso": 60
          },
          {
            "nombre": "Trabajos dirigidos (ejercicios, casos prácticos)",
            "peso": 40,
            "recuperable": false
          }
        ]
      },
      "examenes_parciales": "SÍ. Dos pruebas (temas 1-3 y temas 4-5), 30% cada una.",
      "asistencia_obligatoria": {
        "obligatoria": false,
        "detalle": "Los trabajos dirigidos son no recuperables pero entregables; no se exige un porcentaje de asistencia explícito."
      },
      "evaluacion_global": {
        "resumen": "Una prueba de evaluación global (4 h) en dos partes: Parte 1 (T1-3) 50% + Parte 2 (T4-5) 50%. 100% examen.",
        "componentes": [
          {
            "nombre": "Examen global (Parte 1 + Parte 2)",
            "peso": 100
          }
        ]
      },
      "criterios_evaluacion": "Competencias transversales (toma de decisiones, calidad) evaluadas de forma continua.",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Alta (VHDL/FPGA, hardware)",
        "tiempo": "Alto",
        "razon": "Puedes asistir al laboratorio donde se desarrollan los trabajos (40%); la continua con dos pruebas parciales (30%+30%) reparte mejor que el examen único de 4 h. Dura: estudia VHDL y arquitecturas paralelas a fondo."
      }
    },
    {
      "codigo": "502365",
      "nombre": "Sistemas Inteligentes",
      "nombre_en": "Intelligent Systems",
      "curso": 4,
      "semestre": 7,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Común a la Rama de Informática",
      "materia": "Programación",
      "area": "Lenguajes y Sistemas Informáticos",
      "profesores": [
        "Francisco Chávez de la O"
      ],
      "descripcion": "Inteligencia artificial y sistemas inteligentes: técnicas de búsqueda, computación evolutiva y bioinspirada, y aprendizaje automático (Machine Learning).",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Introducción a los Sistemas Inteligentes y la IA",
          "descripcion": "Conceptos básicos de inteligencia artificial."
        },
        {
          "unidad": 2,
          "nombre": "Técnicas de búsqueda clásicas y heurísticas",
          "descripcion": "Métodos de búsqueda en IA."
        },
        {
          "unidad": 3,
          "nombre": "Computación evolutiva y bioinspirada",
          "descripcion": "Algoritmos genéticos y bioinspirados."
        },
        {
          "unidad": 4,
          "nombre": "Principios básicos de Machine Learning",
          "descripcion": "Fundamentos del aprendizaje automático."
        },
        {
          "unidad": 5,
          "nombre": "Introducción al aprendizaje automático",
          "descripcion": "Aplicación de algoritmos de ML."
        }
      ],
      "practicas_seminarios": "3 prácticas: computación evolutiva/bioinspirada, algoritmos de Machine Learning y aplicación de aprendizaje automático a problemas académicos.",
      "evaluacion_continua": {
        "resumen": "Entregas de Laboratorio (PL) 60% (mín. 5) + Evaluación final (EVF) 40% (mín. 5). Si alguna < 5, suspenso.",
        "componentes": [
          {
            "nombre": "Entregas de Laboratorio (PL)",
            "peso": 60,
            "nota_minima": 5,
            "recuperable": true,
            "nota": "Pueden requerir prueba presencial según criterio del profesor."
          },
          {
            "nombre": "Evaluación final (EVF)",
            "peso": 40,
            "nota_minima": 5,
            "recuperable": true
          }
        ]
      },
      "examenes_parciales": "No.",
      "asistencia_obligatoria": {
        "obligatoria": false,
        "detalle": "Prácticas individuales evaluadas por entrega; no se exige asistencia."
      },
      "evaluacion_global": {
        "resumen": "Trabajos dirigidos (TD) 40% (mín. 5) + Examen de certificación (EC) 60% (mín. 5).",
        "componentes": [
          {
            "nombre": "Trabajos dirigidos (TD)",
            "peso": 40,
            "nota_minima": 5
          },
          {
            "nombre": "Examen de certificación (EC)",
            "peso": 60,
            "nota_minima": 5
          }
        ]
      },
      "criterios_evaluacion": "Ambas partes ≥5; si no, suspenso.",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Media",
        "tiempo": "Medio",
        "razon": "Mismo profesor y filosofía que Sistemas de Información: la continua premia las prácticas (60%) entregables y deja el examen en 40%. La global invierte los pesos. Quédate en continua salvo que no puedas con las entregas."
      }
    },
    {
      "codigo": "502371",
      "nombre": "Metodología y Desarrollo de Aplicaciones para Internet",
      "nombre_en": "Methodology and Development for Internet Applications",
      "curso": 4,
      "semestre": 7,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Tecnologías de la Información",
      "materia": "Gestión de Proyectos y Sistemas de Información",
      "area": "Lenguajes y Sistemas Informáticos",
      "profesores": [
        "Luis V. Calderita Estévez"
      ],
      "descripcion": "Desarrollo ágil de aplicaciones web con Spring Boot: acceso a datos (JPA), lógica de negocio (Spring Services) y presentación (Spring MVC/Thymeleaf).",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Introducción",
          "descripcion": "Ecosistema Spring Boot, Maven y control de versiones con GIT."
        },
        {
          "unidad": 2,
          "nombre": "Acceso a datos – JPA",
          "descripcion": "Patrón DAO, Spring Data e introducción a NoSQL."
        },
        {
          "unidad": 3,
          "nombre": "Lógica de Negocio – Spring Services",
          "descripcion": "Servicios, microcontenedores e inyección de dependencias."
        },
        {
          "unidad": 4,
          "nombre": "Presentación – Spring MVC",
          "descripcion": "Patrón MVC con Spring MVC y Thymeleaf."
        }
      ],
      "practicas_seminarios": "4 prácticas que construyen una aplicación web completa por capas (requisitos, persistencia, negocio y presentación).",
      "evaluacion_continua": {
        "resumen": "Trabajos dirigidos 40% (hay que entregar todos) + Examen 60% (parte teórica y práctica).",
        "componentes": [
          {
            "nombre": "Realización de trabajos dirigidos",
            "peso": 40,
            "nota": "Se han de entregar todos los trabajos para ser evaluado."
          },
          {
            "nombre": "Examen (teórico y práctico)",
            "peso": 60
          }
        ]
      },
      "examenes_parciales": "No.",
      "asistencia_obligatoria": {
        "obligatoria": false,
        "detalle": "Trabajos prácticos entregables; no se exige asistencia."
      },
      "evaluacion_global": {
        "resumen": "Examen final (60%) + trabajos prácticos de obligado cumplimiento (40%).",
        "componentes": [
          {
            "nombre": "Examen final",
            "peso": 60
          },
          {
            "nombre": "Trabajos prácticos obligatorios",
            "peso": 40
          }
        ]
      },
      "criterios_evaluacion": "Mismos pesos en continua y global (60/40); en ambas hay que entregar los trabajos.",
      "veredicto": {
        "compensa": "indiferente",
        "dificultad": "Media",
        "tiempo": "Medio",
        "razon": "Continua y global tienen pesos idénticos (60% examen + 40% trabajos) y los trabajos son entregables sin asistir. Elige según comodidad de plazos. Recomiendan haber superado MDP y Tecnologías Web."
      }
    },
    {
      "codigo": "502374",
      "nombre": "Gestión de Proyectos TIC",
      "nombre_en": "ICT Project Management",
      "curso": 4,
      "semestre": 7,
      "caracter": "Obligatoria",
      "ects": 6,
      "modulo": "Tecnologías de la Información",
      "materia": "Gestión de Proyectos y Sistemas de Información",
      "area": "Lenguajes y Sistemas Informáticos",
      "profesores": [
        "Héctor Sánchez Santamaría"
      ],
      "descripcion": "Planificación y gestión de proyectos TIC según la guía PMBOK: grupos de procesos, áreas de conocimiento y enfoques predictivo y ágil.",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Marco Conceptual y Principios",
          "descripcion": "Proyecto, dirección de proyectos, ciclo de vida y principios PMBOK."
        },
        {
          "unidad": 2,
          "nombre": "Inicio y Planificación",
          "descripcion": "Acta de constitución, interesados, alcance y EDT."
        },
        {
          "unidad": 3,
          "nombre": "Cronograma y Presupuesto",
          "descripcion": "Ruta crítica, cadena crítica, costes e indicadores financieros."
        },
        {
          "unidad": 4,
          "nombre": "Calidad, Recursos, Comunicaciones y Riesgos",
          "descripcion": "Gestión de calidad, recursos, comunicaciones y análisis de riesgos."
        },
        {
          "unidad": 5,
          "nombre": "Ejecución, Monitorización y Cierre",
          "descripcion": "Dirigir el equipo, control integrado de cambios, valor ganado (EVM) y cierre."
        },
        {
          "unidad": 6,
          "nombre": "Marco Ágil",
          "descripcion": "Lean, Kanban, Scrum, planificación y ejecución ágil, mejora continua."
        }
      ],
      "practicas_seminarios": "Ejercicios prácticos con las herramientas y técnicas de los procesos PMBOK, aplicando el código ético del PMI.",
      "evaluacion_continua": {
        "resumen": "Examen (opción múltiple) 60% + trabajos dirigidos 40%. Si no te presentas al examen = 'No presentado'.",
        "componentes": [
          {
            "nombre": "Examen (opción múltiple)",
            "peso": 60
          },
          {
            "nombre": "Trabajos dirigidos (media ponderada de prácticas)",
            "peso": 40
          }
        ]
      },
      "examenes_parciales": "No.",
      "asistencia_obligatoria": {
        "obligatoria": false,
        "detalle": "Trabajos dirigidos entregables; no se exige asistencia."
      },
      "evaluacion_global": {
        "resumen": "Examen escrito único (100%, máx. 10) con preguntas de opción múltiple y de desarrollo (teoría y práctica).",
        "componentes": [
          {
            "nombre": "Examen escrito único",
            "peso": 100
          }
        ]
      },
      "criterios_evaluacion": "En global, todo se juega en un único examen.",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Baja-media (gestión, memorístico)",
        "tiempo": "Bajo-medio",
        "razon": "Sin necesidad de asistir, la continua reparte la nota (60% examen tipo test + 40% trabajos entregables) y reduce el riesgo de jugarlo todo a una carta. La global es un único examen. Contenido asequible; buena para cerrar el grado."
      }
    },
    {
      "codigo": "501308",
      "nombre": "Tecnologías Web",
      "nombre_en": "Web Technologies",
      "curso": 4,
      "semestre": 8,
      "caracter": "Optativa",
      "ects": 6,
      "modulo": "Tecnologías de la Información",
      "materia": "Gestión de Proyectos y Sistemas de Información",
      "area": "Lenguajes y Sistemas Informáticos",
      "profesores": [
        "José Carlos Sancho Núñez"
      ],
      "descripcion": "Fundamentos y estándares de la Web (HTML, CSS, JavaScript), aplicaciones web dinámicas (Servlets y JSP) y servicios web ReST.",
      "temario": [
        {
          "unidad": 1,
          "nombre": "Introducción – Estándares Web",
          "descripcion": "HTML, CSS y JavaScript; práctica integradora."
        },
        {
          "unidad": 2,
          "nombre": "Páginas web dinámicas – Servlets y JSP",
          "descripcion": "Aplicaciones web dinámicas con Servlets y JSPs."
        },
        {
          "unidad": 3,
          "nombre": "Servicios web",
          "descripcion": "Consumo y provisión de servicios web ReST."
        }
      ],
      "practicas_seminarios": "3 prácticas: web con HTML/CSS/JS, aplicación con Servlets y JSPs, y aplicación basada en servicios web ReST.",
      "evaluacion_continua": {
        "resumen": "Actividades de Grupo Grande (AG) 10% + Entregas de Laboratorio (PL) 50% (mín. 5) + Examen final 40% (mín. 5).",
        "componentes": [
          {
            "nombre": "Actividades de Grupo Grande (AG)",
            "peso": 10
          },
          {
            "nombre": "Entregas de Laboratorio (PL)",
            "peso": 50,
            "nota_minima": 5,
            "recuperable": true
          },
          {
            "nombre": "Examen final (EF)",
            "peso": 40,
            "nota_minima": 5,
            "recuperable": true
          }
        ]
      },
      "examenes_parciales": "No.",
      "asistencia_obligatoria": {
        "obligatoria": false,
        "detalle": "Se recomienda asistencia pero las entregas de laboratorio son evaluables sin exigir presencialidad estricta."
      },
      "evaluacion_global": {
        "resumen": "Entregas de Laboratorio (PL) 50% (mín. 5) + Examen final 50% (mín. 5).",
        "componentes": [
          {
            "nombre": "Entregas de Laboratorio (PL)",
            "peso": 50,
            "nota_minima": 5
          },
          {
            "nombre": "Examen final (EF)",
            "peso": 50,
            "nota_minima": 5
          }
        ]
      },
      "criterios_evaluacion": "Mínimo 5 en examen y en entregas de laboratorio.",
      "veredicto": {
        "compensa": "continua",
        "dificultad": "Media",
        "tiempo": "Medio",
        "razon": "Única OPTATIVA del conjunto (8º semestre). La continua baja el examen al 40% (vs 50% en global) gracias a un 10% de actividades; las prácticas son entregables. Complementa MADAI y cierra el itinerario web."
      }
    }
  ]
}
;
