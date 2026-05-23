import { useState, useRef, useEffect } from "react";

const TYPE_META = {
  canopy:    { label: "Canopy",        color: "#1a4a2e", border: "#52b788", text: "#95d5b2", circleOpacity: 0.25 },
  subcanopy: { label: "Sub-Canopy",    color: "#2d6a4f", border: "#74c69d", text: "#b7e4c7", circleOpacity: 0.18 },
  shrub:     { label: "Shrub",         color: "#40916c", border: "#95d5b2", text: "#d8f3dc", circleOpacity: 0.22 },
  vine:      { label: "Vine",          color: "#7c4a00", border: "#f4a261", text: "#fff0d0", circleOpacity: 0 },
  root:      { label: "Root Crop",     color: "#5c3a1e", border: "#c8a060", text: "#f4e4c0", circleOpacity: 0.28 },
  ground:    { label: "Ground Cover",  color: "#386641", border: "#a7c957", text: "#e8f5c0", circleOpacity: 0.28 },
  tea:       { label: "Medicinal Tea", color: "#2a1a4a", border: "#9b72cf", text: "#d4b8f0", circleOpacity: 0.22 },
  aromatic:  { label: "Aromatic",      color: "#4a2a1a", border: "#e8956d", text: "#ffd5b0", circleOpacity: 0.22 },
};

const PLANTS = [
  { id:"avsharwil",  name:"Avocado Sharwil",      emoji:"🥑", type:"canopy",    spread:13, height:15, water:"moderate", note:"Type A · Grafted · Sept–Mar" },
  { id:"avmalama",   name:"Avocado Malama",        emoji:"🥑", type:"canopy",    spread:13, height:15, water:"moderate", note:"Type B pollinator · Grafted" },
  { id:"avdwarf",    name:"Dwarf Avocado",         emoji:"🥑", type:"canopy",    spread:8,  height:9,  water:"moderate", note:"Little Cado · shelf · under 10ft" },
  { id:"lychee",     name:"Lychee Kaimana",        emoji:"🍈", type:"canopy",    spread:15, height:20, water:"moderate", note:"Grafted · cool winter to fruit" },
  { id:"longan",     name:"Longan Kohala",         emoji:"🫐", type:"canopy",    spread:18, height:22, water:"moderate", note:"Grafted · Jul–Sep harvest" },
  { id:"mango",      name:"Mango Rapoza",          emoji:"🥭", type:"canopy",    spread:15, height:15, water:"moderate", note:"Managed · anthracnose resistant" },
  { id:"breadfruit", name:"Breadfruit Maafala",    emoji:"🍞", type:"canopy",    spread:15, height:20, water:"moderate", note:"Compact Polynesian variety" },
  { id:"coconut",    name:"Coconut Maypan Dwarf",  emoji:"🥥", type:"canopy",    spread:12, height:22, water:"moderate", note:"Dwarf · 3-4 yrs to produce" },
  { id:"inga",       name:"Inga Ice Cream Bean",   emoji:"🍦", type:"canopy",    spread:15, height:15, water:"moderate", note:"Pollard to 15ft · N-fixer · coffee shade" },
  { id:"gliricidia", name:"Gliricidia",            emoji:"🌸", type:"canopy",    spread:8,  height:10, water:"moderate", note:"Coppice to 8ft · N-fixer · chop and drop" },
  { id:"vitex",      name:"Vitex",                 emoji:"💜", type:"canopy",    spread:10, height:12, water:"moderate", note:"Hormonal balance · purple flowers" },
  { id:"citlemon",   name:"Meyer Lemon dwarf",     emoji:"🍋", type:"canopy",    spread:7,  height:7,  water:"moderate", note:"Dwarf grafted · shelf" },
  { id:"citkumquat", name:"Kumquat dwarf",         emoji:"🟠", type:"canopy",    spread:6,  height:7,  water:"moderate", note:"Dwarf · shelf" },
  { id:"citkaffir",  name:"Kaffir Lime dwarf",     emoji:"🍋", type:"canopy",    spread:6,  height:7,  water:"moderate", note:"Dwarf grafted · culinary leaves" },
  { id:"cittang",    name:"Tangerine dwarf",        emoji:"🍊", type:"canopy",    spread:7,  height:7,  water:"moderate", note:"Dwarf grafted · shelf" },
  { id:"rollinia",   name:"Rollinia",              emoji:"🍏", type:"subcanopy", spread:12, height:15, water:"high", note:"Custard fruit · loves rain" },
  { id:"soursop",    name:"Soursop",               emoji:"💚", type:"subcanopy", spread:10, height:15, water:"high", note:"Fast producer · loves humidity" },
  { id:"jaboticaba", name:"Jaboticaba",            emoji:"🍇", type:"subcanopy", spread:8,  height:11, water:"moderate", note:"Fruits on trunk · buy largest" },
  { id:"starfruit",  name:"Starfruit",             emoji:"⭐", type:"subcanopy", spread:10, height:12, water:"moderate", note:"Year-round · loves humidity" },
  { id:"papaya",     name:"Papaya Solo",           emoji:"🍈", type:"subcanopy", spread:4,  height:11, alleloRadius:6, water:"moderate", note:"Fast · gap filler" },
  { id:"banana",     name:"Banana Williams",       emoji:"🍌", type:"subcanopy", spread:6,  height:14, water:"moderate", note:"Clumping · prolific" },
  { id:"plantain",   name:"Dwarf Plantain",        emoji:"🍌", type:"subcanopy", spread:5,  height:10, water:"moderate", note:"Colombian Dwarf" },
  { id:"elderberry", name:"Elderberry",            emoji:"🫐", type:"subcanopy", spread:6,  height:9,  water:"high", note:"Immune · flower and berry tea" },
  { id:"noni",       name:"Noni",                  emoji:"🟡", type:"subcanopy", spread:8,  height:10, water:"moderate", note:"Traditional Hawaiian medicine" },
  { id:"cinnamon",   name:"Cinnamon Ceylon",       emoji:"🌿", type:"subcanopy", spread:8,  height:10, water:"moderate", note:"True cinnamon · bark harvest" },
  { id:"moringa",    name:"Moringa PKM-1",         emoji:"🌱", type:"shrub",     spread:4,  height:6,  water:"moderate", note:"Cut monthly · N-fixer · leaf crop" },
  { id:"mamaki",     name:"Mamaki",                emoji:"🍃", type:"shrub",     spread:6,  height:9,  water:"high", note:"Endemic Hawaiian tea · wet understory" },
  { id:"coffee",     name:"Coffee Caturra",        emoji:"☕", type:"shrub",     spread:5,  height:7,  water:"moderate", note:"Part shade · Haiku ideal" },
  { id:"katuk",      name:"Katuk",                 emoji:"🌿", type:"shrub",     spread:4,  height:6,  water:"moderate", note:"High protein leaf · part shade" },
  { id:"acerola",    name:"Acerola Cherry",        emoji:"🍒", type:"shrub",     spread:8,  height:8,  water:"moderate", note:"Extremely high vitamin C" },
  { id:"mulberry",   name:"Mulberry Dwarf",        emoji:"🫐", type:"shrub",     spread:8,  height:8,  water:"moderate", note:"Year-round fruit · fast" },
  { id:"pigeonpea",  name:"Pigeon Pea",            emoji:"🌿", type:"shrub",     spread:4,  height:8,  water:"moderate", note:"N-fixer pioneer · chop and drop" },
  { id:"chili",      name:"Hawaiian Chili Pepper", emoji:"🌶️", type:"shrub",     spread:3,  height:4,  water:"low", note:"Self-seeds permanently" },
  { id:"roselle",    name:"Roselle Hibiscus",      emoji:"🌺", type:"shrub",     spread:4,  height:5,  water:"moderate", note:"Hibiscus tea · vitamin C" },
  { id:"lemongrass", name:"Lemongrass",            emoji:"🌾", type:"shrub",     spread:3,  height:4,  alleloRadius:5, water:"low", note:"Corner marker · deterrent · tea" },
  { id:"citronella", name:"Citronella Grass",      emoji:"🌾", type:"shrub",     spread:3,  height:4,  water:"low", note:"True citronella · mosquito deterrent" },
  { id:"lilikoi",    name:"Lilikoi Possum Purple", emoji:"💛", type:"vine",      spread:15, height:15, water:"moderate", note:"Plant first · year-round" },
  { id:"chayote",    name:"Chayote",               emoji:"🥒", type:"vine",      spread:20, height:15, water:"moderate", note:"100+ fruit per yr · plant whole" },
  { id:"dragonfruit",name:"Dragon Fruit",          emoji:"🐉", type:"vine",      spread:6,  height:8,  water:"low", note:"Post anchor · architectural" },
  { id:"vanilla",    name:"Vanilla Planifolia",    emoji:"🌸", type:"vine",      spread:10, height:12, water:"moderate", note:"Hand pollinate · high value" },
  { id:"wingedbean", name:"Winged Bean",           emoji:"🫘", type:"vine",      spread:8,  height:8,  water:"moderate", note:"N-fixer · all parts edible" },
  { id:"longbean",   name:"Long Bean",             emoji:"🫛", type:"vine",      spread:6,  height:6,  water:"low", note:"Fast · prolific · direct sow" },
  { id:"blackpepper",name:"Black Peppercorn",      emoji:"🖤", type:"vine",      spread:8,  height:10, water:"low", note:"Climbs posts · high value" },
  { id:"bpea",       name:"Blue Butterfly Pea",    emoji:"💙", type:"vine",      spread:10, height:10, water:"moderate", note:"Blue tea · N-fixer · calming" },
  { id:"passflower", name:"Passionflower",         emoji:"💜", type:"vine",      spread:12, height:10, water:"moderate", note:"Sleep tea · calming" },
  { id:"catsclw",    name:"Cats Claw",             emoji:"🌿", type:"vine",      spread:15, height:15, water:"high", note:"Immune · anti-inflammatory" },
  { id:"schisandra", name:"Schisandra",            emoji:"🔴", type:"vine",      spread:10, height:10, water:"moderate", note:"Adaptogen · five-flavor berry tea" },
  { id:"taro",       name:"Taro Lehua Maoli",      emoji:"🌿", type:"root",      spread:3,  height:4,  water:"high", note:"Wettest area · staple carb" },
  { id:"turmeric",   name:"Turmeric",              emoji:"🟡", type:"root",      spread:2,  height:3,  water:"high", note:"High value · harvest Nov-Jan" },
  { id:"ginger",     name:"Ginger Hawaiian White", emoji:"🫚", type:"root",      spread:2,  height:3,  water:"high", note:"Culinary and medicinal" },
  { id:"galangal",   name:"Galangal",              emoji:"🌱", type:"root",      spread:3,  height:4,  water:"high", note:"Thai cooking · prolific wet" },
  { id:"cassava",    name:"Cassava",               emoji:"🥬", type:"root",      spread:3,  height:8,  water:"low", note:"Rotate in ground · calorie crop" },
  { id:"kava",       name:"Kava Awa",              emoji:"🌿", type:"root",      spread:4,  height:5,  water:"high", note:"Medicinal · ceremonial · 3-5yr" },
  { id:"sweetpot",   name:"Sweet Potato Okinawan", emoji:"🍠", type:"ground",    spread:4,  height:1,  alleloRadius:3, water:"low", note:"Living mulch · edible vine and tuber" },
  { id:"pineapple",  name:"Pineapple",             emoji:"🍍", type:"ground",    spread:2,  height:3,  water:"low", note:"Free from store crowns" },
  { id:"peanutgrass",name:"Peanut Grass",          emoji:"🌾", type:"ground",    spread:2,  height:1,  water:"low", note:"N-fixing living mulch · sunny" },
  { id:"okspinach",  name:"Okinawan Spinach",      emoji:"💜", type:"ground",    spread:2,  height:2,  water:"high", note:"Living mulch · nutritious" },
  { id:"comfrey",    name:"Comfrey Bocking 14",    emoji:"🌿", type:"ground",    spread:3,  height:2,  water:"moderate", note:"Around tree drip lines" },
  { id:"nasturtium", name:"Nasturtium",            emoji:"🧡", type:"ground",    spread:3,  height:1,  alleloRadius:4, water:"low", note:"Trap crop · edible · vitamin C" },
  { id:"marigold",   name:"African Marigold",      emoji:"🌼", type:"ground",    spread:2,  height:2,  water:"low", note:"Repels nematodes and aphids" },
  { id:"creepthyme", name:"Creeping Thyme",        emoji:"🌿", type:"ground",    spread:2,  height:1,  water:"low", note:"Path edges · foot traffic · tea" },
  { id:"pennyroyal", name:"Pennyroyal",            emoji:"🌿", type:"ground",    spread:2,  height:1,  alleloRadius:4, water:"low", note:"Ant and flea deterrent" },
  { id:"tulsi",      name:"Tulsi Holy Basil",      emoji:"🌸", type:"tea",       spread:3,  height:3,  water:"moderate", note:"Adaptogen · stress · immune" },
  { id:"lemonbalm",  name:"Lemon Balm",            emoji:"🍋", type:"tea",       spread:3,  height:2,  water:"high", note:"Calming · antiviral · part shade" },
  { id:"shisored",   name:"Shiso Red",             emoji:"🍁", type:"tea",       spread:2,  height:2,  water:"high", note:"Omega-3 · self-seeds · understory" },
  { id:"shisogrn",   name:"Shiso Green",           emoji:"🌿", type:"tea",       spread:2,  height:2,  water:"high", note:"Productive in shade" },
  { id:"mugwort",    name:"Okinawa Mugwort",       emoji:"🌿", type:"tea",       spread:3,  height:3,  water:"moderate", note:"Digestive · anti-inflammatory" },
  { id:"ashwag",     name:"Ashwagandha",           emoji:"🌿", type:"tea",       spread:3,  height:3,  water:"low", note:"Adaptogen root · good drainage" },
  { id:"stevia",     name:"Stevia",                emoji:"🌿", type:"tea",       spread:2,  height:2,  water:"moderate", note:"Natural sweetener · all teas" },
  { id:"peppermint", name:"Peppermint in pot",     emoji:"🌿", type:"tea",       spread:2,  height:2,  water:"moderate", note:"KEEP IN POT - spreads aggressively" },
  { id:"fennel",     name:"Fennel",                emoji:"🌿", type:"tea",       spread:3,  height:4,  alleloRadius:6, water:"low", note:"Digestive · self-seeds · edible" },
  { id:"feverfew",   name:"Feverfew",              emoji:"🌼", type:"tea",       spread:2,  height:2,  water:"moderate", note:"Migraine prevention · part shade" },
  { id:"mullein",    name:"Mullein",               emoji:"🌿", type:"tea",       spread:2,  height:5,  water:"moderate", note:"Respiratory · biennial self-seeds" },
  { id:"echinacea",  name:"Echinacea",             emoji:"🌸", type:"tea",       spread:2,  height:3,  water:"moderate", note:"Immune · needs good drainage" },
  { id:"thaibasil",  name:"Thai Basil",            emoji:"🌿", type:"aromatic",  spread:2,  height:2,  water:"moderate", note:"Perennial · repels aphids" },
  { id:"rosegeram",  name:"Rose Geranium",         emoji:"🌸", type:"aromatic",  spread:3,  height:3,  water:"moderate", note:"Mosquito and aphid deterrent" },
  { id:"socgarlic",  name:"Society Garlic",        emoji:"💜", type:"aromatic",  spread:3,  height:2,  water:"moderate", note:"Allium scent deters insects" },
  { id:"chives",     name:"Chives",                emoji:"🌿", type:"aromatic",  spread:2,  height:1,  water:"moderate", note:"Deters aphids · handles shade" },
  { id:"tansy",      name:"Tansy",                 emoji:"🌼", type:"aromatic",  spread:3,  height:3,  alleloRadius:4, water:"low", note:"Strong ant deterrent" },
  { id:"pandan",     name:"Pandan",                emoji:"🌿", type:"aromatic",  spread:4,  height:5,  water:"high", note:"Ant deterrent · culinary tea" },
  { id:"vietcori",   name:"Vietnamese Coriander",  emoji:"🌿", type:"aromatic",  spread:2,  height:2,  water:"high", note:"Perennial cilantro · moist shade" },
];

const CONFLICTING_PAIRS = new Set([
  "canopy|canopy",
  "canopy|subcanopy",
  "subcanopy|subcanopy",
  "shrub|shrub",
]);
function conflicts(t1, t2) {
  const key = t1 < t2 ? `${t1}|${t2}` : `${t2}|${t1}`;
  return CONFLICTING_PAIRS.has(key);
}

const CONFLICT_PAIRS = [
  { id1:'fennel',      id2:'tulsi',       reason:'Fennel allelopathic — inhibits tulsi growth' },
  { id1:'fennel',      id2:'lemonbalm',   reason:'Fennel suppresses lemon balm' },
  { id1:'fennel',      id2:'shisored',    reason:'Fennel inhibits shiso' },
  { id1:'fennel',      id2:'shisogrn',    reason:'Fennel inhibits shiso' },
  { id1:'fennel',      id2:'vietcori',    reason:'Fennel inhibits coriander family' },
  { id1:'fennel',      id2:'thaibasil',   reason:'Fennel inhibits basil' },
  { id1:'fennel',      id2:'pigeonpea',   reason:'Fennel stunts legume growth' },
  { id1:'fennel',      id2:'turmeric',    reason:'Fennel inhibits rhizome development' },
  { id1:'fennel',      id2:'ginger',      reason:'Fennel inhibits ginger' },
  { id1:'fennel',      id2:'taro',        reason:'Fennel allelopathic effect on taro' },
  { id1:'fennel',      id2:'mugwort',     reason:'Fennel suppresses neighboring herbs' },
  { id1:'papaya',      id2:'taro',        reason:'Papaya allelopathic within 6ft' },
  { id1:'papaya',      id2:'turmeric',    reason:'Papaya root secretions inhibit rhizomes' },
  { id1:'papaya',      id2:'ginger',      reason:'Papaya allelopathic within 6ft' },
  { id1:'papaya',      id2:'mamaki',      reason:'Papaya suppresses understory within 6ft' },
  { id1:'tansy',       id2:'tulsi',       reason:'Tansy oils suppress tulsi' },
  { id1:'tansy',       id2:'lemonbalm',   reason:'Tansy suppresses lemon balm' },
  { id1:'pennyroyal',  id2:'tulsi',       reason:'Pennyroyal dominates competing aromatics' },
  { id1:'pennyroyal',  id2:'lemonbalm',   reason:'Pennyroyal suppresses lemon balm' },
  { id1:'lemongrass',  id2:'moringa',     reason:'Lemongrass root secretions inhibit Moringa' },
  { id1:'mango',       id2:'avsharwil',   reason:'Both heavy feeders, compete for same nutrients' },
  { id1:'mango',       id2:'avmalama',    reason:'Both heavy feeders, compete for same nutrients' },
  { id1:'soursop',     id2:'lychee',      reason:'Both susceptible to same fungal issues — clusters increase disease pressure' },
  { id1:'sweetpot',    id2:'peanutgrass', reason:'Sweet potato vines will smother peanut grass' },
  { id1:'nasturtium',  id2:'peanutgrass', reason:'Nasturtium spreads aggressively and smothers peanut grass' },
  { id1:'lilikoi',     id2:'chayote',     reason:'Both extremely vigorous — will fight for same fence space, space 20ft apart' },
  { id1:'dragonfruit', id2:'blackpepper', reason:'Dragon fruit root mass outcompetes pepper at same post' },
];
function pairReason(id1, id2) {
  for (const c of CONFLICT_PAIRS) {
    if ((c.id1===id1 && c.id2===id2) || (c.id1===id2 && c.id2===id1)) return c.reason;
  }
  return null;
}
function waterDrops(level) {
  return level==="high" ? "💧💧💧" : level==="low" ? "💧" : "💧💧";
}

const ZONE_DEFS = [
  { id:"triangle",  label:"Triangle Food Forest",           emoji:"🌳", color:"#1a4a2e", accent:"#52b788", widthFt:45, heightFt:98, shape:"triangle", desc:"45ft base · 100ft sides · East dry · West wet · 8ft E to W drop" },
  { id:"fence_n",   label:"North Fence Triangle 100ft",     emoji:"🪢", color:"#7c4a00", accent:"#f4a261", widthFt:100,heightFt:12, shape:"fence",    desc:"100ft cattle fence east edge of triangle" },
  { id:"fence_s",   label:"South Fence House Frontage 100ft",emoji:"🐉",color:"#5a3800", accent:"#e9a84a", widthFt:100,heightFt:12, shape:"fence",    desc:"100ft cattle fence along road by house" },
  { id:"fence_emi", label:"Emis Ditch Fence 50ft",          emoji:"🫘", color:"#2a4a1a", accent:"#a7c957", widthFt:50, heightFt:12, shape:"fence",    desc:"50ft south boundary fence" },
  { id:"shelf",     label:"West Shelf 10ft x 100ft",        emoji:"🍋", color:"#1a3a2a", accent:"#4db88a", widthFt:100,heightFt:12, shape:"rect",     desc:"10ft wide · 100ft long · stay under 8-10ft · ocean view" },
  { id:"shower",    label:"Outdoor Shower Area",            emoji:"🚿", color:"#1a2a2a", accent:"#4a9a9a", widthFt:25, heightFt:25, shape:"rect",     desc:"SW corner of house · Mamaki and moisture lovers" },
];

const MAP_W = 600, MAP_H = 800;
const ROAD_X = 560, GULCH_X = 28, VETIVER_X = 85;
const TRI_TIP = { x: ROAD_X, y: 38 };
const TRI_SE  = { x: ROAD_X, y: 405 };
const TRI_SW  = { x: 245, y: 405 };
const HOUSE_X1 = 182, HOUSE_Y1 = 540, HOUSE_X2 = 378, HOUSE_Y2 = 655;
const SOUTH_Y = 770;
function lrp(a, b, t) { return a + (b - a) * t; }
function hexRgb(hex) {
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)].join(",");
}

const LS_KEY = "foodForestLayouts";

function loadAllLayouts() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; }
}
function saveAllLayouts(layouts) {
  localStorage.setItem(LS_KEY, JSON.stringify(layouts));
}

export default function App() {
  const [view, setView] = useState("overview");
  const [placedByZone, setPlacedByZone] = useState(
    Object.fromEntries(ZONE_DEFS.map(z => [z.id, []]))
  );
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [showSavePanel, setShowSavePanel] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [savedLayouts, setSavedLayouts] = useState(loadAllLayouts);
  const [saveMsg, setSaveMsg] = useState("");
  const fileInputRef = useRef(null);

  const currentZone = ZONE_DEFS.find(z => z.id === view);

  function addPlant(zoneId, plant, x, y) {
    const instance = { ...plant, instanceId: Math.random().toString(36).slice(2,9), x, y };
    setPlacedByZone(prev => ({ ...prev, [zoneId]: [...prev[zoneId], instance] }));
  }
  function deletePlant(zoneId, instanceId) {
    setPlacedByZone(prev => ({ ...prev, [zoneId]: prev[zoneId].filter(p => p.instanceId !== instanceId) }));
  }
  function movePlant(zoneId, instanceId, x, y) {
    setPlacedByZone(prev => ({
      ...prev,
      [zoneId]: prev[zoneId].map(p => p.instanceId === instanceId ? { ...p, x, y } : p),
    }));
  }

  function flashMsg(msg) {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(""), 2500);
  }

  function handleSave() {
    const name = saveName.trim();
    if (!name) { flashMsg("Enter a layout name first"); return; }
    const updated = { ...savedLayouts, [name]: { name, date: new Date().toLocaleDateString(), layout: placedByZone } };
    saveAllLayouts(updated);
    setSavedLayouts(updated);
    setSaveName("");
    flashMsg(`Saved: "${name}"`);
  }

  function handleLoad(name) {
    const entry = savedLayouts[name];
    if (!entry) return;
    setPlacedByZone(entry.layout);
    setShowSavePanel(false);
    flashMsg(`Loaded: "${name}"`);
  }

  function handleDeleteLayout(name) {
    const updated = { ...savedLayouts };
    delete updated[name];
    saveAllLayouts(updated);
    setSavedLayouts(updated);
    flashMsg(`Deleted: "${name}"`);
  }

  function handleExport(name) {
    const entry = savedLayouts[name];
    if (!entry) return;
    const blob = new Blob([JSON.stringify(entry, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `food-forest-${name.replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportCurrent() {
    const blob = new Blob([JSON.stringify({ name: "export", date: new Date().toLocaleDateString(), layout: placedByZone }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `food-forest-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.layout) { flashMsg("Invalid layout file"); return; }
        const name = data.name || file.name.replace(".json","");
        const updated = { ...savedLayouts, [name]: data };
        saveAllLayouts(updated);
        setSavedLayouts(updated);
        setPlacedByZone(data.layout);
        flashMsg(`Imported: "${name}"`);
      } catch { flashMsg("Could not read file"); }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const layoutCount = Object.keys(savedLayouts).length;
  const totalPlants = Object.values(placedByZone).reduce((s, arr) => s + arr.length, 0);

  return (
    <div style={{ background:"#070d08", height:"100vh", color:"#d4edda", fontFamily:"'Courier New',monospace", display:"flex", flexDirection:"column" }}>

      {/* Header */}
      <div style={{ padding:"8px 14px", borderBottom:"1px solid #1a3320", background:"#050c06", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
          <div>
            <div style={{ fontSize:"8px", letterSpacing:"5px", color:"#40916c" }}>HAIKU MAUI · FOOD FOREST PLANNER</div>
            <div style={{ fontSize:"14px", color:"#c8e6c9" }}>
              {view === "overview" ? "Property Overview — Click a zone to plant" : currentZone?.label}
            </div>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:"6px", alignItems:"center", flexWrap:"wrap" }}>
            {saveMsg && <span style={{ color:"#52b788", fontSize:"10px", fontFamily:"monospace" }}>{saveMsg}</span>}
            {view !== "overview" && <button onClick={() => setView("overview")} style={btnS("#52b788")}>← Overview</button>}
            {view !== "overview" && <button onClick={() => setPlacedByZone(p => ({ ...p, [view]:[] }))} style={btnS("#c47a5a")}>Clear Zone</button>}
            <button onClick={() => setShowSavePanel(!showSavePanel)} style={btnS(showSavePanel ? "#9b72cf" : "#74c69d")}>
              💾 Layouts {layoutCount > 0 ? `(${layoutCount})` : ""}
            </button>
          </div>
        </div>

        {/* Save/Load Panel */}
        {showSavePanel && (
          <div style={{ marginTop:"10px", padding:"12px", background:"rgba(27,20,50,0.9)", border:"1px solid #9b72cf44", borderRadius:"10px", display:"flex", gap:"16px", flexWrap:"wrap", alignItems:"flex-start" }}>

            {/* Save current */}
            <div style={{ minWidth:"200px" }}>
              <div style={{ fontSize:"9px", letterSpacing:"3px", color:"#9b72cf", marginBottom:"6px" }}>SAVE CURRENT LAYOUT</div>
              <div style={{ display:"flex", gap:"5px" }}>
                <input
                  value={saveName}
                  onChange={e => setSaveName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSave()}
                  placeholder="Layout name..."
                  style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid #9b72cf44", borderRadius:"6px", padding:"5px 8px", color:"#d4edda", fontSize:"11px", outline:"none", fontFamily:"monospace" }}
                />
                <button onClick={handleSave} style={btnS("#9b72cf")}>Save</button>
              </div>
              <div style={{ display:"flex", gap:"5px", marginTop:"6px" }}>
                <button onClick={handleExportCurrent} style={{ ...btnS("#74c69d"), fontSize:"9px" }}>Export JSON</button>
                <button onClick={() => fileInputRef.current?.click()} style={{ ...btnS("#c8a060"), fontSize:"9px" }}>Import JSON</button>
                <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} style={{ display:"none" }}/>
              </div>
              <div style={{ color:"#40916c", fontSize:"9px", marginTop:"4px" }}>{totalPlants} plants in current layout</div>
            </div>

            {/* Saved layouts list */}
            {layoutCount > 0 && (
              <div style={{ flex:1, minWidth:"220px" }}>
                <div style={{ fontSize:"9px", letterSpacing:"3px", color:"#9b72cf", marginBottom:"6px" }}>SAVED LAYOUTS</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"5px", maxHeight:"160px", overflowY:"auto" }}>
                  {Object.values(savedLayouts).map(entry => {
                    const count = Object.values(entry.layout || {}).reduce((s,a) => s+a.length, 0);
                    return (
                      <div key={entry.name} style={{ display:"flex", alignItems:"center", gap:"6px", background:"rgba(155,114,207,0.08)", border:"1px solid #9b72cf33", borderRadius:"7px", padding:"6px 10px" }}>
                        <div style={{ flex:1 }}>
                          <div style={{ color:"#d4b8f0", fontSize:"11px", fontWeight:"bold" }}>{entry.name}</div>
                          <div style={{ color:"#9b72cf88", fontSize:"9px" }}>{entry.date} · {count} plants</div>
                        </div>
                        <button onClick={() => handleLoad(entry.name)} style={{ ...btnS("#52b788"), fontSize:"9px", padding:"3px 8px" }}>Load</button>
                        <button onClick={() => handleExport(entry.name)} style={{ ...btnS("#c8a060"), fontSize:"9px", padding:"3px 8px" }}>Export</button>
                        <button onClick={() => handleDeleteLayout(entry.name)} style={{ ...btnS("#e05050"), fontSize:"9px", padding:"3px 8px" }}>✕</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {layoutCount === 0 && (
              <div style={{ color:"#2d4a2d", fontSize:"11px", fontStyle:"italic", alignSelf:"center" }}>No saved layouts yet</div>
            )}
          </div>
        )}
      </div>

      <div style={{ flex:1, overflow:"hidden", display:"flex" }}>
        {view === "overview"
          ? <Overview placedByZone={placedByZone} onZoneClick={setView} />
          : <ZonePlanner zone={currentZone} placed={placedByZone[view]||[]}
              onAdd={(plant,x,y) => addPlant(view,plant,x,y)}
              onDelete={id => deletePlant(view,id)}
              onMove={(id,x,y) => movePlant(view,id,x,y)}
              filterType={filterType} setFilterType={setFilterType}
              search={search} setSearch={setSearch}
            />
        }
      </div>
    </div>
  );
}

function Overview({ placedByZone, onZoneClick }) {
  const [hov, setHov] = useState(null);
  const hit = id => ({ onClick:()=>onZoneClick(id), onMouseEnter:()=>setHov(id), onMouseLeave:()=>setHov(null), style:{cursor:"pointer"} });

  function dots(zoneId) {
    const plants = placedByZone[zoneId] || [];
    if (!plants.length) return null;
    const zone = ZONE_DEFS.find(z => z.id === zoneId);
    if (!zone) return null;
    return plants.map(p => {
      let sx, sy;
      const fx = p.x / zone.widthFt, fy = p.y / zone.heightFt;
      if (zoneId === "triangle") {
        sx = TRI_SW.x + fx * (TRI_SE.x - TRI_SW.x);
        sy = TRI_TIP.y + fy * (TRI_SE.y - TRI_TIP.y);
      } else if (zoneId === "fence_n") {
        sx = lrp(TRI_TIP.x, TRI_SE.x, fx) + (fy - 0.5) * 14;
        sy = lrp(TRI_TIP.y, TRI_SE.y, fx);
      } else if (zoneId === "fence_s") {
        sx = lrp(TRI_SE.x, ROAD_X, fx) + (fy - 0.5) * 14;
        sy = lrp(TRI_SE.y, SOUTH_Y, fx);
      } else if (zoneId === "fence_emi") {
        sx = lrp(ROAD_X, GULCH_X, fx);
        sy = SOUTH_Y + (fy - 0.5) * 12;
      } else if (zoneId === "shelf") {
        const rx = GULCH_X, ry = TRI_SW.y + 14;
        const rw = VETIVER_X - GULCH_X - 5, rh = SOUTH_Y - TRI_SW.y - 48;
        sx = rx + fy * rw;
        sy = ry + fx * rh;
      } else if (zoneId === "shower") {
        const rx = HOUSE_X1 - 42, ry = HOUSE_Y2 - 48, rw = 38, rh = 38;
        sx = rx + fx * rw;
        sy = ry + fy * rh;
      } else {
        return null;
      }
      return (
        <text key={p.instanceId} x={sx} y={sy + 3} fontSize="11" textAnchor="middle"
          style={{ pointerEvents: "none" }}>{p.emoji}</text>
      );
    });
  }

  const s1x_base = lrp(TRI_SW.x, TRI_SE.x, 0.33);
  const s2x_base = lrp(TRI_SW.x, TRI_SE.x, 0.66);

  return (
    <div style={{ flex:1, overflow:"auto", background:"#080f09", display:"flex", gap:"14px", padding:"14px", alignItems:"flex-start", justifyContent:"center" }}>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ width:"min(52vw,500px)", flexShrink:0, background:"#0a140b", borderRadius:"12px", border:"1px solid #1a3320" }}>

        <line x1={ROAD_X} y1={0} x2={ROAD_X} y2={MAP_H} stroke="#ffffff10" strokeWidth="1" strokeDasharray="3,3"/>
        <text x={ROAD_X+10} y={MAP_H/2} fill="#ffffff15" fontSize="8" transform={`rotate(90,${ROAD_X+10},${MAP_H/2})`}>ROAD</text>
        <line x1={GULCH_X} y1={0} x2={GULCH_X} y2={MAP_H} stroke="#6b3a2a28" strokeWidth="1"/>
        <text x={GULCH_X-12} y={MAP_H*0.38} fill="#6b3a2a" fontSize="8" transform={`rotate(-90,${GULCH_X-12},${MAP_H*0.38})`}>GULCH</text>
        <line x1={VETIVER_X} y1={TRI_SW.y} x2={VETIVER_X} y2={SOUTH_Y-20} stroke="#c8a06055" strokeWidth="2.5" strokeDasharray="6,2"/>
        <text x={VETIVER_X-30} y={lrp(TRI_SW.y,SOUTH_Y,0.2)} fill="#c8a06055" fontSize="7">VETIVER</text>

        <rect x={205} y={4} width={ROAD_X-209} height={26} rx="3" fill="#3a2a1018" stroke="#c8a06028" strokeWidth="1"/>
        <text x={lrp(205,ROAD_X,0.5)} y={13} textAnchor="middle" fill="#c8a06055" fontSize="7">Christmas Berry + Eucalyptus</text>
        <text x={lrp(205,ROAD_X,0.5)} y={24} textAnchor="middle" fill="#c8a06033" fontSize="6">Due north - no shadow - future Mamaki grove</text>

        {/* Triangle */}
        <polygon points={`${TRI_TIP.x},${TRI_TIP.y} ${TRI_SE.x},${TRI_SE.y} ${TRI_SW.x},${TRI_SW.y}`}
          fill={hov==="triangle"?"#2d6a4fbb":"#1a4a2e55"}
          stroke={hov==="triangle"?"#74c69d":"#52b78855"} strokeWidth={hov==="triangle"?2.5:1.5}
          {...hit("triangle")}/>
        {/* Strip dividers */}
        {[[0.33],[0.66]].map(([f],i) => {
          const bx = lrp(TRI_SW.x, TRI_SE.x, f);
          const tx = lrp(TRI_TIP.x, bx, 0.08);
          const ty = lrp(TRI_TIP.y, TRI_SE.y, 0.08);
          return <line key={i} x1={tx} y1={ty} x2={bx} y2={TRI_SE.y} stroke="#95d5b228" strokeWidth="1.5" strokeDasharray="5,3" style={{pointerEvents:"none"}}/>;
        })}
        <text x={lrp(TRI_SE.x,TRI_SW.x,0.5)} y={lrp(TRI_TIP.y,TRI_SE.y,0.42)} fill="#74c69d" fontSize="10" textAnchor="middle" style={{pointerEvents:"none"}}>FOOD FOREST</text>
        <text x={lrp(TRI_SE.x,TRI_SW.x,0.5)} y={lrp(TRI_TIP.y,TRI_SE.y,0.42)+13} fill="#52b78855" fontSize="7" textAnchor="middle" style={{pointerEvents:"none"}}>tap to plant</text>
        {dots("triangle")}

        {/* North fence */}
        <line x1={TRI_TIP.x} y1={TRI_TIP.y} x2={TRI_SE.x} y2={TRI_SE.y}
          stroke={hov==="fence_n"?"#f4a261":"#f4a26155"} strokeWidth={hov==="fence_n"?8:5} {...hit("fence_n")}/>
        <text x={ROAD_X+10} y={lrp(TRI_TIP.y,TRI_SE.y,0.32)} fill="#f4a26177" fontSize="7">N.FENCE</text>
        {dots("fence_n")}

        {/* South fence */}
        <line x1={TRI_SE.x} y1={TRI_SE.y} x2={ROAD_X} y2={SOUTH_Y}
          stroke={hov==="fence_s"?"#e9a84a":"#e9a84a44"} strokeWidth={hov==="fence_s"?8:5} {...hit("fence_s")}/>
        <text x={ROAD_X+10} y={lrp(TRI_SE.y,SOUTH_Y,0.38)} fill="#e9a84a77" fontSize="7">S.FENCE</text>
        {dots("fence_s")}

        {/* Emi fence */}
        <line x1={ROAD_X} y1={SOUTH_Y} x2={GULCH_X} y2={SOUTH_Y}
          stroke={hov==="fence_emi"?"#a7c957":"#a7c95744"} strokeWidth={hov==="fence_emi"?5:3}
          strokeDasharray="8,3" {...hit("fence_emi")}/>
        <text x={lrp(GULCH_X,ROAD_X,0.22)} y={SOUTH_Y+13} fill="#a7c95566" fontSize="7">EMIS FENCE - tap to plant</text>
        {dots("fence_emi")}

        {/* Shelf */}
        <rect x={GULCH_X} y={TRI_SW.y+14} width={VETIVER_X-GULCH_X-5} height={SOUTH_Y-TRI_SW.y-48}
          fill={hov==="shelf"?"#1a3a2a88":"#1a3a2a33"} stroke={hov==="shelf"?"#4db88a":"#4db88a33"} strokeWidth="1.5" rx="3"
          {...hit("shelf")}/>
        <text x={lrp(GULCH_X,VETIVER_X,0.5)} y={TRI_SW.y+30} fill="#4db88a" fontSize="7" textAnchor="middle" style={{pointerEvents:"none"}}>SHELF</text>
        <text x={lrp(GULCH_X,VETIVER_X,0.5)} y={TRI_SW.y+42} fill="#4db88a55" fontSize="6" textAnchor="middle" style={{pointerEvents:"none"}}>stay low</text>
        {dots("shelf")}

        <rect x={TRI_SW.x} y={TRI_SE.y} width={TRI_SE.x-TRI_SW.x} height={50} fill="#2d4a1a18" stroke="#8bc34a28" strokeWidth="1" rx="2"/>
        <text x={lrp(TRI_SW.x,TRI_SE.x,0.5)} y={TRI_SE.y+16} fill="#8bc34a55" fontSize="7" textAnchor="middle">Garden Zone</text>

        <rect x={TRI_SW.x} y={TRI_SE.y+50} width={TRI_SE.x-TRI_SW.x} height={50} fill="#0f20100a" stroke="#3a6a3a15" strokeWidth="1" rx="2"/>
        <text x={lrp(TRI_SW.x,TRI_SE.x,0.5)} y={TRI_SE.y+80} fill="#3a6a3a" fontSize="7" textAnchor="middle">OPEN YARD</text>

        <rect x={HOUSE_X1} y={HOUSE_Y1} width={HOUSE_X2-HOUSE_X1} height={HOUSE_Y2-HOUSE_Y1} fill="#2a2a4a28" stroke="#9090c033" strokeWidth="1.5" rx="3"/>
        <text x={lrp(HOUSE_X1,HOUSE_X2,0.5)} y={lrp(HOUSE_Y1,HOUSE_Y2,0.42)} fill="#9090c0" fontSize="9" textAnchor="middle">HOUSE</text>

        <rect x={HOUSE_X2+8} y={HOUSE_Y1} width={58} height={50} rx="2" fill="#1a1a2a22" stroke="#60608033" strokeWidth="1"/>
        <text x={HOUSE_X2+37} y={HOUSE_Y1+20} fill="#808090" fontSize="7" textAnchor="middle">CAR</text>

        {/* West yard */}
        <rect x={VETIVER_X+4} y={HOUSE_Y1} width={HOUSE_X1-VETIVER_X-8} height={HOUSE_Y2-HOUSE_Y1} fill="#0f20100a" stroke="#3a6a3a12" strokeWidth="1" rx="2"/>
        <text x={lrp(VETIVER_X+4,HOUSE_X1,0.5)} y={lrp(HOUSE_Y1,HOUSE_Y2,0.5)} fill="#3a6a3a" fontSize="6" textAnchor="middle">20ft</text>

        {/* Shower */}
        <rect x={HOUSE_X1-42} y={HOUSE_Y2-48} width={38} height={38} rx="3"
          fill={hov==="shower"?"#1a2a2a88":"#1a2a2a44"} stroke={hov==="shower"?"#4a9a9a":"#4a9a9a44"} strokeWidth="1.5"
          {...hit("shower")}/>
        <text x={HOUSE_X1-23} y={HOUSE_Y2-30} fill="#4a9a9a" fontSize="11" textAnchor="middle" style={{pointerEvents:"none"}}>🚿</text>
        <text x={HOUSE_X1-23} y={HOUSE_Y2-15} fill="#4a9a9a77" fontSize="6" textAnchor="middle" style={{pointerEvents:"none"}}>tap</text>
        {dots("shower")}

        <circle cx={ROAD_X} cy={lrp(HOUSE_Y1,HOUSE_Y2,0.5)} r={9} fill="#e9c46a15" stroke="#e9c46a" strokeWidth="1.5"/>
        <text x={ROAD_X} y={lrp(HOUSE_Y1,HOUSE_Y2,0.5)+4} fill="#e9c46a" fontSize="8" textAnchor="middle">⛩</text>

        <circle cx={VETIVER_X} cy={lrp(HOUSE_Y1,SOUTH_Y,0.3)} r={8} fill="#4db88a15" stroke="#4db88a" strokeWidth="1"/>
        <text x={VETIVER_X} y={lrp(HOUSE_Y1,SOUTH_Y,0.3)+4} fill="#4db88a" fontSize="8" textAnchor="middle">↓</text>
        <text x={VETIVER_X+12} y={lrp(HOUSE_Y1,SOUTH_Y,0.3)+4} fill="#4db88a77" fontSize="6">steps</text>

        <text x={GULCH_X+4} y={lrp(TRI_SW.y,SOUTH_Y,0.82)} fill="#4a9eff33" fontSize="9">🌊</text>

        {[["N",18,18],["S",18,40],["W",6,29],["E",30,29]].map(([l,x,y])=>(
          <text key={l} x={x} y={y} fill="#40916c" fontSize="9" textAnchor="middle">{l}</text>
        ))}
        <line x1="18" y1="21" x2="18" y2="37" stroke="#40916c" strokeWidth="0.8"/>
        <line x1="9" y1="29" x2="28" y2="29" stroke="#40916c" strokeWidth="0.8"/>
      </svg>

      {/* Zone cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:"8px", width:"195px" }}>
        <div style={{ fontSize:"8px", letterSpacing:"3px", color:"#40916c", marginBottom:"2px" }}>ZONES</div>
        {ZONE_DEFS.map(zone => {
          const count = (placedByZone[zone.id]||[]).length;
          const isH = hov === zone.id;
          return (
            <div key={zone.id}
              onClick={() => onZoneClick(zone.id)}
              onMouseEnter={() => setHov(zone.id)}
              onMouseLeave={() => setHov(null)}
              style={{ background:isH?`${zone.color}66`:`${zone.color}28`, border:`1px solid ${isH?zone.accent:zone.accent+"33"}`, borderRadius:"10px", padding:"10px 12px", cursor:"pointer", transition:"all 0.12s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom:"3px" }}>
                <span style={{ fontSize:"16px" }}>{zone.emoji}</span>
                <span style={{ color:zone.accent, fontSize:"11px", fontWeight:"bold" }}>{zone.label}</span>
              </div>
              <div style={{ color: count>0?"#74c69d":"#1a4a2e", fontSize:"10px" }}>
                {count>0?`${count} plants placed`:"Empty - click to start"}
              </div>
              {count>0 && (
                <div style={{ marginTop:"4px" }}>
                  {(placedByZone[zone.id]||[]).slice(0,8).map(p=>(
                    <span key={p.instanceId} style={{ fontSize:"12px" }}>{p.emoji}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ZonePlanner({ zone, placed, onAdd, onDelete, onMove, filterType, setFilterType, search, setSearch }) {
  const svgRef = useRef(null);
  const canvasRef = useRef(null);
  const [draggingNew, setDraggingNew] = useState(null);
  const [draggingPlaced, setDraggingPlaced] = useState(null);
  const [selected, setSelected] = useState(null);
  const [ghostPos, setGhostPos] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ w: 1400, h: 900 });
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [armedPlant, setArmedPlant] = useState(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const update = () => setCanvasSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile, paletteOpen]);

  const PAD = 58;
  const CVW = canvasSize.w, CVH = canvasSize.h;
  const scX = (CVW - PAD*2) / zone.widthFt;
  const scY = (CVH - PAD*2) / zone.heightFt;
  const SC = Math.min(scX, scY, 30);
  const zW = zone.widthFt * SC, zH = zone.heightFt * SC;
  const OX = PAD, OY = PAD;

  const triTip = { x: OX + zW, y: OY };
  const triSE  = { x: OX + zW, y: OY + zH };
  const triSW  = { x: OX,      y: OY + zH };

  function getSVGPos(e) {
    const svg = svgRef.current;
    if (!svg) return {x:0,y:0};
    const rect = svg.getBoundingClientRect();
    const sx = CVW/rect.width, sy = CVH/rect.height;
    const cx = e.touches?e.touches[0].clientX:e.clientX;
    const cy = e.touches?e.touches[0].clientY:e.clientY;
    return { x:(cx-rect.left)*sx, y:(cy-rect.top)*sy };
  }
  function toFt(sx,sy) { return { fx:(sx-OX)/SC, fy:(sy-OY)/SC }; }
  function toSVG(fx,fy) { return { sx:fx*SC+OX, sy:fy*SC+OY }; }

  function inTriangle(px,py) {
    if (zone.shape !== "triangle") return true;
    const x1=triTip.x,y1=triTip.y,x2=triSE.x,y2=triSE.y,x3=triSW.x,y3=triSW.y;
    const d1=(px-x2)*(y1-y2)-(x1-x2)*(py-y2);
    const d2=(px-x3)*(y2-y3)-(x2-x3)*(py-y3);
    const d3=(px-x1)*(y3-y1)-(x3-x1)*(py-y1);
    return !((d1<0||d2<0||d3<0)&&(d1>0||d2>0||d3>0));
  }

  function onMove2(e) {
    const pos = getSVGPos(e);
    if (draggingNew) setGhostPos(pos);
    if (draggingPlaced) {
      const {instanceId,ox,oy} = draggingPlaced;
      const {fx,fy} = toFt(pos.x-ox, pos.y-oy);
      onMove(instanceId, Math.max(0,Math.min(zone.widthFt,fx)), Math.max(0,Math.min(zone.heightFt,fy)));
    }
  }

  function onUp(e) {
    if (draggingNew) {
      const pos = getSVGPos(e);
      if (inTriangle(pos.x, pos.y)) {
        const {fx,fy} = toFt(pos.x, pos.y);
        if (fx>=0&&fx<=zone.widthFt&&fy>=0&&fy<=zone.heightFt) onAdd(draggingNew,fx,fy);
      }
      setDraggingNew(null); setGhostPos(null);
    }
    if (draggingPlaced) setDraggingPlaced(null);
  }

  function onPlacedDown(e, plant) {
    e.stopPropagation();
    setSelected(plant.instanceId);
    const pos = getSVGPos(e);
    const {sx,sy} = toSVG(plant.x, plant.y);
    setDraggingPlaced({ instanceId:plant.instanceId, ox:pos.x-sx, oy:pos.y-sy });
  }

  useEffect(() => {
    function onKey(e) {
      if ((e.key==="Delete"||e.key==="Backspace") && selected) {
        if (document.activeElement.tagName==="INPUT") return;
        onDelete(selected); setSelected(null);
      }
      if (e.key==="Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, onDelete]);

  useEffect(() => {
    function up() { if(draggingPlaced) setDraggingPlaced(null); if(draggingNew){setDraggingNew(null);setGhostPos(null);} }
    window.addEventListener("mouseup",up); window.addEventListener("touchend",up);
    return () => { window.removeEventListener("mouseup",up); window.removeEventListener("touchend",up); };
  }, [draggingNew,draggingPlaced]);

  const overlapping = new Set();
  const proximity = new Map();
  function addTo(map, id, partner) {
    if (!map.has(id)) map.set(id, []);
    map.get(id).push(partner);
  }
  for (let i=0;i<placed.length;i++) {
    for (let j=i+1;j<placed.length;j++) {
      const p1=placed[i],p2=placed[j];
      const {sx:x1,sy:y1}=toSVG(p1.x,p1.y), {sx:x2,sy:y2}=toSVG(p2.x,p2.y);
      const dist = Math.sqrt((x1-x2)**2+(y1-y2)**2);
      const r1=(p1.spread/2)*SC, r2=(p2.spread/2)*SC;
      if (conflicts(p1.type, p2.type) && dist < r1+r2) {
        overlapping.add(p1.instanceId); overlapping.add(p2.instanceId);
      }
      const reason = pairReason(p1.id, p2.id);
      const reach1 = (p1.alleloRadius ?? p1.spread/2) * SC;
      const reach2 = (p2.alleloRadius ?? p2.spread/2) * SC;
      if (reason && dist < reach1 + reach2) {
        addTo(proximity, p1.instanceId, { instanceId:p2.instanceId, name:p2.name, reason });
        addTo(proximity, p2.instanceId, { instanceId:p1.instanceId, name:p1.name, reason });
      }
    }
  }

  const selectedPlant = placed.find(p=>p.instanceId===selected);

  function grid() {
    const lines=[];
    for (let x=0;x<=zone.widthFt;x+=5) {
      const sx=x*SC+OX, ten=x%10===0;
      lines.push(<line key={`gx${x}`} x1={sx} y1={OY} x2={sx} y2={OY+zH} stroke={ten?"#95d5b220":"#95d5b20f"} strokeWidth={ten?1:0.5}/>);
      if(ten) lines.push(<text key={`gtx${x}`} x={sx} y={OY-8} fill="#95d5b255" fontSize="9" fontFamily="monospace" textAnchor="middle">{x}'</text>);
    }
    for (let y=0;y<=zone.heightFt;y+=5) {
      const sy=y*SC+OY, ten=y%10===0;
      lines.push(<line key={`gy${y}`} x1={OX} y1={sy} x2={OX+zW} y2={sy} stroke={ten?"#95d5b220":"#95d5b20f"} strokeWidth={ten?1:0.5}/>);
      if(ten) lines.push(<text key={`gty${y}`} x={OX-8} y={sy+4} fill="#95d5b255" fontSize="9" fontFamily="monospace" textAnchor="end">{y}'</text>);
    }
    return lines;
  }

  function zoneBg() {
    if (zone.shape==="triangle") {
      return (
        <g>
          <polygon points={`${triTip.x},${triTip.y} ${triSE.x},${triSE.y} ${triSW.x},${triSW.y}`}
            fill={`${zone.color}33`} stroke={zone.accent} strokeWidth="2"/>
          <polygon points={`${triTip.x},${triTip.y} ${triTip.x},${triTip.y} ${lrp(triSW.x,triSE.x,0.33)},${triSW.y} ${triSW.x},${triSW.y}`} fill="#4a9eff18" style={{pointerEvents:"none"}}/>
          <polygon points={`${triTip.x},${triTip.y} ${triTip.x},${triTip.y} ${lrp(triSW.x,triSE.x,0.66)},${triSW.y} ${lrp(triSW.x,triSE.x,0.33)},${triSW.y}`} fill="#52b78810" style={{pointerEvents:"none"}}/>
          <polygon points={`${triTip.x},${triTip.y} ${triSE.x},${triSE.y} ${lrp(triSW.x,triSE.x,0.66)},${triSW.y}`} fill="#c8a03018" style={{pointerEvents:"none"}}/>
          {[0.33,0.66].map((f,i)=>{
            const bx=lrp(triSW.x,triSE.x,f), tx=lrp(triTip.x,bx,0.06), ty=lrp(triTip.y,triSE.y,0.06);
            return <line key={i} x1={tx} y1={ty} x2={bx} y2={triSE.y} stroke="#95d5b233" strokeWidth="1.5" strokeDasharray="6,4" style={{pointerEvents:"none"}}/>;
          })}
          <text x={lrp(triSW.x,lrp(triSW.x,triSE.x,0.33),0.5)} y={triSE.y-14} fill="#4a9eff66" fontSize="8" textAnchor="middle" style={{pointerEvents:"none"}}>WEST WET</text>
          <text x={lrp(lrp(triSW.x,triSE.x,0.33),lrp(triSW.x,triSE.x,0.66),0.5)} y={triSE.y-14} fill="#95d5b255" fontSize="8" textAnchor="middle" style={{pointerEvents:"none"}}>MIDDLE SLOPE</text>
          <text x={lrp(lrp(triSW.x,triSE.x,0.66),triSE.x,0.5)} y={triSE.y-14} fill="#c8a06066" fontSize="8" textAnchor="middle" style={{pointerEvents:"none"}}>EAST DRY</text>
          <text x={triTip.x+5} y={triTip.y+14} fill={`${zone.accent}88`} fontSize="8">N road</text>
          <text x={lrp(triSW.x,triSE.x,0.5)} y={triSE.y+20} fill={`${zone.accent}88`} fontSize="8" textAnchor="middle">S garden</text>
          <text x={triSW.x-4} y={lrp(triTip.y,triSW.y,0.5)} fill="#4a9eff77" fontSize="8" textAnchor="end">W wet</text>
          <text x={triSE.x+4} y={lrp(triTip.y,triSE.y,0.5)} fill="#c8a06077" fontSize="8">E dry</text>
        </g>
      );
    }
    if (zone.shape==="fence") {
      return (
        <g>
          <rect x={OX} y={OY} width={zW} height={zH} fill={`${zone.color}22`} stroke={zone.accent} strokeWidth="1.5" rx="4"/>
          <line x1={OX} y1={OY+zH/2} x2={OX+zW} y2={OY+zH/2} stroke={zone.accent} strokeWidth="3" strokeDasharray="10,5" opacity="0.5"/>
          <text x={OX+zW/2} y={OY+zH/2-10} fill={`${zone.accent}88`} fontSize="9" textAnchor="middle">FENCE LINE</text>
          <text x={OX+4} y={OY+14} fill={`${zone.accent}66`} fontSize="8">total: {zone.widthFt}ft</text>
        </g>
      );
    }
    return <rect x={OX} y={OY} width={zW} height={zH} fill={`${zone.color}22`} stroke={zone.accent} strokeWidth="1.5" rx="4"/>;
  }

  const clipId = `clip_${zone.id}`;
  const filteredLibrary = PLANTS.filter(p =>
    (filterType==="all"||p.type===filterType) &&
    (search===""||p.name.toLowerCase().includes(search.toLowerCase()))
  );

  function handleCanvasClick(e) {
    if (armedPlant) {
      const pos = getSVGPos(e);
      if (inTriangle(pos.x, pos.y)) {
        const {fx,fy} = toFt(pos.x, pos.y);
        if (fx>=0 && fx<=zone.widthFt && fy>=0 && fy<=zone.heightFt) onAdd(armedPlant, fx, fy);
      }
      setArmedPlant(null);
      return;
    }
    setSelected(null);
  }

  return (
    <div style={{ flex:1, display:"flex", overflow:"hidden", position:"relative" }}>
      <div ref={canvasRef} style={{ flex:1, overflow:"hidden", background:"#080f09", position:"relative" }}
        onMouseMove={onMove2} onTouchMove={e=>{e.preventDefault();onMove2(e);}}
        onMouseUp={onUp} onTouchEnd={onUp}
        onClick={handleCanvasClick}
      >
        <svg ref={svgRef} viewBox={`0 0 ${CVW} ${CVH}`}
          style={{ width:"100%", height:"100%", display:"block", cursor:draggingNew?"crosshair":draggingPlaced?"grabbing":"default" }}>
          <rect width={CVW} height={CVH} fill="#0a140b"/>
          <defs>
            {zone.shape==="triangle" && (
              <clipPath id={clipId}>
                <polygon points={`${triTip.x},${triTip.y} ${triSE.x},${triSE.y} ${triSW.x},${triSW.y}`}/>
              </clipPath>
            )}
          </defs>
          <g clipPath={zone.shape==="triangle"?`url(#${clipId})`:undefined}>{grid()}</g>
          {zoneBg()}
          <text x={OX} y={OY-20} fill={zone.accent} fontSize="10" fontFamily="monospace">{zone.label}</text>
          <text x={OX} y={OY-8} fill={`${zone.accent}77`} fontSize="8" fontFamily="monospace">{zone.desc}</text>

          {/* Spread circles */}
          <g>
            {placed.map(plant => {
              if (plant.type==="vine") return null;
              const tc = TYPE_META[plant.type]||TYPE_META.shrub;
              const {sx,sy} = toSVG(plant.x,plant.y);
              const isOv = overlapping.has(plant.instanceId);
              const isProx = proximity.has(plant.instanceId);
              const isSel = selected===plant.instanceId;
              const dim = filterType!=="all" && plant.type!==filterType;
              if (plant.alleloRadius) {
                const r = plant.alleloRadius * SC;
                const active = isOv || isProx;
                return (
                  <circle key={`c_${plant.instanceId}`} cx={sx} cy={sy} r={r}
                    fill={active?"rgba(220,50,50,0.15)":"rgba(220,50,50,0.05)"}
                    stroke="#e05050"
                    strokeWidth={isSel?1.6:1}
                    strokeDasharray="5,3"
                    opacity={dim?0.2:1}/>
                );
              }
              const r = (plant.spread/2)*SC;
              const showProx = isProx && !isOv;
              const fill = isOv?"rgba(220,50,50,0.13)"
                         : showProx?"rgba(255,149,68,0.13)"
                         : `rgba(${hexRgb(tc.color)},${tc.circleOpacity})`;
              const idleStroke = plant.type==="canopy" ? `${tc.border}88` : `${tc.border}33`;
              const stroke = isOv?"#e05050"
                           : showProx?"#ff9544"
                           : isSel?tc.border:idleStroke;
              return (
                <circle key={`c_${plant.instanceId}`} cx={sx} cy={sy} r={r}
                  fill={fill} stroke={stroke}
                  strokeWidth={isSel?1.5:0.8}
                  strokeDasharray={isOv||showProx?"4,2":""}
                  opacity={dim?0.2:1}/>
              );
            })}
          </g>

          {/* Plant icons */}
          {placed.map(plant => {
            const tc = TYPE_META[plant.type]||TYPE_META.shrub;
            const {sx,sy} = toSVG(plant.x,plant.y);
            const isSel = selected===plant.instanceId;
            const isOv = overlapping.has(plant.instanceId);
            const isProx = !isOv && proximity.has(plant.instanceId);
            const dim = filterType!=="all" && plant.type!==filterType;
            return (
              <g key={plant.instanceId} style={{ cursor:"grab", userSelect:"none" }}
                opacity={dim?0.2:1}
                onMouseDown={e=>onPlacedDown(e,plant)}
                onTouchStart={e=>{e.preventDefault();onPlacedDown(e,plant);}}
                onClick={e=>{e.stopPropagation();setSelected(isSel?null:plant.instanceId);}}
                transform={`translate(${sx},${sy})`}
              >
                {isSel && <circle r={17} fill="none" stroke={tc.border} strokeWidth="2"/>}
                <circle r={11} fill={isOv?"#3a0a0a":tc.color} stroke={isOv?"#e05050":isProx?"#ff9544":tc.border} strokeWidth={isSel?2:1.2}/>
                <text y={4} textAnchor="middle" fontSize="12" style={{pointerEvents:"none"}}>{plant.emoji}</text>
                <text y={20} textAnchor="middle" fontSize="7" style={{pointerEvents:"none"}}>{waterDrops(plant.water)}</text>
                {isSel && (
                  <g style={{pointerEvents:"none"}}>
                    <text y={32} textAnchor="middle" fill={tc.text} fontSize="7" fontFamily="monospace">{plant.name.length>17?plant.name.slice(0,16)+"…":plant.name}</text>
                    <text y={42} textAnchor="middle" fill="#e0505077" fontSize="6">Del key to delete</text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Ghost */}
          {draggingNew && ghostPos && (()=>{
            const tc = TYPE_META[draggingNew.type]||TYPE_META.shrub;
            const r = (draggingNew.spread/2)*SC;
            return (
              <g transform={`translate(${ghostPos.x},${ghostPos.y})`} opacity="0.65" style={{pointerEvents:"none"}}>
                {draggingNew.type!=="vine" && <circle r={r} fill={`rgba(${hexRgb(tc.color)},0.15)`} stroke={`${tc.border}44`} strokeWidth="1"/>}
                <circle r={11} fill={tc.color} stroke={tc.border} strokeWidth="1.5"/>
                <text y={4} textAnchor="middle" fontSize="12">{draggingNew.emoji}</text>
              </g>
            );
          })()}
        </svg>
      </div>

        {/* Mobile: armed plant indicator */}
        {isMobile && armedPlant && (
          <div style={{ position:"absolute", top:8, left:"50%", transform:"translateX(-50%)", background:"rgba(20,40,25,0.95)", border:"1px solid #52b788", borderRadius:"20px", padding:"6px 14px", display:"flex", alignItems:"center", gap:"8px", color:"#d8f3dc", fontSize:"12px", zIndex:5, fontFamily:"monospace" }}>
            <span style={{ fontSize:"16px" }}>{armedPlant.emoji}</span>
            <span>Tap canvas to place {armedPlant.name}</span>
            <button onClick={e=>{e.stopPropagation();setArmedPlant(null);}} style={{ background:"transparent", border:"none", color:"#e05050", fontSize:"14px", cursor:"pointer", padding:"0 4px" }}>✕</button>
          </div>
        )}

        {/* Mobile: selected plant chip */}
        {isMobile && selectedPlant && !armedPlant && (
          <div style={{ position:"absolute", top:8, left:8, right:8, background:`${TYPE_META[selectedPlant.type]?.color}ee`, border:`1px solid ${TYPE_META[selectedPlant.type]?.border}`, borderRadius:"10px", padding:"8px 10px", zIndex:5, fontFamily:"monospace" }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={{ fontSize:"18px" }}>{selectedPlant.emoji}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ color:"#d8f3dc", fontSize:"12px", fontWeight:"bold", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{selectedPlant.name}</div>
                <div style={{ color:TYPE_META[selectedPlant.type]?.text, fontSize:"9px" }}>
                  {TYPE_META[selectedPlant.type]?.label} · {selectedPlant.spread}ft · {waterDrops(selectedPlant.water)}
                </div>
              </div>
              <button onClick={()=>{onDelete(selectedPlant.instanceId);setSelected(null);}} style={btnS("#e05050")}>Delete</button>
              <button onClick={()=>setSelected(null)} style={{ background:"transparent", border:"none", color:"#d4edda88", fontSize:"14px", cursor:"pointer", padding:"0 4px" }}>✕</button>
            </div>
            {overlapping.has(selectedPlant.instanceId) && <div style={{ color:"#e05050", fontSize:"9px", marginTop:"4px" }}>Too close to another plant</div>}
            {proximity.has(selectedPlant.instanceId) && proximity.get(selectedPlant.instanceId).map((c,i) => (
              <div key={`p${i}`} style={{ color:"#ff9544", fontSize:"9px", marginTop:"4px", lineHeight:"1.4" }}>⚠ Near {c.name}: {c.reason}</div>
            ))}
          </div>
        )}

        {/* Mobile: floating + button */}
        {isMobile && !paletteOpen && !armedPlant && (
          <button onClick={e=>{e.stopPropagation();setPaletteOpen(true);}}
            style={{ position:"absolute", bottom:18, right:18, width:56, height:56, borderRadius:"50%", background:"#52b788", border:"none", color:"#0a140b", fontSize:"30px", fontWeight:"bold", cursor:"pointer", boxShadow:"0 4px 12px rgba(0,0,0,0.4)", zIndex:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
            +
          </button>
        )}

      {/* Mobile: slide-up palette drawer */}
      {isMobile && paletteOpen && (
        <>
          <div onClick={()=>setPaletteOpen(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", zIndex:10 }}/>
          <div style={{ position:"absolute", left:0, right:0, bottom:0, height:"72%", background:"#0c1a0d", borderTop:"1px solid #1a3320", borderRadius:"14px 14px 0 0", display:"flex", flexDirection:"column", zIndex:11, boxShadow:"0 -4px 16px rgba(0,0,0,0.5)" }}>
            <div style={{ display:"flex", alignItems:"center", padding:"10px 12px", borderBottom:"1px solid #1a3320" }}>
              <div style={{ flex:1, fontSize:"11px", color:"#74c69d", fontFamily:"monospace", letterSpacing:"2px" }}>TAP A PLANT · {filteredLibrary.length}</div>
              <button onClick={()=>setPaletteOpen(false)} style={btnS("#74c69d")}>Close</button>
            </div>
            <div style={{ padding:"8px 10px", borderBottom:"1px solid #1a3320", flexShrink:0 }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search plants..."
                style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid #1a3320", borderRadius:"7px", padding:"7px 10px", color:"#d4edda", fontSize:"13px", outline:"none", fontFamily:"monospace", boxSizing:"border-box" }}/>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"4px", marginTop:"6px" }}>
                <button onClick={()=>setFilterType("all")} style={fBtnS("all",filterType,"#52b788")}>All</button>
                {Object.entries(TYPE_META).map(([t,m])=>(
                  <button key={t} onClick={()=>setFilterType(t)} style={fBtnS(t,filterType,m.border)}>
                    {m.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"8px" }}>
              {Object.entries(TYPE_META).map(([type,meta])=>{
                const plants = filteredLibrary.filter(p=>p.type===type);
                if (!plants.length || (filterType!=="all"&&filterType!==type)) return null;
                return (
                  <div key={type} style={{ marginBottom:"10px" }}>
                    <div style={{ fontSize:"9px", letterSpacing:"2px", color:meta.border, marginBottom:"4px", paddingLeft:"3px" }}>{meta.label.toUpperCase()}</div>
                    {plants.map(plant=>(
                      <div key={plant.id}
                        onClick={()=>{ setArmedPlant(plant); setPaletteOpen(false); }}
                        style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", borderRadius:"10px", marginBottom:"4px", background:`${meta.color}44`, border:`1px solid ${meta.border}28`, cursor:"pointer", userSelect:"none" }}
                      >
                        <span style={{ fontSize:"22px", flexShrink:0 }}>{plant.emoji}</span>
                        <div style={{ overflow:"hidden", flex:1 }}>
                          <div style={{ color:meta.text, fontSize:"13px" }}>{plant.name} <span style={{ fontSize:"10px" }}>{waterDrops(plant.water)}</span></div>
                          <div style={{ color:`${meta.border}77`, fontSize:"10px" }}>spread:{plant.spread}ft h:{plant.height}ft</div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Desktop sidebar panel */}
      {!isMobile && (
      <div style={{ width:"228px", background:"#0c1a0d", borderLeft:"1px solid #1a3320", display:"flex", flexDirection:"column", flexShrink:0 }}>
        {selectedPlant ? (
          <div style={{ padding:"10px", borderBottom:"1px solid #1a3320", background:`${TYPE_META[selectedPlant.type]?.color}44`, flexShrink:0 }}>
            <div style={{ fontSize:"20px", marginBottom:"2px" }}>{selectedPlant.emoji}</div>
            <div style={{ fontWeight:"bold", color:"#d8f3dc", fontSize:"12px" }}>{selectedPlant.name}</div>
            <div style={{ color:TYPE_META[selectedPlant.type]?.text, fontSize:"9px", marginBottom:"3px" }}>
              {TYPE_META[selectedPlant.type]?.label} · spread:{selectedPlant.spread}ft · h:{selectedPlant.height}ft
            </div>
            <div style={{ color:"#74c69d", fontSize:"10px", lineHeight:"1.4", marginBottom:"6px" }}>{selectedPlant.note}</div>
            {overlapping.has(selectedPlant.instanceId) && <div style={{ color:"#e05050", fontSize:"9px", marginBottom:"5px" }}>Too close to another plant</div>}
            {proximity.has(selectedPlant.instanceId) && proximity.get(selectedPlant.instanceId).map((c,i) => (
              <div key={`p${i}`} style={{ color:"#ff9544", fontSize:"9px", marginBottom:"5px", lineHeight:"1.4" }}>
                ⚠ Near {c.name}: {c.reason}
              </div>
            ))}
            <button onClick={()=>{onDelete(selectedPlant.instanceId);setSelected(null);}}
              style={{ ...btnS("#e05050"), width:"100%", textAlign:"center", padding:"6px" }}>
              Delete (or press Del key)
            </button>
          </div>
        ) : (
          <div style={{ padding:"10px", borderBottom:"1px solid #1a3320", color:"#1a4a2e", fontSize:"10px", flexShrink:0 }}>
            Drag plant onto map · Click to select · Del key deletes
          </div>
        )}

        <div style={{ padding:"7px 8px", borderBottom:"1px solid #1a3320", flexShrink:0 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search plants..."
            style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid #1a3320", borderRadius:"7px", padding:"5px 8px", color:"#d4edda", fontSize:"11px", outline:"none", fontFamily:"monospace", boxSizing:"border-box" }}/>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"3px", marginTop:"5px" }}>
            <button onClick={()=>setFilterType("all")} style={fBtnS("all",filterType,"#52b788")}>All</button>
            {Object.entries(TYPE_META).map(([t,m])=>(
              <button key={t} onClick={()=>setFilterType(t)} style={fBtnS(t,filterType,m.border)}>
                {m.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"6px" }}>
          <div style={{ fontSize:"8px", letterSpacing:"2px", color:"#40916c", marginBottom:"5px" }}>DRAG TO MAP · {filteredLibrary.length} plants</div>
          {Object.entries(TYPE_META).map(([type,meta])=>{
            const plants = filteredLibrary.filter(p=>p.type===type);
            if (!plants.length || (filterType!=="all"&&filterType!==type)) return null;
            return (
              <div key={type} style={{ marginBottom:"7px" }}>
                <div style={{ fontSize:"8px", letterSpacing:"2px", color:meta.border, marginBottom:"3px", paddingLeft:"3px" }}>{meta.label.toUpperCase()}</div>
                {plants.map(plant=>(
                  <div key={plant.id}
                    onMouseDown={()=>setDraggingNew(plant)}
                    onTouchStart={()=>setDraggingNew(plant)}
                    style={{ display:"flex", alignItems:"center", gap:"6px", padding:"4px 7px", borderRadius:"7px", marginBottom:"2px", background:`${meta.color}44`, border:`1px solid ${meta.border}28`, cursor:"grab", userSelect:"none" }}
                    title={`${plant.name} - spread:${plant.spread}ft height:${plant.height}ft`}
                  >
                    <span style={{ fontSize:"14px", flexShrink:0 }}>{plant.emoji}</span>
                    <div style={{ overflow:"hidden", flex:1 }}>
                      <div style={{ color:meta.text, fontSize:"10px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{plant.name} <span style={{ fontSize:"8px" }}>{waterDrops(plant.water)}</span></div>
                      <div style={{ color:`${meta.border}77`, fontSize:"8px" }}>spread:{plant.spread}ft h:{plant.height}ft</div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div style={{ padding:"6px 10px", borderTop:"1px solid #1a3320", fontSize:"9px", color:"#40916c", flexShrink:0 }}>
          {placed.length} placed · {overlapping.size>0
            ? <span style={{color:"#e05050"}}>{Math.round(overlapping.size/2)} overlaps</span>
            : <span style={{color:"#52b788"}}>no overlaps</span>}
        </div>
      </div>
      )}
    </div>
  );
}

function btnS(color) {
  return { background:"transparent", border:`1px solid ${color}55`, borderRadius:"7px", padding:"4px 10px", color, cursor:"pointer", fontSize:"10px", fontFamily:"monospace" };
}
function fBtnS(type,active,color) {
  return { padding:"2px 6px", borderRadius:"6px", border:`1px solid ${active===type?color:color+"28"}`, background:active===type?`${color}28`:"transparent", color:active===type?color:`${color}66`, cursor:"pointer", fontSize:"8px", fontFamily:"monospace" };
}