import React,{useEffect,useState} from 'react';
import {api,appPath,account,cachedPanel,fetchPanel,participantLabel} from './api.js';
import {AvatarPicker,FloatingField,FormError,PanelFooter,PanelIcon,PanelRadio,PanelSection,PanelSelect,PanelSwitch,Portrait,Loader,uploadChatAvatar} from './panelControls.jsx';
import {reactionChoices} from './ContextMenu.jsx';
import {FilledIcon} from './FilledIcon.jsx';

export const chatDetailViews = ['chat','chat-edit','chat-type','chat-reactions','chat-discussion','chat-members','chat-admins','chat-admin-pick','chat-admin-rights','chat-admin-review','chat-blocked','chat-requests'];
export function DetailRow({icon,tone='slate',title,detail,onClick,children,expanded}) {
 const Element=onClick?'button':'div';
 return <Element className="profile-row detail-row" {...(onClick?{type:'button',onClick,'aria-expanded':expanded}:{})}>
  <i className={'detail-icon '+tone}><FilledIcon name={icon} fallback={<PanelIcon name={icon}/>}/></i><span className="detail-label">{title}{detail!=null && <small>{detail}</small>}</span>{children}
  {onClick && !children && <PanelIcon name="chevron_right"/>}
 </Element>;
}
export function MediaTabs({chatId}) {
 const [tab,setTab]=useState('Медиа');
 const [rows,setRows]=useState(null);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  if(!chatId) return;
  const controller=new AbortController();
  setRows(null);
  setFailed(false);
  fetchPanel('/api/messages?chat_id='+chatId,controller.signal).then(items=>{if(!controller.signal.aborted)setRows(items);})
   .catch(()=>{if(!controller.signal.aborted)setFailed(true);});
  return ()=>controller.abort();
 },[chatId]);
 if(!chatId) return null;
 const results=(rows ?? []).filter(row=>!row.is_deleted).flatMap(row=>{
  if(tab==='Ссылки') return (row.content?.match(/https?:\/\/[^\s<>]+/gi) || []).map(url=>({url,title:url}));
  if(!row.file_url) return [];
  const mime=row.file_type || '';
  const gif=mime==='image/gif';
  const visual=/^(image|video)\//.test(mime);
  if((tab==='Медиа' && visual && !gif) || (tab==='GIF' && gif) || (tab==='Музыка' && mime.startsWith('audio/')) || (tab==='Файлы' && !visual && !mime.startsWith('audio/')))
   return [{url:appPath(row.file_url),title:row.file_name || 'Вложение',image:visual && mime.startsWith('image/')}];
  return [];
 });
 return <>
  <nav className="panel-tabs" aria-label="Вложения чата">{['Медиа','Файлы','Ссылки','Музыка','GIF'].map(name=><button key={name} type="button" aria-pressed={tab===name} onClick={()=>setTab(name)}>{name}</button>)}</nav>
  {failed?<FormError message="Не удалось загрузить вложения."/>:rows===null?<Loader label="Загрузка вложений…"/>:results.length?<div className={'panel-media '+(['Медиа','GIF'].includes(tab)?'panel-media-grid':'')}>{results.map(({url,title,image},index)=><a key={url+index} href={url} target="_blank" rel="noopener noreferrer" title={title}>{image?<img src={url} alt={title}/>:title}</a>)}</div>:<p className="panel-empty">{({Медиа:'Нет медиафайлов',Файлы:'Нет файлов',Ссылки:'Нет ссылок',Музыка:'Нет аудио',GIF:'Нет GIF'})[tab]}</p>}
 </>;
}
export default function ChatDetails({page,setPage,groups,onOpenChat,onUpdated,notifications,onToggleNotifications}) {
 const infoPath='/api/chats/'+page.id+'/info';
 const [record,setRecord]=useState(()=>cachedPanel(infoPath));
 const [loadedId,setLoadedId]=useState(()=>cachedPanel(infoPath)?page.id:null);
 const [draft,setDraft]=useState(()=>cachedPanel(infoPath));
 const [file,setFile]=useState(null);
 const [error,setError]=useState('');
 const [fieldError,setFieldError]=useState(null);
 const [busy,setBusy]=useState(false);
 const [requests,setRequests]=useState(null);
 const [copied,setCopied]=useState(false);
 const [inviteBusy,setInviteBusy]=useState(false);
 const [inviteError,setInviteError]=useState('');
 const inviteInput=React.useRef(null);
 const aliasHintId=React.useId();
 const id=page.id;
 const view=page.view;
 useEffect(()=>{
  const controller=new AbortController();
  setError('');
  setFieldError(null);
  setCopied(false);
  setInviteError('');
  setAdminQuery('');
  if(view==='chat-requests'){
   setRequests(null);
   api('/api/chats/'+id+'/requests',{signal:controller.signal}).then(result=>{if(!controller.signal.aborted)setRequests(result);})
    .catch(reason=>{if(!controller.signal.aborted)setError(reason.message);});
  }
  fetchPanel(infoPath,controller.signal).then(result=>{
   if(controller.signal.aborted) return;
   setRecord(result);setLoadedId(id);setDraft(result);setFile(null);
  }).catch(reason=>{if(!controller.signal.aborted)setError(reason.message);});
  return ()=>controller.abort();
 },[id,view]);
 const data=loadedId===id?record:null;
 const channel=(data?.chat_type ?? page.kind)==='channel';
 const owner=Number(data?.owner_id)===account.id;
 const canManage=owner || data?.permissions?.includes('manage');
 const canInvite=owner || data?.permissions?.includes('invite');
 const canModerate=owner || data?.permissions?.includes('moderate');
 const label=channel?'Подписчики':'Участники';
 const displayed=(data?.participants || []).filter(member=>view==='chat-admins'?['owner','admin'].includes(member.role):view==='chat-blocked'?member.blocked:!member.blocked);
 const go=next=>setPage({...page,view:next,back:page});
 function assign(key,value) {
  setDraft(current=>({...current,[key]:value}));
  setFieldError(current=>current?.field===key || (key==='visibility' && current?.field==='alias') || (key==='reactions_mode' && current?.field==='allowed_reactions')?null:current);
 }
 const errorFor=key=>fieldError?.field===key?fieldError.message:'';
 async function changeRequest(user,accept) {
  try {await api('/api/chats/'+id+'/requests',{method:'POST',json:{user_id:user.id,accept}});setRequests(items=>items.filter(item=>item.id!==user.id));}
  catch(reason){setError(reason.message);}
 }
 async function changeBlock(member) {
  try {
   await api('/api/chats/'+id+'/'+(member.blocked?'unblock':'block')+'/'+member.id,{method:'POST'});
   const result=await api('/api/chats/'+id+'/info');
   setRecord(result);
  } catch(reason){setError(reason.message);}
 }
 async function save(event) {
  event.preventDefault();
  if(busy) return;
  setError('');setFieldError(null);
  if(view==='chat-edit' && !draft.name.trim()){setFieldError({field:'name',message:'Введите название.'});return;}
  if(view==='chat-reactions' && draft.reactions_mode==='selected' && !draft.allowed_reactions.length){
   setFieldError({field:'allowed_reactions',message:'Выберите хотя бы одну реакцию или переключитесь на «Без реакций».'});return;
  }
  setBusy(true);
  try {
   const fields={ 'chat-edit':['name','description'], 'chat-type':['visibility','approval_required','protected','alias'],
    'chat-discussion':['discussion_chat_id'], 'chat-reactions':['reactions_mode','reaction_limit','allowed_reactions'] };
   const settings=Object.fromEntries(fields[view].map(key=>[key,draft[key]]));
   if(view==='chat-type' && draft.visibility==='private') delete settings.alias;
   await api('/api/chats/'+id+'/settings',{method:'PUT',json:settings});
   if(view==='chat-edit' && file) await uploadChatAvatar(api,id,file);
   await onUpdated();
   setPage(page.back || {...page,view:view==='chat-edit'?'chat':'chat-edit'});
  } catch(reason){if(reason.field)setFieldError(reason);else setError(reason.message);}
  finally{setBusy(false);}
 }
 const publicHandle=data?.alias || 'chat-'+id;
 const publicPath=appPath('/t/'+encodeURIComponent(publicHandle));
 const invite=new URL(appPath('/t/join-'+encodeURIComponent(id)),location.origin);
 if(data?.invite_token) invite.searchParams.set('token',data.invite_token);
 const openQr=()=>setPage({view:'qr',id,handle:publicHandle,qrUrl:'/api/chats/'+id+'/qr',back:page});
 async function copyLink() {
  setInviteError('');
  try {await navigator.clipboard.writeText(invite.href);setCopied(true);}
  catch {
   if(view==='chat-type'){
    inviteInput.current?.focus();
    inviteInput.current?.select();
    setInviteError('Не удалось скопировать ссылку. Скопируйте её из поля.');
   }else setError('Не удалось скопировать ссылку.');
  }
 }
 async function resetLink() {
  if(inviteBusy) return;
  setInviteBusy(true);setInviteError('');
  try {const result=await api('/api/chats/'+id+'/invite-link',{method:'POST'});setRecord(current=>({...current,invite_token:result.token}));setCopied(false);}
  catch(reason){setInviteError(reason.message);}
  finally{setInviteBusy(false);}
 }
 const editing=['chat-edit','chat-type','chat-reactions','chat-discussion'].includes(view);
 const ready=draft && data;
 const draftAlias=draft?.alias?.trim().replace(/^@+/,'').toLowerCase() || '';
 const showAliasPreview=!errorFor('alias') && (!draftAlias || /^[a-z][a-z0-9_]{2,31}$/.test(draftAlias));
 const [adminQuery,setAdminQuery]=useState('');
 const assigning=page.admin;
 const rights=[['manage','Изменять настройки чата'],['invite','Приглашать и принимать заявки'],['moderate','Блокировать и удалять сообщения'],...(channel?[['post','Публиковать сообщения']]:[])];
 function selectAdmin(user) {
  setPage({...page,view:'chat-admin-rights',back:page,
   admin:{id:user.id,login:user.login,name:user.name || user.login,avatar:user.avatar,permissions:user.permissions || [],wasAdmin:user.role==='admin'}});
 }
 async function saveAdmin(event) {
  event.preventDefault();setBusy(true);setError('');
  try {
   await api('/api/chats/'+id+'/administrators/'+assigning.id,{method:'PUT',json:{permissions:assigning.permissions}});
   const origin=page.back?.back;
   setPage(origin?.view==='chat-admin-pick'?origin.back:origin);
   await onUpdated();
  }catch(reason){setError(reason.message);}
  finally{setBusy(false);}
 }
 const eligible=(data?.participants || []).filter(member=>member.role!=='owner' && !member.blocked
  && (member.name || member.login).toLocaleLowerCase().includes(adminQuery.trim().toLocaleLowerCase()));

 return <div className="chat-detail-body">
  <FormError message={error}/>
  {!data && !error && <Loader/>}
  {view==='chat' && data && <>
   <div className="profile-cover chat-detail-cover"><Portrait src={data.avatar || page.avatar} name={data.name || page.name}/><strong>{data.name || page.name}</strong><small>{participantLabel(displayed.length,channel)}</small></div>
   <div className="access-settings"><PanelSection title={channel?'Информация о канале':'Информация о группе'}>
    {data.description && <DetailRow icon="info" title={data.description} detail="Информация"/>}
    {data.visibility==='public' ? <DetailRow icon="alternate_email" tone="blue" title={<a className="detail-public-handle" href={publicPath}>@{publicHandle}</a>} detail="Имя пользователя">
     <button type="button" className="header-action profile-qr-action" aria-label="Открыть QR-код" title="QR-код" onClick={openQr}><PanelIcon name="qr_code_2"/></button>
    </DetailRow> : data.invite_token && <DetailRow icon="link" tone="amber" title={invite.href} detail="Ссылка-приглашение" onClick={copyLink}><PanelIcon name={copied?'check':'content_copy'}/></DetailRow>}
    <DetailRow icon="notifications" tone="coral" title="Уведомления" onClick={onToggleNotifications}><span className={'panel-switch'+(notifications?' enabled':'')} role="switch" aria-checked={notifications} aria-label="Уведомления"/></DetailRow>
    <DetailRow icon="groups" tone="green" title={label} detail={displayed.length} onClick={()=>go('chat-members')}/>
    {data.discussion_chat_id && <DetailRow icon="forum" title="Обсуждение" onClick={()=>onOpenChat(data.discussion_chat_id)}/>}
   </PanelSection></div>
   <MediaTabs chatId={id}/>
  </>}
  {editing && ready && canManage && <form className="managed-form" onSubmit={save}>
   {view==='chat-edit' && <>
    <AvatarPicker avatar={data.avatar || page.avatar} file={file} onChange={value=>{setFile(value);if(fieldError?.field==='avatar')setFieldError(null);}}/>
    <FormError message={errorFor('avatar')}/>
    <div className="access-settings"><PanelSection title={channel?'Данные канала':'Данные группы'}>
    <div className="panel-fields">
     <FloatingField label={channel?'Название канала':'Название группы'} required maxLength={150} error={errorFor('name')} value={draft.name || ''} onChange={event=>assign('name',event.target.value)}/>
     <FloatingField label="Описание" multiline rows={2} maxLength={250} error={errorFor('description')} value={draft.description} onChange={event=>assign('description',event.target.value)}/>
    </div></PanelSection>
    <PanelSection title="Настройки чата">
     <DetailRow icon="lock" title={channel?'Тип канала':'Тип группы'} detail={data.visibility==='private'?'Частный':'Публичный'} onClick={()=>go('chat-type')}/>
     {channel && <DetailRow icon="forum" title="Обсуждение" detail={groups.find(group=>Number(group.id)===data.discussion_chat_id)?.name || 'Добавить'} onClick={()=>go('chat-discussion')}/>}
     <DetailRow icon="favorite" title="Реакции" detail={({all:'Все',selected:'Только выбранные',none:'Отключены'})[data.reactions_mode]} onClick={()=>go('chat-reactions')}/>
    </PanelSection>
    <PanelSection title="Управление участниками">
     <DetailRow icon="admin_panel_settings" title="Администраторы" onClick={()=>go('chat-admins')}/>
     <DetailRow icon="groups" title={label} onClick={()=>go('chat-members')}/>
     <DetailRow icon="person_off" title="Чёрный список" onClick={()=>go('chat-blocked')}/>
     {canInvite && <DetailRow icon="how_to_reg" title="Заявки на вступление" onClick={()=>go('chat-requests')}/>}
    </PanelSection></div>
   </>}
   {view==='chat-type' && <div className="access-settings">
    <fieldset className="access-section">
     <legend>Тип доступа</legend>
     <div className="access-card option-card">
      <PanelRadio name="visibility" icon="lock" checked={draft.visibility==='private'} onChange={()=>assign('visibility','private')}
       title="Только по приглашению" detail="Вступить можно по действующей ссылке-приглашению."/>
      <PanelRadio name="visibility" icon="public" checked={draft.visibility==='public'} onChange={()=>assign('visibility','public')}
       title={channel?'Публичный канал':'Публичная группа'} detail={channel?'Канал можно найти через поиск и открыть по короткой ссылке.':'Группу можно найти через поиск и открыть по короткой ссылке.'}/>
     </div>
     <div className={'access-public'+(draft.visibility==='public'?' expanded':'')} inert={draft.visibility!=='public'}>
      <div className="access-public-inner">
       <div className="access-alias">
        <FloatingField label="Короткое имя" aria-describedby={aliasHintId} autoCapitalize="none" spellCheck={false} maxLength={32} error={errorFor('alias')} value={draft.alias} onChange={event=>assign('alias',event.target.value)}/>
        <p id={aliasHintId} className="access-hint">
         {showAliasPreview ? <>{draftAlias===data.alias?'Публичная ссылка':'Ссылка после сохранения'} <b>/t/{draftAlias || 'chat-'+id}</b></>
          : 'От 3 до 32 символов. Начните с латинской буквы.'}
        </p>
       </div>
      </div>
     </div>
    </fieldset>
    {(canInvite || data.invite_token) && <section className="access-section">
     <h3>Ссылка-приглашение</h3>
     <div className="access-card invite-card">
      {data.invite_token && <div className="invite-field">
       <PanelIcon name="link"/>
       <input ref={inviteInput} aria-label="Ссылка-приглашение" value={invite.href} readOnly onFocus={event=>event.currentTarget.select()}/>
       <button type="button" className="header-action" aria-label={copied?'Ссылка скопирована':'Копировать ссылку'} title={copied?'Ссылка скопирована':'Копировать ссылку'} onClick={copyLink}><PanelIcon name={copied?'check':'content_copy'}/></button>
      </div>}
      {canInvite && <button type="button" className={'access-link-action'+(data.invite_token?' renewing':'')} disabled={inviteBusy} onClick={resetLink}>
       <PanelIcon name={data.invite_token?'autorenew':'add'}/>{inviteBusy?'Готовим ссылку…':data.invite_token?'Обновить ссылку':'Создать ссылку'}
      </button>}
      <FormError className="invite-error" message={inviteError}/>
     </div>
     <p className="access-hint">{data.invite_token?'Поделитесь ссылкой, чтобы пригласить людей. Для частного доступа обновление отменяет прежнюю ссылку.':'Создайте ссылку, которой можно поделиться с участниками.'}</p>
    </section>}
    <section className="access-section">
     <h3>Вступление</h3>
     <div className="access-card">
      <PanelSwitch label="Заявки на вступление" checked={draft.approval_required} onChange={value=>assign('approval_required',value)}/>
     </div>
     <p className="access-hint">Новые участники смогут вступить после одобрения владельцем или администратором.</p>
    </section>
    <fieldset className="access-section">
     <legend>Пересылка сообщений</legend>
     <div className="access-card option-card">
      <PanelRadio name="forwarding" checked={!draft.protected} onChange={()=>assign('protected',false)} title="Разрешить пересылку"/>
      <PanelRadio name="forwarding" checked={draft.protected} onChange={()=>assign('protected',true)} title="Запретить пересылку"/>
     </div>
     <p className="access-hint">{draft.protected?'Кнопки копирования и пересылки будут скрыты у участников.':'Участники смогут копировать и пересылать сообщения.'}</p>
    </fieldset>
   </div>}
   {view==='chat-reactions' && <div className="access-settings">
    <PanelSection title="Количество реакций" options hint="Максимум разных эмодзи на одном сообщении.">
     <label className="setting-slider panel-range"><span>На одно сообщение <b>{draft.reaction_limit}</b></span><input type="range" min="1" max={reactionChoices.length} value={draft.reaction_limit} style={{'--range-fill':((draft.reaction_limit-1)/(reactionChoices.length-1))*100+'%'}} onChange={event=>assign('reaction_limit',Number(event.target.value))}/></label>
    </PanelSection>
    <fieldset className="access-section"><legend>Доступные реакции</legend><div className="access-card option-card">{[['all','Все реакции'],['selected','Только выбранные'],['none','Без реакций']].map(([value,title])=><PanelRadio key={value} name="reactions" title={title} checked={draft.reactions_mode===value} onChange={()=>assign('reactions_mode',value)}/>)}
    {draft.reactions_mode==='selected' && <div className="allowed-reactions">{reactionChoices.map(emoji=><button type="button" key={emoji} aria-pressed={draft.allowed_reactions.includes(emoji)} onClick={()=>assign('allowed_reactions',draft.allowed_reactions.includes(emoji)?draft.allowed_reactions.filter(item=>item!==emoji):[...draft.allowed_reactions,emoji])}>{emoji}</button>)}</div>}
    <FormError className="field-error" message={errorFor('allowed_reactions')}/>
    </div></fieldset>
   </div>}
   {view==='chat-discussion' && <div className="access-settings"><PanelSection title="Связанная группа" hint="Для обсуждения можно выбрать группу, которой вы владеете.">
    <div className="panel-fields">
    <PanelSelect label="Группа для обсуждений" value={draft.discussion_chat_id} onChange={value=>assign('discussion_chat_id',value)}
     options={[{value:null,label:'Без обсуждения'},...groups.map(group=>({value:Number(group.id),label:group.name}))]}/>
    </div>
   </PanelSection></div>}
   <PanelFooter disabled={busy || (view==='chat-type' && inviteBusy)}>{busy?'Сохраняем…':'Сохранить'}</PanelFooter>
  </form>}
  {['chat-members','chat-admins','chat-blocked'].includes(view) && data && <>
   <div className="access-settings"><PanelSection title={view==='chat-admins'?'Администраторы':view==='chat-blocked'?'Заблокированные':label}>
   {displayed.map(member=><div className="profile-row person-row panel-person" key={member.id}>
    <button type="button" className="member-profile" onClick={()=>setPage(member.id===account.id?{view:'self',back:page}:{view:'peer',id:member.id,name:member.name || member.login,avatar:member.avatar,back:page})}>
     <Portrait src={member.avatar} name={member.name || member.login}/><span>{member.name || member.login}<small>{member.role==='owner'?'Владелец':member.role==='admin'?'Администратор':label==='Подписчики'?'Подписчик':'Участник'}</small></span>
    </button>
    {owner && member.id!==account.id && !member.blocked && <button type="button" className="header-action" aria-label="Права администратора" title="Права администратора" onClick={()=>selectAdmin(member)}><PanelIcon name="admin_panel_settings"/></button>}
    {canModerate && member.id!==account.id && member.role!=='owner' && <button type="button" className="header-action" title={member.blocked?'Разблокировать':'Заблокировать'} aria-label={member.blocked?'Разблокировать':'Заблокировать'} onClick={()=>changeBlock(member)}><PanelIcon name={member.blocked?'lock_open':'block'}/></button>}
   </div>)}{!displayed.length && <p className="panel-empty">Список пуст</p>}</PanelSection></div>
   {canInvite && view==='chat-members' && <PanelFooter type="button" icon="person_add" onClick={()=>setPage({view:'invite',id,back:page})}>{channel?'Добавить подписчиков':'Добавить участников'}</PanelFooter>}
  </>}
  {view==='chat-admins' && data && owner && <>
   <PanelFooter type="button" icon="person_add" onClick={()=>go('chat-admin-pick')}>Назначить администратора</PanelFooter>
  </>}
  {view==='chat-admin-pick' && data && owner && <div className="access-settings">
   <FloatingField label="Поиск участников" type="search" value={adminQuery} onChange={event=>setAdminQuery(event.target.value)}/>
   <PanelSection title="Шаг 1 из 3 · Выберите участника">{eligible.map(member=><button className="profile-row person-row panel-person" type="button" key={member.id} onClick={()=>selectAdmin(member)}><Portrait src={member.avatar} name={member.name || member.login}/><span>{member.name || member.login}<small>{member.role==='admin'?'Администратор':label==='Подписчики'?'Подписчик':'Участник'}</small></span><PanelIcon name="chevron_right"/></button>)}
    {!eligible.length && <p className="panel-empty">Участники не найдены</p>}
   </PanelSection>
  </div>}
  {view==='chat-admin-rights' && assigning && owner && <>
   <div className="access-settings">
   <div className="access-card"><div className="profile-row panel-person"><Portrait src={assigning.avatar} name={assigning.name}/><strong>{assigning.name}</strong></div></div>
   <PanelSection title="Шаг 2 из 3 · Настройте права">
    {rights.map(([key,text])=><PanelSwitch key={key} label={text} checked={assigning.permissions.includes(key)} onChange={value=>setPage({...page,admin:{...assigning,permissions:value?[...assigning.permissions,key]:assigning.permissions.filter(item=>item!==key)}})}/>)}
   </PanelSection>
   </div>
   <PanelFooter type="button" icon="arrow_forward" disabled={!assigning.permissions.length && !assigning.wasAdmin} onClick={()=>go('chat-admin-review')}>Далее</PanelFooter>
  </>}
  {view==='chat-admin-review' && assigning && owner && <form className="panel-flow" onSubmit={saveAdmin}>
   <div className="access-settings">
   <div className="access-card"><div className="profile-row panel-person"><Portrait src={assigning.avatar} name={assigning.name}/><strong>{assigning.name}</strong></div></div>
   <PanelSection title="Шаг 3 из 3 · Подтвердите изменения">{assigning.permissions.length?rights.filter(([key])=>assigning.permissions.includes(key)).map(([key,text])=><DetailRow key={key} icon="check" tone="green" title={text}/>):<p className="panel-hint">Права администратора будут сняты.</p>}</PanelSection>
   </div>
   <PanelFooter disabled={busy}>{busy?'Сохраняем…':assigning.permissions.length?'Подтвердить права':'Снять права'}</PanelFooter>
  </form>}
  {view==='chat-requests' && data && <div className="access-settings"><PanelSection title="Ожидают решения">
   {requests===null && !error && <Loader label="Загрузка заявок…"/>}
   {requests?.map(user=><div key={user.id} className="profile-row panel-person"><Portrait src={user.avatar} name={user.name}/><span>{user.name}</span><button type="button" className="header-action accept-request" aria-label="Принять" onClick={()=>changeRequest(user,true)}><PanelIcon name="check"/></button><button type="button" className="header-action reject-request" aria-label="Отклонить" onClick={()=>changeRequest(user,false)}><PanelIcon name="close"/></button></div>)}
   {requests?.length===0 && <p className="panel-empty">Новых заявок нет</p>}
  </PanelSection></div>}
 </div>;
}
