
const LS='inju-v5-alpha';
let screen='home', village=null, area=null, mode=null, idx=0, filter='all';
const $=id=>document.getElementById(id); const app=$('app');
function save(k,v){localStorage.setItem(`${LS}:${k}`,JSON.stringify(v))}
function load(k,d=null){try{let v=localStorage.getItem(`${LS}:${k}`);return v?JSON.parse(v):d}catch(e){return d}}
function key(type,i=idx,a=area?.id){return `${a}:${i}:${type}`}
function statusOf(i=idx){return load(key('status',i),'')}
function memoOf(i=idx){return load(key('memo',i),'')}
function holdOf(i=idx){return load(key('hold',i),false)}
function setStatus(s){save(key('status'),s); toast('저장되었습니다'); renderCard()}
function setMemo(v){save(key('memo'),v)}
function toggleHold(){save(key('hold'),!holdOf()); toast(holdOf()?'보류 해제':'보류 저장'); renderCard()}
function areaById(id){return APP_DATA.areas.find(a=>a.id===id)}
function doneCount(a=area){return a.houses.filter((h,i)=>load(`${LS}:${a.id}:${i}:status`,null)).length}
function percent(a=area){return a.houses.length?Math.round(doneCount(a)/a.houses.length*100):0}
function header(title,sub=''){return `<div class="top"><a class="jw" href="https://www.jw.org/ko/" target="_blank">JW.ORG</a><div class="title">${title}</div>${sub?`<div class="sub">${sub}</div>`:''}</div>`}
function layout(title,body,sub=''){app.innerHTML=`<div class="app">${header(title,sub)}<div class="content">${body}</div></div><div id="toast" class="toast"></div>`}
function toast(msg){let t=$('toast'); if(!t){return} t.textContent=msg;t.style.display='block';setTimeout(()=>t.style.display='none',1200)}
function home(){screen='home'; layout('인주회중의 야외봉사 앱',`<div class="menu grid">
<button class="btn" onclick="villages()">🏘 구역방문</button><button class="btn light" onclick="directVisit()">🏠 호별방문</button><button class="btn light" onclick="mapCenter()">🗺 지도센터</button><button class="btn light" onclick="dashboard()">📊 봉사현황</button><button class="btn light" onclick="participants()">👥 참여자관리</button><button class="btn light" onclick="pairs()">🤝 짝배정</button></div>
<div class="verse">“이 왕국의 좋은 소식이 모든 민족에게 증거되기 위하여 사람이 거주하는 온 땅에 전파될 것입니다.”<br><b>— 마태복음 24:14</b></div>`, 'v5.0 Alpha-2')}
function villages(){layout('구역방문',`<div class="grid">${APP_DATA.villages.map(v=>`<button class="btn ${v.id==='geol'?'':'light'}" onclick="selectVillage('${v.id}')">${v.name}</button>`).join('')}</div><button class="btn gray" onclick="home()">← 메인</button>`)}
function selectVillage(id){village=APP_DATA.villages.find(v=>v.id===id); if(!village.areas.length){toast('다음 Sprint에서 추가됩니다'); return} layout(village.name,`<div class="crumb">구역을 선택하세요</div>${village.areas.map(a=>`<button class="btn light" onclick="selectArea('${a.id}')">${a.name}</button>`).join('')}<button class="btn gray" onclick="villages()">← 뒤로</button>`)}
function selectArea(id){area=areaById(id); idx=0; layout(area.name,`<button class="btn" onclick="startMap()">🗺 지도 보기</button><button class="btn" onclick="startCards()">📋 카드만 보기</button><button class="btn gray" onclick="selectVillage('geol')">← 뒤로</button><div class="panel small">숙련자는 카드만 보기로 빠르게 진행하고, 필요할 때만 지도참조를 누르세요.</div>`)}
function startCards(){mode='card'; idx=0; renderCard()}
function directVisit(){area=areaById('geol_a'); startCards()}
function progressHTML(){let p=percent(area);return `<div class="progressLine"><span>${idx+1}/${area.houses.length}</span><div class="bar"><div class="fill" style="width:${p}%"></div></div><span>${p}%</span></div>`}
function renderCard(){let h=area.houses[idx]; let st=statusOf(); let hold=holdOf(); let statuses=[['visit','방문','green'],['absent','부재','yellow'],['reject','거절','red'],['closed','폐문','dark']]; layout(area.name,`${progressHTML()}<div class="panel"><div class="houseNo">${h.number}</div><div class="houseName">${h.name||'이름 없음'}</div><div class="address">${h.address}</div><div class="status">${statuses.map(x=>`<button class="btn ${x[2]} ${st===x[0]?'activeStatus':''}" onclick="setStatus('${x[0]}')">${x[1]}</button>`).join('')}</div><details><summary>메모 ${memoOf()? '✓':''}</summary><textarea oninput="setMemo(this.value)" placeholder="메모를 입력하세요">${memoOf()}</textarea></details></div><div class="nav4"><button class="btn light" onclick="prev()">◀ 이전</button><button class="btn ${hold?'warn':'light'}" onclick="toggleHold()">⏭ 보류</button><button class="btn light" onclick="refMap()">🗺 지도참조</button><button class="btn light" onclick="next()">다음 ▶</button></div><button class="btn" onclick="finishScreen()">🏁 봉사 종료</button><button class="btn gray" onclick="selectArea('${area.id}')">← 시작방식</button>`)}
function prev(){if(idx>0){idx--;renderCard()}else toast('첫 집입니다')}
function next(){if(idx<area.houses.length-1){idx++;renderCard()}else toast('마지막 집입니다')}
function startMap(){mode='map'; idx=0; renderMap(false)}
function refMap(){renderMap(true)}
function renderMap(ref=false){let houses=area.houses; let points=houses.map((h,i)=>{let col=i%7,row=Math.floor(i/7);return {x:10+col*13.2,y:12+row*11.5}}); layout(area.name,`<div class="row"><button class="btn light" onclick="getGPS()">📍 GPS</button><button class="btn light" onclick="${ref?'renderCard()':'startCards()'}">📋 카드</button></div><div class="map">${houses.map((h,i)=>{let st=statusOf(i)||''; let cls=holdOf(i)?'hold':st; return `<button class="marker ${cls}" style="left:${points[i].x}%;top:${points[i].y}%" onclick="idx=${i};renderCard()">${i+1}</button>`}).join('')}<div class="zoneLabel" style="left:8%;top:4%">${area.name}</div></div><div class="panel small">번호를 누르면 해당 카드가 열립니다. 지도참조는 현재 카드로 돌아갈 수 있습니다.</div><button class="btn gray" onclick="${ref?'renderCard()':'selectArea(area.id)'}">← 뒤로</button>`)}
function getGPS(){if(!navigator.geolocation){toast('GPS를 지원하지 않습니다');return}navigator.geolocation.getCurrentPosition(p=>toast('현재 위치 확인됨'),e=>toast('GPS 권한을 허용하세요'))}
function dashboard(){let areaRows=APP_DATA.areas.map(a=>`<div class="panel"><b>${a.name}</b><br>${doneCount(a)} / ${a.houses.length} (${percent(a)}%)</div>`).join(''); let total=APP_DATA.areas.reduce((s,a)=>s+a.houses.length,0); let done=APP_DATA.areas.reduce((s,a)=>s+doneCount(a),0); layout('봉사현황',`<div class="dash"><div class="panel"><div class="num">${done}</div>완료</div><div class="panel"><div class="num">${total}</div>전체</div></div>${areaRows}<button class="btn gray" onclick="home()">← 메인</button>`)}
function participants(){let list=load('participants',[]); layout('참여자관리',`<div class="row"><input id="pname" placeholder="이름" style="flex:1;padding:12px;border-radius:12px;border:1px solid #ccc"><button class="btn" style="width:90px" onclick="addParticipant()">추가</button></div><div class="panel">${list.map((n,i)=>`<span class="pill">${n} <b onclick="removeParticipant(${i})">×</b></span>`).join('')||'참여자 없음'}</div><button class="btn gray" onclick="home()">← 메인</button>`)}
function addParticipant(){let n=$('pname').value.trim(); if(!n)return; let list=load('participants',[]); list.push(n); save('participants',list); participants()}
function removeParticipant(i){let list=load('participants',[]); list.splice(i,1); save('participants',list); participants()}
function pairs(){let list=load('participants',[]); let pairs=[]; for(let i=0;i<list.length;i+=2){pairs.push(list.slice(i,i+2))} layout('짝배정',`<div class="panel small">현재는 임시 2명씩 보기입니다. 수동 배정은 다음 Sprint에서 강화합니다.</div>${pairs.map((p,i)=>`<div class="panel"><b>${i+1}조</b><br>${p.join(' · ')}</div>`).join('')||'<div class="panel">참여자관리에서 이름을 추가하세요.</div>'}<button class="btn gray" onclick="home()">← 메인</button>`)}
function mapCenter(){area=areaById('geol_a'); startMap()}
function finishScreen(){layout('봉사 종료',`<div class="finishBox panel"><label><input type="checkbox" id="safe"> 우리 조는 모두 안전하게 봉사를 마쳤습니다.</label><textarea id="finishNote" placeholder="기타사항이 있으면 입력하세요"></textarea><label><input type="checkbox" id="important"> 인도자가 확인해야 합니다.</label></div><button class="btn" onclick="finishSave()">🏁 봉사 종료</button><button class="btn gray" onclick="renderCard()">← 카드로</button>`)}
function finishSave(){if(!$('safe').checked){toast('안전 확인을 체크하세요');return}let rec={area:area.name,time:new Date().toLocaleString(),note:$('finishNote').value.trim(),important:$('important').checked};let arr=load('finishReports',[]);arr.push(rec);save('finishReports',arr);toast('봉사 종료가 저장되었습니다');home()}
home();
