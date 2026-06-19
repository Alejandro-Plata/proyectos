/* ============================================================
   Planes Docentes GIITI — lógica de la interfaz
   ============================================================ */

const DB = window.DB;
const ASIG = DB.asignaturas;
const byCode = Object.fromEntries(ASIG.map(a => [a.codigo, a]));

const CURSO_LABEL = {
  1: { rom: "1er curso", note: "Formación básica" },
  2: { rom: "2º curso", note: "Núcleo de la rama de Informática" },
  3: { rom: "3er curso", note: "Tecnologías de la Información (especialidad)" },
  4: { rom: "4º curso", note: "Especialidad + optativa" }
};
const VEREDICTO_LABEL = { global: "Global", continua: "Continua", indiferente: "Indiferente" };

/* ---------------- Tema claro/oscuro ---------------- */
const themeBtn = document.getElementById("themeBtn");
const savedTheme = localStorage.getItem("pd-theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
themeBtn.addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme");
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("pd-theme", next);
});

/* ---------------- Utilidades ---------------- */
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function caracterClass(c) {
  const l = (c || "").toLowerCase();
  if (l.includes("básica") || l.includes("basica")) return "caracter-basica";
  if (l.includes("optativa")) return "caracter-optativa";
  return "caracter-obligatoria";
}

/* ---------------- Catálogo ---------------- */
const catalogEl = document.getElementById("catalog");
const searchEl = document.getElementById("search");
const fCurso = document.getElementById("filterCurso");
const fCaracter = document.getElementById("filterCaracter");
const fVeredicto = document.getElementById("filterVeredicto");
const countEl = document.getElementById("count");

function cardHTML(a) {
  const v = a.veredicto.compensa;
  return `
    <div class="card v-${v}" data-code="${a.codigo}">
      <div class="c-top">
        <h4>${esc(a.nombre)}</h4>
        <span class="code">${esc(a.codigo)}</span>
      </div>
      <div class="profs">${esc(a.profesores.join(", "))}</div>
      <div class="tags">
        <span class="tag sem">Sem. ${a.semestre}</span>
        <span class="tag ${caracterClass(a.caracter)}">${esc(a.caracter)}</span>
        <span class="tag">${a.ects} ECTS</span>
        <span class="badge ${v}">${VEREDICTO_LABEL[v]}</span>
      </div>
      <div class="veredicto-line"><strong>Dificultad:</strong> ${esc(a.veredicto.dificultad)}</div>
    </div>`;
}

function render() {
  const q = searchEl.value.trim().toLowerCase();
  const cCurso = fCurso.value;
  const cCar = fCaracter.value;
  const cVer = fVeredicto.value;

  let list = ASIG.filter(a => {
    if (cCurso && String(a.curso) !== cCurso) return false;
    if (cCar && !(a.caracter || "").toLowerCase().includes(cCar.toLowerCase())) return false;
    if (cVer && a.veredicto.compensa !== cVer) return false;
    if (q) {
      const hay = (a.nombre + " " + a.codigo + " " + a.profesores.join(" ") + " " + a.materia).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  countEl.textContent = `${list.length} de ${ASIG.length} asignaturas`;

  const cursos = [1, 2, 3, 4];
  let html = "";
  cursos.forEach(c => {
    const grp = list.filter(a => a.curso === c).sort((x, y) => x.semestre - y.semestre || x.nombre.localeCompare(y.nombre));
    if (!grp.length) return;
    const totalEcts = grp.reduce((s, a) => s + a.ects, 0);
    html += `<div class="year-group">
      <div class="year-head">
        <h3>${CURSO_LABEL[c].rom}</h3>
        <span class="y-meta">${CURSO_LABEL[c].note} · ${grp.length} asignaturas · ${totalEcts} ECTS</span>
      </div>
      <div class="grid">${grp.map(cardHTML).join("")}</div>
    </div>`;
  });
  catalogEl.innerHTML = html || `<p class="section-sub">No hay asignaturas que coincidan con el filtro.</p>`;

  catalogEl.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => openModal(card.dataset.code));
  });
}

[searchEl, fCurso, fCaracter, fVeredicto].forEach(el => el.addEventListener("input", render));

function renderStats() {
  const total = ASIG.length;
  const ects = ASIG.reduce((s, a) => s + a.ects, 0);
  const nGlobal = ASIG.filter(a => a.veredicto.compensa === "global").length;
  const nContinua = ASIG.filter(a => a.veredicto.compensa === "continua").length;
  const tiles = [
    { n: total, l: "Asignaturas", cls: "" },
    { n: ects, l: "ECTS en total", cls: "" },
    { n: nContinua, l: "Convienen en continua", cls: "ok" },
    { n: nGlobal, l: "Convienen en global", cls: "warn" }
  ];
  document.getElementById("stats").innerHTML = tiles.map(t =>
    `<div class="stat"><div class="n ${t.cls}">${t.n}</div><div class="l">${t.l}</div></div>`
  ).join("");
}

/* ---------------- Modal de detalle ---------------- */
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");

function evalBox(title, ev) {
  if (!ev) return "";
  const comps = (ev.componentes || []).map(c => {
    const extra = c.nota || (c.nota_minima ? `Nota mínima ${c.nota_minima}` : "") +
      (c.recuperable === false ? (c.nota_minima ? " · No recuperable" : "No recuperable") : "");
    return `<div class="comp">
      <span class="c-name">${esc(c.nombre)}${extra ? `<small>${esc(extra)}</small>` : ""}</span>
      <span class="c-peso">${c.peso}%</span>
    </div>`;
  }).join("");
  return `<div class="eval-box">
    <h4>${esc(title)}</h4>
    <div class="resumen">${esc(ev.resumen)}</div>
    ${comps}
  </div>`;
}

function modalHTML(a) {
  const v = a.veredicto.compensa;
  const att = a.asistencia_obligatoria || {};
  const temario = (a.temario || []).map(t => `
    <li>
      <div class="t-name"><span class="t-num">${t.unidad}.</span>${esc(t.nombre)}</div>
      ${t.descripcion ? `<div class="t-desc">${esc(t.descripcion)}</div>` : ""}
    </li>`).join("");

  return `
    <div class="modal-head">
      <div>
        <h2>${esc(a.nombre)}</h2>
        <div class="sub">${esc(a.nombre_en)} · Código ${esc(a.codigo)}</div>
      </div>
      <button class="close-btn" id="closeBtn" aria-label="Cerrar">×</button>
    </div>
    <div class="modal-body">
      <div class="block">
        <dl class="kv">
          <dt>Curso / Semestre</dt><dd>${CURSO_LABEL[a.curso].rom} · Semestre ${a.semestre}</dd>
          <dt>Carácter / ECTS</dt><dd>${esc(a.caracter)} · ${a.ects} ECTS</dd>
          <dt>Módulo / Materia</dt><dd>${esc(a.modulo)} · ${esc(a.materia)}</dd>
          <dt>Área</dt><dd>${esc(a.area)}</dd>
          <dt>Profesorado</dt><dd>${esc(a.profesores.join(", "))}</dd>
        </dl>
      </div>

      ${a.descripcion ? `<div class="block"><h3>Descripción</h3><p style="margin:0;font-size:.9rem;color:var(--text-soft)">${esc(a.descripcion)}</p></div>` : ""}

      <div class="block">
        <h3>Temario</h3>
        <ol class="temario">${temario}</ol>
      </div>

      ${a.practicas_seminarios ? `<div class="block"><h3>Prácticas / Seminarios</h3><p style="margin:0;font-size:.88rem;color:var(--text-soft)">${esc(a.practicas_seminarios)}</p></div>` : ""}

      ${a.examenes_parciales ? `<div class="block"><h3>Exámenes parciales</h3><p style="margin:0;font-size:.88rem;color:var(--text-soft)">${esc(a.examenes_parciales)}</p></div>` : ""}

      <div class="block">
        <h3>Sistemas de evaluación</h3>
        <div class="eval-cols">
          ${evalBox("Evaluación continua", a.evaluacion_continua)}
          ${evalBox("Evaluación global", a.evaluacion_global)}
        </div>
        <p class="attend-flag ${att.obligatoria ? "yes" : "no"}">
          ${att.obligatoria ? "⚠ Asistencia relevante: " : "✓ Sin asistencia obligatoria: "}${esc(att.detalle || "")}
        </p>
      </div>

      ${a.criterios_evaluacion ? `<div class="block"><h3>Criterios de evaluación</h3><p style="margin:0;font-size:.88rem;color:var(--text-soft)">${esc(a.criterios_evaluacion)}</p></div>` : ""}

      <div class="block">
        <h3>¿Compensa la evaluación global?</h3>
        <div class="callout ${v}">
          <strong>Recomendación: ${VEREDICTO_LABEL[v]}</strong> — ${esc(a.veredicto.razon)}
          <div class="verline"><strong>Dificultad:</strong> ${esc(a.veredicto.dificultad)} · <strong>Tiempo estimado:</strong> ${esc(a.veredicto.tiempo)}</div>
        </div>
      </div>
    </div>`;
}

function openModal(code) {
  const a = byCode[code];
  if (!a) return;
  modal.innerHTML = modalHTML(a);
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  document.getElementById("closeBtn").addEventListener("click", closeModal);
}
function closeModal() {
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}
overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* ============================================================
   PLAN RECOMENDADO 4 AÑOS
   ============================================================ */
const PLAN = [
  {
    curso: 1,
    titulo: "Cimientos · 5 asignaturas",
    pill: "Carga ligera: aprovéchala para asentar la base",
    why: "Es el año más descargado (5 asignaturas). No tengas prisa por sumar más: la prioridad es <strong>Estructuras de Datos</strong> (sostiene toda la línea de programación) y no arrastrar las dos más ajenas y duras para un informático: <strong>Física</strong> y <strong>Electrónica</strong>. Como puedes ir al laboratorio, en ambas haces la continua y aprovechas los parciales/prácticas en vez de jugártelo todo a un examen global.",
    semestres: [
      { nombre: "Semestre 1", asig: [
        { code: "501422", note: "Base matemática. Sin laboratorio que bloquee y con 30% de actividades recuperables → continua." },
        { code: "501424", note: "La más dura del año. Ahora que vas al laboratorio, continua: parciales eliminatorios (65%) + laboratorio (20%). Empieza pronto." }
      ]},
      { nombre: "Semestre 2", asig: [
        { code: "501429", note: "LA asignatura clave del año: Java y estructuras de datos. Entregas → continua (examen solo 45%)." },
        { code: "501430", note: "Ensamblador NASM. Asistes al laboratorio → continua (50% teoría + 50% prácticas en el aula)." },
        { code: "501431", note: "Electrónica: dura. Con asistencia al laboratorio la continua es viable (pierdes ~6% de asistencia a teoría). Reserva tiempo extra." }
      ]}
    ]
  },
  {
    curso: 2,
    titulo: "Núcleo informático · 8 asignaturas",
    pill: "Año pico: el más exigente en volumen",
    why: "Es el curso con más asignaturas (8). Equilibra cada semestre mezclando una dura con otra asequible. <strong>Análisis y Diseño de Algoritmos</strong> es muy favorable (80% trabajos entregables). <strong>ASLEPI</strong> sirve de respiro. Ojo con las dos de redes (Fundamentos y Redes de Ordenadores): su continua cuenta la asistencia a teoría con un máximo de faltas, así que en esas dos irás por <em>global</em>.",
    semestres: [
      { nombre: "Semestre 3", asig: [
        { code: "501309", note: "Continúa la línea de Java tras Estructuras de Datos. Entregas → continua." },
        { code: "501426", note: "Redes (OSI/TCP-IP). La asistencia de continua cuenta la teoría (máx. 3 faltas) → global (60% teoría + 40% prácticas)." },
        { code: "501432", note: "Grafos, teoría de números y métodos numéricos. Vas al laboratorio → continua (2 parciales 70% + lab 30%)." },
        { code: "502369", note: "Ensamblador MIPS. Asistes a laboratorio y tutorías ECTS → continua (recuperas el 45% práctico)." }
      ]},
      { nombre: "Semestre 4", asig: [
        { code: "501307", note: "Muy rentable: continua = 80% trabajos entregables + 20% examen. Entrega pronto para maximizar nota." },
        { code: "502363", note: "Respiro: jurídico/ético. Asistes a los seminarios y presentas → continua (examen 60% + prácticas)." },
        { code: "502370", note: "Programación paralela (OpenMP/MPI). Entregas de laboratorio (≥80%) → continua." },
        { code: "502375", note: "Cisco. Igual que Fundamentos de Redes: asistencia de teoría con máx. 3 faltas → global. Cúrsala después de aquella." }
      ]}
    ]
  },
  {
    curso: 3,
    titulo: "Especialidad TI · 8 asignaturas",
    pill: "Segundo año pico: mucho laboratorio técnico",
    why: "Otras 8 asignaturas, con bastante laboratorio (C/Unix, distribuidos, hardware): como puedes asistir, casi todas van por continua y eso te evita exámenes prácticos globales. Compénsalas con <strong>Inglés</strong> (semestre 6). La excepción es <strong>Gestión de las Organizaciones</strong>: sus trabajos se hacen en clase de teoría, así que ahí vas por global. <strong>Sistemas de Información</strong> es la más cómoda (60% prácticas por campus virtual).",
    semestres: [
      { nombre: "Semestre 5", asig: [
        { code: "501446", note: "Procesos y memoria en C/Unix. Ahora que vas al laboratorio, la continua de prácticas (45%) es accesible → continua. Domina C." },
        { code: "501453", note: "Criptografía. Asistes a prácticas y ECTS → continua (examen 50% + práctica 30% + ECTS/participación 20%)." },
        { code: "502364", note: "Bases de datos/Big Data. La más cómoda: continua = 60% prácticas (campus virtual) + 40% examen." },
        { code: "502367", note: "Ingeniería del Software (UML/PSP). Defiendes los trabajos en seminario → continua; solo pierdes parte del 10% de asistencia a teoría." }
      ]},
      { nombre: "Semestre 6", asig: [
        { code: "501320", note: "Blanda (empresa). Los trabajos y la exposición son en clase de teoría → global (examen único). Buen contrapeso." },
        { code: "501448", note: "Inglés B1. Las prácticas de laboratorio son asistibles → continua (examen 50% + oral + prácticas). Llevadera." },
        { code: "502368", note: "Distribuidos y tiempo real (C/POSIX): la más técnica. Asistes al laboratorio y defiendes → continua." },
        { code: "502376", note: "VHDL/FPGA: dura. Trabajos en laboratorio (40%) + 2 parciales (60%) → continua. Reserva tiempo." }
      ]}
    ]
  },
  {
    curso: 4,
    titulo: "Cierre · 4 asignaturas",
    pill: "Año descargado: ideal para el TFG",
    why: "Solo 4 asignaturas (las que tienes plan docente). Año cómodo para rematar y dedicar tiempo al Trabajo Fin de Grado (no incluido en estos planes). Las tres obligatorias son de programación/gestión con entregas → continua. La optativa <strong>Tecnologías Web</strong> cierra el itinerario web y se apoya en MADAI.",
    semestres: [
      { nombre: "Semestre 7", asig: [
        { code: "502365", note: "IA/Machine Learning. Continua = 60% prácticas entregables + 40% examen → quédate en continua." },
        { code: "502371", note: "Spring Boot. Continua y global tienen pesos idénticos (60/40) y trabajos entregables → elige por comodidad." },
        { code: "502374", note: "Gestión de proyectos (PMBOK): blanda. Continua reparte la nota (test 60% + trabajos 40%)." }
      ]},
      { nombre: "Semestre 8", asig: [
        { code: "501308", note: "Optativa. Cierra la línea web (HTML/JS, Servlets, ReST). Continua baja el examen al 40%; prácticas asistibles." }
      ]}
    ]
  }
];

function planListItem(item) {
  const a = byCode[item.code];
  if (!a) return "";
  const v = a.veredicto.compensa;
  return `<li class="v-${v}">
    <span class="dot ${v}" title="${VEREDICTO_LABEL[v]}"></span>
    <span class="pl-name"><a href="#" data-open="${a.codigo}">${esc(a.nombre)}</a></span>
    <span class="badge ${v}">${VEREDICTO_LABEL[v]}</span>
    <span class="tag">${a.ects} ECTS</span>
    <span class="pl-note">${esc(item.note)}</span>
  </li>`;
}

function renderPlan() {
  const intro = `<div class="plan-intro">
    <strong>Objetivo:</strong> superar las 25 asignaturas en 4 cursos. El plan sigue el orden oficial por semestres (cada asignatura solo se imparte en el suyo) y respeta las recomendaciones de prerrequisitos.
    Como <strong>puedes asistir a las sesiones prácticas (laboratorio/seminarios) pero no a las clases de teoría</strong>, la <em>evaluación continua</em> vuelve a ser viable en casi todas: las prácticas presenciales y las entregas bajan el peso del examen. La <em>evaluación global</em> solo conviene cuando la continua exige asistir a la teoría con un límite de faltas (las dos asignaturas de redes) o cuando los trabajos se hacen dentro de la clase de teoría (<strong>Gestión de las Organizaciones</strong>).
    Los años 2 y 3 son el cuello de botella (8 asignaturas cada uno): equilibra siempre asignaturas duras con otras blandas, y prioriza dejar aprobadas <strong>Estructuras de Datos</strong>, <strong>Física</strong> y <strong>Electrónica</strong> en 1º para no arrastrarlas.
    <div class="legend">
      <span><i class="dot continua"></i> Conviene continua (con prácticas)</span>
      <span><i class="dot global"></i> Conviene global (continua exige teoría)</span>
      <span><i class="dot indiferente"></i> Indiferente</span>
    </div>
  </div>`;

  const years = PLAN.map(y => {
    const totalEcts = y.semestres.flatMap(s => s.asig).reduce((sum, it) => sum + (byCode[it.code]?.ects || 0), 0);
    const sems = y.semestres.map(s => `
      <div class="plan-sem">
        <h5>${esc(s.nombre)}</h5>
        <ul class="plan-list">${s.asig.map(planListItem).join("")}</ul>
      </div>`).join("");
    return `<div class="plan-year">
      <div class="plan-year-head">
        <span class="yn">${y.curso}º</span>
        <h3>${esc(y.titulo)}</h3>
        <span class="pill">${esc(y.pill)}</span>
        <span class="pill ects">${totalEcts} ECTS</span>
      </div>
      <div class="plan-year-body">
        <p class="why">${y.why}</p>
        ${sems}
      </div>
    </div>`;
  }).join("");

  document.getElementById("planContent").innerHTML = intro + years;

  document.querySelectorAll('[data-open]').forEach(el => {
    el.addEventListener("click", e => { e.preventDefault(); openModal(el.dataset.open); });
  });
}

/* ---------------- Init ---------------- */
renderStats();
render();
renderPlan();
