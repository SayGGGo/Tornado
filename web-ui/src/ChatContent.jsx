import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';

import ContextMenu, {reactionChoices} from './ContextMenu.jsx';
import {FormError,PanelIcon,Portrait} from './panelControls.jsx';
import {OutlineIcon} from './OutlineIcon.jsx';
import ChatRemovalDialog from './ChatRemovalDialog.jsx';
import {api,appPath,account,connectionMessage,messageFromServer,sendToChat} from './api.js';

const chatIcons={tick:'check',check:'checkAll',clip:'paperclip',delete:'trash',close:'close',copy:'content_copy',forward:'forward',bell:'notifications'};
function Icon({name}) {return <OutlineIcon name={chatIcons[name]}/>;}
const clock = new Intl.DateTimeFormat('ru', {hour:'2-digit', minute:'2-digit'});
const dayKey = new Intl.DateTimeFormat('ru', {year:'numeric', month:'numeric', day:'numeric'});
const dateLabel = new Intl.DateTimeFormat('ru', {day:'numeric', month:'long'});
const emptyHistory = [];
const historyCacheKey='tornado:'+account.id+':recent-message-history';
function readHistoryCache() {
 try {
  const entries=JSON.parse(sessionStorage.getItem(historyCacheKey));
  return Object.fromEntries(Object.entries(entries || {}).filter(([,rows])=>Array.isArray(rows) && rows.every(row=>Number.isFinite(row?.at) && Number.isInteger(row?.id))));
 } catch {return {};}
}
export default function ChatContent({chat, channel, showSender, search, forwardTargets, notificationsEnabled, onToggleNotifications, notify, header, onUpdated, canWrite, revision, focus, pickRequest, onOpenAuthor, enterToSend}) {
 const [messages, setMessages] = useState(readHistoryCache);
 const [outbox,setOutbox]=useState({});
 const [historyReady,setHistoryReady]=useState({});
 const [historyError,setHistoryError]=useState(null);
 const [canLoadEarlier,setCanLoadEarlier] = useState({});
 const [loadingEarlier,setLoadingEarlier] = useState(false);
 const scrollAnchor = useRef(null);
 const historyPageSize = 50;
 const [drafts, setDrafts] = useState({});
 const composeErrorId=React.useId();
 const [reactionOverrides,setReactionOverrides]=useState({});
 const [inlineAction,setInlineAction]=useState(null);
 const pendingReactions=useRef(new Set());
 const reactionMovement = useRef(null);
 const [recording, setRecording] = useState(false);
 const [pendingRemoval, setPendingRemoval] = useState(null);
 const [dissolving, setDissolving] = useState(null);
 const removalTimer = useRef(null);
 useEffect(()=>()=>clearTimeout(removalTimer.current),[]);
 const [menu, setMenu] = useState(null);
 const [marked, setMarked] = useState([]);
 const [pinned, setPinned] = useState(null);
 const [reply, setReply] = useState(null);
 const [showLatest, setShowLatest] = useState(false);
 const historyPanel = useRef(null);
 const topDock = useRef(null);
 const bottomDock = useRef(null);
 const scrollOnAppend = useRef(null);
 function updateLatest() {
  const panel = historyPanel.current;
  setShowLatest(Boolean(panel && panel.scrollHeight-panel.clientHeight-panel.scrollTop>40));
 }
 function scrollLatest(smooth=false) {
  const panel = historyPanel.current;
  panel?.scrollTo({top:panel.scrollHeight,behavior:smooth && !matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'auto'});
 }
 async function copyMessage(text) {
  let copied = false;
  try {
   if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    copied = true;
   }
  } catch {}
  if (!copied) {
   const previous = document.activeElement;
   const input = document.createElement('textarea');
   input.className = 'clipboard-fallback';
   input.value = text;
   input.readOnly = true;
   document.body.append(input);
   input.focus({preventScroll:true});
   input.select();
   try { copied = document.execCommand('copy'); }
   catch {}
   finally {
    input.remove();
    if (previous instanceof HTMLElement && !previous.closest('[inert]')) previous.focus({preventScroll:true});
   }
  }
  if (!copied) notify('Не удалось скопировать текст. Проверьте доступ к буферу обмена.');
  return copied;
 }
 function toggleReaction(message,emoji,bubble) {
  const key=reactionKey(message);
  if(pendingReactions.current.has(key)) return;
  const current=visibleReactions(message).find(item=>item.own);
  const next=current?.emoji===emoji?null:emoji;
  pendingReactions.current.add(key);
  api('/api/messages/'+message.id+'/reaction',{method:'PUT',json:{emoji:next}})
   .then(result=>{
    if(bubble?.isConnected && !matchMedia('(prefers-reduced-motion: reduce)').matches){
     const bounds=bubble.querySelector('footer')?.getBoundingClientRect();
     if(bounds) reactionMovement.current={bubble,bounds};
    }
    setReactionOverrides(previous=>({...previous,[key]:result.reactions}));
   }).catch(reason=>notify(reason.message))
   .finally(()=>pendingReactions.current.delete(key));
 }
 function visibleReactions(message){
  return reactionOverrides[reactionKey(message)] ?? message.reactions ?? [];
 }
 useLayoutEffect(()=>{
  const movement = reactionMovement.current;
  reactionMovement.current = null;
  if (!movement) return;
  const footer = movement.bubble.querySelector('footer');
  if (!footer?.isConnected) return;
  const bounds = footer.getBoundingClientRect();
  const dx = movement.bounds.left-bounds.left;
  const dy = movement.bounds.top-bounds.top;
  if (dx || dy) footer.animate(
   [{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'translate(0,0)'}],
   {duration:210,easing:'cubic-bezier(.23,1,.32,1)'}
  );
 },[reactionOverrides]);
 const active = useRef(null), requesting = useRef(false), field = useRef(null);
 const composerSize = useRef(null);
 const sending = useRef(false);
 const [enteringMessage, setEnteringMessage] = useState(null);
 const [name,,,,,record] = chat;
 const [startedBots,setStartedBots]=useState({});
 const [startingBots,setStartingBots]=useState({});
 const historyCutoff = record?.history_after_id ?? 0;
 const [editing, setEditing] = useState(null);
 const [armed,setArmed]=useState(null);
 const [highlighted,setHighlighted]=useState(null);
 const processedFocus=useRef(null);
 const highlightTimer=useRef(null);
 useEffect(()=>()=>clearTimeout(highlightTimer.current),[]);
 useEffect(()=>{if(pickRequest?.chatId===name)setArmed(name);},[pickRequest,name]);
 useEffect(()=>{
  if(!focus || focus.chatId!==name) return;
  const controller=new AbortController();
  api('/api/messages?'+new URLSearchParams({chat_id:name,around:focus.id}),{signal:controller.signal}).then(result=>{
   setMessages(previous=>{
    const merged=new Map((previous[name] ?? []).map(message=>[message.id,message]));
    for(const row of result) {
     if(row.is_deleted) merged.delete(row.id);
     else merged.set(row.id,messageFromServer(row,showSender));
    }
    return {...previous,[name]:[...merged.values()].sort((a,b)=>a.id-b.id)};
   });
  }).catch(reason=>{if(!controller.signal.aborted)notify(reason.message);});
  return ()=>controller.abort();
 },[focus,name,showSender]);
 useEffect(()=>{
  if (!record) return;
  const controller = new AbortController();
  const load = async () => {
   try {
    const result = await api('/api/messages?chat_id='+encodeURIComponent(name),{signal:controller.signal});
    if (!controller.signal.aborted && !removalTimer.current) {
     setHistoryError(previous=>previous?.name===name?null:previous);
     setReactionOverrides(previous=>Object.fromEntries(Object.entries(previous).filter(([key])=>!result.some(row=>key===JSON.stringify([name,row.id]) && !pendingReactions.current.has(key)))));
     setHistoryReady(previous=>previous[name]?previous:{...previous,[name]:true});
     setCanLoadEarlier(previous=>name in previous?previous:{...previous,[name]:result.length>=historyPageSize});
     const rows = result.filter(row=>!row.is_deleted).map(row=>messageFromServer(row,showSender));
     const panel = historyPanel.current;
     if (panel && panel.scrollHeight-panel.clientHeight-panel.scrollTop<40) scrollOnAppend.current=name;
     setMessages(previous=>({...previous,[name]:[
      ...(previous[name] ?? []).filter(message=>message.id>historyCutoff && message.id<(result[0]?.id ?? 0)),...rows,
     ]}));
    }
   } catch (reason) {
    if(!controller.signal.aborted) setHistoryError({name,message:reason.message});
   }
  };
  load();
  return ()=>controller.abort();
 },[name,showSender,revision,historyCutoff]);
 useEffect(()=>{
  if (!record || !historyReady[name]) return;
  try {
   const cache=readHistoryCache();
   delete cache[name];
   cache[name]=(messages[name] || []).filter(message=>message.id>historyCutoff).slice(-30);
   sessionStorage.setItem(historyCacheKey,JSON.stringify(Object.fromEntries(Object.entries(cache).slice(-8))));
  } catch {}
 },[name,messages,historyReady,historyCutoff,Boolean(record)]);
 const reactionKey = message => JSON.stringify([name,message.id]);
 const {text='',file=null,error:composeError=''} = drafts[name] ?? {};
 const history = historyCutoff ? (messages[name] ?? emptyHistory).filter(message=>message.id>historyCutoff) : messages[name] ?? emptyHistory;
 const showBotStart=record?.is_bot && !record.bot_started && !startedBots[name] && canWrite && historyReady[name] && !history.length;
 useEffect(()=>{
  if (!inlineAction || inlineAction.chat!==name) return;
  const message=history.find(item=>item.id===inlineAction.id);
  if (message && JSON.stringify([message.text,message.keyboard])!==inlineAction.moment) setInlineAction(null);
 },[inlineAction,history,name]);
 useEffect(()=>{
  if(!inlineAction) return;
  const timer=setTimeout(()=>setInlineAction(current=>current===inlineAction?null:current),5000);
  return ()=>clearTimeout(timer);
 },[inlineAction]);
 async function runInline(message,item) {
  if (inlineAction?.chat===name && inlineAction.id===message.id) return;
  const action={chat:name,id:message.id,data:item.callback_data,moment:JSON.stringify([message.text,message.keyboard])};
  setInlineAction(action);
  try {
   const result=await api('/api/bot/callback',{method:'POST',json:{chat_id:Number(name),message_id:message.id,data:item.callback_data}});
   if (!result.ok) throw new Error('Бот не выполнил действие.');
  } catch (error) {
   setInlineAction(current=>current===action?null:current);
   notify(error.message);
  }
 }
 async function loadEarlier() {
  if (loadingEarlier || !history.length) return;
  setLoadingEarlier(true);
  try {
   const result = await api('/api/messages?chat_id='+encodeURIComponent(name)+'&first_id='+history[0].id);
   const panel = historyPanel.current;
   if (panel?.dataset.historyChat===name) scrollAnchor.current={name,height:panel.scrollHeight,top:panel.scrollTop};
   setMessages(previous=>({...previous,[name]:[
    ...result.filter(row=>!row.is_deleted).map(row=>messageFromServer(row,showSender)),...(previous[name] ?? []),
   ]}));
   setCanLoadEarlier(previous=>({...previous,[name]:result.length>=historyPageSize}));
  } catch (error) {notify(error.message);}
  finally {setLoadingEarlier(false);}
 }
 const selectedMessages = history.filter(message=>marked.includes(reactionKey(message)));
 const selectionMode = selectedMessages.length>0 || armed===name;
 const lastSelectionCount = useRef(0);
 useLayoutEffect(()=>{
  if (selectionMode) lastSelectionCount.current = selectedMessages.length;
 },[selectionMode,selectedMessages.length]);
 function toggleMarked(key) {
  setMarked(current=>current.includes(key)?current.filter(item=>item!==key):[...current,key]);
 }
 function clearSelection() {
  setArmed(null);
  const keys = new Set(selectedMessages.map(reactionKey));
  setMarked(current=>current.filter(key=>!keys.has(key)));
 }
 async function copySelection() {
  const transcript = selectedMessages.map(message=>{
   const sender = message.own?(account.name || account.login):message.author ?? record?.name;
   const content = message.text || message.file?.name || 'Голосовое сообщение';
   return '['+clock.format(message.at)+'] '+sender+': '+content;
  }).join('\n');
  if (await copyMessage(transcript)) clearSelection();
 }
 const query = search.trim().toLocaleLowerCase('ru');
 const rows = query ? history.filter(message=>[message.text,message.file?.name].some(value=>value?.toLocaleLowerCase('ru').includes(query))) : history;
 function patch(values) { setDrafts(previous=>({...previous,[name]:{...previous[name],error:'',...values}})); }
 async function startBot() {
  if (startingBots[name]) return;
  setStartingBots(current=>({...current,[name]:true}));
  patch({error:''});
  try {
   await api('/api/bot/start/'+encodeURIComponent(name),{method:'POST'});
   setStartedBots(current=>({...current,[name]:true}));
   await onUpdated();
  } catch(reason) {patch({error:reason.message});}
  finally {setStartingBots(current=>({...current,[name]:false}));}
 }
 async function append(values, destination=chat) {
  const [target,,,,,targetChat] = destination;
  const created = await sendToChat(target,values);
  const result = await api('/api/messages?chat_id='+encodeURIComponent(target)).catch(()=>null);
  const rows = result?.filter(row=>!row.is_deleted).map(row=>messageFromServer(row,!targetChat.target_user_id && targetChat.chat_type!=='channel'));
  if (target===name) {
   scrollOnAppend.current = target;
   if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setEnteringMessage(created.ids?.at(-1) ?? null);
  }
  if (rows) setMessages(previous=>({...previous,[target]:[
   ...(previous[target] ?? []).filter(message=>message.id<(rows[0]?.id ?? 0)),...rows,
  ]}));
  onUpdated();
  return created;
 }
 async function send() {
  if (!canWrite || recording || sending.current || (!text.trim() && !file)) return;
  sending.current = true;
  patch({error:''});
  const localId='pending-'+crypto.randomUUID();
  const pending={id:localId,own:true,at:Date.now(),text:text.trim(),file:file?{name:file.name}:null,pending:true};
  const isEdit=editing?.name===name;
  if(!isEdit){
   scrollOnAppend.current=name;
   setOutbox(current=>({...current,[name]:pending}));
   patch({text:'',file:null});
  }
  try {
   if (isEdit) {
    await api('/api/messages/'+editing.message.id,{method:'PUT',json:{content:text.trim()}});
    setMessages(previous=>({...previous,[name]:history.map(message=>message.id===editing.message.id?{...message,text:text.trim(),edited:true}:message)}));
    setEditing(null);
    onUpdated();
   } else {
    await append({text:text.trim(),file,replyId:reply?.name===name?reply.message.id:null});
   }
   setReply(null);
   if(isEdit)patch({text:'',file:null});
   field.current?.focus();
  } catch (error) {
   setDrafts(current=>({...current,[name]:{...current[name],...(!isEdit && !current[name]?.text && !current[name]?.file?{text,file}:{}),error:error.message}}));
  } finally {
   if(!isEdit)setOutbox(current=>{const next={...current};delete next[name];return next;});
   sending.current = false;
  }
 }
 useLayoutEffect(()=>{
  const input = field.current;
  if (!input || selectionMode) {
   composerSize.current = null;
   return;
  }
  const measure = () => {
   const previous = composerSize.current;
   const start = input.getBoundingClientRect().height;
   previous?.animation?.cancel();
   input.style.height = '0px';
   const height = Math.min(input.scrollHeight,132);
   input.style.height = height+'px';
   const animation = previous?.input===input && previous.name===name && Math.abs(start-height)>1 && !matchMedia('(prefers-reduced-motion: reduce)').matches
    ? input.animate([{height:start+'px'},{height:height+'px'}],{duration:145,easing:'ease-out'})
    : null;
   composerSize.current = {input,animation,name};
  };
  measure();
  const observer = new ResizeObserver(entries=>{
   const width = entries[0].contentRect.width;
   if (width === composerSize.current?.width) return;
   measure();
   composerSize.current.width = width;
  });
  composerSize.current.width = input.parentElement.getBoundingClientRect().width;
  observer.observe(input.parentElement);
  return ()=>observer.disconnect();
 },[text,name,selectionMode]);
 useLayoutEffect(()=>{
  const panel = historyPanel.current;
  const top = topDock.current;
  const bottom = bottomDock.current;
  function updateInsets() {
   const atEnd = panel.scrollHeight-panel.clientHeight-panel.scrollTop<12;
   panel.style.setProperty('--history-top',(top.offsetHeight+top.offsetTop)+'px');
   panel.style.setProperty('--history-bottom',(panel.parentElement.clientHeight-bottom.offsetTop)+'px');
   if (atEnd) scrollLatest();
   updateLatest();
  }
  updateInsets();
  scrollLatest();
  updateLatest();
  const observer = new ResizeObserver(updateInsets);
  observer.observe(panel);
  observer.observe(top);
  observer.observe(bottom);
  return ()=>observer.disconnect();
 },[name]);
 useLayoutEffect(()=>{
  if(focus?.chatId===name && processedFocus.current!==focus){
   const target=historyPanel.current?.querySelector('[data-message-id="'+focus.id+'"]');
   if(target){
    processedFocus.current=focus;
    scrollOnAppend.current=null;
    target.scrollIntoView({block:'center',behavior:'instant'});
    clearTimeout(highlightTimer.current);
    setHighlighted(focus.id);
    highlightTimer.current=setTimeout(()=>setHighlighted(null),2000);
   }
  }
  const anchor = scrollAnchor.current;
  if (anchor?.name===name) {
   const panel = historyPanel.current;
   panel.scrollTop = anchor.top+panel.scrollHeight-anchor.height;
   scrollAnchor.current = null;
  }
  if (scrollOnAppend.current===name) {
   scrollOnAppend.current = null;
   scrollLatest();
  }
  updateLatest();
 },[name,messages,search,focus]);
 useEffect(()=>()=>{if(active.current?.state==='recording') active.current.stop();},[]);
 async function voice() {
  if (active.current?.state==='recording') { active.current.stop(); return; }
  if (requesting.current) return;
  requesting.current=true;
  let stream;
  try {
   stream=await navigator.mediaDevices.getUserMedia({audio:true});
   const recorder=new MediaRecorder(stream);
   const chunks=[];
   recorder.ondataavailable=event=>{if(event.data.size) chunks.push(event.data);};
   recorder.onstop=()=>{
    stream.getTracks().forEach(track=>track.stop());
    active.current=null;
    setRecording(false);
    if(chunks.length) append({audio:new Blob(chunks,{type:recorder.mimeType})}).catch(error=>patch({error:error.message}));
   };
   recorder.start();
   active.current=recorder;
   setRecording(true);
  } catch {
   stream?.getTracks().forEach(track=>track.stop());
   patch({error:'Нет доступа к микрофону. Разрешите его использование в браузере.'});
  } finally { requesting.current=false; }
 }
 function openMessageMenu(event,message) {
  event.preventDefault();
  const text=message.text ?? message.file?.name ?? 'Голосовое сообщение';
  const key = reactionKey(message);
  const bubble = event.currentTarget;
  const bounds = bubble.getBoundingClientRect();
  const position = {x:event.clientX || bounds.left,y:event.clientY || bounds.bottom};
  const link = new URL(appPath('/chat'),location.origin);
  link.search = new URLSearchParams({chat:name,message:message.id});
  const actions=[
   ...(canWrite?[['reply','Ответить',()=>{setReply({name,message});field.current?.focus();}]]:[]),
   ...(canWrite && message.own && !message.file && !message.audio?[['edit','Изменить',()=>{setEditing({name,message});patch({text:message.text});field.current?.focus();}]]:[]),
   ...(!record?.protected?[['copy','Копировать текст',()=>copyMessage(text)]]:[]),
   ...(!record?.protected?[['link','Копировать ссылку',()=>copyMessage(link.href)]]:[]),
   ...(!channel?[['pin',pinned?.message.id===message.id && pinned.name===name?'Открепить':'Закрепить',()=>setPinned(current=>current?.name===name && current.message.id===message.id?null:{name,message})]]:[]),
   ...(!record?.protected && forwardTargets.length?[['forward','Переслать',()=>setMenu({...position,actions:forwardTargets.map(target=>['forward',target[5].name,()=>append({text:message.text,file:message.file,audio:message.audio,forwarded:record.name,forwardFrom:message.id},target).catch(error=>notify(error.message))])})]]:[]),
   ['select',marked.includes(key)?'Снять выделение':'Выбрать',()=>toggleMarked(key)],
   ...(!dissolving && (message.own || record?.target_user_id || record?.permissions?.includes('moderate'))?[['delete','Удалить',()=>setPendingRemoval([{key,message,bubble}])]]:[]),
  ];
  const choices=record?.reactions_mode==='none'?[]:record?.reactions_mode==='selected'?record.allowed_reactions:reactionChoices;
  setMenu({...position,actions,messageKey:key,reactionChoices:choices,react:choices?.length?emoji=>toggleReaction(message,emoji,bubble):null});
 }
 function forwardSelection(event) {
  const anchor = event.currentTarget.getBoundingClientRect();
  setMenu({x:anchor.left,y:anchor.top,actions:forwardTargets.map(target=>['forward',target[5].name,async()=>{
   try {
    for (const message of selectedMessages) await append({text:message.text,file:message.file,audio:message.audio,forwarded:record.name,forwardFrom:message.id},target);
    clearSelection();
   } catch (error) { notify(error.message); }
  }])});
 }
 function removeSelected() {
  const bubbles = new Map([...historyPanel.current.querySelectorAll('[data-message-id]')].map(bubble=>[bubble.dataset.messageId,bubble]));
  setPendingRemoval(selectedMessages.map(message=>({key:reactionKey(message),message,bubble:bubbles.get(String(message.id))})));
 }
 async function removeMessage() {
  const candidates = pendingRemoval;
  setPendingRemoval(null);
  removalTimer.current = true;
  const results = await Promise.allSettled(candidates.map(({message})=>api('/api/messages/'+message.id,{method:'DELETE'})));
  const removals = candidates.filter((_,index)=>results[index].status==='fulfilled');
  if (removals.length!==candidates.length) notify('Не удалось удалить часть сообщений');
  if (!removals.length) { removalTimer.current=null; return; }
  const ids = new Set(removals.map(({message})=>message.id));
  const keys = new Set(removals.map(({key})=>key));
  setPendingRemoval(null);
  const finish = () => {
   setMessages(previous=>({...previous,[name]:(previous[name] ?? history).filter(row=>!ids.has(row.id))}));
   setPinned(current=>current?.name===name && ids.has(current.message.id)?null:current);
   setReply(current=>current?.name===name && ids.has(current.message.id)?null:current);
   setMarked(current=>current.filter(key=>!keys.has(key)));
   setDissolving(null);
   removalTimer.current=null;
   onUpdated();
  };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
   finish();
   return;
  }
  const effects = new Map();
  for (const {key,message,bubble} of removals) {
   const row = bubble?.closest('.message-row');
   const wrapper = row?.closest('.message-slot');
   if (!wrapper?.isConnected) continue;
   const origin = row.getBoundingClientRect();
   const avatar = row.querySelector('.sender-avatar');
   const particles = [bubble,avatar].filter(Boolean).flatMap((element,index)=>{
    const rect = element.getBoundingClientRect();
    return Array.from({length:index===0?100:32},()=>({
     '--x':(rect.left-origin.left+Math.random()*rect.width)+'px',
     '--y':(rect.top-origin.top+Math.random()*rect.height)+'px',
     '--dx':(14+Math.random()*53)+'px', '--dy':(Math.random()*65-45)+'px',
     '--delay':Math.random()*100+'ms', '--size':(1.5+Math.random()*3.4)+'px',
     '--particle-color':index===0?(message.own?'#789f86':'#78817b'):'#a9b6ad',
    }));
   });
   effects.set(key,{particles,height:wrapper.getBoundingClientRect().height});
  }
  if (!effects.size) {
   finish();
   return;
  }
  setDissolving(effects);
  removalTimer.current = setTimeout(finish,480);
 }
 const mode=recording?'stop':text.trim()||file?'send':'mic';
 return <>
  <div ref={topDock} className="conversation-dock conversation-dock-top">
   {header}
  {!channel && pinned?.name===name && <button className="chat-note" onClick={()=>setPinned(null)}>⌖ {pinned.message.text ?? 'Вложение'} · ×</button>}
  </div>
  <div key={name} ref={historyPanel} data-history-chat={name} className="message-history" onScroll={updateLatest} aria-label="История сообщений">
   {!query && canLoadEarlier[name] && <button className="chat-note history-load-more" type="button" disabled={loadingEarlier} onClick={loadEarlier}>{loadingEarlier?'Загрузка…':'Загрузить предыдущие сообщения'}</button>}
   {!rows.length && historyError?.name===name && <FormError className="history-error" message={historyError.message===connectionMessage?historyError.message:'Не удалось загрузить сообщения. '+historyError.message}/>}
   {record && !historyReady[name] && !rows.length && historyError?.name!==name && <div className="chat-skeleton" role="status" aria-label="Загрузка сообщений…"><i/><i/><i/></div>}
   {historyReady[name] && !rows.length && historyError?.name!==name && <div className="message-date">{query?'Ничего не найдено':'Нет сообщений'}</div>}
   {(outbox[name] && !query?[...rows,outbox[name]]:rows).map((message,index)=>{
    const key = reactionKey(message);
    const isSelected = marked.includes(key);
    const effect = dissolving?.get(key);
    const reactions = visibleReactions(message);
    const compact = !!message.text && !message.text.includes('\n') && !message.file && !message.audio && !reactions.length;
    const metadata = <footer><time dateTime={new Date(message.at).toISOString()}>{clock.format(message.at)}</time>{message.edited && <span className="message-edited" title="Сообщение изменено" aria-label="Сообщение изменено"><PanelIcon name="edit"/></span>}{message.pending?<span aria-label="Отправляется"><PanelIcon name="schedule"/></span>:message.own && <Icon name={message.read?'check':'tick'}/>}</footer>;
    const newDay=!index || dayKey.format(message.at)!==dayKey.format(rows[index-1].at);
    const onlyMessageToday = newDay && (!rows[index+1] || dayKey.format(message.at)!==dayKey.format(rows[index+1].at));
    const date = <div className="message-date">{dayKey.format(message.at)===dayKey.format(Date.now())?'Сегодня':dateLabel.format(message.at)}</div>;
    return <React.Fragment key={message.id}>
     {newDay && !onlyMessageToday && date}
     <div className={'message-slot'+(effect?' collapsing':'')} style={effect?{'--slot-height':effect.height+'px'}:undefined}>
     {onlyMessageToday && date}
     <div className={'message-row'+(message.own?' outgoing':'')+(isSelected?' selected-message':'')+(menu?.messageKey===key?' context-message':'')+(effect?' row-dissolving':'')+(highlighted===message.id?' search-highlight':'')+(selectionMode?' selection-enabled':'')}
      onClick={selectionMode?event=>{if(!event.target.closest('button,audio,a')) toggleMarked(key);}:undefined}>
     <button type="button" className="message-selection" inert={!selectionMode} aria-hidden={!selectionMode || undefined} aria-pressed={isSelected} aria-label={isSelected?'Снять выделение сообщения':'Выбрать сообщение'} onClick={()=>toggleMarked(key)}><Icon name="tick"/></button>
     {message.sender && <button className="sender-avatar sender-link" type="button" aria-label={'Профиль '+message.sender} onClick={()=>onOpenAuthor(message)}><Portrait src={message.avatar} name={message.sender}/></button>}
     <article data-message-id={message.id} className={'bubble'+(message.own?' own':'')+(effect?' dissolving':'')+(enteringMessage===message.id || message.pending?' entering':'')} onContextMenu={message.pending?undefined:event=>openMessageMenu(event,message)}
      onAnimationEnd={event=>{if(event.target===event.currentTarget && event.animationName==='message-arrive') setEnteringMessage(current=>current===message.id?null:current);}}>
      {message.forwarded && <div className="forwarded-label">Переслано из «{message.forwarded}»</div>}
      {message.quote && <blockquote>{message.quote}</blockquote>}
      {showSender && !message.own && <button type="button" className="sender-name sender-link" onClick={()=>onOpenAuthor(message)}>{message.sender || message.author}</button>}
      {compact ? <div className="bubble-inline"><span className="bubble-copy">{message.text}</span>{metadata}</div> : message.text && <div className="bubble-copy">{message.text}</div>}
      {message.file && <div className="bubble-file"><Icon name="clip"/>{message.file.url?<a href={message.file.url} download>{message.file.name}</a>:message.file.name}</div>}
      {message.audio && <audio controls src={message.audio}/>}
      {Array.isArray(message.keyboard) && <div className="bot-actions" aria-busy={inlineAction?.chat===name && inlineAction.id===message.id}>{message.keyboard.map((row,rowIndex)=>Array.isArray(row) && <div key={rowIndex}>{row.map((item,index)=>{
       if (!item || typeof item.text!=='string') return null;
       if (typeof item.url==='string' && /^https?:\/\//i.test(item.url)) return <a key={index} href={item.url} target="_blank" rel="noopener noreferrer">{item.text}</a>;
       if (item.callback_data==null) return null;
       const pending=inlineAction?.chat===name && inlineAction.id===message.id;
       return <button key={index} type="button" disabled={pending || !canWrite} className={pending && inlineAction.data===item.callback_data?'inline-working':undefined} onClick={()=>runInline(message,item)}>{item.text}</button>;
      })}</div>)}</div>}
      {reactions.length ? <div className="bubble-reaction-line">
       <div className="bubble-reaction-buttons">{reactions.map(item=><button type="button" key={item.emoji} className={'message-reaction'+(channel?' channel-reaction':'')} aria-pressed={item.own} aria-label={item.emoji+', всего '+item.count}
        onClick={event=>toggleReaction(message,item.emoji,event.currentTarget.closest('.bubble'))}>
        <span>{item.emoji}</span>{!channel && item.own && item.count===1?<span className="reaction-author" aria-hidden="true">Я</span>:<span className="reaction-count">{item.count}</span>}
       </button>)}</div>
       {metadata}
      </div> : !compact && metadata}
     </article>
      {effect && <span className="message-particles" aria-hidden="true">{effect.particles.map((style,index)=><i key={index} style={style}/>)}</span>}
     </div></div>
    </React.Fragment>;
   })}
  </div>
  <div ref={bottomDock} className="conversation-dock conversation-dock-bottom">
  {!selectionMode && canWrite && <FormError id={composeErrorId} className="composer-error" message={composeError}/>}
  {editing?.name===name && <button className="chat-note" onClick={()=>{setEditing(null);patch({text:'',file:null});}}>Редактирование · ×</button>}
  {reply?.name===name && <button className="chat-note" onClick={()=>setReply(null)}>↩ {reply.message.text ?? "Вложение"} · ×</button>}
  <div className={'composer-stack'+(selectionMode?' is-selecting':'')}>
  <div className="composer selection-bar" inert={!selectionMode} aria-hidden={!selectionMode || undefined} role="group" aria-label="Действия с выбранными сообщениями">
   <div className="selection-actions">
    <button type="button" className="composer-action selection-delete" aria-label="Удалить выбранные сообщения" disabled={!selectedMessages.length || !!dissolving || selectedMessages.some(message=>!message.own && !record?.target_user_id && !record?.permissions?.includes('moderate'))} onClick={removeSelected}><Icon name="delete"/></button>
    <button type="button" className="composer-action" aria-label="Снять выделение со всех сообщений" onClick={clearSelection}><Icon name="close"/></button>
   </div>
   <span className="selection-count" role="status">Выбрано: {selectionMode?selectedMessages.length:lastSelectionCount.current}</span>
   <div className="selection-actions">
    <button type="button" className="composer-action" aria-label="Копировать выбранные сообщения" disabled={!selectedMessages.length || !!record?.protected} onClick={copySelection}><Icon name="copy"/></button>
    <button type="button" className="composer-action" aria-label="Переслать выбранные сообщения" disabled={!selectedMessages.length || !forwardTargets.length || !!record?.protected} onClick={forwardSelection}><Icon name="forward"/></button>
   </div>
  </div>
  <div inert={selectionMode} aria-hidden={selectionMode || undefined} className={'composer standard-composer'+(channel && !canWrite?' channel-composer channel-readonly':'')}>
   {showLatest && <button type="button" className="scroll-latest" aria-label="К последнему сообщению" onClick={()=>scrollLatest(true)}>
    <OutlineIcon name="down"/>
   </button>}
   {showBotStart ? <button type="button" className="channel-alert bot-start" disabled={startingBots[name]} onClick={startBot}><PanelIcon name="arrow_forward"/>{startingBots[name]?'Запускаем…':'Запустить бота'}</button> : !canWrite && !channel ? <p className="composer-restricted">{record?.peer_blocked?'Снимите блокировку, чтобы снова писать.':'Отправка сообщений недоступна'}</p> : !canWrite && channel ? <button type="button" className="channel-alert" aria-pressed={notificationsEnabled} onClick={onToggleNotifications}><span className="bell-state" aria-hidden="true"><Icon name="bell"/><i/></span><span className="alert-label"><span className="label-enable">Включить уведомления</span><span className="label-disable">Выключить уведомления</span></span></button> : <>
    <label className="composer-action attachment"><OutlineIcon name="paperclip"/><input type="file" aria-label="Прикрепить файл" onChange={event=>{const file=event.target.files[0]; if(file) patch({file});event.target.value='';}}/></label>
    <div className="compose-field"><span aria-hidden="true" className={'compose-placeholder'+(text?' faded':'')}>{recording?'Идёт запись…':'Сообщение'}</span><textarea ref={field} className="message-input" rows={1} aria-label="Сообщение" aria-describedby={composeError?composeErrorId:undefined} value={text} onChange={event=>patch({text:event.target.value})} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.nativeEvent.isComposing && (enterToSend || event.ctrlKey || event.metaKey)){event.preventDefault();if(!recording)send();}}}/></div>
    {file && <button type="button" className="attached-file" title="Убрать файл" onClick={()=>patch({file:null})}>{file.name} ×</button>}
    <button type="button" className="composer-action" aria-label="Добавить смайлик" onClick={()=>{patch({text:text+' 🙂'});field.current?.focus();}}><OutlineIcon name="smile"/></button>
    <button type="button" className={'composer-action primary-action '+mode} aria-label={{mic:'Записать голосовое',stop:'Завершить запись',send:'Отправить'}[mode]} onClick={mode==='send'?send:voice}><span key={mode}><OutlineIcon name={mode}/></span></button>
   </>}
  </div>
  </div>
  </div>
  {pendingRemoval && <ChatRemovalDialog kind="message" count={pendingRemoval.length} allowBoth={false} onClose={()=>setPendingRemoval(null)} onConfirm={removeMessage}/>}
  <ContextMenu menu={menu} close={()=>setMenu(null)}/>
 </>;
}



