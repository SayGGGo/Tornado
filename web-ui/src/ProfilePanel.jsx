import React,{useEffect,useState} from 'react';
import {api,appPath,account,presenceLabel,cachedPanel,fetchPanel} from './api.js';
import ChatSetup from './ChatSetup.jsx';
import ChatDetails,{chatDetailViews,DetailRow,MediaTabs} from './ChatDetails.jsx';
import {AvatarPicker,FloatingField,FormError,PanelFooter,PanelIcon,PanelSection,PanelSwitch,Portrait,Loader} from './panelControls.jsx';
import DeveloperPanel from './DeveloperPanel.jsx';
import {NotificationSettings,PrivacySettings} from './SettingsPages.jsx';
import {VerifiedBadge} from './OutlineIcon.jsx';

const titles={'new-chat':'Новое сообщение','new-group':'Добавить участников','new-channel':'Создать канал',
 invite:'Добавить участников',self:'Мой профиль',edit:'Изменить профиль',peer:'Информация',chat:'О чате',
 'chat-edit':'Изменить','chat-type':'Тип чата','chat-discussion':'Обсуждение','chat-reactions':'Реакции',
 'chat-members':'Участники','chat-admin-pick':'Выбрать администратора','chat-admin-rights':'Права администратора','chat-admin-review':'Проверить права','chat-admins':'Администраторы','chat-blocked':'Чёрный список','chat-requests':'Заявки на вступление',
 settings:'Настройки',developer:'API-кабинет',display:'Отображение',privacy:'Конфиденциальность',shortcuts:'Набор сообщений',notifications:'Уведомления',logout:'Выход из аккаунта',qr:'QR-код',join:'Вступить в канал'};
const setupViews=['new-chat','new-group','new-channel','invite'];
function UsernameDialog({name,collectible,source,onClose}) {
 const dialog=React.useRef(null);
 const timer=React.useRef(null);
 const [closing,setClosing]=useState(false);
 const [copied,setCopied]=useState(false);
 const [copyError,setCopyError]=useState('');
 const link=new URL(appPath('/t/'+encodeURIComponent(name)),location.origin).href;
 React.useLayoutEffect(()=>{
  const element=dialog.current;
  element.showModal();
  const title=element.querySelector('h2');
  const from=source?.getBoundingClientRect();
  const to=title.getBoundingClientRect();
  const animate=from && from.width && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(animate){
   source.classList.add('username-in-flight');
   title.animate([{transform:'translate('+(from.left-to.left)+'px,'+(from.top-to.top)+'px) scale('+Math.max(.5,from.width/to.width)+')'},{transform:'none'}],{duration:430,easing:'cubic-bezier(.22,1,.36,1)'});
  }
  return ()=>{clearTimeout(timer.current);source?.classList.remove('username-in-flight');element.close();};
 },[]);
 function close() {
  if(timer.current!==null)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){onClose();return;}
  setClosing(true);
  timer.current=setTimeout(onClose,180);
 }
 return <dialog ref={dialog} className={'username-dialog'+(source?' username-flight':'')+(closing?' closing':'')} aria-labelledby="username-title" onCancel={event=>{event.preventDefault();close();}} onClick={event=>{if(event.target===event.currentTarget)close();}}>
  <div className="username-dialog-body">
   <button type="button" className="header-action username-close" aria-label="Закрыть" onClick={close}><PanelIcon name="close"/></button>
   <div className="username-heading">
    <span className="username-emblem"><PanelIcon name={collectible?'favorite':'alternate_email'}/></span>
    <div><h2 id="username-title">@{name}</h2><span>{collectible?'Коллекционное имя':'Имя пользователя'}</span></div>
   </div>
   <p>{collectible?'Это имя закреплено за владельцем. Коллекционные имена недоступны при регистрации и смене обычного имени.':'По имени пользователя можно найти профиль и открыть переписку в Tornado.'}</p>
   <FormError message={copyError}/>
   <button type="button" className="access-save" onClick={async()=>{
    try {await navigator.clipboard.writeText(link);setCopied(true);setCopyError('');}
    catch {setCopyError('Не удалось скопировать ссылку. Проверьте разрешения браузера.');}
   }}><PanelIcon name={copied?'check':'content_copy'}/>{copied?'Ссылка скопирована':'Копировать ссылку'}</button>
  </div>
 </dialog>;
}
function editDraft(profile) {
 const [first,...rest]=(profile.name || '').trim().split(/\s+/);
 return {first,last:rest.join(' '),bio:profile.bio || '',login:profile.login};
}
export default function ProfilePanel({page,setPage,profile,setProfile,onOpenChat,onUpdated,groups,notifications,notificationEnabled,onToggleNotifications,preferences,changePreference,blocked}) {
 const [draft,setDraft]=useState(null);
 const [error,setError]=useState('');
 const [fieldError,setFieldError]=useState(null);
 const [saving,setSaving]=useState(false);
 const [peer,setPeer]=useState(null);
 const [portraitOpen,setPortraitOpen]=useState(false);
 const [usernameDialog,setUsernameDialog]=useState(null);
 const [ordering,setOrdering]=useState(false);
 const [qrReady,setQrReady]=useState(false);
 const view=page?.view;
 useEffect(()=>{
  setError('');
  setPortraitOpen(false);
  setUsernameDialog(null);
  setQrReady(false);
  setFieldError(null);
  if(view!=='peer') return;
  const controller=new AbortController();
  const path='/api/user/'+page.id;
  setPeer(cachedPanel(path) ?? null);
  fetchPanel(path,controller.signal).then(result=>{if(!controller.signal.aborted)setPeer(result);}).catch(reason=>{if(!controller.signal.aborted)setError(reason.message);});
  return ()=>controller.abort();
 },[view,page?.id]);
 useEffect(()=>{
  if(view!=='join' || !page?.alias || page.id) return;
  const controller=new AbortController();
  fetchPanel('/api/chats/by-alias/'+encodeURIComponent(page.alias),controller.signal).then(result=>{
   if(!controller.signal.aborted) setPage({...page,...result});
  }).catch(reason=>{if(!controller.signal.aborted)setError(reason.message);});
  return ()=>controller.abort();
 },[view,page?.alias,page?.id,setPage]);
 if(!page) return null;
 const details=chatDetailViews.includes(view);
 const setup=setupViews.includes(view);
 const editing=view==='edit';
 const own=view==='self' || view==='settings';
 const info=own?profile:view==='peer'?peer:null;
 const usernames=info?.usernames || (info?[{name:info.handle || info.login,collectible:info.collectible_handle}]:[]);
 const showingProfile=own || view==='peer';
 const openQr=()=>setPage({view:'qr',id:own?profile.id:page.id,name:info?.login,handle:info?.handle || info?.login,back:page});
 const qrUrl=appPath(page.qrUrl || '/api/user/'+page.id+'/qr');
 const previous = page.back || (view==='new-group' && page.step===2?{...page,step:1}:
  ['notifications','logout','display','shortcuts','privacy','developer'].includes(view)?{view:'settings'}:
  details && view!=='chat'?{...page,view:['chat-type','chat-discussion','chat-reactions','chat-admins','chat-blocked','chat-requests'].includes(view)?'chat-edit':'chat'}:null);
 const heading=view==='new-group' && page.step===2?'Создать группу':page.kind==='channel'?
  ({chat:'О канале','chat-type':'Тип канала','chat-members':'Подписчики'}[view] || titles[view]):view==='chat'?'О группе':titles[view];
 function update(key,value) {
  setDraft(current=>({...current,[key]:value}));
  const field=['first','last'].includes(key)?'fio':key;
  setFieldError(current=>current?.field===field?null:current);
 }
 function edit() {setDraft(editDraft(profile));setPage({view:'edit',back:page});}
 async function save(event) {
  event.preventDefault();
  setError('');setFieldError(null);
  if(!draft.first.trim()){setFieldError({field:'fio',message:'Введите имя.'});return;}
  setSaving(true);
  try {
   const result=await api('/api/user/profile',{method:'POST',json:{fio:[draft.first,draft.last].map(value=>value.trim()).filter(Boolean).join(' '),login:draft.login.trim(),bio:draft.bio,...(draft.avatar?{avatar:draft.avatar}:{})}});
   setProfile({...profile,name:result.fio,login:result.login,handle:result.handle,usernames:result.usernames,bio:result.bio,avatar:result.avatar});
   setPage(previous || {view:'self'});
  } catch(reason){if(reason.field)setFieldError(reason);else setError(reason.message);}
  finally{setSaving(false);}
 }
 async function moveUsername(index,direction) {
  if(ordering)return;
  const order=usernames.map(entry=>entry.name);
  [order[index],order[index+direction]]=[order[index+direction],order[index]];
  setOrdering(true);
  try {const result=await api('/api/user/profile/username-order',{method:'PUT',json:{order}});setProfile(current=>({...current,usernames:result.usernames}));}
  catch(reason){setError(reason.message);}
  finally{setOrdering(false);}
 }
 async function changeAvatar(file) {
  if(file.size>10*1024*1024 || !['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)){setFieldError({field:'avatar',message:'Выберите фото JPG, PNG, WebP или GIF размером до 10 МБ.'});return;}
  if(file.type!=='image/gif' && typeof createImageBitmap==='function'){
   try{
    const image=await createImageBitmap(file);
    const ratio=Math.min(1,384/Math.max(image.width,image.height));
    const canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(image.width*ratio));
    canvas.height=Math.max(1,Math.round(image.height*ratio));
    canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
    image.close();
    const preview=canvas.toDataURL('image/webp',.86);
    if(preview.length<file.size*4/3){update('avatar',preview);return;}
   }catch{}
  }
  const reader=new FileReader();
  reader.addEventListener('load',()=>update('avatar',reader.result));
  reader.readAsDataURL(file);
 }
 async function join() {
  setSaving(true);setError('');
  try {
   const result=await api('/api/chats/join',{method:'POST',json:{chat_id:Number(page.id),token:page.token}});
   if(result.pending) setPage({...page,pending:true});
   else await onOpenChat(page.id,true);
  } catch(reason){setError(reason.message);}
  finally{setSaving(false);}
 }
 return <section className={'profile-sheet'+(editing || setup || details && view!=='chat'?' is-profile-form':'')+(editing?' profile-edit-sheet':'')} aria-label={heading}>
  <header className="profile-sheet-header">
   <button className="header-action" type="button" aria-label={previous?'Назад':'Закрыть'} onClick={()=>setPage(previous)}><PanelIcon name={previous?'arrow_back':'close'}/></button>
   <strong>{heading}</strong>
   {showingProfile && info && <button className="header-action profile-qr-action" type="button" aria-label="Открыть QR-код" title="QR-код" onClick={openQr}><PanelIcon name="qr_code_2"/></button>}
   {own && <button className="header-action" type="button" aria-label="Изменить профиль" onClick={edit}><PanelIcon name="edit"/></button>}
   {view==='chat' && (page.owner || page.manage) && <button className="header-action" type="button" aria-label="Изменить чат" onClick={()=>setPage({...page,view:'chat-edit',back:page})}><PanelIcon name="edit"/></button>}
  </header>
  <div key={view+':'+(page.id || '')} className={'profile-sheet-scroll'+(editing?'':' panel-section-enter')}>
   {view==='peer' && !info && !error && <div className="profile-loading" role="status" aria-label="Загрузка профиля"><i/><i/><i/></div>}
   {showingProfile && (info || view!=='peer') && <>
    <div className={'profile-cover'+(own?' own-profile-cover':' chat-detail-cover')+(view==='settings'?' settings-cover':'')}>
     <button type="button" className="portrait-preview" aria-label="Увеличить фото профиля" onClick={()=>setPortraitOpen(true)}><Portrait name={info?.name || info?.fio || page.name || info?.login} src={info?.avatar || page.avatar}/></button>
     <strong>{info?.name || info?.fio || page.name || info?.login}<VerifiedBadge visible={info?.verified}/></strong><small>{own?'в сети':presenceLabel(peer)}</small>
    </div>
    {info && view!=='settings' && <div className="access-settings"><PanelSection title="Данные профиля">
     {usernames.map(({name,collectible},index)=><DetailRow key={name} icon="alternate_email" tone="blue" title={<button type="button" className="profile-username" onClick={event=>setUsernameDialog({name,collectible,source:event.currentTarget})}>@{name}</button>} detail={collectible?'Коллекционное имя':'Имя пользователя'}>
      {index===0 && <button type="button" className="header-action profile-qr-action" aria-label="Открыть QR-код профиля" onClick={openQr}><PanelIcon name="qr_code_2"/></button>}
      {own && usernames.length>1 && <div className="username-order">
       <button type="button" className="header-action" aria-label={'Поднять @'+name} disabled={ordering || index===0} onClick={()=>moveUsername(index,-1)}><PanelIcon name="send"/></button>
       <button type="button" className="header-action" aria-label={'Опустить @'+name} disabled={ordering || index===usernames.length-1} onClick={()=>moveUsername(index,1)}><PanelIcon name="down"/></button>
      </div>}
     </DetailRow>)}
     {info.bio && <DetailRow icon="info" title={info.bio} detail="О себе"/>}
     {view==='peer' && page.chatId && <DetailRow icon="notifications" tone="coral" title="Уведомления" onClick={()=>onToggleNotifications(page.chatId)}><span className={'panel-switch'+(notificationEnabled(page.chatId)?' enabled':'')}/></DetailRow>}
     {view==='peer' && <DetailRow icon="chat_bubble" tone="green" title="Написать сообщение" onClick={async()=>{
      try{const result=await api('/api/chats/get_or_create',{method:'POST',json:{target_user_id:Number(page.id)}});await onOpenChat(result.chat_id);}
      catch(reason){setError(reason.message);}
     }}/>}
    </PanelSection>
    {own && <PanelSection title="Для разработчиков"><DetailRow icon="code" tone="green" title="API-кабинет" detail="Приложения, OAuth и токены" onClick={()=>setPage({view:'developer',back:page})}/></PanelSection>}
    </div>}
    {view==='peer' && <MediaTabs chatId={page.chatId}/>}
   </>}
   <FormError message={error}/>
   {setup && <ChatSetup page={page} setPage={setPage} onDone={onOpenChat}/>}
   {editing && draft && <form className="profile-editor panel-flow" onSubmit={save}>
    <AvatarPicker avatar={draft.avatar || profile.avatar} onChange={changeAvatar}/>
    <FormError message={fieldError?.field==='avatar'?fieldError.message:''}/>
    <div className="access-settings">
    <PanelSection title="Личные данные" hint="Описание видно тем, кто открывает ваш профиль."><div className="panel-fields">
     <FloatingField label="Имя (обязательно)" required maxLength={100} error={fieldError?.field==='fio'?fieldError.message:''} value={draft.first} onChange={event=>update('first',event.target.value)}/>
     <FloatingField label="Фамилия" maxLength={100} value={draft.last} onChange={event=>update('last',event.target.value)}/>
     <FloatingField label="О себе" multiline maxLength={200} rows={2} error={fieldError?.field==='bio'?fieldError.message:''} value={draft.bio} onChange={event=>update('bio',event.target.value)}/>
    </div></PanelSection>
    <PanelSection title="Публичный профиль" hint="Это имя используется в поиске и для входа в Tornado."><div className="panel-fields"><FloatingField label="Имя пользователя" required pattern={draft.login===profile.login?undefined:"[A-Za-z][A-Za-z0-9_]{2,49}"} autoCapitalize="none" spellCheck={false} formatError="Начните с латинской буквы. Далее — латинские буквы, цифры или подчёркивания. От 3 до 50 символов." error={fieldError?.field==='login'?fieldError.message:''} value={draft.login} maxLength={50} onChange={event=>update('login',event.target.value)}/></div></PanelSection>
    </div>
    <PanelFooter disabled={saving}>{saving?'Сохраняем…':'Сохранить'}</PanelFooter>
   </form>}
   {details && <ChatDetails page={page} setPage={setPage} groups={groups} onOpenChat={onOpenChat} onUpdated={onUpdated} notifications={notificationEnabled(page.id)} onToggleNotifications={()=>onToggleNotifications(page.id)}/>}
   {view==='settings' && <div className="access-settings">
    <PanelSection title="Аккаунт">
     <DetailRow icon="account_circle" tone="blue" title="Аккаунт" detail="Имя, аватар и описание" onClick={edit}/>
     <DetailRow icon="code" tone="green" title="API-кабинет" detail="Приложения, OAuth и токены" onClick={()=>setPage({view:'developer',back:page})}/>
    </PanelSection>
    <PanelSection title="Приложение">
     <DetailRow icon="notifications" tone="coral" title="Уведомления" detail="Звук, предпросмотр и фоновые уведомления" onClick={()=>setPage({view:'notifications'})}/>
     <DetailRow icon="privacy_tip" tone="green" title="Конфиденциальность" detail="Статус, описание и чёрный список" onClick={()=>setPage({view:'privacy'})}/>
     <DetailRow icon="view_compact_alt" tone="green" title="Отображение" detail="Плотность, анимации и превью" onClick={()=>setPage({view:'display'})}/>
     <DetailRow icon="keyboard" title="Набор сообщений" detail="Поведение клавиши Enter" onClick={()=>setPage({view:'shortcuts'})}/>
    </PanelSection>
    <div className="access-card"><DetailRow icon="logout" tone="coral" title="Выйти из аккаунта" onClick={()=>setPage({view:'logout'})}/></div>
   </div>}
   {view==='display' && <div className="access-settings">
    <PanelSection title="Список чатов">
     <PanelSwitch label="Компактный список" detail="Уменьшить высоту строк чатов" checked={!!preferences.compact} onChange={value=>changePreference('compact',value)}/>
     <PanelSwitch label="Текст последнего сообщения" checked={preferences.previews!==false} onChange={value=>changePreference('previews',value)}/>
    </PanelSection>
    <PanelSection title="Переходы"><PanelSwitch label="Анимации интерфейса" checked={preferences.motion!==false} onChange={value=>changePreference('motion',value)}/></PanelSection>
   </div>}
   {view==='shortcuts' && <div className="access-settings"><PanelSection title="Отправка сообщений" hint="Shift+Enter добавляет новую строку. Ctrl+Enter или ⌘+Enter отправляют сообщение в любом режиме.">
    <PanelSwitch label="Отправлять по Enter" checked={preferences.enterToSend!==false} onChange={value=>changePreference('enterToSend',value)}/>
   </PanelSection></div>}
   {view==='developer' && <DeveloperPanel/>}
   {view==='notifications' && <NotificationSettings preferences={preferences} changePreference={changePreference} notifications={notifications}/>}
   {view==='privacy' && <PrivacySettings profile={profile} setProfile={setProfile} blocked={blocked} onUpdated={onUpdated}/>}
   {view==='logout' && <div className="access-settings"><PanelSection title="Сеанс Tornado" hint="Для возвращения к чатам потребуется снова войти."><a className="access-link-action renewing" href={appPath('/logout')}><PanelIcon name="logout"/>Выйти из аккаунта</a></PanelSection></div>}
   {view==='qr' && <div className="qr-view qr-enter">
    <div className={'qr-card'+(qrReady?' qr-ready':'')}><img src={qrUrl} alt="QR-код" onLoad={()=>setQrReady(true)} onError={()=>setError('Не удалось загрузить QR-код.')}/><strong>@{page.handle}</strong></div>
    <a className="qr-profile-link" href={appPath('/t/'+encodeURIComponent(page.handle))}>{location.host}{appPath('/t/'+page.handle)}</a>
    <button type="button" onClick={async()=>{
     try{const picture=fetch(qrUrl).then(response=>{if(!response.ok) throw new Error();return response.blob();});await navigator.clipboard.write([new ClipboardItem({'image/png':picture})]);}
     catch{setError('Не удалось скопировать изображение.');}
    }}><PanelIcon name="content_copy"/>Копировать QR-код</button>
    <a href={qrUrl} download="tornado-qr.png"><PanelIcon name="download"/>Скачать QR-код</a>
   </div>}
   {view==='join' && <div className="access-settings"><PanelSection title="Приглашение">
    <div className="panel-fields"><strong>{page.name || 'Вступить в чат Tornado'}</strong>
    {page.pending?<p className="access-hint">Заявка отправлена владельцу.</p>:<button className="access-save" type="button" disabled={saving || !page.id} onClick={join}><PanelIcon name="person_add"/>{saving?'Вступаем…':'Вступить'}</button>}</div>
   </PanelSection></div>}
  </div>
  {usernameDialog && <UsernameDialog {...usernameDialog} onClose={()=>setUsernameDialog(null)}/>}
  {portraitOpen && <div className="portrait-overlay" role="dialog" aria-modal="true" aria-label="Фото профиля" onClick={()=>setPortraitOpen(false)} onKeyDown={event=>{if(event.key==='Escape')setPortraitOpen(false);}}>
   <button autoFocus type="button" className="header-action" aria-label="Закрыть фото"><PanelIcon name="close"/></button>
   <Portrait name={info?.name || info?.fio || page.name} src={info?.avatar || page.avatar}/>
  </div>}
 </section>;
}
