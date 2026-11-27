import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';
import ContextMenu from './ContextMenu.jsx';
import ChatContent from './ChatContent.jsx';
import ChatRemovalDialog, {removalLabels} from './ChatRemovalDialog.jsx';
import {api,appPath,account,formatTime,presenceLabel,participantLabel,connectionMessage} from './api.js';
import {connectRealtime} from './realtime.js';
import ProfilePanel from './ProfilePanel.jsx';
import GlobalSearch from './GlobalSearch.jsx';
import {useChatNotifications} from './notifications.js';
import {FormError,PanelIcon,Loader} from './panelControls.jsx';
import {OutlineIcon} from './OutlineIcon.jsx';
const archiveRow = ['Архив','Сохранённые чаты','',0,'/static/icons/archive.png'];
function usePreference(key,fallback) {
 const storageKey = 'tornado:'+account.id+':'+key;
 const [value,setValue] = useState(()=>{
  try {
   const stored=JSON.parse(localStorage.getItem(storageKey));
   if (stored==null || typeof stored!==typeof fallback || Array.isArray(stored)!==Array.isArray(fallback)) return fallback;
   return stored;
  }
  catch {return fallback;}
 });
 useEffect(()=>{try {localStorage.setItem(storageKey,JSON.stringify(value));} catch {}},[storageKey,value]);
 return [value,setValue];
}
function HeaderAction({icon,label,onClick,expanded}) {
 return <button type="button" className="header-action" aria-label={label} aria-expanded={expanded} title={label} onClick={onClick}>
  <OutlineIcon name={icon==='phone'?'telephone':icon}/>
 </button>;
}
const initialParams = new URLSearchParams(location.search);
const initialChat = initialParams.get('chat');
const numberParam = name => /^\d+$/.test(initialParams.get(name) || '')?Number(initialParams.get(name)):null;
function initialPage() {
 if(initialParams.get('channel')) return {view:'join',alias:initialParams.get('channel')};
 if(numberParam('join')) return {view:'join',id:numberParam('join'),token:initialParams.get('invite')};
 if(numberParam('peer')) return numberParam('peer')===account.id?{view:'self'}:{view:'peer',id:numberParam('peer')};
 return null;
}
function App() {
 const [loading,setLoading]=useState(true), [query,setQuery]=useState(''), [selected,setSelected]=useState(/^\d+$/.test(initialChat ?? '')?initialChat:null), [width,setWidth]=useState(null); const panel=useRef(null);
 const [archive, setArchive] = usePreference('archive',[]);
 const [profile,setProfile] = useState(account);
 const [preferences,setPreferences]=usePreference('interface-settings',{enterToSend:true,compact:false,previews:true,motion:true});
 function changePreference(key,value) {setPreferences(current=>({...current,[key]:value}));}
 const [profilePage,setProfilePage] = useState(initialPage);
 const [searchOpen,setSearchOpen]=useState(false);
 const [globalTab,setGlobalTab]=useState('all');
 const [recent,setRecent]=usePreference('recent',[]);
 const [messageFocus,setMessageFocus]=useState(()=>numberParam('chat') && numberParam('message')?{chatId:initialChat,id:numberParam('message')}:null);
 const [pickRequest,setPickRequest]=useState(null);
 const searchInput=useRef(null);
 function closeSearch() {
   setSearchOpen(false);
   setQuery('');
   searchInput.current?.blur();
 }
 useEffect(()=>{
   if(!searchOpen) return;
   function dismiss(event) {
     if(event.key==='Escape' && !document.querySelector('dialog[open],.context-popover:not(.closing)')) closeSearch();
   }
   window.addEventListener('keydown',dismiss);
   return ()=>window.removeEventListener('keydown',dismiss);
 },[searchOpen]);
 const [renderedProfile,setRenderedProfile] = useState(null);
 useEffect(()=>{
   if (!profilePage) return;
   function closeOnEscape(event) {
     if (event.key==='Escape' && !document.querySelector('dialog[open],.context-popover:not(.closing)')) setProfilePage(null);
   }
   window.addEventListener('keydown',closeOnEscape);
   return ()=>window.removeEventListener('keydown',closeOnEscape);
 },[profilePage]);
 useLayoutEffect(()=>{
   if (profilePage) {
     setRenderedProfile(profilePage);
     return;
   }
   const timer=setTimeout(()=>setRenderedProfile(null),240);
   return ()=>clearTimeout(timer);
 },[profilePage]);
 const [records,setRecords] = useState({});
 const [connected,setConnected] = useState(false);
 const [chatRevision,setChatRevision] = useState(0);
 const loadGeneration = useRef(0);
 const [members,setMembers] = useState({});
 const [recordsReady,setRecordsReady] = useState(false);
 const [recordsError,setRecordsError] = useState('');
 const [hiddenChats,setHiddenChats] = usePreference('hidden',[]);
 async function loadChats() {
   const generation = ++loadGeneration.current;
   try {
     const all = {};
     let offset = 0;
     for (;;) {
       const result = await api('/api/chats?limit=50&offset='+offset,{cache:'no-store'});
       Object.assign(all,result.items);
       if (!result.has_more || !Object.keys(result.items ?? {}).length) break;
       offset += 50;
     }
     if (generation!==loadGeneration.current) return all;
     setRecords(all);
     setRecordsError('');
     setRecordsReady(true);
     return all;
   } catch(reason) {
     if(generation===loadGeneration.current)setRecordsError(reason.message);
   }
 }
 useEffect(()=>{
   const disconnect = connectRealtime({
     onStatus:setConnected,
     onChange:()=>{
       loadChats();
       setChatRevision(revision=>revision+1);
     },
   });
   loadChats();
   const online = () => api('/api/user/update_status',{method:'POST'}).catch(()=>{});
   online();
   const heartbeat = setInterval(online,30000);
   return ()=>{disconnect();clearInterval(heartbeat);};
 },[]);
 const entries = Object.entries(records).sort(([,a],[,b])=>String(b.last_sent_at ?? '').localeCompare(String(a.last_sent_at ?? ''))).map(([id,chat])=>[
   id, chat.last_msg, chat.last_sent_at?formatTime.format(new Date(chat.last_sent_at)):chat.last_time,chat.unread,chat.avatar,chat,
 ]);
 const chats = [archiveRow,...entries];
 const label = id => records[id]?.name ?? id;
 const [fromArchive, setFromArchive] = useState(false);
 const [chatMenu, setChatMenu] = useState(null);
 const [deleted, setDeleted] = useState([]);
 const [pendingDelete, setPendingDelete] = useState(null);
 const [removalNotices, setRemovalNotices] = useState([]);
 const removalTimers = useRef(new Map());
 useEffect(()=>()=>{for (const timer of removalTimers.current.values()) clearTimeout(timer);},[]);
 const [pinnedChats, setPinnedChats] = usePreference('pinned',[]);
 const [folder, setFolder] = usePreference('folder',[]);
 const [unread, setUnread] = usePreference('unread',{});
 const [notifications, setNotifications] = usePreference('notifications',{});
 useChatNotifications(records,preferences,notifications,selected);
 const toggleMembership = (set, name) => set(items=>items.includes(name)?items.filter(item=>item!==name):[...items,name]);
 const [notice, setNotice] = useState(null);
 const noticeTimer = useRef(null);
 useEffect(()=>()=>clearTimeout(noticeTimer.current),[]);
 function notify(text) {
   if (text===connectionMessage) return;
   clearTimeout(noticeTimer.current);
   setNotice({text});
   noticeTimer.current = setTimeout(()=>setNotice(null),3200);
 }
 function notificationEnabled(name) {
   const chat=records[name];
   const kind=chat?.target_user_id?'personal':chat?.chat_type==='channel'?'channel':'group';
   return notifications[name] ?? (preferences['notify_'+kind]!==false);
 }
 function toggleNotifications(name) {
   setNotifications(values=>({...values,[name]:!notificationEnabled(name)}));
 }
 function openChat(name, stored) {
   if (name==='Архив') {
     setFromArchive(true);
     return;
   }
   setFromArchive(stored);
   setSelected(name);
   if (name) {
     setUnread(values=>{const next={...values};delete next[name];return next;});
     setRecent(current=>[name,...current.filter(item=>item!==name)].slice(0,8));
   }
 }
 function dismissRemoval(name, undo) {
   const timer = removalTimers.current.get(name);
   if (!timer) return;
   clearTimeout(timer);
   removalTimers.current.delete(name);
   setRemovalNotices(items=>items.filter(item=>item.name!==name));
   if (undo) {
     if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
       rememberRows();
       arriving.current.add(name);
     }
     setDeleted(items=>items.filter(item=>item.name!==name));
   }
 }
 function removalKind(name) {
   const kind=chatKind(name);
   return kind==='channel' && Number(records[name]?.owner_id)===account.id?'owned-channel':kind;
 }
 function removeChat(name, forBoth) {
   const kind = removalKind(name);
   setPendingDelete(null);
   setDeleted(items=>[...items,{name,forBoth}]);
   setRemovalNotices(items=>[...items,{name,kind}]);
   removalTimers.current.set(name,setTimeout(async()=>{
     dismissRemoval(name,false);
     try {
       if(kind==='chat' || kind==='owned-channel'){
         await api('/api/chats/'+name+'?scope='+(forBoth?'both':'self'),{method:'DELETE'});
         setArchive(items=>items.filter(item=>item!==name));
         setRecent(items=>items.filter(item=>item!==name));
       } else await api('/api/chats/'+name+'/leave',{method:'POST'});
       await loadChats();
     } catch (error) { notify(error.message); }
     finally {setDeleted(items=>items.filter(item=>item.name!==name));}
   },5000));
   if(selected===name) setSelected(null);
 }
 const [tab, setTab] = useState('all');
 const [messageSearch, setMessageSearch] = useState(null);
 const currentChat = records[selected];
 useEffect(()=>{
   if (!currentChat && recordsReady && selected) setSelected(null);
 },[recordsReady,currentChat,selected]);
 useEffect(()=>{
   if (!selected || !currentChat || currentChat.target_user_id) return;
   const controller = new AbortController();
   api('/api/chats/'+selected+'/info',{signal:controller.signal}).then(info=>{
     setMembers(current=>({...current,[selected]:info.participants?.length ?? 0}));
   }).catch(()=>{});
   return ()=>controller.abort();
 },[selected,Boolean(currentChat),chatRevision]);
 function openChatProfile() {
   if (!currentChat) return;
   setProfilePage({view:currentChat.target_user_id?'peer':'chat',id:currentChat.target_user_id || selected,
     chatId:selected,name:currentChat.name,avatar:currentChat.avatar,kind:currentChat.chat_type,owner:Number(currentChat.owner_id)===account.id,manage:currentChat.permissions?.includes('manage')});
 }
 async function startCall() {
   try {
     const result = await api('/api/call/start',{method:'POST',json:{target_user_id:Number(currentChat.target_user_id),chat_id:Number(selected)}});
     if (result.call_url) location.assign(appPath(result.call_url));
   } catch (error) { notify(error.message); }
 }
 const available = chats.filter(([name])=>!deleted.some(chat=>chat.name===name) && !hiddenChats.includes(name));
 const hasArchivedChats = available.some(([name])=>archive.includes(name));
 const archiveOpen = hasArchivedChats && fromArchive;
 useLayoutEffect(()=>{
   if (!hasArchivedChats && fromArchive) setFromArchive(false);
 },[hasArchivedChats,fromArchive]);
 const moving = useRef(new Set());
 const arriving = useRef(new Set());
 const positions = useRef(null);
 const getRows = () => [...panel.current.querySelectorAll('[data-chat]')];
 function rememberRows() {
   positions.current = new Map(getRows().map(element=>[element.dataset.chat,element.getBoundingClientRect().top]));
 }
 async function moveChat(name, stored) {
   if (moving.current.has(name)) return;
   moving.current.add(name);
   const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   const row = getRows().find(element=>element.dataset.chat===name);
   if (!reduced && row) {
     await row.animate([{opacity:1,translate:'0 0'},{opacity:0,translate:stored?'-12px 0':'12px 0'}],{duration:150,easing:'ease-out',fill:'forwards'}).finished.catch(()=>{});
   }
   if (!reduced) {
     rememberRows();
     arriving.current.add(name);
   }
   setArchive(previous=>stored ? previous.filter(item=>item!==name) : [...previous,name]);
   moving.current.delete(name);
 }
 useLayoutEffect(()=>{
   for (const row of getRows()) {
     const name = row.dataset.chat;
     const previousTop = positions.current?.get(name);
     const delta = previousTop === undefined ? 0 : previousTop - row.getBoundingClientRect().top;
     if (delta) row.animate([{transform:'translateY('+delta+'px)'},{transform:'translateY(0)'}],{duration:200,easing:'cubic-bezier(0.23, 1, 0.32, 1)'});
     if (arriving.current.delete(name)) row.animate([{opacity:0,translate:'0 6px'},{opacity:1,translate:'0 0'}],{duration:180,easing:'ease-out'});
   }
   positions.current = null;
 },[archive,archiveOpen,query,tab,deleted]);
 function openChatMenu(event, name, anchor) {
   event.preventDefault();
   const stored = archive.includes(name);
   const bounds=anchor || event.currentTarget.getBoundingClientRect();
   setChatMenu({x:event.clientX || bounds.left,y:event.clientY || bounds.bottom,actions:[
    ['tab','Открыть в новой вкладке',()=>{
      const url = new URL(location.href);
      url.searchParams.set('chat',name);
      window.open(url,'_blank','noopener');
    }],
    ['eye','Просмотреть',()=>openChat(name,stored)],
    ['folder',folder.includes(name)?'Убрать из папки':'Добавить в папку',()=>toggleMembership(setFolder,name)],
    ['unread','Пометить непрочитанным',()=>setUnread(values=>({...values,[name]:Math.max(1,values[name] ?? 0)}))],
    ['pin',pinnedChats.includes(name)?'Открепить':'Закрепить',()=>toggleMembership(setPinnedChats,name)],
    [notificationEnabled(name)?'bellOff':'bell',notificationEnabled(name)?'Выкл. уведомления':'Вкл. уведомления',()=>toggleNotifications(name)],
    ['archive',stored?'Вернуть из архива':'В архив',()=>moveChat(name,stored)],
    ['delete',removalLabels[removalKind(name)].action,()=>setPendingDelete(name)],
   ]});
 }
 const groups = entries.filter(chat=>!chat[5].target_user_id && chat[5].chat_type!=='channel').map(chat=>chat[0]);
 const channels = entries.filter(chat=>chat[5].chat_type==='channel').map(chat=>chat[0]);
 const chatKind = name => channels.includes(name)?'channel':groups.includes(name)?'group':'chat';
 function anchorMenu(event,label,actions,{above=false,align='start',identity}={}) {
   const trigger=event.currentTarget;
   if(chatMenu?.trigger===trigger){setChatMenu(null);return;}
   setChatMenu({trigger,label,actions,above,align,identity});
 }
 function toggleSidebarMenu(event) {
   if(searchOpen) {closeSearch();return;}
   const actions=[
     ['chats','Все чаты',()=>{setTab('all');setFromArchive(false);closeSearch();}],
     ['profile','Мой профиль',()=>setProfilePage({view:'self'})],
     ['settings','Настройки',()=>setProfilePage({view:'settings'})],
   ];
   if(hasArchivedChats) actions.push(['archive','Архив',()=>setFromArchive(true)]);
   anchorMenu(event,'Разделы чатов',actions,{identity:{name:profile.name || profile.login,avatar:profile.avatar,open:()=>setProfilePage({view:'self'})}});
 }
 function toggleCreateMenu(event) {
   anchorMenu(event,'Создание чата',[
     ['channel','Создать канал',()=>setProfilePage({view:'new-channel'})],
     ['groups','Создать группу',()=>setProfilePage({view:'new-group',step:1})],
     ['profile','Новое сообщение',()=>setProfilePage({view:'new-chat'})],
   ],{above:true,align:'end'});
 }
 function showHeaderMenu(event) {
   if(!currentChat) return;
   const channel=currentChat.chat_type==='channel';
   const personal=!!currentChat.target_user_id;
   const owner=Number(currentChat.owner_id)===account.id;
   const actions=[];
   if(!personal && (owner || currentChat.permissions?.includes('manage'))) actions.push(['edit','Изменить',()=>setProfilePage({view:'chat-edit',id:selected,name:currentChat.name,avatar:currentChat.avatar,kind:currentChat.chat_type,owner})]);
   else actions.push(['profile',personal?'Профиль собеседника':channel?'О канале':'О группе',openChatProfile]);
   if(personal) actions.push(['video','Видеозвонок',startCall]);
   const muted=!notificationEnabled(selected);
   actions.push([muted?'bell':'bellOff',muted?'Включить уведомления':'Выключить уведомления',()=>toggleNotifications(selected)]);
   if(channel && currentChat.discussion_chat_id) actions.push(['chats','Открыть обсуждение',()=>openDiscussion(currentChat.discussion_chat_id)]);
   actions.push(['select','Выбрать сообщения',()=>setPickRequest({chatId:selected})]);
   if(personal && !currentChat.is_bot) actions.push(['block',currentChat.peer_blocked?'Разблокировать':'Заблокировать',async()=>{
     try{
       await api('/api/chats/'+selected+'/'+(currentChat.peer_blocked?'unblock':'block')+'/'+currentChat.target_user_id,{method:'POST'});
       await loadChats();
     }catch(reason){notify(reason.message);}
   }]);
   actions.push(['delete',removalLabels[removalKind(selected)].action,()=>setPendingDelete(selected)]);
   anchorMenu(event,'Действия чата',actions,{align:'end'});
 }
 async function openDiscussion(id) {
   const key=String(id);
   if(!records[key]){
     try{
       const result=await api('/api/chats/join',{method:'POST',json:{chat_id:Number(id)}});
       if(result.pending){setProfilePage({view:'join',id,pending:true});return;}
       await loadChats();
     }catch(reason){notify(reason.message);return;}
   }
   openChat(key,archive.includes(key));
   setProfilePage(null);
 }
 function openSearchChat(id) {
   const key=String(id);
   closeSearch();
   openChat(key,archive.includes(key));
 }
 async function openSearchPerson(user) {
   if(Number(user.id)===account.id){closeSearch();setProfilePage({view:'self'});return;}
   try {
     const data=await api('/api/chats/get_or_create',{method:'POST',json:{target_user_id:Number(user.id)}});
     await loadChats();
     const key=String(data.chat_id);
     setHiddenChats(items=>items.filter(item=>item!==key));
     setProfilePage(null);
     openSearchChat(key);
   } catch (error) {notify(error.message);}
 }
 useEffect(()=>{
   const id=numberParam('start_peer');
   if(id) openSearchPerson({id});
 },[]);
 const matchesTab = name => tab!=='folder' || folder.includes(name);
 const byPinned = ([a],[b]) => Number(pinnedChats.includes(b))-Number(pinnedChats.includes(a));
 const archiveChats = available.filter(([name])=>archive.includes(name)).sort(byPinned);
 const mainChats = available.filter(([name])=>(name!=='Архив' || hasArchivedChats) && !archive.includes(name) && matchesTab(name)).sort((a,b)=>Number(b[0]==='Архив')-Number(a[0]==='Архив') || byPinned(a,b));
 useEffect(()=>{const t=setTimeout(()=>setLoading(false),700);return()=>clearTimeout(t)},[]);
 const clamp=v=>Math.max(Math.min(window.innerWidth<=1100?76:280,window.innerWidth*.5),Math.min(window.innerWidth*.5,480,v));
 useEffect(()=>{const fn=()=>setWidth(w=>w===null?null:clamp(w));window.addEventListener('resize',fn);return()=>window.removeEventListener('resize',fn)},[]);
 function resize(e){e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);const x=e.clientX,w=panel.current.getBoundingClientRect().width,t=e.currentTarget;const move=a=>setWidth(clamp(w+a.clientX-x));const stop=()=>{t.removeEventListener('pointermove',move);t.removeEventListener('pointerup',stop);t.removeEventListener('pointercancel',stop)};t.addEventListener('pointermove',move);t.addEventListener('pointerup',stop);t.addEventListener('pointercancel',stop)}
 return <><div className={'preloader'+(loading?'':' is-hidden')} role="status" aria-label="Загрузка"><div className="brand"><svg className="logo" viewBox="0 0 1132 642" aria-hidden="true"><path d="M442.493 592L687.802 384.673L687.802 235.834L811.937 235.834L1082 50L334.072 50L50 235.834L442.493 235.834L442.493 592Z" fill="#fff"/></svg><div className="word" aria-label="Tornado">{'Tornado'.split('').map((c,i)=><span key={i} style={{'--i':i}}>{c}</span>)}</div></div></div><div className="pattern-light" aria-hidden="true"/><main className={'interface'+(selected && selected !== 'Архив' ? ' has-chat' : '')+(profilePage?' has-profile':'')+(searchOpen?' has-search':'')+(preferences.compact?' compact-chat':'')+(preferences.motion===false?' motion-disabled':'')+(preferences.previews===false?' hide-previews':'')}><aside className="sidebar" ref={panel} style={width===null?undefined:{width}} aria-label="Боковая панель">{archiveOpen ? <div className="archive-page">
       <header><button type="button" aria-label="Закрыть архив" onClick={()=>setFromArchive(false)}><OutlineIcon name="arrow_back"/></button>Архив</header>
       <div className="chat-list">{archiveChats.map(([name,preview,time,,image])=>
        <div className="archive-row" key={name} data-chat={name} onContextMenu={event=>openChatMenu(event,name)}>
         <button type="button" className="chat" onClick={()=>{openChat(name,true);}}><img className="avatar" alt="" src={appPath(image)}/><div className="chat-body"><div className="chat-line"><span className="chat-name">{label(name)}</span><span className="chat-time">{time}</span></div><div className="chat-preview"><span>{preview}</span>{!!unread[name] && <span className="badge">{unread[name]}</span>}</div></div></button>
         
        </div>
       )}</div>
      </div> : <><div className="sidebar-header">
       <button className={'menu-button morph-menu'+(searchOpen?' back':'')} type="button" aria-label={searchOpen?'Закрыть поиск':'Меню'} aria-expanded={chatMenu?.label==='Разделы чатов'} onClick={toggleSidebarMenu}><span><PanelIcon name="menu"/><PanelIcon name="arrow_back"/></span></button>
       <label className={'search'+(searchOpen?' search-active':'')}><PanelIcon name="search"/><input ref={searchInput} type="search" placeholder={connected?'Поиск':'Соединение…'} aria-label={connected?'Поиск':'Соединение…'} value={query}
        onFocus={()=>{setSearchOpen(true);setChatMenu(null);}} onChange={event=>setQuery(event.target.value)}/>
        {query && <button type="button" className="search-clear" aria-label="Очистить поиск" onClick={()=>{setQuery('');searchInput.current?.focus();}}><PanelIcon name="close"/></button>}
       </label>
      </div>
      <GlobalSearch open={searchOpen} query={query} tab={globalTab} setTab={setGlobalTab} recent={recent} clearRecent={()=>setRecent([])} records={records}
       openChat={openSearchChat} openPerson={openSearchPerson}
       openResult={message=>{setMessageSearch(null);openSearchChat(message.chat_id);setMessageFocus({chatId:String(message.chat_id),id:message.id});}}
       openChannel={chat=>{closeSearch();if(records[chat.id])openSearchChat(chat.id);else setProfilePage({view:'join',id:chat.id,name:chat.name});}}/>
      <div className="sidebar-chat-layer" inert={searchOpen} aria-hidden={searchOpen || undefined}>
{(folder.length>0 || tab==='folder') && <button type="button" className="folder-filter" aria-pressed={tab==='folder'} onClick={()=>setTab(tab==='folder'?'all':'folder')}>Папка</button>}<div className="chat-list" aria-label="Список чатов">{!recordsReady && (recordsError?<FormError message={recordsError}/>:<Loader label="Загрузка чатов…"/>)} {mainChats.map(c=><button type="button" className={'chat'+(selected===c[0]?' selected':'')} key={c[0]} data-chat={c[0]} aria-pressed={selected===c[0]} onContextMenu={c[0] === "Архив" ? undefined : event=>openChatMenu(event,c[0])} onClick={event=>{
   openChat(c[0],false);
   const button=event.currentTarget;
   const rect=button.getBoundingClientRect();
   const wave=document.createElement('span');
   wave.className='chat-wave';
   wave.style.left=(event.detail ? event.clientX-rect.left : rect.width/2)+'px';
   wave.style.top=(event.detail ? event.clientY-rect.top : rect.height/2)+'px';
   wave.setAttribute('aria-hidden','true');
   if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
     button.append(wave);
     wave.addEventListener('animationend',()=>wave.remove(),{once:true});
   }
 }}><img className="avatar" src={appPath(c[4])} alt=""/><div className="chat-body"><div className="chat-line"><span className="chat-name">{label(c[0])}</span><span className="chat-time">{typeof c[5]?.last_status==='boolean' && <span aria-label={c[5].last_status?'Прочитано':'Отправлено'} role="img"><OutlineIcon name={c[5].last_status?'checkAll':'check'}/></span>}{c[2]}</span></div><div className="chat-preview"><span>{c[1]}</span>{!!(unread[c[0]] ?? c[3])&&<span className={'badge'+(c[0]==='Архив'?' muted':'')}>{unread[c[0]] ?? c[3]}</span>}</div></div></button>)}</div></div><button type="button" className={'sidebar-create'+(chatMenu?.label==='Создание чата'?' is-open':'')} aria-label="Создать чат" aria-expanded={chatMenu?.label==='Создание чата'} onClick={toggleCreateMenu} inert={searchOpen}><OutlineIcon name={chatMenu?.label==='Создание чата'?'close':'edit'}/></button><div className="resize-handle" role="separator" aria-label="Изменить ширину панели" aria-orientation="vertical" aria-valuemin={0} aria-valuemax={50} tabIndex="0" onPointerDown={resize} onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();setWidth(clamp(panel.current.getBoundingClientRect().width+(e.key==='ArrowRight'?10:-10)))}}}/></>}</aside>
    {<section className="conversation" hidden={!currentChat} aria-label={currentChat?.name ?? "Чат"}>
      <div className="conversation-body" hidden={selected === 'Архив'}>
      <ChatContent enterToSend={preferences.enterToSend!==false} onOpenAuthor={message=>setProfilePage({view:'peer',id:message.authorId,name:message.author,avatar:message.avatar})} focus={messageFocus} pickRequest={pickRequest} revision={chatRevision} notify={notify} onUpdated={loadChats} canWrite={profile.can_message && !currentChat?.blocked && (!channels.includes(selected) || currentChat?.permissions?.includes('post') || Number(currentChat?.owner_id)===profile.id)} chat={chats.find(chat=>chat[0]===selected) ?? chats[0]} channel={channels.includes(selected)} showSender={groups.includes(selected)} forwardTargets={available.filter(([name])=>name!=='Архив' && !channels.includes(name))} notificationsEnabled={notificationEnabled(selected)} onToggleNotifications={()=>toggleNotifications(selected)} search={messageSearch && messageSearch.chat===selected ? messageSearch.value : ''} header={<>
      <header key={selected} className="conversation-header" onClick={event=>{if(!event.target.closest('button'))openChatProfile();}}>
       <button type="button" className="composer-action back-button" aria-label="Назад к списку чатов" onClick={()=>setSelected(null)}>
        <OutlineIcon name="arrow_back"/>
       </button>
       <button type="button" className="chat-profile-button" aria-label="Открыть сведения о чате" onClick={openChatProfile}><img className="header-avatar" src={appPath(currentChat?.target_user_id===profile.id?profile.avatar:currentChat?.avatar)} alt=""/>
       <span className="header-identity"><strong>{currentChat?.name}</strong><small>{currentChat?.target_user_id?presenceLabel(currentChat):members[selected]!==undefined?participantLabel(members[selected],channels.includes(selected)):''}</small></span></button>
       <div className="header-actions">
        <HeaderAction icon="search" label="Поиск по сообщениям" onClick={()=>setMessageSearch(current=>current?.chat===selected?null:{chat:selected,value:''})}/>
        {!channels.includes(selected) && !groups.includes(selected) && <HeaderAction icon="phone" label="Позвонить" onClick={startCall}/>}
        <HeaderAction icon="more" label="Действия чата" expanded={chatMenu?.label==='Действия чата'} onClick={showHeaderMenu}/>
       </div>
      </header>
      {messageSearch && messageSearch.chat === selected && <div className="header-search">
       <input autoFocus type="search" aria-label="Поиск по сообщениям" placeholder="Поиск по сообщениям" value={messageSearch.value} onChange={event=>setMessageSearch({chat:selected,value:event.target.value})} onKeyDown={event=>{if(event.key==='Escape')setMessageSearch(null);}}/>
      </div>}
      </>}/></div>
    </section>}
  <aside className="profile-dock" inert={!profilePage} aria-hidden={!profilePage || undefined}><ProfilePanel page={renderedProfile} setPage={setProfilePage} profile={profile} setProfile={setProfile} blocked={entries.filter(item=>item[5].peer_blocked).map(item=>({...item[5],id:item[0]}))} preferences={preferences} changePreference={changePreference} notifications={notifications} notificationEnabled={notificationEnabled} onToggleNotifications={toggleNotifications} onUpdated={loadChats}
   groups={entries.filter(item=>groups.includes(item[0]) && Number(item[5].owner_id)===account.id).map(item=>({id:item[0],name:item[5].name}))}
   onOpenChat={async (id,showDetails=false)=>{
    const loaded=await loadChats();
    const key=String(id);
    setHiddenChats(items=>items.filter(item=>item!==key));
    setArchive(items=>items.filter(item=>item!==key));
    openChat(key,false);
    const chat=loaded?.[key] || records[key];
    setProfilePage(showDetails && chat && !chat.target_user_id?{view:'chat',id:key,name:chat.name,avatar:chat.avatar,kind:chat.chat_type,owner:Number(chat.owner_id)===account.id,manage:chat.permissions?.includes('manage')}:null);
   }}/></aside>
  </main><ContextMenu menu={chatMenu} close={()=>setChatMenu(null)}/>
  {pendingDelete && <ChatRemovalDialog name={label(pendingDelete)} kind={removalKind(pendingDelete)} onClose={()=>setPendingDelete(null)} onConfirm={forBoth=>removeChat(pendingDelete,forBoth)}/>}
  <div className="removal-notices">
   {notice && <div className="removal-notice error-notice" role="alert">
    <OutlineIcon name="error"/>
    {notice.text}
   </div>}
   {removalNotices.map(({name,kind})=><div className="removal-notice" key={name}>
    <svg className="removal-timer" viewBox="0 0 26 26" aria-hidden="true">
     <circle cx="13" cy="13" r="10" fill="none" stroke="#ffffff30" strokeWidth="2"/>
     <circle className="removal-timer-progress" cx="13" cy="13" r="10" pathLength="100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform="rotate(-90 13 13)"/>
    </svg>
    <span role="status">{removalLabels[kind].done}</span>
    <button type="button" aria-label={'Вернуть чат '+label(name)} onClick={()=>dismissRemoval(name,true)}>Вернуть</button>
   </div>)}
  </div></>;
}
const root=document.getElementById('root');
createRoot(root,{onUncaughtError(error){
 console.error(error);
 root.dispatchEvent(new ErrorEvent('tornado:render-error',{message:error?.message || 'Ошибка рендера.'}));
}}).render(<App/>);


