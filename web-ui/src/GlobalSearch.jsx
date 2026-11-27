import React,{useEffect,useState} from 'react';
import {account,api,formatTime} from './api.js';
import {FormError,PanelIcon,Portrait,Loader} from './panelControls.jsx';
import {VerifiedBadge} from './OutlineIcon.jsx';

const categories=[['all','Чаты'],['channels','Каналы'],['bots','Боты'],['posts','Посты'],['media','Медиа'],['links','Ссылки'],['messages','Сообщения']];
const empty={users:[],channels:[],messages:[],next_cursor:null};
const storageKey='tornado:'+account.id+':search-v1';
const freshFor=30000;
const retainFor=300000;
const cache=new Map();
try {
 for(const [key,entry] of Object.entries(JSON.parse(sessionStorage.getItem(storageKey)) || {}))
  if(entry && Date.now()-entry.at<retainFor) cache.set(key,entry);
} catch {}
function cached(key) {
 const entry=cache.get(key);
 return entry && Date.now()-entry.at<retainFor?entry:undefined;
}
function saveSearch(key,data) {
 cache.delete(key);
 cache.set(key,{at:Date.now(),data});
 while(cache.size>20) cache.delete(cache.keys().next().value);
 try {
  // Message snippets stay in memory. Persist only profiles and channel previews.
  sessionStorage.setItem(storageKey,JSON.stringify(Object.fromEntries([...cache].map(([path,entry])=>[
   path,Array.isArray(entry.data)?entry:{...entry,at:Math.min(entry.at,Date.now()-freshFor),data:{...entry.data,messages:[],next_cursor:null}}
  ]))));
 } catch {}
}
const contactsPath='/api/users/search';
export default function GlobalSearch({open,query,tab,setTab,recent,clearRecent,records,openPerson,openChat,openResult,openChannel}) {
 const [contacts,setContacts]=useState(()=>cached(contactsPath)?.data || []);
 const [resultFrame,setResultFrame]=useState(null);
 const [paging,setPaging]=useState(null);
 const term=query.trim().toLowerCase();
 const path=term.length>=2?'/api/search?'+new URLSearchParams({q:term,kind:tab}):null;
 const frame=resultFrame?.path===path?resultFrame:null;
 const results=frame?.data || cached(path)?.data || empty;
 const hasResults=!!(results.users.length || results.channels.length || results.messages.length);
 const busy=!!path && (paging===path || (frame?.busy ?? !cached(path)));
 const error=frame?.error || '';
 useEffect(()=>{
  if(!open && cached(contactsPath)) return;
  if(cached(contactsPath) && Date.now()-cached(contactsPath).at<freshFor) return;
  const controller=new AbortController();
  const timer=setTimeout(()=>{
   api(contactsPath,{signal:controller.signal}).then(data=>{
    if(!controller.signal.aborted && Array.isArray(data)){saveSearch(contactsPath,data);setContacts(data);}
   }).catch(()=>{});
  },open?0:800);
  return ()=>{clearTimeout(timer);controller.abort();};
 },[open]);
 useEffect(()=>{
  if(!open || !path) return;
  const stored=cached(path);
  if(stored && Date.now()-stored.at<freshFor){
   setResultFrame({path,data:stored.data,busy:false});
   return;
  }
  const controller=new AbortController();
  setResultFrame({path,data:stored?.data,busy:true});
  const timer=setTimeout(()=>{
   api(path,{signal:controller.signal}).then(data=>{
    if(controller.signal.aborted)return;
    saveSearch(path,data);
    setResultFrame({path,data,busy:false});
   }).catch(reason=>{if(!controller.signal.aborted)setResultFrame({path,data:stored?.data,busy:false,error:reason.message});});
  },stored?0:180);
  return ()=>{clearTimeout(timer);controller.abort();};
 },[open,path]);
 async function more() {
  if(!path || busy || !results.next_cursor)return;
  setPaging(path);
  try {
   const data=await api(path+'&cursor='+encodeURIComponent(results.next_cursor));
   const combined={...results,messages:[...new Map([...results.messages,...data.messages].map(row=>[row.id,row])).values()],next_cursor:data.next_cursor};
   saveSearch(path,combined);
   setResultFrame(current=>current?.path===path?{path,data:combined,busy:false}:current);
  } catch(reason){setResultFrame(current=>current?.path===path?{path,data:results,busy:false,error:reason.message}:current);}
  finally{setPaging(current=>current===path?null:current);}
 }
 const local=term.length>=2 && tab==='all'?Object.entries(records).filter(([,chat])=>chat.name?.toLocaleLowerCase('ru').includes(term.toLocaleLowerCase('ru'))).slice(0,8):[];
 return <div className={'global-search'+(open?' searching':'')} inert={!open} aria-hidden={!open || undefined}>
  <nav className="panel-tabs search-tabs" aria-label="Категории поиска">{categories.map(([id,label])=><button key={id} type="button" aria-pressed={tab===id} onClick={()=>setTab(id)}>{label}</button>)}</nav>
  <div className="global-search-results">
   {!term && <>
    {contacts.length>0 && <div className="search-contacts">{contacts.map(user=><button key={user.id} type="button" onClick={()=>openPerson(user)}><Portrait src={user.avatar} name={user.fio || user.login}/><span>{user.fio || user.login}</span></button>)}</div>}
    {!!recent.filter(id=>records[id]).length && <section className="search-result-card"><header>Недавние<button className="header-action" type="button" aria-label="Очистить недавние" onClick={clearRecent}><PanelIcon name="close"/></button></header>
     {recent.filter(id=>records[id]).map(id=><Result key={id} avatar={records[id].avatar} title={records[id].name} detail={records[id].last_msg} onClick={()=>openChat(id)}/>)}
    </section>}
   </>}
   {local.length>0 && <section className="search-result-card"><header>Ваши чаты</header>{local.map(([id,chat])=><Result key={id} avatar={chat.avatar} title={chat.name} detail={chat.last_msg} onClick={()=>openChat(id)}/>)}</section>}
   {(results.users.length>0 || results.channels.length>0) && <section className="search-result-card"><header>Глобальный поиск</header>
    {results.users.map(user=><Result key={'user'+user.id} avatar={user.avatar} title={user.fio || user.login} verified={user.verified} detail={'@'+(user.handle || user.login)} onClick={()=>openPerson(user)}/>)}
    {results.channels.map(chat=><Result key={'channel'+chat.id} avatar={chat.avatar} title={chat.name} detail={chat.description || 'Публичный канал'} onClick={()=>openChannel(chat)}/>)}
   </section>}
   {results.messages.length>0 && <section className="search-result-card"><header>Сообщения</header>{results.messages.map(message=>{
    const chat=records[message.chat_id];
    return <Result key={message.id} avatar={chat?.avatar || message.avatar} title={chat?.name || message.name || message.author} detail={message.text} time={formatTime.format(new Date(message.at))} onClick={()=>openResult(message)}/>;
   })}</section>}
   {results.next_cursor && <button type="button" className="search-more" onClick={more} disabled={busy}>Искать дальше</button>}
   <FormError message={hasResults?'':error}/>
   {term.length>=2 && !error && !busy && !local.length && !results.users.length && !results.channels.length && !results.messages.length && !results.next_cursor && <p className="panel-empty">Ничего не найдено</p>}
   {busy && !hasResults && !local.length && <Loader label="Поиск…"/>}
  </div>
 </div>;
}
function Result({avatar,title,detail,time,onClick,verified}) {
 return <button type="button" className="profile-row search-result" onClick={onClick}><Portrait src={avatar} name={title}/>
  <span className="search-result-text">{title}<VerifiedBadge visible={verified}/><small>{detail}</small></span>{time && <time>{time}</time>}
 </button>;
}
