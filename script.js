// script.js - core logic for "1秒後に死ぬ君"

// ----- Data -----
const occupations = [
  "会社員・公務員",
  "医療・福祉職",
  "教育職",
  "運転・配送職",
  "建設・工場・現場職",
  "飲食・接客業",
  "IT・技術職",
  "自営業・経営者",
  "警察・消防・自衛官",
  "スポーツ・芸能・クリエイター",
  "学生",
  "無職・その他"
];

const situations = [
  "自宅でくつろいでいる",
  "睡眠中",
  "通勤・通学中",
  "電車・バスで移動中",
  "自動車で移動中",
  "徒歩で移動中",
  "自転車で移動中",
  "勤務中",
  "高所作業中",
  "食事中",
  "入浴中",
  "運動中",
  "スポーツ中",
  "買い物中",
  "屋外で遊んでいる",
  "旅行中",
  "ランダム"
];

// Event schema example:
// {
//   id: 1,
//   name: "自動車同士の衝突",
//   category: "交通事故",
//   tags: ["現実系", "交通事故"],
//   occupations: ["運転・配送職", "警察・消防・自衛官"], // empty = all
//   situations: ["自動車で移動中", "通勤・通学中"], // empty = all
//   baseWeight: 10,
//   ageMod: { "<20": 1.2, "20-40": 1, "40-60": 0.9, ">60": 0.8 },
//   healthMod: { "健康": 1, "疲労気味": 0.9, "持病あり": 0.8, "不健康": 0.7 },
//   personalityMod: { "慎重": 0.9, "大胆": 1.1, "のんびり": 1, "せっかち": 1.2, "臆病": 0.8, "好奇心旺盛": 1.2, "ランダム": 1 },
//   result: "death", // or "survive"
//   description: "{{name}}は{{situation}}で{{cause}}により死亡しました。"
// }

// For prototype we create a limited set (~60 events) with simple modifiers.
const events = [
  // 交通事故 (10 events)
  { id: 1, name: "自動車同士の衝突", category: "交通事故", tags: ["現実系"], occupations: ["運転・配送職"], situations: ["自動車で移動中", "通勤・通学中"], baseWeight: 12, result: "death", description: "{{name}}は{{situation}}で{{event}}に遭い、致命的な事故に..." },
  { id: 2, name: "歩行中の車との接触", category: "交通事故", tags: ["現実系"], occupations: [], situations: ["徒歩で移動中", "自転車で移動中"], baseWeight: 8, result: "death", description: "{{name}}は{{situation}}で{{event}}に巻き込まれた。" },
  { id: 3, name: "自転車での転倒", category: "交通事故", tags: ["現実系"], occupations: [], situations: ["自転車で移動中"], baseWeight: 6, result: "death", description: "{{name}}は{{situation}}で{{event}}し、重傷で..." },
  { id: 4, name: "バイク事故", category: "交通事故", tags: ["現実系"], occupations: [], situations: ["自動車で移動中", "徒歩で移動中"], baseWeight: 5, result: "death", description: "{{name}}は{{situation}}で{{event}}に遭遇した。" },
  { id: 5, name: "バス事故", category: "交通事故", tags: ["現実系"], occupations: [], situations: ["電車・バスで移動中"], baseWeight: 7, result: "death", description: "{{name}}は{{situation}}で{{event}}で..." },
  { id: 6, name: "列車事故", category: "交通事故", tags: ["現実系"], occupations: [], situations: ["電車・バスで移動中"], baseWeight: 4, result: "death", description: "{{name}}は{{situation}}で{{event}}に巻き込まれる。" },
  { id: 7, name: "船舶事故", category: "交通事故", tags: ["現実系"], occupations: [], situations: ["旅行中"], baseWeight: 3, result: "death", description: "{{name}}は{{situation}}で{{event}}に遭い、沈没した。" },
  { id: 8, name: "航空機事故", category: "交通事故", tags: ["現実系"], occupations: [], situations: ["旅行中"], baseWeight: 2, result: "death", description: "{{name}}は{{situation}}で{{event}}に巻き込まれた。" },
  { id: 9, name: "自転車と犬の衝突", category: "交通事故", tags: ["ネタ系"], occupations: [], situations: ["自転車で移動中"], baseWeight: 4, result: "death", description: "{{name}}は{{situation}}で犬と衝突し、致命的な怪我を負った。" },
  { id: 10, name: "スケートボードでの転倒", category: "交通事故", tags: ["ネタ系"], occupations: [], situations: ["屋外で遊んでいる"], baseWeight: 4, result: "death", description: "{{name}}は{{situation}}で{{event}}し、奇跡的に..." },
  // 病気 (8 events)
  { id: 11, name: "心臓発作", category: "病気による死亡", tags: ["現実系"], occupations: [], situations: [], baseWeight: 9, result: "death", description: "{{name}}は{{situation}}で突然の{{event}}に倒れた。" },
  { id: 12, name: "急性脳卒中", category: "病気による死亡", tags: ["現実系"], occupations: [], situations: [], baseWeight: 7, result: "death", description: "{{name}}は{{situation}}で{{event}}に見舞われた。" },
  { id: 13, name: "食中毒", category: "病気による死亡", tags: ["現実系"], occupations: [], situations: ["食事中"], baseWeight: 6, result: "death", description: "{{name}}は{{situation}}で{{event}}し、命を落とした。" },
  { id: 14, name: "アレルギーショック", category: "病気による死亡", tags: ["現実系"], occupations: [], situations: [], baseWeight: 5, result: "death", description: "{{name}}は{{situation}}で{{event}}に襲われた。" },
  { id: 15, name: "謎のウイルス感染", category: "病気による死亡", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 3, result: "death", description: "{{name}}は{{situation}}で{{event}}に感染し、…" },
  { id: 16, name: "過労死", category: "病気による死亡", tags: ["現実系"], occupations: ["会社員・公務員", "IT・技術職"], situations: ["勤務中"], baseWeight: 4, result: "death", description: "{{name}}は{{situation}}で過労が原因の{{event}}に。" },
  { id: 17, name: "古代呪いによる崩壊", category: "病気による死亡", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 2, result: "death", description: "{{name}}は{{situation}}で古代の{{event}}にかかった。" },
  { id: 18, name: "過度のカフェイン摂取", category: "病気による死亡", tags: ["ネタ系"], occupations: [], situations: ["飲食・接客業"], baseWeight: 2, result: "death", description: "{{name}}は{{situation}}で{{event}}により心停止した。" },
  // 犯罪・事件 (6 events)
  { id: 19, name: "強盗事件に巻き込まれる", category: "犯罪・事件", tags: ["現実系"], occupations: [], situations: [], baseWeight: 7, result: "death", description: "{{name}}は{{situation}}で{{event}}に遭遇し、命を失った。" },
  { id: 20, name: "通り魔に刺される", category: "犯罪・事件", tags: ["現実系"], occupations: [], situations: [], baseWeight: 6, result: "death", description: "{{name}}は{{situation}}で{{event}}に..." },
  { id: 21, name: "サイバー攻撃で心臓が止まる", category: "犯罪・事件", tags: ["ネタ系"], occupations: ["IT・技術職"], situations: [], baseWeight: 3, result: "death", description: "{{name}}は{{situation}}で{{event}}に驚き、心停止した。" },
  { id: 22, name: "謎の黒装束に誘拐される", category: "犯罪・事件", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 2, result: "death", description: "{{name}}は{{situation}}で{{event}}に遭い、未知の結末に。" },
  { id: 23, name: "宝くじ当選で事件に巻き込まれる", category: "犯罪・事件", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 3, result: "death", description: "{{name}}は{{situation}}で{{event}}により..." },
  { id: 24, name: "警察官に誤射される", category: "犯罪・事件", tags: ["現実系"], occupations: ["警察・消防・自衛官"], situations: [], baseWeight: 4, result: "death", description: "{{name}}は{{situation}}で{{event}}に..." },
  // 超常・ネタ系 (8 events, some survival)
  { id: 25, name: "UFOに連れ去られる", category: "超常現象・架空イベント", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 5, result: "survive", description: "{{name}}は{{situation}}で{{event}}に遭遇し、宇宙船へ...しかし無事帰還した。" },
  { id: 26, name: "隕石が直撃", category: "超常現象・架空イベント", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 4, result: "death", description: "{{name}}は{{situation}}で{{event}}により..." },
  { id: 27, name: "コピー機が襲ってくる", category: "超常現象・架空イベント", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 4, result: "death", description: "{{name}}は{{situation}}で突然の{{event}}に..." },
  { id: 28, name: "巨大なプリンが落ちてくる", category: "超常現象・架空イベント", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 3, result: "survive", description: "{{name}}は{{situation}}で{{event}}を受け、奇跡的に生き延びた。" },
  { id: 29, name: "地面が突然消える", category: "超常現象・架空イベント", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 2, result: "death", description: "{{name}}は{{situation}}で{{event}}に足を取られた。" },
  { id: 30, name: "鳩に世界の命運を握られる", category: "超常現象・架空イベント", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 1, result: "survive", description: "{{name}}は{{situation}}で鳩に出会い、奇跡的に助かる。" },
  { id: 31, name: "異世界に転送される", category: "超常現象・架空イベント", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 2, result: "survive", description: "{{name}}は{{situation}}で{{event}}し、別世界で新たな人生を歩む。" },
  { id: 32, name: "スパゲッティ・モンスターの襲撃", category: "超常現象・架空イベント", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 2, result: "death", description: "{{name}}は{{situation}}で{{event}}に食べられた。" },
  // その他の日常事故 (6 events)
  { id: 33, name: "階段から転落", category: "転倒・転落・墜落", tags: ["現実系"], occupations: [], situations: [], baseWeight: 8, result: "death", description: "{{name}}は{{situation}}で{{event}}し、重傷で..." },
  { id: 34, name: "高所から転落", category: "転倒・転落・墜落", tags: ["現実系"], occupations: [], situations: [], baseWeight: 5, result: "death", description: "{{name}}は{{situation}}で{{event}}した。" },
  { id: 35, name: "足を滑らせて転倒", category: "転倒・転落・墜落", tags: ["現実系"], occupations: [], situations: [], baseWeight: 6, result: "death", description: "{{name}}は{{situation}}で{{event}}し、致命的な頭部外傷。" },
  { id: 36, name: "落下物に巻き込まれる", category: "転倒・転落・墜落", tags: ["現実系"], occupations: [], situations: [], baseWeight: 4, result: "death", description: "{{name}}は{{situation}}で{{event}}により..." },
  { id: 37, name: "火事で焼き尽くされる", category: "火災・爆発", tags: ["現実系"], occupations: [], situations: [], baseWeight: 6, result: "death", description: "{{name}}は{{situation}}で{{event}}により..." },
  { id: 38, name: "スパークプラグが爆発", category: "火災・爆発", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 3, result: "death", description: "{{name}}は{{situation}}で{{event}}に巻き込まれた。" },
  // 労働災害 (5 events)
  { id: 39, name: "機械に巻き込まれる", category: "労働災害・作業事故", tags: ["現実系"], occupations: ["建設・工場・現場職", "運転・配送職"], situations: [], baseWeight: 5, result: "death", description: "{{name}}は{{situation}}で{{event}}に..." },
  { id: 40, name: "化学薬品の漏洩", category: "労働災害・作業事故", tags: ["現実系"], occupations: ["医療・福祉職", "建設・工場・現場職"], situations: [], baseWeight: 4, result: "death", description: "{{name}}は{{situation}}で{{event}}に曝露し..." },
  { id: 41, name: "高所作業で落下物に衝突", category: "労働災害・作業事故", tags: ["現実系"], occupations: ["高所作業中"], situations: ["高所作業中"], baseWeight: 3, result: "death", description: "{{name}}は{{situation}}で{{event}}に当たり..." },
  { id: 42, name: "電気ショック", category: "労働災害・作業事故", tags: ["現実系"], occupations: ["IT・技術職"], situations: [], baseWeight: 2, result: "death", description: "{{name}}は{{situation}}で{{event}}により心停止した。" },
  { id: 43, name: "工具の誤使用", category: "労働災害・作業事故", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 2, result: "death", description: "{{name}}は{{situation}}で{{event}}で..." },
  // 生存系 (5 events)
  { id: 44, name: "奇跡的に助かる", category: "予想外の生存", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 6, result: "survive", description: "{{name}}は{{situation}}で{{event}}したが、奇跡的に助かった！" },
  { id: 45, name: "スーパーヒーローに救助される", category: "予想外の生存", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 4, result: "survive", description: "{{name}}は{{situation}}で危機に直面したが、スーパーヒーローが救出した。" },
  { id: 46, name: "タイムリープで回避", category: "予想外の生存", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 3, result: "survive", description: "{{name}}は{{situation}}で{{event}}し、時間を遡って無事に…" },
  { id: 47, name: "泥棒に助けられる", category: "予想外の生存", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 2, result: "survive", description: "{{name}}は{{situation}}で危機に瀕したが、泥棒が助けてくれた。" },
  { id: 48, name: "自分の影が守ってくれる", category: "予想外の生存", tags: ["ネタ系"], occupations: [], situations: [], baseWeight: 2, result: "survive", description: "{{name}}は{{situation}}で{{event}}により、無事に..." }
];

// ----- Utilities -----
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomChoice(arr) {
  return arr[randInt(0, arr.length - 1)];
}
function weightedRandom(eventsList) {
  const total = eventsList.reduce((sum, e) => sum + e.weight, 0);
  let r = Math.random() * total;
  for (const e of eventsList) {
    if (r < e.weight) return e;
    r -= e.weight;
  }
  return eventsList[eventsList.length - 1];
}
function calculateBMI(heightCm, weightKg) {
  if (!heightCm || !weightKg) return null;
  const heightM = heightCm / 100;
  return (weightKg / (heightM * heightM)).toFixed(1);
}
// ----- UI Navigation -----
const screens = {
  title: document.getElementById('title-screen'),
  character: document.getElementById('character-screen'),
  situation: document.getElementById('situation-screen'),
  fate: document.getElementById('fate-screen'),
  result: document.getElementById('result-screen')
};
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}
// ----- Init -----
function init() {
  // Populate occupation select
  const occSelect = document.getElementById('occupation');
  occupations.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o; opt.textContent = o; occSelect.appendChild(opt);
  });
  // Populate situation select
  const sitSelect = document.getElementById('situation');
  situations.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s; sitSelect.appendChild(opt);
  });
  // Body mode toggle
  document.getElementById('body-mode').addEventListener('change', (e) => {
    const simple = document.getElementById('body-simple');
    const detail = document.getElementById('body-detail');
    if (e.target.value === 'simple') { simple.classList.remove('hidden'); detail.classList.add('hidden'); }
    else { simple.classList.add('hidden'); detail.classList.remove('hidden'); }
  });
  // BMI update
  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');
  const bmiDisplay = document.getElementById('bmi-display');
  function updateBMI() {
    const bmi = calculateBMI(Number(heightInput.value), Number(weightInput.value));
    bmiDisplay.textContent = bmi ? `BMI: ${bmi}` : '';
  }
  heightInput.addEventListener('input', updateBMI);
  weightInput.addEventListener('input', updateBMI);
  // Random generators
  document.getElementById('random-name').addEventListener('click', () => {
    const names = ['太郎', '花子', '次郎', 'さくら', '勇気', '光'];
    document.getElementById('name').value = randomChoice(names);
  });
  document.getElementById('random-age').addEventListener('click', () => {
    document.getElementById('age').value = randInt(0, 100);
  });
  // Navigation buttons
  document.getElementById('start-btn').addEventListener('click', () => showScreen('character'));
  document.getElementById('to-situation').addEventListener('click', () => showScreen('situation'));
  document.getElementById('to-fate').addEventListener('click', () => {
    // Prepare canvas character (simple pixel square)
    drawCharacter();
    showScreen('fate');
  });
  document.getElementById('reveal-btn').addEventListener('click', () => {
    const result = runFate();
    displayResult(result);
    showScreen('result');
    saveHistory(result);
    renderHistory();
  });
  document.getElementById('again-btn').addEventListener('click', () => {
    // Reset to title or character? We'll go back to character for new run.
    showScreen('character');
  });
  // Load history on start
  renderHistory();
}

// ----- Canvas -----
function drawCharacter() {
  const canvas = document.getElementById('char-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Simple 8x8 pixel avatar
  const pixelSize = 20;
  const avatar = [
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,0,1],
    [1,0,0,1,1,0,0,1],
    [0,1,0,0,0,0,1,0],
    [0,0,1,1,1,1,0,0]
  ];
  ctx.fillStyle = '#ff0';
  for (let y = 0; y < avatar.length; y++) {
    for (let x = 0; x < avatar[y].length; x++) {
      if (avatar[y][x]) {
        ctx.fillRect(x*pixelSize, y*pixelSize, pixelSize, pixelSize);
      }
    }
  }
}

// ----- Fate Logic -----
function collectInput() {
  // Helper to resolve "ランダム" selections
  const resolveRandom = (value, options) => {
    if (value === "ランダム" || value === "random") {
      return randomChoice(options);
    }
    return value;
  };
  const name = document.getElementById('name').value || '名無し';
  let gender = document.getElementById('gender').value;
  const genderOptions = ['男性','女性'];
  gender = resolveRandom(gender, genderOptions);
  let age = Number(document.getElementById('age').value);
  if (!age) age = randInt(0,100);
  const bodyMode = document.getElementById('body-mode').value;
  let bodyDesc = '';
  if (bodyMode === 'simple') {
    let type = document.getElementById('body-type').value;
    const typeOptions = ['痩せ型','標準','がっちり','太め'];
    type = resolveRandom(type, typeOptions);
    bodyDesc = type;
  } else {
    const h = document.getElementById('height').value;
    const w = document.getElementById('weight').value;
    const bmi = calculateBMI(Number(h), Number(w));
    bodyDesc = `${h}cm / ${w}kg (BMI ${bmi})`;
  }
  let personality = document.getElementById('personality').value;
  const personalityOptions = ['慎重','大胆','のんびり','せっかち','臆病','好奇心旺盛'];
  personality = resolveRandom(personality, personalityOptions);
  let occupation = document.getElementById('occupation').value;
  occupation = resolveRandom(occupation, occupations);
  let health = document.getElementById('health').value;
  const healthOptions = ['健康','疲労気味','持病あり','不健康'];
  health = resolveRandom(health, healthOptions);
  const situation = document.getElementById('situation').value;
  return { name, gender, age, bodyDesc, personality, occupation, health, situation };
}


function filterCandidates(input) {
  // Treat "ランダム" as wildcard for occupation and situation
  const occ = input.occupation;
  const sit = input.situation;
  return events.filter(ev => {
    // Occupation filter: if event defines occupations, they must include selected occupation unless random selected
    if (ev.occupations && ev.occupations.length > 0) {
      if (occ === "ランダム") return true;
      if (!ev.occupations.includes(occ)) return false;
    }
    // Situation filter: if event defines situations, they must include selected situation unless random selected
    if (ev.situations && ev.situations.length > 0) {
      if (sit === "ランダム") return true;
      if (!ev.situations.includes(sit)) return false;
    }
    return true;
  });
}
  return events.filter(ev => {
    // Occupation filter: if event.occupations non-empty, must include selected occupation (or random matches all)
    if (ev.occupations && ev.occupations.length > 0 && ev.occupations[0] !== "random") {
      if (input.occupation === "random") return true;
      if (!ev.occupations.includes(input.occupation)) return false;
    }
    // Situation filter similar
    if (ev.situations && ev.situations.length > 0) {
      if (input.situation === "ランダム") return true;
      if (!ev.situations.includes(input.situation)) return false;
    }
    // Event can be universally applicable (empty arrays) -> keep
    return true;
  });
}

function computeWeight(event, input) {
  let w = event.baseWeight;
  // Age modifier simple
  if (input.age < 20) w *= 1.2;
  else if (input.age < 40) w *= 1.0;
  else if (input.age < 60) w *= 0.9;
  else w *= 0.8;
  // Health modifier
  switch (input.health) {
    case '健康': w *= 1.0; break;
    case '疲労気味': w *= 0.9; break;
    case '持病あり': w *= 0.8; break;
    case '不健康': w *= 0.7; break;
    default: w *= 1.0;
  }
  // Personality modifier
  switch (input.personality) {
    case '慎重': w *= 0.9; break;
    case '大胆': w *= 1.1; break;
    case 'のんびり': w *= 1.0; break;
    case 'せっかち': w *= 1.2; break;
    case '臆病': w *= 0.8; break;
    case '好奇心旺盛': w *= 1.2; break;
    default: w *= 1.0;
  }
  // Random factor for randomness
  w *= Math.random() * 0.5 + 0.75; // 0.75-1.25
  return w;
}

function runFate() {
  const input = collectInput();
  const candidates = filterCandidates(input);
  // Attach weight
  candidates.forEach(ev => ev.weight = computeWeight(ev, input));
  const chosen = weightedRandom(candidates);
  // Build result description
  const tmpl = chosen.description;
  const resultText = tmpl.replace(/{{name}}/g, input.name)
    .replace(/{{situation}}/g, input.situation)
    .replace(/{{event}}/g, chosen.name)
    .replace(/{{cause}}/g, chosen.name);
  return { input, event: chosen, text: resultText };
}

function displayResult(result) {
  const container = document.getElementById('result-content');
  container.innerHTML = '';
  const title = document.createElement('h3');
  title.textContent = `${result.input.name}の運命」`;
  const eventName = document.createElement('p');
  eventName.textContent = `結果: ${result.event.name}`;
  const outcome = document.createElement('p');
  outcome.textContent = result.event.result === 'death' ? '死亡' : '生存';
  const story = document.createElement('p');
  story.textContent = result.text;
  const tags = document.createElement('p');
  tags.textContent = `タグ: ${result.event.tags.join(', ')}`;
  container.append(title, eventName, outcome, story, tags);
}

// ----- History -----
function saveHistory(result) {
  const hist = JSON.parse(localStorage.getItem('deathGameHistory') || '[]');
  hist.unshift({
    timestamp: Date.now(),
    name: result.input.name,
    event: result.event.name,
    outcome: result.event.result,
    tags: result.event.tags
  });
  // Keep only latest 20
  if (hist.length > 20) hist.length = 20;
  localStorage.setItem('deathGameHistory', JSON.stringify(hist));
}
function renderHistory() {
  const list = document.getElementById('history-list');
  list.innerHTML = '';
  const hist = JSON.parse(localStorage.getItem('deathGameHistory') || '[]');
  hist.forEach(item => {
    const li = document.createElement('li');
    const date = new Date(item.timestamp).toLocaleString();
    li.textContent = `${date} - ${item.name}: ${item.event} (${item.outcome})`;
    list.appendChild(li);
  });
}

// ----- Start -----
window.addEventListener('load', init);
