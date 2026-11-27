import React,{useEffect,useState} from 'react';
import {api,formatTime,fetchPanel} from './api.js';
import {FormError,PanelIcon,Portrait,Loader} from './panelControls.jsx';

const categories=[['all','Чаты'],['channels','Каналы'],['bots','Боты'],['posts','Посты'],['media','Медиа'],['links','Ссылки'],['messages','Сообщения']];
const empty={users:[],channels:[],messages:[],next_cursor:null};
export default function GlobalSearch({open,query,tab,setTab,recent,clearRecent,records,openPerson,openChat,openResult,openChannel}) {
 const [contacts,setContacts]=useState([]);
 const [results,setResults]=useState(empty);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const term=query.trim();
 useEffect(()=>{
  if(!open) return;
  const controller=new AbortController();
  fetchPanel('/api/users/search',controller.signal).then(data=>{if(!controller.signal.aborted)setContacts(data);}).catch(()=>{});
  return ()=>controller.abort();
 },[open]);
 useEffect(()=>{
  if(!open) return;
  setResults(empty);
  setError('');
  setBusy(term.length>=2);
  if(term.length<2) return;
  const controller=new AbortController();
  const timer=setTimeout(()=>{
   fetchPanel('/api/search?'+new URLSearchParams({q:term,kind:tab}),controller.signal)
    .then(data=>{if(!controller.signal.aborted)setResults(data);}).catch(reason=>{if(!controller.signal.aborted)setError(reason.message);})
    .finally(()=>{if(!controller.signal.aborted)setBusy(false);});
  },320);
  return ()=>{clearTimeout(timer);controller.abort();};
 },[open,term,tab]);
 async function more() {
  setBusy(true);
  setError('');
  try {
   const data=await api('/api/search?'+new URLSearchParams({q:term,kind:tab,cursor:results.next_cursor}));
   setResults(current=>current===results?{...current,messages:[...current.messages,...data.messages],next_cursor:data.next_cursor}:current);
  } catch(reason){setError(reason.message);}
  finally{setBusy(false);}
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
    {results.users.map(user=><Result key={'user'+user.id} avatar={user.avatar} title={user.fio || user.login} detail={'@'+(user.handle || user.login)} onClick={()=>openPerson(user)}/>)}
    {results.channels.map(chat=><Result key={'channel'+chat.id} avatar={chat.avatar} title={chat.name} detail={chat.description || 'Публичный канал'} onClick={()=>openChannel(chat)}/>)}
   </section>}
   {results.messages.length>0 && <section className="search-result-card"><header>Сообщения</header>{results.messages.map(message=>{
    const chat=records[message.chat_id];
    return <Result key={message.id} avatar={chat?.avatar || message.avatar} title={chat?.name || message.name || message.author} detail={message.text} time={formatTime.format(new Date(message.at))} onClick={()=>openResult(message)}/>;
   })}</section>}
   {results.next_cursor && <button type="button" className="search-more" onClick={more} disabled={busy}>Искать дальше</button>}
   <FormError message={error}/>
   {term.length>=2 && !error && !busy && !local.length && !results.users.length && !results.channels.length && !results.messages.length && !results.next_cursor && <p className="panel-empty">Ничего не найдено</p>}
   {busy && <Loader/>}
  </div>
 </div>;
}
function Result({avatar,title,detail,time,onClick}) {
 return <button type="button" className="profile-row search-result" onClick={onClick}><Portrait src={avatar} name={title}/>
  <span className="search-result-text">{title}<small>{detail}</small></span>{time && <time>{time}</time>}
 </button>;
}
