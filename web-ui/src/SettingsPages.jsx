import React,{useEffect,useState} from 'react';
import {api} from './api.js';
import {DetailRow} from './ChatDetails.jsx';
import {FormError,PanelIcon,PanelSection,PanelSwitch,Portrait} from './panelControls.jsx';
import {notificationKinds,pushSupported,switchBackground} from './notifications.js';

export function NotificationSettings({preferences,changePreference,notifications}) {
 const [status,setStatus]=useState(null);
 const [error,setError]=useState('');
 const [pending,setPending]=useState(false);
 const browser='Notification' in window;
 useEffect(()=>{
  if(!pushSupported()){setStatus(false);return;}
  const controller=new AbortController();
  api('/api/push/vapid-key',{signal:controller.signal}).then(result=>{if(!controller.signal.aborted)setStatus(!!(result.publicKey && result.available));})
   .catch(()=>{if(!controller.signal.aborted)setStatus(false);});
  return ()=>controller.abort();
 },[]);
 async function web(value) {
  setError('');
  if(!value){changePreference('webNotifications',false);return;}
  try{
   if(await Notification.requestPermission()!=='granted')throw new Error('Разрешите уведомления в настройках сайта.');
   changePreference('webNotifications',true);
  }catch(reason){setError(reason.message);}
 }
 async function background(value) {
  setPending(true);setError('');
  try{await switchBackground(value,preferences,notifications);changePreference('backgroundNotifications',value);}
  catch(reason){setError(reason.message);}
  finally{setPending(false);}
 }
 const volume=preferences.notificationVolume ?? 5;
 return <div className="access-settings">
  <PanelSection title="Веб-уведомления" options>
   <PanelSwitch label="Уведомления в браузере" detail={!browser?'Браузер не поддерживает уведомления':undefined} disabled={!browser} checked={!!preferences.webNotifications} onChange={web}/>
   <PanelSwitch label="Уведомления в фоне" detail={status===null?'Проверяем доступность…':status?'При закрытой вкладке':'Сервис фоновых уведомлений недоступен'} disabled={pending || (!status && !preferences.backgroundNotifications)} checked={!!preferences.backgroundNotifications} onChange={background}/>
   <label className="setting-slider panel-range"><span>Громкость звука <b>{volume}</b></span><input type="range" min="0" max="10" value={volume} style={{'--range-fill':volume*10+'%'}} onChange={event=>changePreference('notificationVolume',Number(event.target.value))}/></label>
   <FormError message={error}/>
  </PanelSection>
  {notificationKinds.map(([kind,label])=><PanelSection key={kind} title={label}>
   <PanelSwitch label="Уведомления" checked={preferences['notify_'+kind]!==false} onChange={value=>changePreference('notify_'+kind,value)}/>
   <PanelSwitch label="Предпросмотр сообщений" detail="Показывать текст в уведомлении" checked={preferences['preview_'+kind]!==false} onChange={value=>changePreference('preview_'+kind,value)}/>
  </PanelSection>)}
 </div>;
}
export function PrivacySettings({profile,setProfile,blocked,onUpdated}) {
 const [error,setError]=useState('');
 const [pending,setPending]=useState(false);
 const [listOpen,setListOpen]=useState(false);
 async function save(field,value) {
  setPending(true);setError('');
  try{const result=await api('/api/user/privacy',{method:'PUT',json:{[field]:value}});setProfile(current=>({...current,...result}));}
  catch(reason){setError(reason.message);}
  finally{setPending(false);}
 }
 return <div className="access-settings">
  <PanelSection title="Блокировки">
   <DetailRow icon="person_off" tone="coral" title="Чёрный список" detail={blocked.length} expanded={listOpen} onClick={()=>setListOpen(value=>!value)}><PanelIcon name={listOpen?'expand_more':'chevron_right'}/></DetailRow>
   <div className={'settings-expander'+(listOpen?' expanded':'')} inert={!listOpen}><div>
    {blocked.length?blocked.map(chat=><div key={chat.id} className="profile-row panel-person"><Portrait src={chat.avatar} name={chat.name}/><span>{chat.name}</span><button className="panel-value" type="button" onClick={async()=>{
     try{await api('/api/chats/'+chat.id+'/unblock/'+chat.target_user_id,{method:'POST'});await onUpdated();}
     catch(reason){setError(reason.message);}
    }}>Разблокировать</button></div>):<p className="panel-hint">Список пуст</p>}
   </div></div>
  </PanelSection>
  <PanelSection title="Кто видит данные профиля">
   <PanelSwitch label="Последний визит и статус «в сети»" detail={profile.show_last_seen===false?'Только я':'Все в Tornado'} checked={profile.show_last_seen!==false} disabled={pending} onChange={value=>save('show_last_seen',value)}/>
   <PanelSwitch label="О себе" detail={profile.show_bio===false?'Только я':'Все в Tornado'} checked={profile.show_bio!==false} disabled={pending} onChange={value=>save('show_bio',value)}/>
  </PanelSection>
  <FormError message={error}/>
 </div>;
}
