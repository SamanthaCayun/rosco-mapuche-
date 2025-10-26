// Datos: letras y pistas proporcionadas
const rosco = [
  {letter:'A', word:'Antü', clue:'En mapuche significa sol. Representa el color amarillo de la bandera, símbolo de la energía y la sabiduría.'},
  {letter:'B', word:'Bandera', clue:'Símbolo de identidad con colores que representan el cielo (azul), la tierra (verde), la fuerza (rojo) y la sabiduría (negro).'},
  {letter:'C', word:'Cayun', clue:'Apellido mapuche que puede significar fuerza o justicia.'},
  {letter:'D', word:'Diversidad', clue:'Valor que reconoce las distintas culturas que forman parte de nuestro país.'},
  {letter:'E', word:'Ley 26.160', clue:'Norma que protege los territorios indígenas frente a desalojos y garantiza sus derechos sobre la tierra.'},
  {letter:'F', word:'Flecha', clue:'En la bandera mapuche-tehuelche representa la lucha y la defensa de su cultura.'},
  {letter:'G', word:'Guanaco', clue:'Animal importante para la vida cotidiana y el abrigo del pueblo mapuche.'},
  {letter:'H', word:'Historia', clue:'Relato del pasado que nos ayuda a entender quiénes somos.'},
  {letter:'I', word:'Identidad', clue:'Lo que nos define como personas o pueblos; representada en los símbolos y colores de su bandera.'},
  {letter:'J', word:'Rojo', clue:'Color de la bandera que simboliza la identidad, la fuerza y la sangre derramada en defensa de su pueblo.'},
  {letter:'L', word:'Lonko', clue:'Autoridad o líder de una comunidad mapuche, guía espiritual y social.'},
  {letter:'M', word:'Mapu', clue:'Significa tierra en mapudungun, vinculada al color verde de la bandera.'},
  {letter:'N', word:'Ñuke', clue:'Palabra mapuche que significa madre, símbolo de protección y vida.'},
  {letter:'O', word:'Orgullo', clue:'Sentimiento de valorar y respetar las raíces y la herencia cultural.'},
  {letter:'P', word:'Pewma', clue:'Sueño o visión espiritual que guía a las personas; representado con el color azul, símbolo del cielo.'},
  {letter:'Q', word:'Quimün', clue:'Sabiduría o conocimiento ancestral; su color es el negro, símbolo del saber profundo.'},
  {letter:'R', word:'Ruca', clue:'Vivienda tradicional de madera y barro donde habita la familia mapuche.'},
  {letter:'S', word:'Solidaridad', clue:'Valor fundamental de ayuda y respeto mutuo dentro de la comunidad.'},
  {letter:'T', word:'Trutruka', clue:'Instrumento musical mapuche hecho de caña, usado en ceremonias y celebraciones.'},
  {letter:'U', word:'Unidad', clue:'Representa la unión del pueblo para defender sus derechos y tradiciones.'},
  {letter:'V', word:'Verde', clue:'Color que representa la naturaleza, la medicina y la conexión con la tierra.'},
  {letter:'W', word:'Wenufoye', clue:'Significa “Canelo del Cielo”; es la bandera mapuche creada en 1992 como símbolo de identidad y resistencia.'},
  {letter:'Z', word:'Zomo', clue:'Mujer, en lengua mapuche; símbolo de fortaleza, sabiduría y continuidad cultural.'}
];

// Estado del juego
const state = rosco.map(r => ({...r, status:'pending'}));
const lettersEl = document.getElementById('letters');
const clueEl = document.getElementById('clue');
const answerEl = document.getElementById('answer');
const submitBtn = document.getElementById('submit');
const skipBtn = document.getElementById('skip');
const revealBtn = document.getElementById('reveal');
const resetBtn = document.getElementById('reset');
const progressEl = document.getElementById('progress');
const correctEl = document.getElementById('correct');

// Normaliza texto (sin tildes, minúsculas)
function normalize(text) {
  return text.toString().trim().toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ');
}

// Dibuja las letras en círculo
function renderLetters() {
  lettersEl.innerHTML = '';
  const total = state.length;
  const radius = 190;
  state.forEach((item, i) => {
    const angle = (360 / total) * i - 90;
    const rad = angle * (Math.PI / 180);
    const cx = radius * Math.cos(rad);
    const cy = radius * Math.sin(rad);
    const el = document.createElement('div');
    el.className = 'letter';
    el.dataset.index = i;
    el.style.left = `calc(50% + ${cx}px)`;
    el.style.top = `calc(50% + ${cy}px)`;
    el.textContent = item.letter;
    if (item.status === 'correct') el.classList.add('correct');
    if (item.status === 'wrong') el.classList.add('wrong');
    el.addEventListener('click', () => selectLetter(i));
    lettersEl.appendChild(el);
  });
}

let currentIndex = null;

function selectLetter(i) {
  currentIndex = i;
  document.querySelectorAll('.letter').forEach(el => el.classList.remove('current'));
  const el = document.querySelector(`.letter[data-index='${i}']`);
  if (el) el.classList.add('current');
  const data = state[i];
  clueEl.textContent = `${data.letter} — ${data.clue}`;
  answerEl.value = '';
  answerEl.focus();
}

function updateStats() {
  const done = state.filter(s => s.status !== 'pending').length;
  const correct = state.filter(s => s.status === 'correct').length;
  progressEl.textContent = `${done} / ${state.length} completados`;
  correctEl.textContent = `Aciertos: ${correct}`;
}

function checkAnswer() {
  if (currentIndex === null) return alert('Selecciona primero una letra.');
  const user = normalize(answerEl.value || '');
  const target = normalize(state[currentIndex].word || '');
  if (!user) { alert('Escribe una respuesta antes de comprobar.'); return; }

  if (user === target) {
    state[currentIndex].status = 'correct';
    markLetter(currentIndex, 'correct');
    clueEl.textContent = `✅ ¡Correcto! ${state[currentIndex].letter} — ${state[currentIndex].word}`;
  } else {
    state[currentIndex].status = 'wrong';
    markLetter(currentIndex, 'wrong');
    clueEl.textContent = `❌ Incorrecto. La respuesta era ${state[currentIndex].word}.`;
  }
  updateStats();
}

function markLetter(i, cls) {
  const el = document.querySelector(`.letter[data-index='${i}']`);
  if (!el) return;
  el.classList.remove('current');
  el.classList.add(cls);
}

function skipLetter() {
  if (currentIndex === null) return alert('Selecciona una letra primero');
  clueEl.textContent = `Pasaste la letra ${state[currentIndex].letter}.`;
  document.querySelectorAll('.letter').forEach(el => el.classList.remove('current'));
  currentIndex = null;
  answerEl.value = '';
}

function revealAnswer() {
  if (currentIndex === null) return alert('Selecciona una letra primero');
  clueEl.textContent = `${state[currentIndex].letter} — RESPUESTA: ${state[currentIndex].word}`;
  state[currentIndex].status = 'correct';
  markLetter(currentIndex, 'correct');
  updateStats();
}

function resetAll() {
  if (!confirm('¿Reiniciar el rosco? Se borrarán los progresos.')) return;
  state.forEach(s => s.status = 'pending');
  currentIndex = null;
  renderLetters();
  clueEl.textContent = 'Selecciona una letra para ver la pista.';
  updateStats();
}

// Eventos
submitBtn.addEventListener('click', () => { checkAnswer(); });
skipBtn.addEventListener('click', () => { skipLetter(); });
revealBtn.addEventListener('click', () => { revealAnswer(); });
resetBtn.addEventListener('click', () => { resetAll(); });

answerEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    checkAnswer();
  }
});

// Inicialización
renderLetters();
updateStats();
selectLetter(0);
