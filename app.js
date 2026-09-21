const nodes = [
  {id:'chips',name:'Northstar Semiconductors',detail:'Taiwan | Microchips',type:'supplier',x:130,y:105,role:'Supplies microchips for AuroraSmart speakers.',stock:'18 days',backup:'ChipExpress Ltd.'},
  {id:'casings',name:'Pacific Plastics',detail:'Vietnam | Casings',type:'supplier',x:125,y:350,role:'Makes the recycled plastic speaker casings.',stock:'22 days',backup:'EcoMould Australia'},
  {id:'aurora',name:'Port Aurora',detail:'Australia | Main port',type:'port',x:390,y:235,role:'Normal arrival point for imported components.',stock:'N/A',backup:'Port Brilliant'},
  {id:'brilliant',name:'Port Brilliant',detail:'Singapore | Backup port',type:'port',x:425,y:390,role:'Global backup port for routes into Australia and Europe.',stock:'N/A',backup:'Available'},
  {id:'factory',name:'Aurora Assembly',detail:'Brisbane | Factory',type:'factory',x:650,y:235,role:'Builds AuroraSmart speakers from imported parts.',stock:'6 days',backup:'Extra shift available'},
  {id:'warehouse',name:'Rotterdam Distribution Hub',detail:'Netherlands | Warehouse',type:'warehouse',x:790,y:115,role:'Stores finished speakers before European and North American delivery.',stock:'12 days',backup:'Dubai overflow'},
  {id:'retail',name:'Global Retail Partners',detail:'Europe and North America | Stores',type:'retail',x:800,y:360,role:'Receives speakers for customers in several world regions.',stock:'9 days',backup:'Priority allocation'}
];

const connections = [
  ['chips','aurora'],
  ['casings','aurora'],
  ['aurora','factory'],
  ['factory','warehouse'],
  ['warehouse','retail'],
  ['casings','brilliant'],
  ['brilliant','factory']
];

const scenarios = {
  normal:{
    title:'Normal operations',
    icon:'✓',
    summary:'All usual routes are operating. Aurora Electronics can use its lowest-cost standard plan.',
    affected:[],
    impact:[
      ['Supply chain is ready','All key locations are operating normally.','good'],
      ['Products on schedule','AuroraSmart deliveries are expected on time.','good'],
      ['Best choice','Use Port Aurora and standard ocean shipping.','good']
    ],
    plans:[
      ['Normal route','Standard plan','Port Aurora to Brisbane factory.','$48,000','12 days','Low','recommended']
    ]
  },

  port:{
    title:'Sydney port closure',
    icon:'⚓',
    summary:'Port Aurora in Sydney is closed for 10 days after an industrial accident. Imported parts cannot be unloaded there.',
    affected:['aurora','factory','warehouse','retail'],
    impact:[
      ['Sydney port is blocked','No incoming components can unload at the Australian main port.','critical'],
      ['Brisbane factory may stop','The factory has only six days of chip stock.','warning'],
      ['Global orders may be late','European and North American deliveries could be delayed.','warning']
    ],
    plans:[
      ['Normal route','Unavailable','Port Aurora in Sydney is closed.','$48,000','12 days','Low','unavailable'],
      ['Singapore backup route','Recommended','Redirect ships through Singapore, then send parts to Brisbane.','$61,000','16 days','Medium','recommended'],
      ['Emergency air freight','Fast option','Fly only urgent microchips from Taiwan to Brisbane.','$145,000','5 days','Low','']
    ]
  },

  cyclone:{
    title:'Taiwan cyclone warning',
    icon:'🌀',
    summary:'A severe cyclone is expected near the Taiwan microchip supplier. Ship departures may be delayed.',
    affected:['chips','aurora','factory'],
    impact:[
      ['Chip exports may be delayed','Northstar Semiconductors may not be able to release orders safely.','critical'],
      ['Factory buffer is tight','Brisbane could run low on parts before the delayed ship arrives.','warning'],
      ['Safety comes first','Do not rely on the original shipping timetable.','warning']
    ],
    plans:[
      ['Wait for Taiwan shipment','Lowest cost','Keep the normal booking and wait for the cyclone to pass.','$48,000','19 days','High',''],
      ['Singapore consolidation','Recommended','Move later shipments through Singapore once ports reopen.','$64,000','17 days','Medium','recommended'],
      ['Air freight chips','Fast option','Protect urgent orders by flying a small chip shipment.','$145,000','5 days','Low','']
    ]
  },

  supplier:{
    title:'Microchip supplier outage',
    icon:'◈',
    summary:'Northstar Semiconductors has stopped production for two weeks after equipment failure.',
    affected:['chips','factory','warehouse','retail'],
    impact:[
      ['Microchips unavailable','The main chip supplier cannot send new orders for two weeks.','critical'],
      ['Factory may stop in 6 days','Existing component stock will run out quickly.','warning'],
      ['Priority products need a plan','Only the most important speaker orders may be possible.','warning']
    ],
    plans:[
      ['Wait for Northstar','Lowest cost','Resume normal orders when production restarts.','$48,000','26 days','High',''],
      ['ChipExpress backup','Recommended','Buy compatible chips from an approved backup supplier.','$78,000','14 days','Medium','recommended'],
      ['Redesign product','Long-term option','Use a different chip and update the product design.','$110,000','45 days','Medium','']
    ]
  },

  road:{
    title:'Brisbane road closure',
    icon:'🚧',
    summary:'Flooding has closed the main road between the Sydney port and the Brisbane factory.',
    affected:['aurora','factory'],
    impact:[
      ['Australian road link is limited','Trucks cannot use the usual Sydney to Brisbane connection.','critical'],
      ['Singapore backup remains available','Global shipments can still move through the backup port.','good'],
      ['Keep backup capacity','A longer rail and road route is possible but adds time and cost.','warning']
    ],
    plans:[
      ['Singapore backup route','Recommended','Move incoming containers through Singapore while the road closes.','$61,000','16 days','Medium','recommended'],
      ['Longer Australian road route','Backup only','Use an inland road route from Sydney to Brisbane.','$75,000','21 days','Medium',''],
      ['Rail and truck combination','Alternative','Move containers by rail, then use local trucks.','$69,000','18 days','Medium','']
    ]
  },

  flood:{
    title:'Rotterdam warehouse flood',
    icon:'🌧',
    summary:'Floodwater has damaged part of the Rotterdam Distribution Hub in the Netherlands.',
    affected:['warehouse','retail'],
    impact:[
      ['European warehouse capacity reduced','Only 30% of normal stock can be picked and sent.','critical'],
      ['International retail orders delayed','European and North American stores may not receive usual deliveries.','warning'],
      ['Brisbane factory still produces','The Australian factory can keep building speakers.','good']
    ],
    plans:[
      ['Use Dubai overflow','Recommended','Send finished goods to the Dubai overflow warehouse.','$72,000','15 days','Medium','recommended'],
      ['Direct factory delivery','Fast option','Send urgent orders from Brisbane to selected global stores.','$89,000','8 days','Low',''],
      ['Wait for Rotterdam repair','Lowest cost','Hold stock until the European warehouse reopens.','$48,000','20 days','High','']
    ]
  },

  cyber:{
    title:'Singapore port cyberattack',
    icon:'⌁',
    summary:'A cyberattack has disrupted the booking and container release systems at the Singapore backup port.',
    affected:['brilliant','factory'],
    impact:[
      ['Containers cannot be released','Singapore port systems cannot process normal pickup paperwork.','critical'],
      ['Brisbane factory buffer is tight','The Australian factory has only six days of chip stock.','warning'],
      ['Manual processing may help','A limited number of urgent containers could be handled manually.','warning']
    ],
    plans:[
      ['Wait for system recovery','Lowest cost','Keep containers in Singapore while systems are restored.','$48,000','18 days','High',''],
      ['Use manual priority release','Recommended','Pay for manual processing of the most urgent components.','$69,000','10 days','Medium','recommended'],
      ['Air freight urgent chips','Fast option','Fly a small emergency shipment from Taiwan to Brisbane.','$145,000','5 days','Low','']
    ]
  },

  fuel:{
    title:'Netherlands fuel shortage',
    icon:'⛽',
    summary:'A regional fuel shortage near Rotterdam is limiting European truck availability and increasing transport prices.',
    affected:['warehouse','retail'],
    impact:[
      ['European truck capacity is limited','Some global retail deliveries cannot be scheduled normally.','critical'],
      ['Delivery costs rise','Transport suppliers are charging more for available vehicles.','warning'],
      ['Rail capacity is useful','Rail can protect part of the European supply chain if bookings are made early.','good']
    ],
    plans:[
      ['Use normal truck network','Lowest cost','Keep regular European road bookings and accept possible delays.','$58,000','17 days','High',''],
      ['Rail and priority trucks','Recommended','Use European rail for long distances and reserve trucks for local deliveries.','$73,000','14 days','Medium','recommended'],
      ['Pause low priority orders','Capacity option','Save transport capacity for the most important customers.','$51,000','20 days','Medium','']
    ]
  },

  bankruptcy:{
    title:'Vietnam supplier bankruptcy',
    icon:'⚠',
    summary:'Pacific Plastics in Vietnam has entered administration and cannot guarantee future casing deliveries.',
    affected:['casings','factory','warehouse','retail'],
    impact:[
      ['Casing supply is uncertain','New orders may be cancelled or delayed without warning.','critical'],
      ['Factory production is at risk','The Brisbane factory cannot finish speakers without plastic casings.','warning'],
      ['Backup supplier needs approval','A replacement supplier must confirm quality and capacity.','warning']
    ],
    plans:[
      ['Use existing casing stock','Short-term option','Keep production running while current casings remain available.','$48,000','12 days','High',''],
      ['EcoMould Australia backup','Recommended','Approve the Australian backup casing supplier and arrange the first shipment.','$76,000','15 days','Medium','recommended'],
      ['Change the speaker design','Long-term option','Redesign the casing to use a more widely available material.','$118,000','50 days','Medium','']
    ]
  }
};

let active = 'normal';
let selected = null;
let companyName = 'Aurora Electronics';
let history = [];

const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
const select = document.querySelector('#scenarioSelect');

Object.entries(scenarios).forEach(([key, value]) => {
  const option = document.createElement('option');
  option.value = key;
  option.textContent = value.title;
  select.appendChild(option);
});

function escapeText(value) {
  return String(value).replace(/[&<>]/g, c => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;'
  }[c]));
}

function drawMap() {
  const s = scenarios[active];
  const svg = document.querySelector('#network');

  svg.innerHTML = '<text class="water" x="600" y="65">Global supply-chain network</text>';

  connections.forEach(([a, b]) => {
    const A = byId[a];
    const B = byId[b];
    const blocked = s.affected.includes(a) || s.affected.includes(b);
    const backup = a === 'brilliant' || b === 'brilliant';
    const cls = blocked ? 'blocked' : backup ? 'backup' : 'active';

    svg.insertAdjacentHTML(
      'beforeend',
      `<line class="line ${cls}" x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}"/>`
    );
  });

  nodes.forEach(n => {
    const affected = s.affected.includes(n.id);
    const selectedNode = selected === n.id;

    svg.insertAdjacentHTML(
      'beforeend',
      `<g class="node ${n.type} ${affected ? 'affected' : ''} ${selectedNode ? 'selected' : ''}" data-id="${n.id}">
        <circle cx="${n.x}" cy="${n.y}" r="27"/>
        <text x="${n.x}" y="${n.y + 5}" font-size="18">
          ${n.type === 'port' ? '⚓' : n.type === 'factory' ? '⚙' : n.type === 'supplier' ? '◈' : n.type === 'warehouse' ? '▣' : '⌂'}
        </text>
        <text class="name" x="${n.x}" y="${n.y + 48}">${escapeText(n.name)}</text>
        <text class="detail" x="${n.x}" y="${n.y + 63}">${escapeText(n.detail)}</text>
      </g>`
    );
  });

  svg.querySelectorAll('.node').forEach(el => {
    el.addEventListener('click', () => {
      selected = el.dataset.id;
      render();
    });
  });
}

function renderDetails() {
  const holder = document.querySelector('#nodeDetails');

  if (!selected) {
    holder.innerHTML = `
      <h2>Choose a location</h2>
      <p>Click any circle on the map to see what it does in the supply chain.</p>
    `;
    return;
  }

  const n = byId[selected];
  const affected = scenarios[active].affected.includes(n.id);

  holder.innerHTML = `
    <h2>${n.name}</h2>
    <p>${n.role}</p>
    <div class="detail-grid">
      <div>Location<b>${n.detail.split('|')[0]}</b></div>
      <div>Status<b>${affected ? 'Affected' : 'Operating'}</b></div>
      <div>Current stock<b>${n.stock}</b></div>
      <div>Backup<b>${n.backup}</b></div>
    </div>
  `;
}

function render() {
  const s = scenarios[active];
  const isNormal = active === 'normal';

  document.querySelector('#score').textContent =
    isNormal ? '86' :
    active === 'port' ? '42' :
    active === 'supplier' ? '38' :
    active === 'flood' ? '57' :
    '64';

  document.querySelector('#scoreWord').textContent =
    isNormal ? 'Ready' : 'Needs action';

  const sum = document.querySelector('#scenarioSummary');
  sum.className = 'scenario-summary ' + (isNormal ? 'normal' : 'alert');

  sum.innerHTML = `
    <span class="icon">${s.icon}</span>
    <div>
      <h3>${s.title}</h3>
      <p>${s.summary}</p>
    </div>
  `;

  document.querySelector('#impactStatus').textContent =
    isNormal ? 'Normal operations' : 'Disruption active';

  document.querySelector('#impactStatus').className =
    'status ' + (isNormal ? '' : 'alert');

  document.querySelector('#mapNote').textContent =
    isNormal
      ? 'Blue lines show normal product movement. Select a disruption to see what changes.'
      : 'Red dashed lines show affected routes. Orange dashed lines are backup routes.';

  document.querySelector('#choiceHelp').textContent =
    isNormal
      ? 'The normal route is currently the lowest-cost choice.'
      : 'Green border = RouteTwin recommended response.';

  document.querySelector('#impactCards').innerHTML = s.impact.map(x => `
    <article class="impact-card ${x[2]}">
      <h3>${x[0]}</h3>
      <p>${x[1]}</p>
    </article>
  `).join('');

  document.querySelector('#planCards').innerHTML = s.plans.map(p => `
    <article class="plan-card ${p[6]}">
      <span class="tag">${p[1]}</span>
      <h3>${p[0]}</h3>
      <p>${p[2]}</p>
      <div class="metrics">
        <span>Cost<b>${p[3]}</b></span>
        <span>Time<b>${p[4]}</b></span>
        <span>Risk<b class="risk-${p[5].toLowerCase()}">${p[5]}</b></span>
      </div>
    </article>
  `).join('');

  drawMap();
  renderDetails();
}

function recommendedPlan() {
  return scenarios[active].plans.find(plan => plan[6] === 'recommended') || scenarios[active].plans[0];
}

function renderHistory() {
  const holder = document.querySelector('#scenarioHistory');

  if (!history.length) {
    holder.innerHTML = '<p class="empty-history">No scenarios have been run yet.</p>';
    return;
  }

  holder.innerHTML = history.map((entry, index) => `
    <article class="history-item">
      <strong>${escapeText(entry.company)}</strong>
      <span>${escapeText(scenarios[entry.scenario].title)}</span>
      <span>${escapeText(entry.time)}</span>
      <button type="button" data-history="${index}">Run again</button>
    </article>
  `).join('');

  holder.querySelectorAll('[data-history]').forEach(button => {
    button.addEventListener('click', () => {
      const entry = history[Number(button.dataset.history)];

      active = entry.scenario;
      select.value = active;
      companyName = entry.company;

      document.querySelector('#companyName').value = companyName;
      document.querySelector('#companyLabel').textContent = companyName + ' | fictional demonstration data';
      document.querySelector('#builderMessage').textContent =
        'Showing ' + companyName + ' with the ' + scenarios[active].title + ' scenario.';

      selected = null;
      render();
    });
  });
}

function addHistory() {
  history.unshift({
    company: companyName,
    scenario: active,
    time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
  });

  history = history.slice(0, 6);
  renderHistory();
}

function downloadReport() {
  const s = scenarios[active];
  const plan = recommendedPlan();

  const affected = nodes
    .filter(node => s.affected.includes(node.id))
    .map(node => node.name)
    .join(', ') || 'No locations affected';

  const safeCompany = escapeText(companyName);
  const safeAffected = escapeText(affected);
  const safePlan = escapeText(plan[0]);
  const safeDetail = escapeText(plan[2]);

  const report = `
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <title>RouteTwin Scenario Report</title>
  <style>
    body{font-family:Arial,sans-serif;color:#10243c;margin:42px;line-height:1.5}
    .top{border-bottom:4px solid #1678c9;padding-bottom:18px;margin-bottom:26px}
    .brand{color:#1678c9;font-size:13px;font-weight:bold;letter-spacing:2px}
    .title{font-size:30px;font-weight:bold;margin:6px 0}
    .sub{color:#61788d;margin:0}
    h2{font-size:17px;margin:28px 0 10px;color:#10243c}
    table{width:100%;border-collapse:collapse}
    th{background:#071d35;color:white;text-align:left;padding:11px}
    td{border:1px solid #d8e3ec;padding:11px;vertical-align:top}
    .recommended{border-left:6px solid #10a879;background:#effbf5;padding:18px}
    .footer{margin-top:34px;border-top:1px solid #d8e3ec;padding-top:14px;color:#61788d;font-size:10px}
  </style>
</head>
<body>
  <div class="top">
    <div class="brand">ROUTETWIN | SCENARIO REPORT</div>
    <div class="title">Supply Chain Disruption Assessment</div>
    <p class="sub">Prepared for ${safeCompany} using fictional demonstration data</p>
  </div>

  <h2>Scenario overview</h2>

  <table>
    <tr><th>Company</th><td>${safeCompany}</td></tr>
    <tr><th>Scenario</th><td>${escapeText(s.title)}</td></tr>
    <tr><th>Summary</th><td>${escapeText(s.summary)}</td></tr>
    <tr><th>Affected locations</th><td>${safeAffected}</td></tr>
  </table>

  <h2>Recommended response</h2>

  <div class="recommended">
    <strong>${safePlan}</strong><br>
    ${safeDetail}
  </div>

  <h2>Response comparison</h2>

  <table>
    <tr>
      <th>Estimated cost</th>
      <th>Estimated time</th>
      <th>Risk</th>
    </tr>
    <tr>
      <td>${escapeText(plan[3])}</td>
      <td>${escapeText(plan[4])}</td>
      <td>${escapeText(plan[5])}</td>
    </tr>
  </table>

  <p class="footer">RouteTwin is an early learning prototype. All companies, locations, costs, and outcomes in this report are fictional.</p>
</body>
</html>`;

  const blob = new Blob([report], {type:'application/msword'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-routetwin-scenario-report.doc';

  link.click();
  URL.revokeObjectURL(url);

  document.querySelector('#builderMessage').textContent = 'Your Word report has downloaded.';
}

document.querySelector('#applyCompanyButton').addEventListener('click', () => {
  const input = document.querySelector('#companyName');
  const name = input.value.trim();

  if (!name) {
    document.querySelector('#builderMessage').textContent = 'Please enter a company name first.';
    input.focus();
    return;
  }

  companyName = name;
  document.querySelector('#companyLabel').textContent = companyName + ' | fictional demonstration data';
  document.querySelector('#builderMessage').textContent = 'Your demo now uses ' + companyName + '.';
});

document.querySelector('#downloadButton').addEventListener('click', downloadReport);

document.querySelector('#runButton').addEventListener('click', () => {
  active = select.value;
  selected = null;
  render();
  addHistory();
});

document.querySelector('#resetButton').addEventListener('click', () => {
  active = 'normal';
  select.value = 'normal';
  selected = null;
  render();
});

render();
renderHistory();
