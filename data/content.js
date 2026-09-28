// Single source of truth for the Open Netrikkan website.
// Edit text here, then run `npm run build` (or just `npm start`).
'use strict';

const site = {
  name: 'Open Netrikkan',
  tag: 'A UTS Company',
  headline: 'Simulate the decision before it costs you the quarter.',
  email: 'info@opennetrikkan.com',
  uts: { name: 'Univision Technology Solutions (UTS)', url: 'https://uts3s.com', tagline: 'Silicon, Systems, Sustainability' },
  city: 'Bengaluru, India',
  url: 'https://opennetrikkan.com',
};

// ---------------------------------------------------------------------------
// MODULES  (menu, module pages, chatbot all read from this list)
// ---------------------------------------------------------------------------
const modules = [
  {
    slug: 'changeover-optimizer', n: '01', name: 'Changeover Optimizer', sector: 'High-mix assembly', icon: 'clock',
    status: 'Available module',
    question: 'In what order should this week’s work orders run so the line spends the most time producing and the least time changing over?',
    short: 'Which sequence of work orders cuts changeover time this week?',
    body: 'Any high-mix assembly line — consumer electronics, appliances, precision instruments — faces the same problem: every model and variant needs its own fixtures, components and operator skill, and the possible sequences for a week’s orders run into the millions. The Changeover Optimizer models the line, its work orders and the setup relationship between every pair of products, simulates candidate sequences and searches for the one that cuts changeover time while still meeting due dates.',
    result: 'A recommended sequence with the changeover hours it saves shown against the current plan — unbilled capacity recovered without capital spend.',
    features: [
      ['Upload and optimise', 'Drop in the work-order spreadsheet; it is parsed automatically and a changeover-minimised schedule is generated in minutes.'],
      ['Tooling-family-aware sequencing', 'Sequencing respects tooling families, line capacity and per-line movement rules, not just due dates.'],
      ['Live schedule board', 'Reorder or reassign work orders and watch changeovers recalculate instantly.'],
      ['Value of changeover reduction', 'The dashboard converts avoided changeovers and recovered downtime into a money figure planners can defend.'],
      ['Ask about this schedule', 'Plain-language questions answered from the schedule’s own numbers — output, changeovers, utilisation, spare capacity — never from a generic model.'],
      ['Export and roles', 'Excel, JSON and PowerPoint exports; plant-head, planner and viewer roles; simulation history for comparison.'],
    ],
    images: ['changeover-dash', 'changeover-board', 'changeover-ask'], video: 'changeover-optimizer',
  },
  {
    slug: 'newline', n: '02', name: 'Newline', sector: 'Auto components', icon: 'bars',
    status: 'Available module',
    question: 'For a component we have not yet made, which machines, stations and layout hit the required volume and quality — and what will it cost?',
    short: 'Which equipment and layout does a new component line need?',
    body: 'Automotive programmes are quoted against tight targets and long commitments, often within days of a drawing. Newline takes the component’s specification and a plain-English process description, parses it into ordered stages, scores candidate machines transparently against each stage, and simulates the resulting line for throughput, utilisation, work-in-progress and headcount.',
    result: 'A scored equipment shortlist, a process-flow diagram and a line plan — evidence in place of optimism at the moment the quote is written.',
    features: [
      ['Plain-English process parsing', 'Describe how the part is made in a sentence; Newline turns it into an editable, ordered stage sequence.'],
      ['Scored machine recommendations', 'Every stage is matched against an equipment catalogue and scored 0–100% for applicability, with full specs shown.'],
      ['Process flow and line KPIs', 'Stages linked to chosen machines, with throughput, headcount and WIP per station — bottlenecks found on paper, not on the floor.'],
      ['Digital twin dashboard', 'Simulated telemetry — utilisation, cycle time, machine status — surfaces problems before a part is produced.'],
      ['Digital thread and report', 'Component, parameters, process definition and selected machines traced end to end, rolled into a printable PDF report.'],
      ['Built for teams', 'Admin, sales, RFP-prep and production roles, plus a sales dashboard tracking every RFP by stage.'],
    ],
    images: ['newline-flow', 'newline-review', 'newline-twin', 'newline-report'], video: 'newline',
  },
  {
    slug: 'machine-bank-scheduler', n: '03', name: 'Machine Bank Scheduler', sector: 'Any machine bank', icon: 'machine',
    status: 'Available module',
    question: 'Which machine in the bank should take this job, on which shift, so every order ships on time with the fewest changeovers and idle hours?',
    short: 'Which job runs on which machine in the bank, on which shift?',
    body: 'Any plant running a bank of same-type machines with different specifications — injection moulding presses of different tonnage, CNC centres with different tooling — faces the same scheduling problem. The module models machine capacity by shift, job-to-machine spec compatibility, due dates and changeover effort, then generates and simulates a schedule. It includes the Customer Commitment Analyser, which checks the real floor before Sales promises a date.',
    result: 'One verified view of machine capacity: every order gets a proposed delivery date, backed by the schedule, machine loading, labour and inventory.',
    features: [
      ['Customer Commitment Analyser', 'Before a sales commitment, verify production capacity, existing schedule, machine loading, inventory, labour and mould availability — then commit with confidence.'],
      ['Order file to estimate', 'Order spreadsheets are parsed automatically; effort is estimated from cycle time, cavities, station count, OEE, buffer and three-shift schedule.'],
      ['Verified delivery dates', 'A proposed delivery date per order, approved in one click; every date is locked and backed by data.'],
      ['Master schedule and allocation', 'Equipment assigned to every order in under a minute, with a utilisation heat-map across the whole machine bank.'],
      ['Instant re-plan', 'Change any shift parameter and every delivery date recalculates instantly.'],
      ['Labour and inventory', 'Operator, helper, supervisor and QC gaps flagged before the shift; material demand computed from the current schedule.'],
    ],
    images: ['bank-schedule', 'bank-effort', 'bank-heatmap'], video: 'customer-commitment',
  },
  {
    slug: 'tablet', n: '04', name: 'Tablet', sector: 'Pharma', icon: 'pill',
    status: 'Available module',
    question: 'How should a tablet line be configured and scheduled so batches clear each stage without queueing or breaching a hold-time limit?',
    short: 'Where does batch flow stall on the tablet line?',
    body: 'Contract pharma manufacturing is a chain of stages — blending, granulation, compression, coating, packing — sharing equipment across products under mandatory cleaning and quality holds. Tablet simulates batch flow through every stage, shows where batches wait and which stage limits output, and quantifies how a change in batch size or campaign order shifts throughput and lead time. Every scenario is a reproducible run, suited to regulated environments where a decision must be explained.',
    result: 'A validated-before-the-floor scenario: in the demonstration line, an AI parameter search lifted OEE from 33.7% to 39.2% (about +7K units a day). Demonstration figures on synthetic data.',
    features: [
      ['OEE by manufacturing phase', 'Plant-level and line-level OEE with trends measured against target.'],
      ['Changeover and hold-time tracker', 'Batch-level risk flagged before it happens; WIP hold-time versus validated limits.'],
      ['DES sequence optimiser', 'Optimal wash sequence for dosage changeovers — reduces cross-contamination risk and cleaning time.'],
      ['Scenario simulator', 'Tune parameters live and see OEE, output, batch cycle, QC release and cost respond.'],
      ['AI parameter optimiser', 'Searches over a hundred configurations for the best parameter set for the goal you pick.'],
      ['Active alerts', 'Hold-time breaches and equipment faults surfaced as they emerge.'],
    ],
    images: ['tablet-oee', 'tablet-seq', 'tablet-sim', 'tablet-ai'], video: 'tablet-pharma',
  },
  {
    slug: 'warehouse', n: '05', name: 'Warehouse', sector: 'Distribution / 3PL', icon: 'warehouse',
    status: 'Available module',
    question: 'With this inbound schedule, dock count and labour roster, where will the warehouse jam — and which change clears it?',
    short: 'Where will inbound and dock operations jam this peak?',
    body: 'Modelled on a reference distribution centre of roughly 500,000 sq ft, 30 dock doors and 80–120 staff per shift. Warehouse takes advance shipping notices, dock and resource parameters and slotting data, then runs scenarios across throughput, slotting, dock scheduling and resource use, comparing volume bands such as a normal week against a peak week.',
    result: 'KPI snapshots tied directly to the P&L, not just operational metrics.',
    features: [
      ['Inbound and dock simulation', 'Advance shipping notices flow through dock doors and receiving labour.'],
      ['Slotting scenarios', 'Test slotting changes before moving a single pallet.'],
      ['Peak versus normal', 'Compare volume bands side by side to find the breaking point.'],
      ['P&L-linked KPIs', 'Dock cost and service impact expressed in money.'],
    ],
    images: [], video: null,
  },
  {
    slug: 'outbound', n: '06', name: 'Outbound', sector: 'Warehouse outbound', icon: 'truck',
    status: 'Available module',
    question: 'Which combination of picking method, wave release, staffing and cut-off times gets orders out on time at the lowest cost?',
    short: 'Which pick, wave and staffing plan ships on time at lowest cost?',
    body: 'An interactive simulator in which the planner moves the operational levers and every KPI recalculates live, with configurations saved and compared side by side. Where a manufacturer ships directly to retailers or brand owners, this is where contractual service levels are won or lost.',
    result: 'Saved configurations compared side by side, with every KPI recalculating live as levers move.',
    features: [
      ['Live levers', 'Picking method, wave release, staffing and cut-off times as sliders; KPIs recalculate instantly.'],
      ['Saved configurations', 'Snapshot and compare alternative operating plans.'],
      ['Service-level focus', 'Built around on-time dispatch and contractual penalties.'],
    ],
    images: [], video: null,
  },
  {
    slug: 'fabsim', n: '07', name: 'FabSim', sector: 'Semiconductor', icon: 'chip',
    status: 'Available module',
    question: 'Where in the fab are we losing yield, capacity and cycle time — and which lever recovers the most?',
    short: 'Where is the fab losing yield, capacity and cycle time?',
    body: 'Six simulation modules — chamber matching, defect flow, sampling optimisation, capacity planning, excursion risk and work-in-progress flow — run in-browser on realistic synthetic data, so a first evaluation needs no upload of sensitive fab data.',
    result: 'In the demonstration environment the modules illustrate roughly 3% higher yield from chamber matching, 18% more throughput from capacity planning and 12% shorter cycle time from WIP flow control. (Demo figures on synthetic data; real results depend on the fab’s own operating data.)',
    features: [
      ['Chamber matching', 'Align chamber behaviour to recover yield.'],
      ['Defect flow and sampling', 'Trace defects and optimise inspection sampling.'],
      ['Capacity planning', 'Find the throughput lever that matters.'],
      ['Excursion risk and WIP flow', 'Anticipate excursions and shorten cycle time.'],
    ],
    images: [], video: null,
  },
  {
    slug: 'oilsim', n: '08', name: 'OilSim', sector: 'Oil & gas upstream', icon: 'drop',
    status: 'Available module',
    question: 'What is the probability that enough of the right crude reaches the refinery’s crude distillation unit on the day it is needed?',
    short: 'What is the probability crude reaches the refinery on time?',
    body: 'A Monte Carlo engine spanning roughly 20 parameters across crude sourcing, maritime logistics, port and terminal operations and refinery configuration, run across 2,000 stochastic trials — the same discipline every manufacturer with a long, uncertain inbound chain needs, at its most demanding.',
    result: 'A P10/P50/P90 availability distribution, the expected gross refining margin impact in $/barrel, and a tank-farm stock-out risk score.',
    features: [
      ['Monte Carlo engine', '~20 parameters, 2,000 stochastic trials.'],
      ['P10 / P50 / P90 availability', 'Probability, not a single average.'],
      ['Margin and stock-out risk', 'Expected GRM impact in $/bbl and tank-farm risk score.'],
    ],
    images: [], video: null,
  },
  {
    slug: 'replenish', n: '09', name: 'Replenish', sector: 'FMCG distribution', icon: 'fridge',
    status: 'Available module',
    question: 'Which freezers should be restocked, with what, and in what order of visits, so shelves stay full without wasted trips or write-offs?',
    short: 'Which freezers need restocking, and in what order?',
    body: 'FMCG brands and the contract manufacturers behind them depend on cabinets placed across thousands of outlets, where demand varies by outlet, weather and day of week. Replenish simulates cabinet-level demand, stock levels and delivery capacity, then proposes a prioritised restocking plan — closing the loop between sell-through at the outlet and production runs at the plant.',
    result: 'A prioritised restocking plan and visit order that keeps shelves full without wasted trips or write-offs.',
    features: [
      ['Cabinet-level demand', 'Demand varies by outlet, weather and day of week.'],
      ['Route priority', 'Which cabinets first, with what stock.'],
      ['Sell-through to production', 'Closes the loop from outlet to plant.'],
    ],
    images: [], video: null,
  },
];

// ---------------------------------------------------------------------------
// VIDEOS  (streamed through /stream/<id>; never linked as static files)
// ---------------------------------------------------------------------------
const videos = [
  { id: 'changeover-optimizer', title: 'Assembly Changeover Optimizer', module: 'changeover-optimizer', dur: '2:01', poster: 'changeover-dash', blurb: 'From a work-order spreadsheet to an optimised, changeover-minimised schedule in minutes.' },
  { id: 'newline', title: 'Newline — New Component Feasibility & Line Planner', module: 'newline', dur: '3:35', poster: 'newline-flow', blurb: 'A blank page to a fully scoped, cost-and-capacity-checked production line.' },
  { id: 'tablet-pharma', title: 'Tablet — Pharma Line Optimizer', module: 'tablet', dur: '3:35', poster: 'tablet-oee', blurb: 'Simulate it first: model the tablet line, run the scenario, see the outcome before anything moves on the floor.' },
  { id: 'customer-commitment', title: 'Customer Commitment Analyser', module: 'machine-bank-scheduler', dur: '4:28', poster: 'bank-schedule', blurb: 'Verify the floor before Sales commits: verified delivery dates, machine allocation and labour in one flow.' },
];

// ---------------------------------------------------------------------------
// CASE STUDIES (anonymised: no customer, employer or vendor-brand names)
// ---------------------------------------------------------------------------
const caseStudies = [
  {
    id: 'virtual-commissioning', tag: 'Aerospace · Digital twin', img: 'case-fuselage', group: 'Enterprise programmes',
    title: 'Virtual commissioning of an aircraft-fuselage inspection cell',
    objective: 'Prove a robotic scanning process for a full aircraft fuselage in a physics-accurate digital twin before any hardware was commissioned.',
    outcomes: [
      'Hangar scene and fuselage represented in a real-time 3D simulation environment',
      'A custom robot with LiDAR simulated scanning the main deck and cargo area',
      'Scan plan established: 20 scans cover an entire fuselage',
      'Virtual commissioning simulated the process end to end and accelerated delivery',
    ],
  },
  {
    id: 'point-cloud', tag: 'Aerospace · Quality', img: 'case-pointcloud', group: 'Enterprise programmes',
    title: 'Simulated point-cloud acquisition for digital quality',
    objective: 'Replicate real scanning conditions in simulation so that inspection algorithms could be developed and validated ahead of the physical rollout.',
    outcomes: [
      'Point-cloud acquisition simulated as in reality, with no aircraft tied up',
      'Aircraft twin creation from scans, compared with a reference to classify gaps',
      'Non-conformance probability and reports surfaced in a business application with 3D visualisation',
      'Quality teams in multiple countries collaborating on one shared twin',
    ],
  },
  {
    id: 'scanning-robot', tag: 'Aerospace · Robotics', img: 'case-lidar', group: 'Enterprise programmes',
    title: 'Autonomous scanning robot: motion and collision-safety design',
    objective: 'Validate how a scanning robot moves position to position through the fuselage structure and stops precisely without collisions.',
    outcomes: [
      'Full scan sequence from home position, through remaining positions, and back, simulated in side and front views',
      'Proximity / LiDAR sensing of cross beams verified to stop the robot precisely',
      'Passenger and cargo areas both covered by the same process',
      'Real-time rendering at over 100 frames per second on a laptop GPU',
    ],
  },
  {
    id: 'closed-loop-quality', tag: 'Aerospace · Digital thread', img: 'case-views', group: 'Enterprise programmes',
    title: 'A closed loop for quality: from inspection data to root cause',
    objective: 'Connect inspection findings to engineering and manufacturing so non-conformances are prevented, not just recorded.',
    outcomes: [
      'Feedback loops from manufacturing to engineering to prevent repeat defects',
      'Non-conformance data analytics used to identify root causes',
      'End-to-end continuity of the quality process from the shop floor to the customer',
      'A single quality data backbone shared by quality experts and analysts',
    ],
  },
  {
    id: 'pharma-line', tag: 'Pharma · Open Netrikkan', img: 'tablet-ai', group: 'Open Netrikkan modules in action',
    title: 'Validating a tablet-line configuration before the floor',
    objective: 'Find a better line configuration without running a trial batch — the batch that would otherwise cost more than most improvement projects.',
    outcomes: [
      'Scenario simulator with OEE, output, batch cycle and release metrics',
      'AI parameter search improved demonstration OEE from 33.7% to 39.2% (about +7K units a day)',
      'DES-optimised wash sequence reduces cross-contamination risk and cleaning time',
      'Every scenario is a reproducible run that can be explained to quality',
    ],
  },
];

// ---------------------------------------------------------------------------
// ECOSYSTEM (text marks; customer logos are opt-in - see README)
// ---------------------------------------------------------------------------
const ecosystem = ['A UTS Company', 'NASSCOM DeepTech member', 'Patent-pending IP', 'Bengaluru, India'];
// Put logo files (SVG/PNG) into public/assets/logos and list them here to show a customer-logo strip.
const customerLogos = []; // e.g. { file: 'acme.svg', alt: 'Acme' }

const industries = [
  ['Injection moulding & plastics', 'Machine-bank scheduling and verified delivery commitments.', 'machine-bank-scheduler'],
  ['Automotive components', 'Quote new lines faster and more accurately.', 'newline'],
  ['High-mix assembly', 'Cut changeover hours without capital spend.', 'changeover-optimizer'],
  ['Pharma & life sciences', 'Batch flow, hold-times and validated scenarios.', 'tablet'],
  ['Warehousing & 3PL', 'Dock, slotting and labour planning.', 'warehouse'],
  ['Semiconductor', 'Yield, capacity and cycle-time levers.', 'fabsim'],
  ['Oil & gas', 'Probability that crude reaches the refinery on time.', 'oilsim'],
  ['FMCG distribution', 'Freezer restocking and route priority.', 'replenish'],
];


// ---------------------------------------------------------------------------
// INTEGRATIONS
// ---------------------------------------------------------------------------
const integrations = {
  intro: 'Open Netrikkan is additive: it sits beside the systems a plant already runs and never replaces them. Data can arrive through a connector, an API, a file drop or a spreadsheet — so a first model never has to wait on an integration project.',
  groups: [
    { icon: 'db', title: 'ERP & planning', items: ['SAP S/4HANA and ECC', 'Oracle E-Business Suite and Fusion', 'Microsoft Dynamics 365', 'Infor, IFS, Epicor', 'Advanced planning (APS) systems', 'Sales order, BOM, routing and inventory data'] },
    { icon: 'gear', title: 'MES / MOM', items: ['Siemens Opcenter', 'Dassault DELMIA Apriso', 'Rockwell Plex and FactoryTalk', 'AVEVA MES', 'Work orders, confirmations, downtime and yield feedback', 'Custom and in-house MES'] },
    { icon: 'layers', title: 'WMS, TMS & supply chain', items: ['SAP EWM', 'Manhattan Associates', 'Blue Yonder', 'Oracle WMS', 'Dock, slotting, inbound and outbound events', 'Transport and carrier data'] },
    { icon: 'machine', title: 'Digital twin & 3D', items: ['NVIDIA Omniverse and OpenUSD', 'Siemens Tecnomatix and Process Simulate', 'Azure Digital Twins', 'AWS IoT TwinMaker', 'FMI / FMU co-simulation', 'CAD and layout files: STEP, DWG, glTF'] },
    { icon: 'bars', title: 'Historians & time-series', items: ['AVEVA PI (OSIsoft)', 'AVEVA Historian', 'GE Proficy Historian', 'Ignition historian', 'InfluxDB, TimescaleDB', 'Machine states, cycle times and OEE signals'] },
    { icon: 'clock', title: 'Shop-floor protocols', items: ['OPC UA', 'MQTT and Sparkplug B', 'Modbus TCP', 'PLC and SCADA gateways', 'Kafka and AMQP event streams', 'Edge gateways for legacy equipment'] },
    { icon: 'layers', title: 'Quality, PLM & maintenance', items: ['QMS and LIMS', 'Siemens Teamcenter, PTC Windchill, 3DEXPERIENCE', 'IBM Maximo, SAP PM and other CMMS', 'Non-conformance and inspection data'] },
    { icon: 'db', title: 'Data platforms & files', items: ['SQL and NoSQL databases via ODBC / JDBC', 'Snowflake, Databricks, BigQuery', 'Azure, AWS and Google Cloud storage', 'Excel, CSV, PDF and drawings through document extraction', 'SFTP and scheduled file drops'] },
    { icon: 'shield', title: 'Identity & security', items: ['SSO with SAML 2.0 and OpenID Connect', 'Microsoft Entra ID, Okta', 'Role-based access', 'On-premise or private-cloud deployment options', 'Language models that can run locally'] },
  ],
  api: {
    title: 'Open APIs for your own integrations',
    body: 'If you would like to connect Open Netrikkan to a system that is not listed, we will expose the APIs to do it. Every module can be driven programmatically: submit a scenario, retrieve the ranked recommendation and KPIs, and push the approved plan back into your own applications.',
    points: ['REST APIs described with an OpenAPI specification', 'Webhooks and event streaming for run completion and plan approval', 'Bulk data exchange in JSON, CSV and Parquet', 'API keys and OAuth 2.0 with role-based scopes', 'Sandbox environment and integration support from our team'],
  },
  note: 'Connector availability and timelines are confirmed during scoping, based on the versions and interfaces at your plant.',
};

// ---------------------------------------------------------------------------
// FORM OPTIONS
// ---------------------------------------------------------------------------
const options = {
  designation: ['C-level / Founder / Managing Director', 'VP / SVP / Head of Function', 'Director / General Manager', 'Senior Manager / Manager', 'Engineer / Analyst / Executive', 'Consultant / Advisor'],
  interest: ['Production scheduling & changeover optimisation', 'New line & capacity planning', 'Machine-bank scheduling & delivery commitments', 'Pharma batch flow & OEE', 'Warehouse & outbound operations', 'Semiconductor fab (FabSim)', 'Oil & gas supply (OilSim)', 'FMCG distribution & restocking', 'Digital twin & virtual commissioning', 'Gain-share pilot'],
  size: ['1–50', '51–200', '201–500', '501–1,000', '1,001–5,000', '5,001–10,000', '10,000+'],
  sector: ['Automotive & auto components', 'Electronics & high-tech assembly', 'Pharma & life sciences', 'Semiconductor', 'Oil, gas & energy', 'FMCG & consumer goods', 'Plastics, footwear & injection moulding', 'Aerospace & defence', 'Logistics, 3PL & warehousing', 'Industrial machinery', 'Chemicals & materials', 'Other manufacturing', 'Consulting / system integrator', 'Other'],
};

// ---------------------------------------------------------------------------
// CHATBOT KNOWLEDGE BASE (used by server.js)
// ---------------------------------------------------------------------------
const faq = [
  { k: ['what is', 'about', 'platform', 'open netrikkan', 'opennetrikkan', 'who are you', 'what do you do', 'overview'],
    a: 'Open Netrikkan is an AI-native discrete event simulation (DES) platform for manufacturing and logistics. It models your operation as a sequence of events, runs hundreds or thousands of scenarios against your real constraints, and gives planners a ranked recommendation with the reasoning visible. We are part of UTS (Univision Technology Solutions) and based in Bengaluru.', chips: ['See the modules', 'How does it work?', 'Book a demo'] },
  { k: ['how does it work', 'how it works', 'agent', 'method', 'approach', 'ai', 'simulation work'], a: 'A four-agent decision chain runs against your plant’s own data: an Interpreter reads plant data and constraints, a Diagnostician finds where time is being lost, a Simulator runs scenarios at scale, and a Recommender ranks the fix and explains why. The loop repeats until improvement flattens, then hands the plan to the planner.', chips: ['Is my data safe?', 'See the modules', 'Book a demo'] },
  { k: ['module', 'modules', 'tools', 'products', 'list', 'what can'], a: 'We have nine decision engines: Changeover Optimizer, Newline, Machine Bank Scheduler, Tablet (pharma), Warehouse, Outbound, FabSim (semiconductor), OilSim (oil & gas) and Replenish (FMCG). Each answers one recurring planning question. Which sector are you in?', chips: ['Assembly / auto', 'Pharma', 'Warehousing', 'Semiconductor', 'Oil & gas', 'FMCG'] },
  { k: ['changeover', 'assembly line', 'sequenc'], a: 'The Changeover Optimizer takes your work-order spreadsheet and searches for the sequence that cuts changeover time while meeting due dates. It shows the hours and money saved against the current plan.', link: ['/modules/changeover-optimizer/', 'Open Changeover Optimizer'], chips: ['Watch the demo video', 'Book a demo'] },
  { k: ['newline', 'new line', 'new component', 'feasibility', 'quote', 'rfp', 'auto component', 'automotive'], a: 'Newline turns a component specification and a plain-English process description into a scored equipment shortlist, process flow, line KPIs and a PDF report — evidence at the moment a quote is written.', link: ['/modules/newline/', 'Open Newline'], chips: ['Watch the demo video', 'Book a demo'] },
  { k: ['machine bank', 'injection', 'moulding', 'molding', 'commitment', 'delivery date', 'scheduler'], a: 'The Machine Bank Scheduler matches each job to the right machine and shift. It includes the Customer Commitment Analyser that verifies real capacity before Sales commits to a date.', link: ['/modules/machine-bank-scheduler/', 'Open Machine Bank Scheduler'], chips: ['How is it priced?', 'Book a demo'] },
  { k: ['pharma', 'tablet', 'batch', 'oee', 'hold time', 'hold-time'], a: 'Tablet simulates batch flow through blending, granulation, compression, coating and packing, showing where batches queue and which stage limits output. Every scenario is a reproducible run, suited to regulated environments.', link: ['/modules/tablet/', 'Open Tablet'], chips: ['Watch the demo video', 'Book a demo'] },
  { k: ['warehouse', 'dock', '3pl', 'slotting', 'inbound'], a: 'Warehouse models inbound, dock scheduling, slotting and labour — for example a 500,000 sq ft centre with 30 dock doors — and compares a normal week against a peak week, with KPIs tied to the P&L.', link: ['/modules/warehouse/', 'Open Warehouse'], chips: ['Outbound module', 'Book a demo'] },
  { k: ['outbound', 'pick', 'pack', 'dispatch', 'wave'], a: 'Outbound is an interactive simulator for picking method, wave release, staffing and cut-off times; every KPI recalculates live and configurations can be compared side by side.', link: ['/modules/outbound/', 'Open Outbound'], chips: ['Book a demo'] },
  { k: ['fab', 'fabsim', 'semiconductor', 'wafer', 'yield'], a: 'FabSim has six modules — chamber matching, defect flow, sampling optimisation, capacity planning, excursion risk and WIP flow — running in the browser on synthetic data, so no sensitive fab data is needed to evaluate it.', link: ['/modules/fabsim/', 'Open FabSim'], chips: ['Book a demo'] },
  { k: ['oil', 'oilsim', 'crude', 'refinery', 'gas'], a: 'OilSim is a Monte Carlo engine (~20 parameters, 2,000 trials) that gives the probability crude reaches the refinery on time, as P10/P50/P90 availability plus margin impact and stock-out risk.', link: ['/modules/oilsim/', 'Open OilSim'], chips: ['Book a demo'] },
  { k: ['fmcg', 'freezer', 'replenish', 'restock', 'cabinet'], a: 'Replenish simulates cabinet-level demand, stock and delivery capacity, then proposes a prioritised restocking plan and visit order.', link: ['/modules/replenish/', 'Open Replenish'], chips: ['Book a demo'] },
  { k: ['price', 'pricing', 'cost', 'gain share', 'gain-share', 'commercial', 'pay'], a: 'Where a manufacturer prefers to pay for results, we offer gain-share pricing with an audited baseline, an agreed definition of utilisation, a carve-out for market cyclicality, a joint measurement committee and a monthly floor fee. You pay more only when the measured result improves. Fixed-fee pilots are also possible.', chips: ['How do pilots work?', 'Book a demo'] },
  { k: ['pilot', 'deploy', 'implementation', 'timeline', 'weeks', 'get started', 'start'], a: 'The usual path is four steps: Baseline (1–2 weeks), Model (2–4 weeks), Pilot (4–8 weeks) and Scale (ongoing). You do not need all nine tools — we start with the decision that costs the most today. Durations depend on data readiness.', chips: ['Book a demo', 'Download the whitepaper'] },
  { k: ['data', 'secure', 'security', 'privacy', 'safe', 'cloud', 'llm', 'on-prem'], a: 'Models run on data the plant already holds, and language models run locally, so operational data need not leave your environment. The platform is additive: it sits beside ERP, MES and WMS systems and never replaces them.', chips: ['Integrations', 'Book a demo'] },
  { k: ['erp', 'sap', 'mes', 'wms', 'integrat', 'opcenter', 'siemens', 'api', 'opc', 'mqtt', 'historian', 'pi system', 'scada', 'plc', 'protocol', 'digital twin', 'omniverse'], a: 'We integrate with ERP (SAP, Oracle, Dynamics), MES/MOM (Siemens Opcenter, DELMIA Apriso, Plex), WMS/TMS, digital-twin platforms (Omniverse, Tecnomatix), historians (AVEVA PI, Proficy) and shop-floor protocols such as OPC UA and MQTT. Data can also arrive as spreadsheets, PDFs and drawings. If you want to connect something else, we expose REST APIs and webhooks for it.', link: ['/integrations/', 'See supported integrations'], chips: ['Book a demo'] },
  { k: ['white paper', 'whitepaper', 'paper', 'report', 'download', 'pdf'], a: 'Our whitepaper, “Simulation as the Operating System for Contract Manufacturing”, covers all nine engines. You can read it online in full, or download the PDF with a work email.', link: ['/whitepaper/', 'Open the whitepaper'], chips: ['Book a demo'] },
  { k: ['video', 'demo video', 'watch'], a: 'You can watch our product walkthroughs in the video library — Changeover Optimizer, Newline, Tablet and the Customer Commitment Analyser.', link: ['/videos/', 'Open the video library'], chips: ['Book a demo'] },
  { k: ['case', 'customer', 'reference', 'proof', 'results', 'outcome'], a: 'Our case-study section covers digital-twin and virtual-commissioning programmes from our team’s earlier work, plus our own modules in action.', link: ['/case-studies/', 'Open case studies'], chips: ['Book a demo'] },
  { k: ['contact', 'email', 'phone', 'call', 'reach', 'address', 'location', 'where', 'bengaluru', 'bangalore'], a: 'You can reach our team at info@opennetrikkan.com. We are based in Bengaluru, India.', chips: ['Book a demo'] },
  { k: ['uts', 'univision', 'acquired', 'nasscom', 'company', 'team', 'founder'], a: 'Open Netrikkan has been acquired by Univision Technology Solutions (UTS), a global engineering and product company (uts3s.com), and is a NASSCOM DeepTech member.', chips: ['Book a demo'] },
  { k: ['hello', 'hi ', 'hey', 'namaste', 'good morning', 'good evening'], a: 'Hello! I can tell you about the Open Netrikkan platform, our nine modules, pricing, deployment or the whitepaper — or set up a demo. What would you like to know?', chips: ['What is Open Netrikkan?', 'See the modules', 'Book a demo'] },
];

const bookIntent = ['book', 'demo', 'schedule', 'talk to', 'speak', 'meeting', 'call me', 'contact me', 'get in touch', 'pilot session', 'trial', 'quote'];

// ---------------------------------------------------------------------------
// WHITEPAPER (full text, rendered on-page and downloadable as PDF after the form)
// ---------------------------------------------------------------------------
const whitepaper = {
  title: 'Simulation as the Operating System for Contract Manufacturing',
  dek: 'How discrete event simulation and AI-driven decision-making turn changeovers, schedules and quotes into evidence — nine decision engines from Open Netrikkan, built for India’s contract manufacturers and the global supply chains they serve.',
  date: 'September 2026', pages: 15,
  sections: [
    { id: 'big-idea', title: 'The big idea', html: `
      <p class="wp-lede">Contract manufacturers are not paid for equipment. They are paid for <em>decisions made correctly</em>, thousands of times a week — which job runs next, which machine takes it, how much stock stands behind it.</p>
      <p>Most of those decisions are still made on <strong>spreadsheets and experience</strong>. Simulation lets a plant test a decision before it commits to it.</p>` },
    { id: 'summary', title: 'Executive summary', html: `
      <h3>Nine decision engines, one method</h3>
      <p>This paper describes nine simulation-based planning tools built by Open Netrikkan, an AI-native discrete event simulation (DES) platform for manufacturing and logistics. Each tool answers one recurring question a contract manufacturer’s planners face every week. Together they span the full loop: designing a new line, scheduling machines, controlling changeovers, running the process, and moving finished goods out the door.</p>
      <p>The method is constant across sectors. Model the operation as a sequence of events, feed it the customer’s real constraints, run hundreds or thousands of scenarios, and hand the planner a ranked recommendation with the reasoning visible. As McKinsey’s 2026 global AI survey finds, <strong>88% of organisations now use AI in at least one function, yet only 37% can attribute any profit impact to it</strong><sup>1</sup> — the gap between using AI and deciding better with it is exactly where these nine tools sit.</p>
      <div class="wp-table-wrap"><table class="wp-table"><thead><tr><th>#</th><th>Tool</th><th>Decision it supports</th><th>Sector</th><th>Status</th></tr></thead><tbody>
      <tr><td>1</td><td><b>Changeover Optimizer</b></td><td>Sequencing and changeover minimisation on an assembly line</td><td>High-mix assembly</td><td>Available</td></tr>
      <tr><td>2</td><td><b>Newline</b></td><td>Equipment and layout for a new component line</td><td>Auto components</td><td>Available</td></tr>
      <tr><td>3</td><td><b>Machine Bank Scheduler</b></td><td>Schedule for a bank of same-type machines, different specs</td><td>Any machine bank</td><td>Available</td></tr>
      <tr><td>4</td><td><b>Tablet</b></td><td>Batch flow and bottleneck control on a tablet line</td><td>Pharma</td><td>Available</td></tr>
      <tr><td>5</td><td><b>Warehouse</b></td><td>Dock, slotting and labour planning, inbound and outbound</td><td>Distribution / 3PL</td><td>Available</td></tr>
      <tr><td>6</td><td><b>Outbound</b></td><td>Pick, pack and dispatch configuration</td><td>Warehouse outbound</td><td>Available</td></tr>
      <tr><td>7</td><td><b>FabSim</b></td><td>Yield, capacity and cycle-time levers in a fab</td><td>Semiconductor</td><td>Available</td></tr>
      <tr><td>8</td><td><b>OilSim</b></td><td>Probability crude reaches the refinery on time</td><td>Oil &amp; gas</td><td>Available</td></tr>
      <tr><td>9</td><td><b>Replenish</b></td><td>Freezer restocking plan and route priority</td><td>FMCG distribution</td><td>Available</td></tr>
      </tbody></table></div>
      <p class="wp-note">The platform sits alongside existing ERP, MES and WMS systems; it does not replace them.</p>` },
    { id: 'problem', title: 'The contract manufacturer’s problem', html: `
      <h3>Volatility is the business model</h3>
      <p>A contract manufacturer sells capacity, not a product. Its customers change orders, volumes and specifications on their own schedule, and the manufacturer absorbs the volatility. Three pressures recur across every sector this paper covers.</p>
      <div class="wp-cols">
        <div><p><b>High mix, constant changeover.</b> Every switch between products, moulds, dies or recipes consumes time in which no revenue is produced. The order in which jobs run can change total changeover time by a wide margin, yet most plants still sequence by experience and spreadsheet.</p>
        <p><b>Quotes precede the line.</b> Winning a new programme means committing to cycle time, headcount and equipment before anything is built. An optimistic quote erodes margin for the life of the contract; a cautious one loses the bid.</p></div>
        <div><p><b>The plant is only as good as what surrounds it.</b> Late material, a congested dock, an understocked freezer or a delayed crude cargo idles a well-run line as surely as a machine breakdown.</p>
        <p>Spreadsheets and static capacity calculators cannot hold these pressures because they ignore variability and interaction. A machine that averages 85% utilisation on paper still queues jobs when arrivals bunch up.</p></div>
      </div>
      <blockquote class="wp-quote">“Technologies alone will not take us ahead. It’s how we integrate them into our strategy that matters.”<cite>— Founder, Indian industrial manufacturing enterprise, quoted in PwC India, <i>Rewriting the Rules: The Next Chapter of Indian Industrial Manufacturing</i>, 2026</cite></blockquote>
      <div class="wp-stats">
        <div><b>59%</b><span>of Indian manufacturers say AI will be critical to their strategy over the next five years — above the 52% global average</span><i>PwC, Rewriting the Rules, 2026</i></div>
        <div><b>51%</b><span>cite decision quality, not workforce or capital, as the biggest barrier to transformation</span><i>PwC, Rewriting the Rules, 2026</i></div>
        <div><b>41%</b><span>flag workforce skill gaps even where leadership rates the workforce as empowered — a “confident stagnation” pattern</span><i>PwC, Rewriting the Rules, 2026</i></div>
      </div>` },
    { id: 'india', title: 'The Indian manufacturing scenario', html: `
      <h3>A capability window, not a cost story</h3>
      <p>India’s manufacturers are more confident than the global average and more exposed to the technology gap at the same time. PwC’s 2026 CEO Survey found <strong>77% of India CEOs expect stronger domestic economic growth</strong>, against 55% globally, and industrial manufacturing was the second most common sector into which Indian companies diversified over the past five years.<sup>2</sup> That confidence is not yet matched by AI-scale deployment.</p>
      <figure class="wp-chart"><div class="bars">
        <div class="bar"><label>CEOs expecting stronger domestic growth</label><span><i style="width:77%" class="c1"></i></span><b>77%</b></div>
        <div class="bar"><label>CEOs highly confident in near-term revenue growth</label><span><i style="width:57%" class="c2"></i></span><b>57%</b></div>
        <div class="bar"><label>CEOs concerned about keeping pace with AI</label><span><i style="width:66%" class="c4"></i></span><b>66%</b></div>
        <div class="bar"><label>CEOs applying AI to demand generation at scale</label><span><i style="width:37%" class="c3"></i></span><b>37%</b></div>
        <div class="bar"><label>CEOs reporting revenue growth from AI at scale</label><span><i style="width:32%" class="c3"></i></span><b>32%</b></div>
      </div><figcaption>Fig. 1 — India CEOs and AI: confidence in growth is high, but AI is still applied narrowly. Source: PwC India, 26th &amp; 29th CEO Survey, 2026.</figcaption></figure>
      <div class="wp-cols">
        <div><p><b>The competitiveness gap is structural, not just technological.</b> BCG’s global “factory of the future” research finds AI-enabled transformation can lift manufacturing productivity by up to 60%, and estimates that without modernisation, over a trillion dollars of manufacturing value in high-cost geographies is exposed to relocation risk<sup>3</sup> — a pressure India’s contract manufacturers can turn into an opening only if their own plants modernise as fast as the customers awarding them work.</p></div>
        <div><p><b>Auto components illustrate the opportunity.</b> McKinsey projects India’s domestic auto component market to grow 7–8% annually through FY2030, outpacing the broader auto sector by 1.4–1.6x, with exports growing over 20% a year as electrification and premiumisation raise the value of every component sourced.<sup>4</sup> Capturing that growth means quoting and running new lines faster and more accurately than the sourcing decision allows time for.</p></div>
      </div>
      <blockquote class="wp-quote">“Tech enablement and automation will surge across the sector, yet the most meaningful performance differentiation will come from how coherently those technologies, including AI and automation, work together.”<cite>— Ryan Hawk, Global Industrials &amp; Services Leader, PwC US, on PwC’s 2026 industrial manufacturing outlook</cite></blockquote>` },
    { id: 'why-now', title: 'Why now', html: `
      <p class="wp-lede"><span class="hl">88%</span> of organisations use AI somewhere in the business. Only <span class="hl">37%</span> can show it moved profit.</p>
      <p>McKinsey calls this the implementation gap: benefits appear at the task level and stall before they reach the balance sheet. Closing it on the shop floor means putting AI where the decision is made — the schedule, the sequence, the quote — not beside it.</p>
      <p class="wp-note">Source: McKinsey &amp; Company, <i>The State of AI in 2026: On the Road to ROI</i>, August 2026.</p>` },
    { id: 'method', title: 'How simulation works', html: `
      <h3>From event model to recommendation</h3>
      <p>Discrete event simulation (DES) models a plant as things that happen at moments in time: an order arrives, a machine starts a job, a changeover finishes, a truck docks. The model advances event by event, tracking queues, utilisation and delay, and because it can draw random variation from real data, it shows the range of outcomes a plan may produce — not a single average.</p>
      <p>The Open Netrikkan platform adds an AI decision layer on top of a conventional simulation engine.</p>
      <figure class="wp-agents">
        <div class="ag a1"><b>Interpreter</b><span>Reads plant data &amp; constraints</span></div><i>→</i>
        <div class="ag a2"><b>Diagnostician</b><span>Finds where time is being lost</span></div><i>→</i>
        <div class="ag a1"><b>Simulator</b><span>Runs scenarios at scale</span></div><i>→</i>
        <div class="ag a2"><b>Recommender</b><span>Ranks the fix, explains why</span></div>
        <figcaption>Fig. 2 — The four-agent decision chain runs locally against the plant’s own data, in a closed loop that keeps refining the recommendation until improvement flattens.</figcaption>
      </figure>
      <div class="wp-cols">
        <div><p><b>Scenarios, not forecasts.</b> Planners ask what happens if a customer adds 20% volume, a machine goes down for two shifts, or a mould is delayed. Each becomes a scenario, compared side by side.</p>
        <p><b>Additive to existing systems.</b> The platform reads from and complements ERP, MES and WMS systems already on the floor. It gives planners a decision layer those systems do not provide.</p></div>
        <div><p><b>Fast to configure.</b> Data arrives as the spreadsheets, PDFs and drawings a plant already holds; document extraction converts them into simulation inputs, so a first model does not wait on an integration project.</p>
        <p><b>Data stays put.</b> Language models run locally, so operational data need not leave the customer’s environment.</p></div>
      </div>` },
    { id: 'tools', title: 'The nine tools, at a glance', html: `
      <h3>One question each, answered in minutes</h3>
      <div class="wp-tools">${modules.map(m => `<a class="wp-tool" href="/modules/${m.slug}/"><i>${m.n}</i><b>${m.name}</b><em>${m.sector}</em><span>${m.short}</span></a>`).join('')}</div>` },
    { id: 'use-cases-1', title: 'Assembly, new lines and machine banks', html: `
      ${['changeover-optimizer', 'newline', 'machine-bank-scheduler'].map((s, i) => { const m = modules.find(x => x.slug === s); return `<div class="wp-case"><div class="wp-case-h"><span>Use case ${m.n} · ${m.sector}</span><h3>${m.name}</h3></div><p class="wp-q">“${m.question}”</p><p>${m.body}</p><p><b>Result:</b> ${m.result}</p></div>`; }).join('')}` },
    { id: 'use-cases-2', title: 'Pharma, warehouse and outbound', html: `
      ${['tablet', 'warehouse', 'outbound'].map(s => { const m = modules.find(x => x.slug === s); return `<div class="wp-case"><div class="wp-case-h"><span>Use case ${m.n} · ${m.sector}</span><h3>${m.name}</h3></div><p class="wp-q">“${m.question}”</p><p>${m.body}</p></div>`; }).join('')}` },
    { id: 'use-cases-3', title: 'Semiconductor, upstream oil and FMCG', html: `
      ${['fabsim', 'oilsim', 'replenish'].map(s => { const m = modules.find(x => x.slug === s); return `<div class="wp-case"><div class="wp-case-h"><span>Use case ${m.n} · ${m.sector}</span><h3>${m.name}</h3></div><p class="wp-q">“${m.question}”</p><p>${m.body}</p></div>`; }).join('')}
      <div class="wp-pattern"><p class="kick">The pattern</p><p>Changeover hours, quote accuracy, machine utilisation, batch lead time, dock cost, service penalties, yield, stock-out risk, delivery cost.</p><p class="sub">Nine different cost lines. <b>One method</b> — simulate before you commit — recovers value on every one of them.</p></div>` },
    { id: 'deployment', title: 'Deployment approach and business case', html: `
      <h3>Start with the decision that costs the most today</h3>
      <p>A contract manufacturer does not need to adopt all nine tools. The usual path starts with the one decision that costs the most today, proves it against a measured baseline, then extends.</p>
      <div class="wp-steps">
        <div><i>01</i><b>Baseline</b><em>1–2 weeks</em><span>Collect existing schedules, order history and machine data; agree the audited baseline and the metric that defines success.</span></div>
        <div><i>02</i><b>Model</b><em>2–4 weeks</em><span>Build and validate the simulation against last quarter’s actual performance.</span></div>
        <div><i>03</i><b>Pilot</b><em>4–8 weeks</em><span>Planners run scenarios alongside their normal process and compare outcomes.</span></div>
        <div><i>04</i><b>Scale</b><em>Ongoing</em><span>Move to daily use; extend to a second line, plant or tool.</span></div>
      </div><p class="wp-note">Durations are indicative and depend on data readiness.</p>
      <div class="wp-cols">
        <div><h4>Aligning our interest with yours</h4><p>Where a manufacturer prefers to pay for results, we offer gain-share pricing. Protections include an audited baseline, an agreed definition of utilisation, a carve-out for market cyclicality, a joint measurement committee, and a monthly floor fee. The manufacturer pays more only when the measured result improves.</p></div>
        <div><h4>Data and control</h4><p>Models run on data the plant already holds. Language models run locally, so operational data need not leave the customer’s environment. The platform is additive: it is designed to sit beside SAP, Siemens Opcenter, and equivalent MES/WMS systems, never to replace them.</p></div>
      </div>` },
    { id: 'conclusion', title: 'Conclusion and next steps', html: `
      <h3>See it against your own numbers</h3>
      <p>Contract manufacturers compete on reliability and cost, and both are set by planning decisions that are hard to test on a live floor. Simulation makes those decisions testable, and India’s manufacturers now have both the confidence and the competitive pressure to make that shift before their customers make it for them.</p>
      <p>The best way to see one of these tools is to try it against a real scenario. A practical next step is a 30-minute working session in which you nominate the one planning decision that hurts most, and we run the closest tool against a representative case from your own operation.</p>
      <blockquote class="wp-quote">To arrange it, write to the Open Netrikkan team at ${site.email}</blockquote>` },
    { id: 'sources', title: 'Sources', html: `
      <ol class="wp-sources">
        <li>McKinsey &amp; Company, <i>The State of AI in 2026: On the Road to ROI</i>, August 2026.</li>
        <li>PwC India, 29th CEO Survey — India results, 2026; PwC India, <i>Rewriting the Rules: The Next Chapter of Indian Industrial Manufacturing</i>, 2026.</li>
        <li>Boston Consulting Group, <i>AI-Powered Factories Are Rewriting the Rules of Global Manufacturing</i>, May 2026; BCG, <i>How the Factory of the Future Is Reshaping the Economics of Manufacturing Competitiveness</i>, 2026.</li>
        <li>McKinsey &amp; Company, <i>Shifting into High Gear: India’s Auto Component Sector</i>, 2026.</li>
        <li>PwC, <i>Industrial Manufacturing’s Race to 2030</i>, global sector outlook, 2026.</li>
        <li>Boston Consulting Group, <i>Turbocharging Automotive Operations with GenAI</i>, 2026.</li>
      </ol>
      <p class="wp-note">Figures illustrating FabSim and OilSim outcomes in this paper are drawn from each tool’s own demonstration environment on representative or synthetic data; real results depend on the customer’s own operating data.</p>` },
  ],
};

module.exports = { site, integrations, modules, videos, caseStudies, ecosystem, customerLogos, industries, options, faq, bookIntent, whitepaper };
