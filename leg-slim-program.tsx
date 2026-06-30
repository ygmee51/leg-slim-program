import { useState, useEffect, useRef } from "react";

const ADMIN_PASSWORD = "misaki1551";
const START_DATE = new Date("2026-07-01");
const MAX_VIDEOS = 5;
const DAYS = ["月","火","水","木","金","土","日"];
const DEFAULT_CATS = ["脚やせトレ","ストレッチ","脚やせトレ","マッサージ","脚やせトレ","ほぐし方","ストレッチ"];

const DEFAULT_MESSAGES = [
  "1歩美脚に前進！","今日も自分に感謝","自分を愛してあげてね","あなたは最高にきれい","努力は裏切らない",
  "未来の自分がありがとうって言ってる","今日の積み重ねが明日の脚を作る","毎日少しずつ、それで十分","がんばった自分に拍手",
  "美しさは継続から生まれる","今日も内側から輝いて","自分への投資、最高の選択","コツコツが最強","きれいになるって楽しい",
  "今この瞬間も美しくなってる","あなたの努力は必ず花開く","継続は美の力なり","今日も自分に優しくね",
  "体が変わると心も変わる","自信はこうして育つ","今日のあなた、昨日より美しい","一緒にがんばろう！",
  "毎日が美脚への階段","自分を信じて続けよう","その努力、絶対に実る","ボディは一日にして成らず",
  "今日も丁寧に、自分の体と向き合って","ゆっくりでいい、止まらなければ","あなたの脚、どんどん変わってる","今日も最高の1日！",
  "好きな自分になる途中","変化を楽しんで","自分への約束、守れてる？えらい！","心も体も、磨き続けよう",
  "今日のがんばりは明日の自信になる","あなたが笑顔でいることが一番きれい","美脚への道、順調！","今日も正直に自分と向き合えた",
  "体の声を聞いてあげてね","今日の汗が未来の美しさ","努力した日は自分を褒めてね","あなたはちゃんと進んでる",
  "小さな習慣が大きな変化を生む","今日も愛を込めてセルフケア","続けてるだけで偉い！","今日のあなた、輝いてる",
  "何もしない昨日の自分より最高","なりたい自分に、着実に近づいてる","今日もよく頑張りました","あなたの努力は宝物",
  "美しさは習慣の積み重ね","今日もセルフラブデー！","自分を大切に、今日もお疲れ様","変わってる、確実に",
  "体が喜んでるの感じる？","継続中のあなたが一番かっこいい","今日もご自愛ください","努力の先に理想の脚がある",
  "自分磨き、最高の趣味","体を動かした自分に感謝","今日の1歩が未来を変える","あなたらしく美しく",
  "心も体も軽くなっていく","ゆっくりでも確実に前進中","今日のあなたを誇りに思って","続けること自体が才能",
  "美脚計画、着々と進行中！","今日も自分に花丸！","内側から変わっていくあなたが好き","努力は蓄積される",
  "今日もよく動いた！えらい！","あなたの輝きは止まらない","体を信じて、続けて","自分へのご褒美の日が来る",
  "今日も一緒に進めた","ちょっとずつでも、続ければ大きくなる","理想の自分に近づいてる","今日も愛おしい1日",
  "汗をかくたびきれいになってる","今日の自分、最高にかわいい","毎日コツコツ、美脚計画順調","あなたの努力は光ってる",
  "自分を愛する練習、毎日続けて","今日もセルフケアできた！","体は正直に変わっていく","続けてるだけで十分すごい",
  "3ヶ月、一緒にやりきろう","今日の努力に敬意を","なりたい自分、もうすぐそこ","1日1日が宝石みたい",
];

const BADGES = [
  { days:1,  icon:"🌱", label:"スタート！" },
  { days:3,  icon:"✨", label:"3日連続！" },
  { days:7,  icon:"🔥", label:"1週間達成！" },
  { days:14, icon:"💪", label:"2週間の壁突破！" },
  { days:21, icon:"🌟", label:"習慣化スタート！" },
  { days:30, icon:"👑", label:"1ヶ月クイーン！" },
  { days:60, icon:"💎", label:"2ヶ月レジェンド！" },
  { days:90, icon:"🏆", label:"3ヶ月完走！" },
];

const P = {
  bg:"#fff8fb", card:"#ffffff", border:"#fce7f3",
  pink:"#f472b6", pinkLight:"#fce7f3",
  purple:"#c084fc", purpleLight:"#f3e8ff",
  green:"#10b981", greenLight:"rgba(16,185,129,0.1)",
  text:"#4b2d3e", sub:"#9d6b8a", muted:"#c4a0b4",
};

// ── helpers ──
function getDaysSinceStart() {
  return Math.max(0, Math.floor((new Date() - START_DATE) / 86400000));
}
function getProgramWeek() { return Math.floor(getDaysSinceStart() / 7) + 1; }
function getWeekNumber(date) {
  const d = new Date(date); d.setHours(0,0,0,0);
  d.setDate(d.getDate()+4-(d.getDay()||7));
  const y = new Date(d.getFullYear(),0,1);
  return Math.ceil((((d-y)/86400000)+1)/7);
}
function getTodayIdx() { return (new Date().getDay()+6)%7; }
function getWeekKey() {
  const d = new Date();
  return `week_${d.getFullYear()}_${getWeekNumber(d)}`;
}
function dateStr(d) { return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; }
function todayStr() { return dateStr(new Date()); }
function extractYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
  return m?m[1]:null;
}
function emptyVideo() { return {url:"",title:"",memo:""}; }
function defaultEntry(i) { return {day:DAYS[i], categoryId:DEFAULT_CATS[i], videos:[emptyVideo()]}; }
function loadLS(key, fb) { try { return JSON.parse(localStorage.getItem(key)||"null")??fb; } catch { return fb; } }
function getTodayMsg(custom) {
  const idx = getDaysSinceStart() % 90;
  return (custom&&custom[idx]) || DEFAULT_MESSAGES[idx % DEFAULT_MESSAGES.length];
}

// ── storage ──
async function sGet(key, shared=false) {
  try { const r = await window.storage.get(key, shared); return r ? JSON.parse(r.value) : null; } catch { return null; }
}
async function sSet(key, val, shared=false) {
  try { await window.storage.set(key, JSON.stringify(val), shared); } catch {}
}

// ── streak calc ──
function calcStreak(completed) {
  let streak = 0;
  const d = new Date();
  // today done?
  const wk = getWeekKey();
  const tIdx = getTodayIdx();
  // walk back day by day
  for (let i = 0; i < 90; i++) {
    const check = new Date(d);
    check.setDate(check.getDate() - i);
    const wkn = getWeekNumber(check);
    const wkey = `week_${check.getFullYear()}_${wkn}`;
    const dayIdx = (check.getDay()+6)%7;
    // check any video done that day
    const keys = Object.keys(completed).filter(k => k.startsWith(`${wkey}_${dayIdx}_v`) || k === `${wkey}_${dayIdx}_done`);
    const done = keys.some(k => completed[k]);
    if (done) streak++;
    else if (i > 0) break; // allow today to be not done yet
  }
  return streak;
}

function calcTotalDone(completed) {
  // count unique days done
  const days = new Set();
  Object.keys(completed).forEach(k => {
    if (completed[k]) {
      const m = k.match(/^week_\d+_\d+_(\d+)_/);
      if (m) days.add(k.split('_').slice(0,4).join('_')+'_'+m[1]);
    }
  });
  return days.size;
}

// ════════════════════════════════════════════════
// ROOT
// ════════════════════════════════════════════════
export default function App() {
  const [mode, setMode] = useState(null);
  const [userName, setUserName] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = loadLS("leg_username", null);
      if (saved) {
        const u = await sGet(`user:${saved}`, true);
        if (u) { setUserName(saved); setMode("user"); }
        else localStorage.removeItem("leg_username");
      }
      setChecking(false);
    })();
  }, []);

  if (checking) return <Splash />;
  if (mode==="user" && userName) return <UserApp userName={userName} onLogout={() => { setUserName(null); localStorage.removeItem("leg_username"); setMode(null); }} />;
  if (mode==="admin") return <AdminApp onBack={() => setMode(null)} />;
  return <TopScreen onUser={name => { setUserName(name); localStorage.setItem("leg_username", name); setMode("user"); }} onAdmin={() => setMode("admin")} />;
}

function Splash() {
  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${P.pinkLight},${P.purpleLight})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center",color:P.muted}}><div style={{fontSize:40,marginBottom:8}}>🐐</div><div style={{fontSize:13}}>読み込み中...</div></div>
    </div>
  );
}

// ════════════════════════════════════════════════
// TOP SCREEN
// ════════════════════════════════════════════════
function TopScreen({ onUser, onAdmin }) {
  const [name, setName] = useState("");
  const [adminPw, setAdminPw] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const [err, setErr] = useState("");

  async function handleJoin() {
    const n = name.trim();
    if (!n) { setErr("名前を入力してください"); return; }
    const members = await sGet("members", true) || [];
    if (!members.includes(n)) {
      await sSet("members", [...members, n], true);
      await sSet(`user:${n}`, { name:n, joinedAt:todayStr(), completed:{} }, true);
    }
    onUser(n);
  }
  function handleAdmin() {
    if (adminPw===ADMIN_PASSWORD) onAdmin();
    else setErr("パスワードが違います");
  }

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${P.pinkLight} 0%,${P.purpleLight} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:P.card,borderRadius:28,padding:"36px 24px",width:"100%",maxWidth:380,boxShadow:`0 8px 40px rgba(244,114,182,0.18)`}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:44,marginBottom:8}}>🐐</div>
          <div style={{fontSize:10,letterSpacing:3,color:P.purple,fontWeight:700,marginBottom:4}}>✦ Team 脚痩せ隊 ✦</div>
          <div style={{fontSize:22,fontWeight:900,color:P.text}}>3ヶ月美脚プログラム Vol.1</div>
          <div style={{fontSize:12,color:P.muted,marginTop:4}}>3ヶ月で理想の美脚を手に入れよう</div>
        </div>
        {!showAdmin ? (
          <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:12,color:P.sub,fontWeight:600,marginBottom:6}}>あなたの名前を入力してね 🤍</div>
              <input value={name} onChange={e=>{setName(e.target.value);setErr("");}}
                placeholder="例：八木美"
                style={{width:"100%",background:P.bg,border:`1.5px solid ${P.border}`,color:P.text,borderRadius:14,padding:"13px 16px",fontSize:15,boxSizing:"border-box",outline:"none"}}
                onKeyDown={e=>e.key==="Enter"&&handleJoin()}
              />
            </div>
            {err&&<div style={{fontSize:12,color:P.pink,marginBottom:8}}>{err}</div>}
            <button onClick={handleJoin} style={{width:"100%",padding:"15px 0",background:`linear-gradient(135deg,${P.pink},${P.purple})`,border:"none",color:"#fff",borderRadius:16,cursor:"pointer",fontWeight:900,fontSize:16,boxShadow:`0 4px 20px ${P.pink}44`,marginBottom:14}}>スタート ✦</button>
            <button onClick={()=>{setShowAdmin(true);setErr("");}} style={{width:"100%",padding:"10px 0",background:"none",border:`1px solid ${P.border}`,color:P.muted,borderRadius:12,cursor:"pointer",fontSize:12}}>管理者としてログイン</button>
          </>
        ) : (
          <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:12,color:P.sub,fontWeight:600,marginBottom:6}}>管理者パスワード</div>
              <input value={adminPw} onChange={e=>{setAdminPw(e.target.value);setErr("");}} type="password" placeholder="パスワードを入力"
                style={{width:"100%",background:P.bg,border:`1.5px solid ${P.border}`,color:P.text,borderRadius:14,padding:"13px 16px",fontSize:15,boxSizing:"border-box",outline:"none"}}
                onKeyDown={e=>e.key==="Enter"&&handleAdmin()}
              />
            </div>
            {err&&<div style={{fontSize:12,color:P.pink,marginBottom:8}}>{err}</div>}
            <button onClick={handleAdmin} style={{width:"100%",padding:"15px 0",background:`linear-gradient(135deg,${P.pink},${P.purple})`,border:"none",color:"#fff",borderRadius:16,cursor:"pointer",fontWeight:900,fontSize:16,boxShadow:`0 4px 20px ${P.pink}44`,marginBottom:12}}>管理画面へ</button>
            <button onClick={()=>{setShowAdmin(false);setErr("");}} style={{width:"100%",padding:"10px 0",background:"none",border:`1px solid ${P.border}`,color:P.muted,borderRadius:12,cursor:"pointer",fontSize:12}}>戻る</button>
          </>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// USER APP
// ════════════════════════════════════════════════
function UserApp({ userName, onLogout }) {
  const weekKey  = getWeekKey();
  const todayIdx = getTodayIdx();
  const programWeek = getProgramWeek();

  const [tab, setTab]             = useState("today");
  const [programs, setPrograms]   = useState(null);
  const [messages, setMessages]   = useState(null);
  const [notice, setNotice]       = useState(null);
  const [completed, setCompleted] = useState({});
  const [playIdx, setPlayIdx]     = useState(0);
  const [loading, setLoading]     = useState(true);
  const [showBadge, setShowBadge] = useState(null);
  const [photos, setPhotos]       = useState({});
  const [photoLoading, setPhotoLoading] = useState(false);
  const [diary, setDiary]         = useState({});  // { "2026-7-1": "今日頑張った！" }
  const [sizes, setSizes]         = useState([]);   // [{ date, weight, waist, hip, thigh }]
  const [goal, setGoal]           = useState("");   // 今週の目標
  const [posts, setPosts]         = useState([]);   // 共有投稿
  const [allMembers, setAllMembers] = useState([]); // ランキング用
  const [allCompleted, setAllCompleted] = useState({}); // { name: completed }

  useEffect(() => {
    (async () => {
      const [p, m, u, n, ph, di, sz, gl, ps, mb] = await Promise.all([
        sGet("programs", true),
        sGet("messages", true),
        sGet(`user:${userName}`, true),
        sGet("notice", true),
        sGet(`photos:${userName}`, true),
        sGet(`diary:${userName}`, true),
        sGet(`sizes:${userName}`, true),
        sGet(`goal:${userName}`, true),
        sGet("posts", true),
        sGet("members", true),
      ]);
      setPrograms(p||{});
      setMessages(m||{});
      setCompleted(u?.completed||{});
      setNotice(n||null);
      setPhotos(ph||{});
      setDiary(di||{});
      setSizes(sz||[]);
      setGoal(gl||"");
      setPosts(ps||[]);
      setAllMembers(mb||[]);
      setLoading(false);
    })();
  }, [userName]);

  async function uploadPhoto(month, file) {
    if (!file) return;
    setPhotoLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const next = { ...photos, [month]: e.target.result };
      setPhotos(next);
      await sSet(`photos:${userName}`, next, true);
      setPhotoLoading(false);
    };
    reader.readAsDataURL(file);
  }
  async function deletePhoto(month) {
    const next = { ...photos }; delete next[month];
    setPhotos(next);
    await sSet(`photos:${userName}`, next, true);
  }

  // 日記
  async function saveDiary(dateKey, text) {
    const next = { ...diary, [dateKey]: text };
    setDiary(next);
    await sSet(`diary:${userName}`, next, true);
  }

  // サイズ記録
  async function addSize(entry) {
    const next = [...sizes, { ...entry, date: todayStr() }];
    setSizes(next);
    await sSet(`sizes:${userName}`, next, true);
  }

  // 目標
  async function saveGoal(text) {
    setGoal(text);
    await sSet(`goal:${userName}`, text, true);
  }

  // 投稿
  async function addPost(text) {
    if (!text.trim()) return;
    const next = [{ name: userName, text, date: todayStr(), time: new Date().toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"}) }, ...posts].slice(0, 100);
    setPosts(next);
    await sSet("posts", next, true);
  }

  function getWeekProgram(wkey) {
    if (!programs) return DAYS.map((_,i)=>defaultEntry(i));
    return (programs[wkey]||DAYS.map((_,i)=>defaultEntry(i)));
  }
  const weekProgram = getWeekProgram(weekKey);
  const todayEntry  = weekProgram[todayIdx];
  const todayVideos = todayEntry?.videos||[];
  const validVideos = todayVideos.filter(v=>extractYouTubeId(v.url));
  const currentVidId = extractYouTubeId(todayVideos[playIdx]?.url);

  function vKey(dayIdx, vi) { return `${weekKey}_${dayIdx}_v${vi}`; }
  function isDayDone(dayIdx) {
    const entry = weekProgram[dayIdx];
    const vids  = (entry?.videos||[]).filter(v=>extractYouTubeId(v.url));
    if (!vids.length) return !!completed[`${weekKey}_${dayIdx}_done`];
    return vids.every((_,vi) => completed[vKey(dayIdx,vi)]);
  }

  async function toggleVideo(dayIdx, vi) {
    const key  = vKey(dayIdx, vi);
    const next = {...completed, [key]: !completed[key]};
    setCompleted(next);
    const u = await sGet(`user:${userName}`, true)||{};
    await sSet(`user:${userName}`, {...u, completed:next}, true);
    // badge check
    if (!completed[key]) {
      const streak = calcStreak(next);
      const badge  = [...BADGES].reverse().find(b => streak >= b.days && streak === b.days);
      if (badge) setShowBadge(badge);
    }
  }

  const todayDone     = isDayDone(todayIdx);
  const weekDoneCount = weekProgram.filter((_,i)=>isDayDone(i)).length;
  const streak        = calcStreak(completed);
  const totalDone     = calcTotalDone(completed);
  const progressPct   = Math.round((totalDone / 90) * 100);
  const todayMessage  = getTodayMsg(messages);
  const earnedBadges  = BADGES.filter(b => totalDone >= b.days);

  const card = {background:P.card, border:`1px solid ${P.border}`, borderRadius:20, padding:"16px 18px"};

  if (loading) return <Splash />;

  return (
    <div style={{minHeight:"100vh",background:P.bg,color:P.text,fontFamily:"'Hiragino Sans','Yu Gothic','Helvetica Neue',sans-serif"}}>

      {/* HEADER */}
      <div style={{background:`linear-gradient(135deg,${P.pinkLight} 0%,${P.purpleLight} 100%)`,padding:"20px 20px 18px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(249,168,212,0.3)"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:10,letterSpacing:3,color:P.purple,fontWeight:700,marginBottom:2}}>✦ Team 脚痩せ隊 ✦</div>
              <div style={{fontSize:19,fontWeight:900,color:P.text}}>{userName}さんの3ヶ月美脚プログラム Vol.1 🐐</div>
            </div>
            <button onClick={onLogout} style={{background:"rgba(255,255,255,0.7)",border:`1px solid ${P.border}`,color:P.muted,borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:11,flexShrink:0}}>ログアウト</button>
          </div>
          <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
            {[
              {l:"第何週目", v:`${programWeek}週目`},
              {l:"🔥 連続", v:`${streak}日`},
              {l:"今週の達成", v:`${weekDoneCount}/7日`},
              {l:"累計", v:`${totalDone}日`},
            ].map(s=>(
              <div key={s.l} style={{background:"rgba(255,255,255,0.75)",borderRadius:12,padding:"6px 12px",textAlign:"center",border:"1px solid rgba(255,255,255,0.9)"}}>
                <div style={{fontSize:16,fontWeight:900,color:P.pink}}>{s.v}</div>
                <div style={{fontSize:9,color:P.sub}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 全体進捗バー */}
      <div style={{background:P.pinkLight,height:5}}>
        <div style={{width:`${progressPct}%`,height:"100%",background:`linear-gradient(90deg,${P.pink},${P.purple})`,transition:"width .5s"}}/>
      </div>

      {/* TABS */}
      <div style={{display:"flex",background:P.card,borderBottom:`1px solid ${P.border}`,overflowX:"auto"}}>
        {[["today","今日🐐"],["week","今週"],["progress","進捗"],["community","みんな"],["body","記録"],["photo","写真📸"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{flexShrink:0,padding:"12px 12px",background:"none",border:"none",cursor:"pointer",color:tab===k?P.pink:P.muted,fontWeight:tab===k?700:400,fontSize:11,borderBottom:tab===k?`2px solid ${P.pink}`:"2px solid transparent",transition:"all .2s"}}>{l}</button>
        ))}
      </div>

      <div style={{padding:"16px 16px",maxWidth:480,margin:"0 auto"}}>

        {/* お知らせバナー */}
        {notice?.text && (
          <div style={{background:`linear-gradient(135deg,${P.purpleLight},${P.pinkLight})`,border:`1px solid ${P.purple}44`,borderRadius:16,padding:"12px 16px",marginBottom:14,display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:18,flexShrink:0}}>📣</span>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:P.purple,marginBottom:2}}>管理者からのお知らせ</div>
              <div style={{fontSize:13,color:P.text,lineHeight:1.5}}>{notice.text}</div>
              {notice.date && <div style={{fontSize:10,color:P.muted,marginTop:4}}>{notice.date}</div>}
            </div>
          </div>
        )}

        {/* ══ TODAY ══ */}
        {tab==="today" && (
          <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div>
                <div style={{fontSize:12,color:P.muted}}>今日のメニュー</div>
                <div style={{fontSize:22,fontWeight:900}}>{todayEntry?.day}曜日</div>
              </div>
              <div style={{background:P.pinkLight,border:`1px solid ${P.pink}44`,borderRadius:16,padding:"8px 14px",textAlign:"center"}}>
                <div style={{fontSize:11,color:P.pink,fontWeight:700}}>{todayEntry?.categoryId||"メニュー"}</div>
              </div>
            </div>

            {validVideos.length===0 && (
              <div style={{...card,textAlign:"center",padding:28,marginBottom:14}}>
                <div style={{fontSize:36,marginBottom:8}}>🎬</div>
                <div style={{fontWeight:700,marginBottom:4}}>今日の動画は準備中です</div>
                <div style={{fontSize:12,color:P.muted}}>管理者が動画を登録するまでお待ちください</div>
              </div>
            )}

            {validVideos.length>1 && (
              <div style={{display:"flex",gap:8,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
                {todayVideos.map((v,vi)=>{
                  if(!extractYouTubeId(v.url))return null;
                  const done=completed[vKey(todayIdx,vi)];
                  return(
                    <button key={vi} onClick={()=>setPlayIdx(vi)} style={{flexShrink:0,background:playIdx===vi?`linear-gradient(135deg,${P.pink},${P.purple})`:P.card,border:playIdx===vi?"none":`1px solid ${P.border}`,borderRadius:20,padding:"6px 14px",cursor:"pointer",color:playIdx===vi?"#fff":P.sub,fontSize:12,fontWeight:playIdx===vi?700:400,display:"flex",alignItems:"center",gap:5}}>
                      {done&&"✓ "}{v.title||`動画${vi+1}`}
                    </button>
                  );
                })}
              </div>
            )}

            {currentVidId && (
              <div style={{borderRadius:20,overflow:"hidden",marginBottom:12,boxShadow:`0 8px 32px ${P.pink}33`}}>
                <iframe width="100%" height="210" src={`https://www.youtube.com/embed/${currentVidId}`} title="video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{display:"block"}}/>
              </div>
            )}

            {validVideos.length>0 && (
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
                {todayVideos.map((v,vi)=>{
                  const vid=extractYouTubeId(v.url); if(!vid)return null;
                  const done=!!completed[vKey(todayIdx,vi)];
                  return(
                    <div key={vi} style={{...card,padding:"12px 14px",display:"flex",alignItems:"center",gap:12,background:done?`linear-gradient(135deg,${P.purpleLight},${P.pinkLight})`:P.card,border:done?`1px solid ${P.purple}44`:`1px solid ${P.border}`}}>
                      <button onClick={()=>setPlayIdx(vi)} style={{background:"none",border:"none",padding:0,cursor:"pointer",flexShrink:0}}>
                        <img src={`https://img.youtube.com/vi/${vid}/default.jpg`} alt="" style={{width:60,height:45,borderRadius:10,objectFit:"cover",display:"block"}}/>
                      </button>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:700,fontSize:13,color:P.text,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.title||`動画 ${vi+1}`}</div>
                        {v.memo&&<div style={{fontSize:11,color:P.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.memo}</div>}
                      </div>
                      <button onClick={()=>toggleVideo(todayIdx,vi)} style={{width:38,height:38,borderRadius:"50%",border:done?"none":`2px solid ${P.border}`,cursor:"pointer",flexShrink:0,background:done?`linear-gradient(135deg,${P.pink},${P.purple})`:"transparent",color:done?"#fff":P.muted,fontSize:16,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",boxShadow:done?`0 0 12px ${P.pink}44`:"none"}}>✓</button>
                    </div>
                  );
                })}
              </div>
            )}

            {todayDone && (
              <div style={{background:`linear-gradient(135deg,${P.pinkLight},${P.purpleLight})`,border:`1px solid ${P.pink}44`,borderRadius:20,padding:"20px",textAlign:"center",marginBottom:14}}>
                <div style={{fontSize:28,marginBottom:8}}>🐐</div>
                <div style={{fontSize:15,fontWeight:900,color:P.pink,marginBottom:4}}>今日のメニュー完了！</div>
                <div style={{fontSize:14,color:P.sub,lineHeight:1.6,fontWeight:600}}>「{todayMessage}」</div>
                <div style={{marginTop:10,fontSize:12,color:P.purple,fontWeight:700}}>🔥 {streak}日連続継続中！</div>
              </div>
            )}
          </>
        )}

        {/* ══ WEEK ══ */}
        {tab==="week" && (
          <>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:20,fontWeight:900}}>今週のプログラム</div>
              <div style={{fontSize:12,color:P.muted}}>{programWeek}週目（7/1スタート）</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {weekProgram.map((entry,i)=>{
                const done=isDayDone(i); const isToday=i===todayIdx;
                const vids=(entry.videos||[]).filter(v=>extractYouTubeId(v.url));
                const doneCount=vids.filter((_,vi)=>completed[vKey(i,vi)]).length;
                return(
                  <div key={i} style={{...card,display:"flex",alignItems:"center",gap:14,background:isToday?`linear-gradient(135deg,${P.pinkLight},${P.purpleLight})`:P.card,border:isToday?`1.5px solid ${P.pink}88`:`1px solid ${P.border}`,opacity:done?.8:1,boxShadow:isToday?`0 4px 16px ${P.pink}22`:"none"}}>
                    <div style={{width:38,height:38,borderRadius:"50%",flexShrink:0,background:isToday?`linear-gradient(135deg,${P.pink},${P.purple})`:(done?P.pinkLight:"#f9f0f5"),display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:isToday?"#fff":(done?P.pink:P.muted)}}>{done?"✓":entry.day}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                        <span style={{fontWeight:700,fontSize:14,color:P.text}}>{entry.categoryId}</span>
                        {vids.length>0&&<span style={{fontSize:10,color:P.pink,background:P.pinkLight,borderRadius:10,padding:"1px 8px",fontWeight:700}}>{doneCount}/{vids.length}本</span>}
                      </div>
                      <div style={{fontSize:11,color:P.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{vids.filter(v=>v.title).map(v=>v.title).join(" · ")||(vids.length===0?"動画準備中":"タイトル未設定")}</div>
                    </div>
                    {isToday&&!done&&<div style={{fontSize:10,color:P.pink,fontWeight:700,letterSpacing:.5,flexShrink:0}}>TODAY</div>}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ══ PROGRESS ══ */}
        {tab==="progress" && (
          <>
            {/* 全体進捗 */}
            <div style={{...card,marginBottom:14,background:`linear-gradient(135deg,${P.pinkLight},${P.purpleLight})`,border:`1px solid ${P.pink}44`}}>
              <div style={{fontSize:13,fontWeight:700,color:P.pink,marginBottom:10}}>📊 3ヶ月プログラム進捗</div>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                <div style={{fontSize:36,fontWeight:900,color:P.pink}}>{progressPct}%</div>
                <div style={{flex:1}}>
                  <div style={{background:"rgba(255,255,255,0.6)",borderRadius:8,height:10,overflow:"hidden"}}>
                    <div style={{width:`${progressPct}%`,height:"100%",background:`linear-gradient(90deg,${P.pink},${P.purple})`,transition:"width .5s"}}/>
                  </div>
                  <div style={{fontSize:11,color:P.sub,marginTop:4}}>累計 {totalDone} / 90日</div>
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                {[{l:"🔥 連続記録",v:`${streak}日`},{l:"💪 累計達成",v:`${totalDone}日`},{l:"📅 今週",v:`${weekDoneCount}/7日`}].map(s=>(
                  <div key={s.l} style={{flex:1,background:"rgba(255,255,255,0.6)",borderRadius:10,padding:"8px 4px",textAlign:"center"}}>
                    <div style={{fontSize:15,fontWeight:900,color:P.pink}}>{s.v}</div>
                    <div style={{fontSize:9,color:P.sub}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* バッジ */}
            <div style={{...card,marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:700,color:P.text,marginBottom:12}}>🏆 獲得バッジ</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {BADGES.map(b=>{
                  const earned = totalDone >= b.days;
                  return(
                    <div key={b.days} style={{background:earned?`linear-gradient(135deg,${P.pinkLight},${P.purpleLight})`:P.bg,border:earned?`1px solid ${P.pink}44`:`1px solid ${P.border}`,borderRadius:14,padding:"12px 10px",textAlign:"center",opacity:earned?1:.4}}>
                      <div style={{fontSize:28,marginBottom:4}}>{b.icon}</div>
                      <div style={{fontSize:11,fontWeight:700,color:earned?P.pink:P.muted}}>{b.label}</div>
                      <div style={{fontSize:10,color:P.muted}}>{b.days}日達成</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 週別カレンダー（直近4週） */}
            <div style={{...card}}>
              <div style={{fontSize:13,fontWeight:700,color:P.text,marginBottom:12}}>📅 達成カレンダー（直近4週）</div>
              {Array.from({length:4},(_,wi)=>{
                const weekStart = new Date();
                weekStart.setDate(weekStart.getDate() - weekStart.getDay() - (3-wi)*7 + 1);
                return(
                  <div key={wi} style={{marginBottom:10}}>
                    <div style={{fontSize:10,color:P.muted,marginBottom:6}}>{wi===3?"今週":`${4-wi}週前`}</div>
                    <div style={{display:"flex",gap:4}}>
                      {DAYS.map((day,di)=>{
                        const d = new Date(weekStart); d.setDate(d.getDate()+di);
                        const wkn = getWeekNumber(d);
                        const wkey = `week_${d.getFullYear()}_${wkn}`;
                        const vKeys = Object.keys(completed).filter(k=>k.startsWith(`${wkey}_${di}_`));
                        const done  = vKeys.some(k=>completed[k]);
                        const isToday = dateStr(d)===todayStr();
                        return(
                          <div key={di} style={{flex:1,aspectRatio:"1",borderRadius:8,background:done?`linear-gradient(135deg,${P.pink},${P.purple})`:isToday?P.pinkLight:P.bg,border:isToday?`1.5px solid ${P.pink}`:`1px solid ${P.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:done?"#fff":P.muted,fontWeight:done?700:400}}>
                            {done?"✓":day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ══ PHOTO ══ */}
        {/* ══ COMMUNITY ══ */}
        {tab==="community" && (
          <>
            {/* ランキング */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:20,fontWeight:900}}>みんなの状況</div>
            </div>

            {/* 今週の目標 */}
            <GoalCard userName={userName} goal={goal} onSave={saveGoal} />

            {/* ランキング */}
            <div style={{...card, marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:700,color:P.text,marginBottom:12}}>🏅 連続記録ランキング</div>
              <RankingList userName={userName} members={allMembers} />
            </div>

            {/* みんなの投稿 */}
            <div style={{...card, marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:700,color:P.text,marginBottom:10}}>💬 みんなのひとこと</div>
              <PostBox userName={userName} posts={posts} onPost={addPost} />
            </div>
          </>
        )}

        {/* ══ BODY ══ */}
        {tab==="body" && (
          <>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:20,fontWeight:900}}>身体の記録</div>
              <div style={{fontSize:12,color:P.muted}}>体重・サイズの変化をグラフで見よう</div>
            </div>
            <SizeTracker sizes={sizes} onAdd={addSize} />

            {/* 一言日記 */}
            <div style={{...card, marginTop:14}}>
              <div style={{fontSize:13,fontWeight:700,color:P.text,marginBottom:10}}>📝 今日の一言日記</div>
              <DiaryBox diary={diary} onSave={saveDiary} />
            </div>
          </>
        )}

        {tab==="photo" && (
          <>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:20,fontWeight:900}}>脚の記録📸</div>
              <div style={{fontSize:12,color:P.muted}}>毎月4角度から撮って変化を見よう</div>
            </div>

            {/* コラージュ */}
            {[1,2,3].some(m=>photos[`${m}_front`]) && (
              <div style={{...card,marginBottom:16,background:`linear-gradient(135deg,${P.pinkLight},${P.purpleLight})`,border:`1px solid ${P.pink}44`}}>
                <div style={{fontSize:13,fontWeight:700,color:P.pink,marginBottom:12}}>✦ 3ヶ月の変化（正面）</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {[1,2,3].map(m=>(
                    <div key={m}>
                      <div style={{fontSize:10,color:P.muted,textAlign:"center",marginBottom:4,fontWeight:700}}>{m}ヶ月目</div>
                      {photos[`${m}_front`]
                        ? <img src={photos[`${m}_front`]} alt="" style={{width:"100%",aspectRatio:"3/4",objectFit:"cover",borderRadius:10,display:"block"}}/>
                        : <div style={{width:"100%",aspectRatio:"3/4",borderRadius:10,background:P.bg,border:`1px dashed ${P.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>📷</div>
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 各月 */}
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[1,2,3].map(m=>(
                <PhotoMonthCard key={m} month={m} photos={photos} userName={userName} onUpdate={async (next)=>{setPhotos(next); await sSet(`photos:${userName}`,next,true);}} />
              ))}
            </div>

            {photoLoading&&<div style={{textAlign:"center",padding:20,color:P.muted,fontSize:13}}>アップロード中...</div>}
          </>
        )}
      </div>

      {/* バッジ獲得モーダル */}
      {showBadge && (
        <div style={{position:"fixed",inset:0,background:"rgba(75,45,62,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={()=>setShowBadge(null)}>
          <div style={{background:P.card,borderRadius:28,padding:"36px 28px",textAlign:"center",maxWidth:280,margin:20,boxShadow:`0 8px 40px ${P.pink}44`}}>
            <div style={{fontSize:64,marginBottom:12}}>{showBadge.icon}</div>
            <div style={{fontSize:11,color:P.purple,fontWeight:700,letterSpacing:2,marginBottom:6}}>BADGE GET!</div>
            <div style={{fontSize:20,fontWeight:900,color:P.pink,marginBottom:8}}>{showBadge.label}</div>
            <div style={{fontSize:13,color:P.sub,marginBottom:20}}>すごい！継続は力なり🐐</div>
            <button onClick={()=>setShowBadge(null)} style={{background:`linear-gradient(135deg,${P.pink},${P.purple})`,border:"none",color:"#fff",borderRadius:14,padding:"12px 32px",cursor:"pointer",fontWeight:900,fontSize:14}}>やったー！</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════
// 目標カード
// ════════════════════════════════════════════════
function GoalCard({ userName, goal, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(goal);
  const P2 = { bg:"#fff8fb",card:"#fff",border:"#fce7f3",pink:"#f472b6",purple:"#c084fc",text:"#4b2d3e",muted:"#c4a0b4",sub:"#9d6b8a" };
  const card = {background:P2.card,border:`1px solid ${P2.border}`,borderRadius:20,padding:"14px 16px",marginBottom:14};
  return (
    <div style={{...card}}>
      <div style={{fontSize:13,fontWeight:700,color:P2.text,marginBottom:8}}>🎯 今週の目標</div>
      {editing ? (
        <>
          <input value={draft} onChange={e=>setDraft(e.target.value)} placeholder="例：今週は毎日やりきる！" maxLength={50}
            style={{width:"100%",background:P2.bg,border:`1.5px solid ${P2.pink}`,color:P2.text,borderRadius:10,padding:"10px 12px",fontSize:13,boxSizing:"border-box",outline:"none",marginBottom:8}}/>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setEditing(false)} style={{flex:1,padding:"9px 0",background:P2.bg,border:`1px solid ${P2.border}`,color:P2.muted,borderRadius:10,cursor:"pointer",fontSize:12}}>キャンセル</button>
            <button onClick={()=>{onSave(draft);setEditing(false);}} style={{flex:2,padding:"9px 0",background:`linear-gradient(135deg,${P2.pink},${P2.purple})`,border:"none",color:"#fff",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:12}}>保存</button>
          </div>
        </>
      ) : (
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{flex:1,fontSize:13,color:goal?P2.text:P2.muted,fontWeight:goal?600:400}}>{goal||"目標を設定しよう！"}</div>
          <button onClick={()=>{setDraft(goal);setEditing(true);}} style={{background:P2.bg,border:`1px solid ${P2.border}`,color:P2.pink,borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:11,fontWeight:700}}>編集</button>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════
// ランキング
// ════════════════════════════════════════════════
function RankingList({ userName, members }) {
  const [ranking, setRanking] = useState([]);
  const P2 = { pink:"#f472b6", purple:"#c084fc", pinkLight:"#fce7f3", text:"#4b2d3e", muted:"#c4a0b4" };

  useEffect(() => {
    (async () => {
      const list = await Promise.all(members.map(async name => {
        const u = await sGet(`user:${name}`, true);
        return { name, streak: calcStreak(u?.completed||{}) };
      }));
      setRanking(list.sort((a,b)=>b.streak-a.streak));
    })();
  }, [members]);

  const medals = ["🥇","🥈","🥉"];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {ranking.slice(0,10).map((r,i)=>(
        <div key={r.name} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid #fce7f3`}}>
          <div style={{fontSize:18,width:28,textAlign:"center",flexShrink:0}}>{medals[i]||`${i+1}`}</div>
          <div style={{flex:1,fontWeight:r.name===userName?700:400,color:r.name===userName?P2.pink:P2.text,fontSize:13}}>{r.name}{r.name===userName&&" (あなた)"}</div>
          <div style={{fontSize:13,fontWeight:700,color:P2.purple}}>🔥{r.streak}日</div>
        </div>
      ))}
      {ranking.length===0&&<div style={{fontSize:12,color:"#c4a0b4",textAlign:"center",padding:12}}>読み込み中...</div>}
    </div>
  );
}

// ════════════════════════════════════════════════
// 投稿ボックス
// ════════════════════════════════════════════════
function PostBox({ userName, posts, onPost }) {
  const [text, setText] = useState("");
  const P2 = { bg:"#fff8fb",card:"#fff",border:"#fce7f3",pink:"#f472b6",purple:"#c084fc",text:"#4b2d3e",muted:"#c4a0b4",sub:"#9d6b8a",pinkLight:"#fce7f3" };
  return (
    <>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="今日の一言！（例：今日も頑張った🔥）" maxLength={60}
          style={{flex:1,background:P2.bg,border:`1.5px solid ${P2.border}`,color:P2.text,borderRadius:12,padding:"10px 12px",fontSize:13,outline:"none"}}
          onKeyDown={e=>e.key==="Enter"&&(onPost(text),setText(""))}
        />
        <button onClick={()=>{onPost(text);setText("");}} disabled={!text.trim()} style={{background:`linear-gradient(135deg,${P2.pink},${P2.purple})`,border:"none",color:"#fff",borderRadius:12,padding:"10px 14px",cursor:"pointer",fontWeight:700,fontSize:13,flexShrink:0}}>投稿</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:280,overflowY:"auto"}}>
        {posts.slice(0,30).map((p,i)=>(
          <div key={i} style={{background:p.name===userName?`linear-gradient(135deg,${P2.pinkLight},#f3e8ff)`:"#f9f5ff",borderRadius:12,padding:"10px 12px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:11,fontWeight:700,color:p.name===userName?P2.pink:P2.sub}}>{p.name}</span>
              <span style={{fontSize:10,color:P2.muted}}>{p.date} {p.time}</span>
            </div>
            <div style={{fontSize:13,color:P2.text}}>{p.text}</div>
          </div>
        ))}
        {posts.length===0&&<div style={{fontSize:12,color:"#c4a0b4",textAlign:"center",padding:12}}>まだ投稿がありません</div>}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════
// サイズ記録
// ════════════════════════════════════════════════
function SizeTracker({ sizes, onAdd }) {
  const [form, setForm] = useState({weight:"",waist:"",hip:"",thigh:""});
  const [showForm, setShowForm] = useState(false);
  const P2 = { bg:"#fff8fb",card:"#fff",border:"#fce7f3",pink:"#f472b6",purple:"#c084fc",pinkLight:"#fce7f3",purpleLight:"#f3e8ff",text:"#4b2d3e",muted:"#c4a0b4",sub:"#9d6b8a" };
  const card = {background:P2.card,border:`1px solid ${P2.border}`,borderRadius:20,padding:"14px 16px"};

  function handleAdd() {
    if (!form.weight && !form.waist && !form.hip && !form.thigh) return;
    onAdd(form); setForm({weight:"",waist:"",hip:"",thigh:""}); setShowForm(false);
  }

  const latest = sizes[sizes.length-1];
  const first  = sizes[0];

  return (
    <div style={{...card}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,color:P2.text}}>⚖️ 体重・サイズ記録</div>
        <button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${P2.pink},${P2.purple})`,border:"none",color:"#fff",borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:11,fontWeight:700}}>＋ 記録する</button>
      </div>

      {/* 記録フォーム */}
      {showForm && (
        <div style={{background:P2.bg,borderRadius:14,padding:"12px 14px",marginBottom:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
            {[["weight","体重","kg"],["waist","ウエスト","cm"],["hip","ヒップ","cm"],["thigh","太もも","cm"]].map(([key,label,unit])=>(
              <div key={key}>
                <div style={{fontSize:10,color:P2.muted,marginBottom:4}}>{label}（{unit}）</div>
                <input type="number" value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder="--"
                  style={{width:"100%",background:P2.card,border:`1px solid ${P2.border}`,color:P2.text,borderRadius:8,padding:"8px 10px",fontSize:14,boxSizing:"border-box",outline:"none",textAlign:"center"}}/>
              </div>
            ))}
          </div>
          <button onClick={handleAdd} style={{width:"100%",padding:"10px 0",background:`linear-gradient(135deg,${P2.pink},${P2.purple})`,border:"none",color:"#fff",borderRadius:10,cursor:"pointer",fontWeight:700}}>保存</button>
        </div>
      )}

      {/* 最新vs初回 */}
      {sizes.length>1 && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:12}}>
          {[["体重","weight","kg"],["ウエスト","waist","cm"],["ヒップ","hip","cm"],["太もも","thigh","cm"]].map(([label,key,unit])=>{
            const diff = latest[key] && first[key] ? (parseFloat(latest[key])-parseFloat(first[key])).toFixed(1) : null;
            return(
              <div key={key} style={{background:diff&&diff<0?P2.pinkLight:P2.bg,border:`1px solid ${P2.border}`,borderRadius:10,padding:"8px 6px",textAlign:"center"}}>
                <div style={{fontSize:9,color:P2.muted,marginBottom:2}}>{label}</div>
                <div style={{fontSize:13,fontWeight:700,color:P2.text}}>{latest[key]||"--"}<span style={{fontSize:9}}>{unit}</span></div>
                {diff&&<div style={{fontSize:10,fontWeight:700,color:diff<0?"#10b981":P2.pink}}>{diff>0?"+":""}{diff}{unit}</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* 履歴 */}
      {sizes.length>0 && (
        <div style={{maxHeight:160,overflowY:"auto"}}>
          {[...sizes].reverse().slice(0,10).map((s,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${P2.border}`,fontSize:11,color:P2.sub}}>
              <span>{s.date}</span>
              <span>{s.weight&&`${s.weight}kg`} {s.waist&&`W${s.waist}`} {s.hip&&`H${s.hip}`} {s.thigh&&`太${s.thigh}`}</span>
            </div>
          ))}
        </div>
      )}
      {sizes.length===0&&<div style={{fontSize:12,color:P2.muted,textAlign:"center",padding:12}}>まだ記録がありません</div>}
    </div>
  );
}

// ════════════════════════════════════════════════
// 日記ボックス
// ════════════════════════════════════════════════
function DiaryBox({ diary, onSave }) {
  const todayKey = todayStr();
  const [text, setText] = useState(diary[todayKey]||"");
  const [saved, setSaved] = useState(false);
  const P2 = { bg:"#fff8fb",border:"#fce7f3",pink:"#f472b6",purple:"#c084fc",text:"#4b2d3e",muted:"#c4a0b4" };

  useEffect(()=>{ setText(diary[todayKey]||""); },[diary,todayKey]);

  async function handleSave() {
    await onSave(todayKey, text);
    setSaved(true); setTimeout(()=>setSaved(false),2000);
  }

  return (
    <>
      <textarea value={text} onChange={e=>{setText(e.target.value);setSaved(false);}} rows={3} maxLength={200}
        placeholder="今日の感想や気づきを一言…（例：脚が少し軽くなった気がする！）"
        style={{width:"100%",background:P2.bg,border:`1.5px solid ${P2.border}`,color:P2.text,borderRadius:12,padding:"10px 12px",fontSize:13,resize:"none",boxSizing:"border-box",outline:"none",fontFamily:"inherit",marginBottom:8}}
      />
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:11,color:P2.muted}}>{text.length}/200文字</span>
        <button onClick={handleSave} style={{background:`linear-gradient(135deg,${P2.pink},${P2.purple})`,border:"none",color:"#fff",borderRadius:10,padding:"8px 18px",cursor:"pointer",fontWeight:700,fontSize:12}}>
          {saved?"✓ 保存しました！":"保存する"}
        </button>
      </div>
      {/* 過去の日記 */}
      {Object.keys(diary).filter(k=>k!==todayKey).length>0 && (
        <div style={{marginTop:14}}>
          <div style={{fontSize:11,color:P2.muted,marginBottom:8}}>過去の日記</div>
          <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:180,overflowY:"auto"}}>
            {Object.entries(diary).filter(([k])=>k!==todayKey).sort((a,b)=>b[0]>a[0]?1:-1).slice(0,10).map(([date,txt])=>(
              <div key={date} style={{background:P2.bg,borderRadius:10,padding:"8px 12px"}}>
                <div style={{fontSize:10,color:P2.muted,marginBottom:2}}>{date}</div>
                <div style={{fontSize:12,color:P2.text}}>{txt}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ════════════════════════════════════════════════
// PHOTO MONTH CARD（参加者用）
// ════════════════════════════════════════════════
const ANGLES = [
  { key:"front", label:"正面", guide:"足を肩幅に開いて\n正面を向いて立つ", icon:"🧍" },
  { key:"right", label:"右横", guide:"右側から\n真横を向いて立つ", icon:"➡️" },
  { key:"left",  label:"左横", guide:"左側から\n真横を向いて立つ", icon:"⬅️" },
  { key:"back",  label:"背面", guide:"後ろ向きに\nまっすぐ立つ",   icon:"🔄" },
];

function CameraModal({ angle, onCapture, onClose }) {
  const fileRef = useRef(null);

  function handleReadyTap() {
    fileRef.current?.click();
  }

  function handleFile(e) {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { onCapture(ev.target.result); onClose(); };
    reader.readAsDataURL(file);
  }

  return (
    <div style={{position:"fixed",inset:0,background:"#0a0a14",zIndex:300,display:"flex",flexDirection:"column"}}>
      {/* ヘッダー */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",background:"rgba(0,0,0,0.6)"}}>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer",lineHeight:1}}>×</button>
        <div style={{color:"#fff",fontWeight:700,fontSize:14}}>{angle.icon} {angle.label}の撮影ガイド</div>
        <div style={{width:32}}/>
      </div>

      {/* ガイド画像 */}
      <div style={{flex:1,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
        {/* シルエットガイド */}
        <div style={{position:"relative",width:"60%",maxWidth:220,height:"75%"}}>
          {/* 体のシルエット（SVG） */}
          <svg viewBox="0 0 100 200" style={{width:"100%",height:"100%",opacity:.25}}>
            <ellipse cx="50" cy="22" rx="12" ry="14" fill="#fff"/>
            <rect x="35" y="35" width="30" height="55" rx="8" fill="#fff"/>
            <rect x="22" y="38" width="14" height="42" rx="6" fill="#fff"/>
            <rect x="64" y="38" width="14" height="42" rx="6" fill="#fff"/>
            <rect x="37" y="88" width="12" height="65" rx="6" fill="#fff"/>
            <rect x="51" y="88" width="12" height="65" rx="6" fill="#fff"/>
            <ellipse cx="43" cy="158" rx="9" ry="5" fill="#fff"/>
            <ellipse cx="57" cy="158" rx="9" ry="5" fill="#fff"/>
          </svg>
          {/* ガイドライン */}
          {/* 腰ライン */}
          <div style={{position:"absolute",top:"32%",left:"-30%",right:"-30%",borderTop:"2px dashed rgba(255,255,255,0.6)"}}>
            <span style={{position:"absolute",right:0,top:-16,fontSize:9,color:"#fff",background:"rgba(0,0,0,0.5)",padding:"1px 6px",borderRadius:4,whiteSpace:"nowrap"}}>腰ライン</span>
          </div>
          {/* 膝ライン */}
          <div style={{position:"absolute",top:"62%",left:"-30%",right:"-30%",borderTop:"2px dashed rgba(192,132,252,0.9)"}}>
            <span style={{position:"absolute",right:0,top:-16,fontSize:9,color:"#c084fc",background:"rgba(0,0,0,0.5)",padding:"1px 6px",borderRadius:4,whiteSpace:"nowrap"}}>膝ライン</span>
          </div>
          {/* 足首ライン */}
          <div style={{position:"absolute",top:"83%",left:"-30%",right:"-30%",borderTop:"2px dashed rgba(244,114,182,0.9)"}}>
            <span style={{position:"absolute",right:0,top:-16,fontSize:9,color:"#f472b6",background:"rgba(0,0,0,0.5)",padding:"1px 6px",borderRadius:4,whiteSpace:"nowrap"}}>足首ライン</span>
          </div>
        </div>

        {/* ガイドテキスト */}
        <div style={{position:"absolute",bottom:16,left:16,right:16,textAlign:"center"}}>
          <div style={{background:"rgba(0,0,0,0.7)",borderRadius:14,padding:"10px 16px",display:"inline-block"}}>
            <div style={{fontSize:13,color:"#fff",fontWeight:700,whiteSpace:"pre-line"}}>{angle.guide}</div>
            <div style={{fontSize:11,color:P.pink,marginTop:4}}>📍 膝下〜腰が画面に映るように</div>
          </div>
        </div>
      </div>

      {/* 下部 */}
      <div style={{background:"rgba(0,0,0,0.85)",padding:"16px 20px 36px"}}>
        <div style={{background:"rgba(244,114,182,0.15)",border:`1px solid ${P.pink}55`,borderRadius:14,padding:"12px 14px",marginBottom:18,fontSize:11,color:"#fff",lineHeight:1.7}}>
          📸 <strong style={{color:P.pink}}>撮影のコツ</strong>：スマホを立てかけ、ご自身のカメラアプリで上のガイドを参考に撮影してください。撮り終えたら下のボタンから写真を選んでください。
        </div>
        <button onClick={handleReadyTap} style={{display:"block",width:"100%",background:`linear-gradient(135deg,${P.pink},${P.purple})`,border:"none",color:"#fff",borderRadius:16,padding:"16px 0",cursor:"pointer",fontWeight:900,fontSize:15}}>
          🖼 写真を選ぶ
        </button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
    </div>
  );
}

function PhotoMonthCard({ month, photos, onUpdate }) {
  const [showGuide, setShowGuide] = useState(null);
  const [cameraAngle, setCameraAngle] = useState(null);
  const card = {background:P.card,border:`1px solid ${P.border}`,borderRadius:20,padding:"16px 18px"};

  async function handleCapture(angleKey, dataUrl) {
    const next = { ...photos, [`${month}_${angleKey}`]: dataUrl };
    await onUpdate(next);
  }
  async function handleFile(angleKey, file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => { await handleCapture(angleKey, e.target.result); };
    reader.readAsDataURL(file);
  }
  async function handleDelete(angleKey) {
    const next = { ...photos }; delete next[`${month}_${angleKey}`];
    await onUpdate(next);
  }

  const doneCount = ANGLES.filter(a=>photos[`${month}_${a.key}`]).length;

  return (
    <>
      {cameraAngle && (
        <CameraModal
          angle={cameraAngle}
          onCapture={(url)=>handleCapture(cameraAngle.key,url)}
          onClose={()=>setCameraAngle(null)}
        />
      )}
      <div style={{...card}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div>
            <div style={{fontWeight:700,fontSize:15,color:P.text}}>{month}ヶ月目</div>
            <div style={{fontSize:11,color:P.muted}}>{month===1?"スタート時":month===2?"1ヶ月後":"2ヶ月後"} · {doneCount}/4角度</div>
          </div>
          <div style={{width:36,height:36,borderRadius:"50%",background:doneCount===4?`linear-gradient(135deg,${P.pink},${P.purple})`:P.pinkLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:doneCount===4?"#fff":P.pink}}>{doneCount}/4</div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {ANGLES.map(angle=>{
            const img = photos[`${month}_${angle.key}`];
            return(
              <div key={angle.key}>
                <div style={{fontSize:11,fontWeight:700,color:P.sub,marginBottom:6,display:"flex",alignItems:"center",gap:4}}>
                  {angle.label}
                  <button onClick={()=>setShowGuide(showGuide===angle.key?null:angle.key)} style={{background:P.pinkLight,border:"none",color:P.pink,borderRadius:"50%",width:16,height:16,cursor:"pointer",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>?</button>
                </div>
                {showGuide===angle.key && (
                  <div style={{background:`linear-gradient(135deg,${P.pinkLight},${P.purpleLight})`,border:`1px solid ${P.pink}44`,borderRadius:10,padding:"8px 10px",marginBottom:8,fontSize:11,color:P.text,lineHeight:1.6,textAlign:"center"}}>
                    <div style={{fontSize:20,marginBottom:4}}>{angle.icon}</div>
                    <div style={{whiteSpace:"pre-line",fontWeight:600}}>{angle.guide}</div>
                    <div style={{fontSize:10,color:P.muted,marginTop:4}}>📍 膝下〜腰が映るように</div>
                  </div>
                )}
                {img ? (
                  <div style={{position:"relative"}}>
                    <img src={img} alt={angle.label} style={{width:"100%",aspectRatio:"3/4",objectFit:"cover",borderRadius:12,display:"block"}}/>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,display:"flex",gap:4,padding:6}}>
                      <button onClick={()=>setCameraAngle(angle)} style={{flex:1,background:"rgba(244,114,182,0.85)",border:"none",color:"#fff",borderRadius:8,padding:"5px 0",cursor:"pointer",fontSize:10,fontWeight:700}}>🖼 変更する</button>
                      <button onClick={()=>handleDelete(angle.key)} style={{background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",borderRadius:8,padding:"5px 8px",cursor:"pointer",fontSize:10}}>×</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={()=>setCameraAngle(angle)} style={{display:"block",width:"100%",cursor:"pointer",background:"none",border:"none",padding:0}}>
                    <div style={{width:"100%",aspectRatio:"3/4",borderRadius:12,background:P.bg,border:`2px dashed ${P.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
                      <div style={{fontSize:28}}>📷</div>
                      <div style={{fontSize:10,color:P.muted,fontWeight:600}}>タップして写真を選ぶ</div>
                    </div>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════
// ADMIN PHOTO CARD
// ════════════════════════════════════════════════
function AdminPhotoCard({ name }) {
  const [photos, setPhotos] = useState(null);
  useEffect(() => {
    sGet(`photos:${name}`, true).then(p => setPhotos(p||{}));
  }, [name]);

  const card = {background:P.card,border:`1px solid ${P.border}`,borderRadius:20,padding:"16px 18px"};

  if (!photos) return <div style={{...card,color:P.muted,fontSize:12,textAlign:"center"}}>読み込み中...</div>;

  const hasAny = [1,2,3].some(m=>ANGLES.some(a=>photos[`${m}_${a.key}`]));

  return (
    <div style={{...card}}>
      <div style={{fontWeight:700,fontSize:14,color:P.text,marginBottom:12}}>{name}さん</div>
      {!hasAny ? (
        <div style={{fontSize:12,color:P.muted}}>写真未登録</div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[1,2,3].map(m=>{
            const monthPhotos = ANGLES.filter(a=>photos[`${m}_${a.key}`]);
            if(!monthPhotos.length) return null;
            return(
              <div key={m}>
                <div style={{fontSize:11,fontWeight:700,color:P.pink,marginBottom:6}}>{m}ヶ月目（{monthPhotos.length}/4角度）</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
                  {ANGLES.map(a=>(
                    <div key={a.key}>
                      <div style={{fontSize:9,color:P.muted,textAlign:"center",marginBottom:2}}>{a.label}</div>
                      {photos[`${m}_${a.key}`]
                        ? <img src={photos[`${m}_${a.key}`]} alt="" style={{width:"100%",aspectRatio:"3/4",objectFit:"cover",borderRadius:8,display:"block"}}/>
                        : <div style={{width:"100%",aspectRatio:"3/4",borderRadius:8,background:P.bg,border:`1px dashed ${P.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>－</div>
                      }
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════
// ADMIN APP
// ════════════════════════════════════════════════
function AdminApp({ onBack }) {
  const weekKey  = getWeekKey();
  const todayIdx = getTodayIdx();

  const [tab, setTab]       = useState("members");
  const [programs, setPrograms]   = useState({});
  const [messages, setMessages]   = useState({});
  const [members, setMembers]     = useState([]);
  const [userData, setUserData]   = useState({});
  const [editWeek, setEditWeek]   = useState(weekKey);
  const [editForm, setEditForm]   = useState(null);
  const [msgDraft, setMsgDraft]   = useState(null);
  const [msgEdit, setMsgEdit]     = useState(false);
  const [notice, setNotice]       = useState({text:"",date:""});
  const [noticeSaved, setNoticeSaved] = useState(false);
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [pwInput, setPwInput]     = useState("");
  const [pwOk, setPwOk]           = useState(false);
  const [pwErr, setPwErr]         = useState("");

  useEffect(() => {
    (async () => {
      const [p,m,mb,n,ag] = await Promise.all([
        sGet("programs",true), sGet("messages",true),
        sGet("members",true), sGet("notice",true),
        sGet("agreements",true),
      ]);
      setPrograms(p||{}); setMessages(m||{}); setMembers(mb||[]);
      setNotice(n||{text:"",date:""});
      setAgreements(ag||[]);
      const ud={};
      for (const name of (mb||[])) {
        const u = await sGet(`user:${name}`,true);
        if (u) ud[name]=u;
      }
      setUserData(ud); setLoading(false);
    })();
  }, []);

  async function refresh() {
    const mb = await sGet("members",true)||[];
    setMembers(mb);
    const ud={};
    for (const name of mb) { const u=await sGet(`user:${name}`,true); if(u)ud[name]=u; }
    setUserData(ud);
  }

  async function removeMember(name) {
    if (!window.confirm(`${name}さんを削除しますか？`)) return;
    const next = members.filter(m=>m!==name);
    await sSet("members",next,true);
    setMembers(next);
    const ud={...userData}; delete ud[name]; setUserData(ud);
  }

  async function saveNotice() {
    const n = {text:notice.text, date:todayStr()};
    await sSet("notice",n,true);
    setNotice(n); setNoticeSaved(true);
    setTimeout(()=>setNoticeSaved(false),2000);
  }

  function getWeekProgram(wkey) {
    return programs[wkey]||DAYS.map((_,i)=>defaultEntry(i));
  }
  async function saveWeekProgram(wkey,prog) {
    const next={...programs,[wkey]:prog};
    setPrograms(next); await sSet("programs",next,true);
  }
  function openEdit(wkey,dayIndex) {
    const entry=getWeekProgram(wkey)[dayIndex];
    setEditForm({wkey,dayIndex,categoryId:entry.categoryId,videos:entry.videos.length?entry.videos.map(v=>({...v})):[emptyVideo()]});
  }
  async function saveEdit() {
    if(!editForm)return;
    const prog=[...getWeekProgram(editForm.wkey)];
    prog[editForm.dayIndex]={day:prog[editForm.dayIndex].day,categoryId:editForm.categoryId,videos:editForm.videos.filter(v=>v.url||v.title)};
    if(!prog[editForm.dayIndex].videos.length)prog[editForm.dayIndex].videos=[emptyVideo()];
    await saveWeekProgram(editForm.wkey,prog); setEditForm(null);
  }
  function updVideo(vi,field,val){setEditForm(f=>{const vids=f.videos.map((v,i)=>i===vi?{...v,[field]:val}:v);return{...f,videos:vids};});}
  function addVideo(){setEditForm(f=>({...f,videos:[...f.videos,emptyVideo()]}));}
  function rmVideo(vi){setEditForm(f=>{const vids=f.videos.filter((_,i)=>i!==vi);return{...f,videos:vids.length?vids:[emptyVideo()]};});}
  function openMsgEdit(){const d={};for(let i=0;i<90;i++)d[i]=messages[i]||DEFAULT_MESSAGES[i%DEFAULT_MESSAGES.length];setMsgDraft(d);setMsgEdit(true);}
  async function saveMsgEdit(){setMessages(msgDraft);await sSet("messages",msgDraft,true);setMsgEdit(false);}

  // member helpers
  function getWeekProg(wk) { return programs[wk]||DAYS.map((_,i)=>defaultEntry(i)); }
  function memberDayDone(name,wkey,dayIdx) {
    const u=userData[name]; if(!u)return false;
    const entry=getWeekProg(wkey)[dayIdx];
    const vids=(entry?.videos||[]).filter(v=>extractYouTubeId(v.url));
    if(!vids.length)return !!u.completed?.[`${wkey}_${dayIdx}_done`];
    return vids.every((_,vi)=>u.completed?.[`${wkey}_${dayIdx}_v${vi}`]);
  }
  function memberTodayDone(name){return memberDayDone(name,weekKey,todayIdx);}
  function memberWeekDone(name){return getWeekProg(weekKey).filter((_,i)=>memberDayDone(name,weekKey,i)).length;}
  function memberStreak(name){return calcStreak(userData[name]?.completed||{});}
  function memberTotal(name){return calcTotalDone(userData[name]?.completed||{});}

  const nextDate=new Date(); nextDate.setDate(nextDate.getDate()+7);
  const nextKey=`week_${nextDate.getFullYear()}_${getWeekNumber(nextDate)}`;
  const allWeekKeys=Array.from(new Set([weekKey,nextKey,...Object.keys(programs)])).sort();
  function weekLabel(wkey){const[,y,w]=wkey.split("_");return`${y}年 第${w}週${wkey===weekKey?" ✦ 今週":wkey===nextKey?" 翌週":""}`;  }

  const doneCount  = members.filter(n=>memberTodayDone(n)).length;
  const notDone    = members.filter(n=>!memberTodayDone(n));
  const sabori     = members.filter(n=>memberStreak(n)===0 && memberTotal(n)>0); // streak broken
  const card={background:P.card,border:`1px solid ${P.border}`,borderRadius:20,padding:"16px 18px"};

  if (!pwOk) return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${P.pinkLight},${P.purpleLight})`,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:P.card,borderRadius:24,padding:"32px 24px",width:"100%",maxWidth:360,boxShadow:`0 8px 40px ${P.pink}22`}}>
        <div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:32,marginBottom:8}}>🔐</div><div style={{fontSize:18,fontWeight:900,color:P.text}}>管理者ログイン</div></div>
        <input value={pwInput} onChange={e=>{setPwInput(e.target.value);setPwErr("");}} type="password" placeholder="管理者パスワード"
          style={{width:"100%",background:P.bg,border:`1.5px solid ${P.border}`,color:P.text,borderRadius:12,padding:"12px 14px",fontSize:14,boxSizing:"border-box",marginBottom:10,outline:"none"}}
          onKeyDown={e=>e.key==="Enter"&&(pwInput===ADMIN_PASSWORD?setPwOk(true):setPwErr("パスワードが違います"))}
        />
        {pwErr&&<div style={{fontSize:12,color:P.pink,marginBottom:8}}>{pwErr}</div>}
        <button onClick={()=>pwInput===ADMIN_PASSWORD?setPwOk(true):setPwErr("パスワードが違います")} style={{width:"100%",padding:"13px",background:`linear-gradient(135deg,${P.pink},${P.purple})`,border:"none",color:"#fff",borderRadius:12,cursor:"pointer",fontWeight:900,marginBottom:12}}>ログイン</button>
        <button onClick={onBack} style={{width:"100%",padding:"10px",background:"none",border:`1px solid ${P.border}`,color:P.muted,borderRadius:10,cursor:"pointer",fontSize:12}}>戻る</button>
      </div>
    </div>
  );

  if (loading) return <Splash />;

  return (
    <div style={{minHeight:"100vh",background:P.bg,color:P.text,fontFamily:"'Hiragino Sans','Yu Gothic','Helvetica Neue',sans-serif"}}>
      <div style={{background:`linear-gradient(135deg,${P.pinkLight},${P.purpleLight})`,padding:"20px 20px 18px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:10,letterSpacing:3,color:P.purple,fontWeight:700,marginBottom:2}}>✦ ADMIN ✦</div>
            <div style={{fontSize:20,fontWeight:900,color:P.text}}>管理者ダッシュボード</div>
          </div>
          <button onClick={onBack} style={{background:"rgba(255,255,255,0.7)",border:`1px solid ${P.border}`,color:P.muted,borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:11}}>ログアウト</button>
        </div>
        <div style={{display:"flex",gap:8,marginTop:12}}>
          {[{l:"参加者",v:`${members.length}名`},{l:"今日完了",v:`${doneCount}名`},{l:"未完了",v:`${members.length-doneCount}名`},{l:"サボリ注意",v:`${sabori.length}名`}].map(s=>(
            <div key={s.l} style={{background:"rgba(255,255,255,0.75)",borderRadius:12,padding:"6px 10px",textAlign:"center",flex:1}}>
              <div style={{fontSize:15,fontWeight:900,color:s.l==="サボリ注意"&&sabori.length>0?"#ef4444":P.pink}}>{s.v}</div>
              <div style={{fontSize:9,color:P.sub}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",background:P.card,borderBottom:`1px solid ${P.border}`,overflowX:"auto"}}>
        {[["members","メンバー"],["stats","統計📊"],["notice","お知らせ"],["program","動画管理"],["message","メッセージ"],["agreements","同意書"],["photos","写真📸"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{flexShrink:0,padding:"12px 14px",background:"none",border:"none",cursor:"pointer",color:tab===k?P.pink:P.muted,fontWeight:tab===k?700:400,fontSize:12,borderBottom:tab===k?`2px solid ${P.pink}`:"2px solid transparent",transition:"all .2s"}}>{l}</button>
        ))}
      </div>

      <div style={{padding:"16px 16px",maxWidth:520,margin:"0 auto"}}>

        {/* ── MEMBERS ── */}
        {tab==="stats" && (
          <>
            <div style={{fontSize:20,fontWeight:900,marginBottom:16}}>統計・達成率</div>

            {/* 全体サマリー */}
            <div style={{...card,marginBottom:14,background:`linear-gradient(135deg,${P.pinkLight},${P.purpleLight})`,border:`1px solid ${P.pink}44`}}>
              <div style={{fontSize:13,fontWeight:700,color:P.pink,marginBottom:12}}>📊 全体サマリー</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[
                  {l:"参加者数",v:`${members.length}名`},
                  {l:"今日の達成率",v:`${members.length?Math.round(doneCount/members.length*100):0}%`},
                  {l:"平均連続記録",v:`${members.length?Math.round(members.reduce((s,n)=>s+memberStreak(n),0)/members.length):0}日`},
                  {l:"サボり注意",v:`${sabori.length}名`,alert:sabori.length>0},
                ].map(s=>(
                  <div key={s.l} style={{background:"rgba(255,255,255,0.7)",borderRadius:12,padding:"10px",textAlign:"center"}}>
                    <div style={{fontSize:18,fontWeight:900,color:s.alert?"#ef4444":P.pink}}>{s.v}</div>
                    <div style={{fontSize:10,color:P.sub}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 達成率グラフ（今週） */}
            <div style={{...card,marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:700,color:P.text,marginBottom:12}}>📅 今週の達成率（曜日別）</div>
              <div style={{display:"flex",gap:6,alignItems:"flex-end",height:80}}>
                {DAYS.map((day,di)=>{
                  const doneN = members.filter(n=>memberDayDone(n,weekKey,di)).length;
                  const pct   = members.length ? Math.round(doneN/members.length*100) : 0;
                  const isToday = di===todayIdx;
                  return(
                    <div key={di} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                      <div style={{fontSize:9,color:P.muted,fontWeight:700}}>{pct}%</div>
                      <div style={{width:"100%",height:`${Math.max(4,pct*0.7)}px`,background:isToday?`linear-gradient(135deg,${P.pink},${P.purple})`:P.pinkLight,borderRadius:"4px 4px 0 0",minHeight:4}}/>
                      <div style={{fontSize:9,color:isToday?P.pink:P.muted,fontWeight:isToday?700:400}}>{day}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* メンバー別達成数ランキング */}
            <div style={{...card}}>
              <div style={{fontSize:13,fontWeight:700,color:P.text,marginBottom:12}}>🏅 メンバー別ランキング</div>
              {[...members]
                .map(n=>({name:n,streak:memberStreak(n),total:memberTotal(n),weekD:memberWeekDone(n)}))
                .sort((a,b)=>b.streak-a.streak)
                .map((m,i)=>{
                  const medals=["🥇","🥈","🥉"];
                  const isAlert = m.streak===0 && m.total>0;
                  return(
                    <div key={m.name} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${P.border}`}}>
                      <div style={{fontSize:16,width:26,textAlign:"center",flexShrink:0}}>{medals[i]||`${i+1}`}</div>
                      <div style={{flex:1,fontSize:13,color:isAlert?"#ef4444":P.text,fontWeight:600}}>{m.name}{isAlert&&" ⚠️"}</div>
                      <div style={{fontSize:11,color:P.muted}}>🔥{m.streak}日 / 累計{m.total}日</div>
                    </div>
                  );
                })}
            </div>
          </>
        )}

        {tab==="members" && (
          <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{fontSize:20,fontWeight:900}}>メンバー一覧</div>
              <button onClick={refresh} style={{background:"none",border:`1px solid ${P.border}`,color:P.sub,borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:11}}>🔄 更新</button>
            </div>

            {/* サボりアラート */}
            {sabori.length>0 && (
              <div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:16,padding:"12px 16px",marginBottom:14}}>
                <div style={{fontSize:12,fontWeight:700,color:"#ef4444",marginBottom:6}}>😴 連続記録が途切れた人</div>
                <div style={{fontSize:12,color:P.text}}>{sabori.join("、")}</div>
                <div style={{fontSize:11,color:P.muted,marginTop:4}}>お知らせで声がけしてみよう！</div>
              </div>
            )}

            {/* 今日のサマリー */}
            <div style={{...card,marginBottom:14,background:`linear-gradient(135deg,${P.pinkLight},${P.purpleLight})`,border:`1px solid ${P.pink}44`}}>
              <div style={{fontSize:13,fontWeight:700,color:P.pink,marginBottom:10}}>📊 今日（{DAYS[todayIdx]}曜日）の達成状況</div>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <div style={{flex:1,background:"rgba(255,255,255,0.7)",borderRadius:12,padding:"10px",textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:900,color:P.green}}>✓ {doneCount}名</div>
                  <div style={{fontSize:10,color:P.sub}}>完了</div>
                </div>
                <div style={{flex:1,background:"rgba(255,255,255,0.7)",borderRadius:12,padding:"10px",textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:900,color:P.pink}}>{members.length-doneCount}名</div>
                  <div style={{fontSize:10,color:P.sub}}>未完了</div>
                </div>
              </div>
              {notDone.length>0&&<div style={{fontSize:11,color:P.sub}}><span style={{fontWeight:700}}>未完了：</span>{notDone.join("、")}</div>}
            </div>

            {members.length===0 ? (
              <div style={{...card,textAlign:"center",padding:28}}><div style={{fontSize:32,marginBottom:8}}>👥</div><div style={{color:P.muted}}>まだ参加者がいません</div></div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {members.map(name=>{
                  const isDone=memberTodayDone(name);
                  const streak=memberStreak(name);
                  const total=memberTotal(name);
                  const weekD=memberWeekDone(name);
                  const u=userData[name];
                  const isAlert=streak===0&&total>0;
                  return(
                    <div key={name} style={{...card,display:"flex",alignItems:"center",gap:12,border:isAlert?"1px solid rgba(239,68,68,0.3)":`1px solid ${P.border}`}}>
                      <div style={{width:42,height:42,borderRadius:"50%",background:isDone?`linear-gradient(135deg,${P.pink},${P.purple})`:P.pinkLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:isDone?"#fff":P.pink,flexShrink:0}}>{name[0]}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:700,fontSize:14,color:P.text,marginBottom:3}}>{name}さん</div>
                        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                          <span style={{fontSize:11,color:isDone?P.green:P.muted,fontWeight:isDone?700:400}}>今日：{isDone?"✓ 完了":"未完了"}</span>
                          <span style={{fontSize:11,color:P.muted}}>🔥{streak}日連続</span>
                          <span style={{fontSize:11,color:P.muted}}>今週{weekD}/7日</span>
                          <span style={{fontSize:11,color:P.muted}}>累計{total}日</span>
                        </div>
                        {u?.joinedAt&&<div style={{fontSize:10,color:P.muted,marginTop:2}}>参加：{u.joinedAt}</div>}
                      </div>
                      <button onClick={()=>removeMember(name)} style={{background:"none",border:`1px solid ${P.border}`,color:P.muted,borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:11,flexShrink:0}}>削除</button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── NOTICE ── */}
        {tab==="notice" && (
          <>
            <div style={{fontSize:20,fontWeight:900,marginBottom:6}}>お知らせ配信</div>
            <div style={{fontSize:12,color:P.muted,marginBottom:16}}>全メンバーのアプリに表示されます</div>
            <div style={{...card,marginBottom:14}}>
              <div style={{fontSize:11,color:P.muted,marginBottom:8}}>メッセージ内容</div>
              <textarea
                value={notice.text}
                onChange={e=>setNotice(n=>({...n,text:e.target.value}))}
                placeholder="例：今週の動画を登録しました！頑張りましょう🐐"
                rows={4}
                style={{width:"100%",background:P.bg,border:`1.5px solid ${P.border}`,color:P.text,borderRadius:12,padding:"12px 14px",fontSize:13,resize:"none",boxSizing:"border-box",outline:"none"}}
              />
              <button onClick={saveNotice} style={{width:"100%",marginTop:12,padding:"13px 0",background:`linear-gradient(135deg,${P.pink},${P.purple})`,border:"none",color:"#fff",borderRadius:14,cursor:"pointer",fontWeight:900,fontSize:14,boxShadow:`0 4px 20px ${P.pink}44`}}>
                {noticeSaved?"✓ 送信しました！":"📣 お知らせを送る"}
              </button>
            </div>
            {notice.date&&<div style={{fontSize:11,color:P.muted,textAlign:"center"}}>前回の送信：{notice.date}</div>}
            <div style={{...card,marginTop:14}}>
              <div style={{fontSize:11,color:P.muted,marginBottom:6}}>現在表示中のお知らせ</div>
              {notice.text ? (
                <div style={{fontSize:13,color:P.text,lineHeight:1.6}}>{notice.text}</div>
              ) : (
                <div style={{fontSize:12,color:P.muted}}>なし</div>
              )}
            </div>
          </>
        )}

        {/* ── PROGRAM ── */}
        {tab==="program" && (
          <>
            <div style={{fontSize:20,fontWeight:900,marginBottom:14}}>動画の管理</div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,color:P.muted,marginBottom:6}}>編集する週</div>
              <select value={editWeek} onChange={e=>setEditWeek(e.target.value)} style={{width:"100%",background:P.card,border:`1px solid ${P.border}`,color:P.text,borderRadius:12,padding:"10px 14px",fontSize:14,cursor:"pointer"}}>
                {allWeekKeys.map(k=><option key={k} value={k}>{weekLabel(k)}</option>)}
              </select>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {getWeekProgram(editWeek).map((entry,i)=>{
                const vCount=(entry.videos||[]).filter(v=>extractYouTubeId(v.url)).length;
                return(
                  <div key={i} style={{...card,display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:34,height:34,borderRadius:"50%",background:P.pinkLight,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:P.pink,flexShrink:0}}>{entry.day}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:13,color:P.text,marginBottom:2}}>{entry.categoryId}</div>
                      <div style={{fontSize:11,color:P.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{vCount>0?`${vCount}本登録済み`:"動画未登録"}</div>
                    </div>
                    <button onClick={()=>openEdit(editWeek,i)} style={{background:`linear-gradient(135deg,${P.pink},${P.purple})`,border:"none",color:"#fff",borderRadius:12,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700,flexShrink:0}}>編集</button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── MESSAGE ── */}
        {tab==="message" && (
          <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div><div style={{fontSize:20,fontWeight:900}}>モチベメッセージ</div><div style={{fontSize:12,color:P.muted}}>3ヶ月分（90日）</div></div>
              {!msgEdit&&<button onClick={openMsgEdit} style={{background:`linear-gradient(135deg,${P.pink},${P.purple})`,border:"none",color:"#fff",borderRadius:12,padding:"8px 16px",cursor:"pointer",fontSize:12,fontWeight:700}}>編集</button>}
            </div>
            <div style={{...card,textAlign:"center",padding:"18px 16px",marginBottom:14,background:`linear-gradient(135deg,${P.pinkLight},${P.purpleLight})`,border:`1px solid ${P.pink}44`}}>
              <div style={{fontSize:11,color:P.muted,marginBottom:6}}>{getDaysSinceStart()+1}日目のメッセージ（7/1スタート）</div>
              <div style={{fontSize:15,fontWeight:700,color:P.pink}}>「{getTodayMsg(messages)}」</div>
            </div>
            {!msgEdit ? (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {Array.from({length:90},(_,i)=>i).map(i=>(
                  <div key={i} style={{...card,display:"flex",alignItems:"center",gap:12,padding:"11px 14px"}}>
                    <div style={{width:30,height:30,borderRadius:"50%",background:P.pinkLight,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:10,color:P.pink,flexShrink:0}}>{i+1}</div>
                    <div style={{flex:1,fontSize:13,color:P.text}}>{messages[i]||DEFAULT_MESSAGES[i%DEFAULT_MESSAGES.length]}</div>
                    {messages[i]&&<div style={{fontSize:10,color:P.purple,background:P.purpleLight,borderRadius:8,padding:"2px 8px",flexShrink:0}}>カスタム</div>}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:80}}>
                  {Array.from({length:90},(_,i)=>i).map(i=>(
                    <div key={i} style={{...card,padding:"12px 14px"}}>
                      <div style={{fontSize:11,color:P.muted,marginBottom:5}}>{i+1}日目</div>
                      <input value={msgDraft?.[i]||""} onChange={e=>setMsgDraft(d=>({...d,[i]:e.target.value}))}
                        placeholder={DEFAULT_MESSAGES[i%DEFAULT_MESSAGES.length]}
                        style={{width:"100%",background:P.bg,border:`1px solid ${P.border}`,color:P.text,borderRadius:10,padding:"9px 12px",fontSize:13,boxSizing:"border-box",outline:"none"}}
                      />
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:10,position:"fixed",bottom:16,left:0,right:0,padding:"0 16px",boxSizing:"border-box",maxWidth:520,margin:"0 auto"}}>
                  <button onClick={()=>setMsgEdit(false)} style={{flex:1,padding:"14px 0",background:P.card,border:`1px solid ${P.border}`,color:P.muted,borderRadius:14,cursor:"pointer",fontWeight:700}}>キャンセル</button>
                  <button onClick={saveMsgEdit} style={{flex:2,padding:"14px 0",background:`linear-gradient(135deg,${P.pink},${P.purple})`,border:"none",color:"#fff",borderRadius:14,cursor:"pointer",fontWeight:900,fontSize:15,boxShadow:`0 4px 20px ${P.pink}44`}}>保存する 🐐</button>
                </div>
              </>
            )}
          </>
        )}

        {/* ── AGREEMENTS ── */}
        {tab==="agreements" && (
          <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div>
                <div style={{fontSize:20,fontWeight:900}}>同意書一覧</div>
                <div style={{fontSize:12,color:P.muted}}>LPから送信された同意書</div>
              </div>
              <button onClick={async()=>{const ag=await sGet("agreements",true);setAgreements(ag||[]);}} style={{background:"none",border:`1px solid ${P.border}`,color:P.sub,borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:11}}>🔄 更新</button>
            </div>
            <div style={{...card,marginBottom:14,background:`linear-gradient(135deg,${P.pinkLight},${P.purpleLight})`,border:`1px solid ${P.pink}44`}}>
              <div style={{fontSize:13,fontWeight:700,color:P.pink,marginBottom:6}}>📝 同意書はGoogleフォームで管理</div>
              <div style={{fontSize:12,color:P.sub,lineHeight:1.7}}>同意書はGoogleフォームに切り替わりました。回答内容はフォームと連携したGoogleスプレッドシートでご確認ください。</div>
            </div>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSeFtQtVZpHZV34kPbHXXKU24RZgz0oJM8IMIh7YEz697dWOGg/viewform?usp=publish-editor" target="_blank" style={{display:"block",background:`linear-gradient(135deg,${P.pink},${P.purple})`,color:"#fff",textDecoration:"none",textAlign:"center",borderRadius:16,padding:"14px 0",fontWeight:700,fontSize:14}}>
              📝 同意書フォームを開く
            </a>
          </>
        )}

        {/* ── PHOTOS ── */}
        {tab==="photos" && (
          <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div>
                <div style={{fontSize:20,fontWeight:900}}>脚の写真記録</div>
                <div style={{fontSize:12,color:P.muted}}>全メンバーの写真進捗</div>
              </div>
              <button onClick={async()=>{
                const ud={};
                for(const name of members){const u=await sGet(`photos:${name}`,true);if(u)ud[name]=u;}
                setUserData(prev=>({...prev,...Object.fromEntries(Object.entries(ud).map(([n,p])=>[n,{...prev[n],photos:p}]))}));
              }} style={{background:"none",border:`1px solid ${P.border}`,color:P.sub,borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:11}}>🔄 更新</button>
            </div>

            {members.length===0 ? (
              <div style={{...card,textAlign:"center",padding:28}}>
                <div style={{fontSize:32,marginBottom:8}}>📸</div>
                <div style={{color:P.muted}}>まだメンバーがいません</div>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                {members.map(name => (
                  <AdminPhotoCard key={name} name={name} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* 編集モーダル */}
      {editForm && (
        <div style={{position:"fixed",inset:0,background:"rgba(75,45,62,0.5)",display:"flex",alignItems:"flex-end",zIndex:100}} onClick={e=>{if(e.target===e.currentTarget)setEditForm(null);}}>
          <div style={{background:P.card,borderRadius:"24px 24px 0 0",padding:"24px 20px 40px",width:"100%",maxWidth:520,margin:"0 auto",maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{fontSize:16,fontWeight:900,marginBottom:20,color:P.text}}>{getWeekProgram(editForm.wkey)[editForm.dayIndex]?.day}曜日を編集 ✦</div>
            <div style={{marginBottom:18}}>
              <div style={{fontSize:11,color:P.muted,marginBottom:8}}>カテゴリ名</div>
              <input value={editForm.categoryId} onChange={e=>setEditForm(f=>({...f,categoryId:e.target.value}))}
                placeholder="例：ストレッチ、脚やせトレ..."
                style={{width:"100%",background:P.bg,border:`1.5px solid ${P.pink}88`,color:P.text,borderRadius:12,padding:"12px 14px",fontSize:14,boxSizing:"border-box",outline:"none"}}
              />
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10}}>
                {["脚やせトレ","ストレッチ","ほぐし方","マッサージ"].map(s=>(
                  <button key={s} onClick={()=>setEditForm(f=>({...f,categoryId:s}))} style={{background:editForm.categoryId===s?P.pinkLight:P.bg,border:`1px solid ${editForm.categoryId===s?P.pink:P.border}`,borderRadius:20,padding:"5px 14px",cursor:"pointer",color:editForm.categoryId===s?P.pink:P.muted,fontSize:12,fontWeight:editForm.categoryId===s?700:400}}>{s}</button>
                ))}
              </div>
            </div>
            <div style={{fontSize:11,color:P.muted,marginBottom:10}}>動画（最大{MAX_VIDEOS}本）</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {editForm.videos.map((v,vi)=>(
                <div key={vi} style={{background:P.bg,border:`1px solid ${P.border}`,borderRadius:16,padding:"14px 14px 12px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{fontSize:12,fontWeight:700,color:P.pink}}>動画 {vi+1}</div>
                    {editForm.videos.length>1&&<button onClick={()=>rmVideo(vi)} style={{background:"none",border:"none",color:P.muted,cursor:"pointer",fontSize:18}}>×</button>}
                  </div>
                  {[["url","YouTube URL","https://www.youtube.com/watch?v=..."],["title","タイトル（任意）","例：10分美脚ストレッチ"],["memo","メモ（任意）","例：内ももを意識して"]].map(([field,label,ph])=>(
                    <div key={field} style={{marginBottom:field==="memo"?0:10}}>
                      <div style={{fontSize:11,color:P.muted,marginBottom:5}}>{label}</div>
                      <input value={v[field]} onChange={e=>updVideo(vi,field,e.target.value)} placeholder={ph}
                        style={{width:"100%",background:P.card,border:`1px solid ${P.border}`,color:P.text,borderRadius:10,padding:"9px 12px",fontSize:13,boxSizing:"border-box",outline:"none"}}
                      />
                      {field==="url"&&extractYouTubeId(v.url)&&(
                        <div style={{marginTop:8,borderRadius:12,overflow:"hidden"}}>
                          <iframe width="100%" height="130" src={`https://www.youtube.com/embed/${extractYouTubeId(v.url)}`} frameBorder="0" allowFullScreen/>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {editForm.videos.length<MAX_VIDEOS&&(
              <button onClick={addVideo} style={{width:"100%",marginTop:12,padding:"12px 0",background:"none",border:`2px dashed ${P.border}`,color:P.muted,borderRadius:14,cursor:"pointer",fontSize:13,fontWeight:700}}>＋ 動画を追加（{editForm.videos.length}/{MAX_VIDEOS}）</button>
            )}
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button onClick={()=>setEditForm(null)} style={{flex:1,padding:"14px 0",background:P.bg,border:`1px solid ${P.border}`,color:P.muted,borderRadius:14,cursor:"pointer",fontWeight:700}}>キャンセル</button>
              <button onClick={saveEdit} style={{flex:2,padding:"14px 0",background:`linear-gradient(135deg,${P.pink},${P.purple})`,border:"none",color:"#fff",borderRadius:14,cursor:"pointer",fontWeight:900,fontSize:15,boxShadow:`0 4px 20px ${P.pink}44`}}>保存する 🐐</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
