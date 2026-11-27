import {useEffect,useRef} from 'react';
import {api,appPath} from './api.js';

export const notificationKinds=[['personal','Личные чаты'],['group','Группы'],['channel','Каналы']];
export function pushSupported() {
 return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}
function decodeKey(value) {
 const base64=value.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(value.length/4)*4,'=');
 return Uint8Array.from(atob(base64),symbol=>symbol.charCodeAt(0));
}
function subscriptionSettings(preferences,overrides) {
 return {
  kinds:Object.fromEntries(notificationKinds.map(([key])=>[key,preferences['notify_'+key]!==false])),
  previews:Object.fromEntries(notificationKinds.map(([key])=>[key,preferences['preview_'+key]!==false])),
  overrides,
 };
}
export async function switchBackground(enabled, preferences, overrides) {
 if(!pushSupported()) throw new Error('Этот браузер не поддерживает фоновые уведомления');
 if(!enabled) {
  const registration=await navigator.serviceWorker.getRegistration('/');
  const subscription=await registration?.pushManager.getSubscription();
  if(subscription) {
   await api('/api/push/unsubscribe',{method:'POST',json:{endpoint:subscription.endpoint}});
   await subscription.unsubscribe();
  }
  return;
 }
 if(await Notification.requestPermission()!=='granted') throw new Error('Браузер не разрешил уведомления');
 const key=await api('/api/push/vapid-key');
 if(!key.publicKey || !key.available) throw new Error('Сервер не настроен для фоновых уведомлений');
 await navigator.serviceWorker.register(appPath('/sw.js'));
 const registration=await navigator.serviceWorker.ready;
 let subscription=await registration.pushManager.getSubscription();
 if(!subscription) subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:decodeKey(key.publicKey)});
 await api('/api/push/subscribe',{method:'POST',json:{...subscription.toJSON(),settings:subscriptionSettings(preferences,overrides)}});
}
export function useChatNotifications(records,preferences,overrides,selected) {
 const seen=useRef(null);
 const audio=useRef(null);
 useEffect(()=>{
  if(!preferences.webNotifications || !window.AudioContext) return;
  function allowSound(){
   try {audio.current ||= new AudioContext();audio.current.resume().catch(()=>{});}
   catch {}
  }
  document.addEventListener('pointerdown',allowSound,{once:true});
  return ()=>document.removeEventListener('pointerdown',allowSound);
 },[preferences.webNotifications]);
 useEffect(()=>{
  if(!preferences.backgroundNotifications || !pushSupported()) return;
  let active=true;
  navigator.serviceWorker.getRegistration('/').then(registration=>registration?.pushManager.getSubscription()).then(subscription=>{
   if(active && subscription) return api('/api/push/subscribe',{method:'POST',json:{...subscription.toJSON(),settings:subscriptionSettings(preferences,overrides)}});
  }).catch(()=>{});
  return ()=>{active=false;};
 },[preferences,overrides]);
 useEffect(()=>{
  if(!Object.keys(records).length) return;
  const previous=seen.current;
  seen.current=records;
  if(!previous || !preferences.webNotifications) return;
  for(const [id,chat] of Object.entries(records)){
   const kind=chat.target_user_id?'personal':chat.chat_type==='channel'?'channel':'group';
   if(!chat.unread || !chat.last_sent_at || (previous[id]?.last_sent_at || '')>=chat.last_sent_at || chat.last_status!=null) continue;
   if(overrides[id]===false || (overrides[id]!==true && preferences['notify_'+kind]===false)) continue;
   if(!document.hidden && id===selected) continue;
   const volume=Number(preferences.notificationVolume ?? 5)/10;
   if(volume>0 && audio.current?.state==='running'){
    const context=audio.current;
    const tone=context.createOscillator(), gain=context.createGain();
    tone.frequency.value=620;
    gain.gain.setValueAtTime(volume*.075,context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+.17);
    tone.connect(gain).connect(context.destination);
    tone.start();tone.stop(context.currentTime+.18);
   }
   if(document.hidden && !preferences.backgroundNotifications && globalThis.Notification?.permission==='granted'){
    try{
     const notice=new Notification(chat.name,{body:preferences['preview_'+kind]===false?'Новое сообщение':chat.last_msg,tag:'tornado-chat-'+id});
     notice.onclick=()=>{window.focus();location.assign(appPath('/chat?chat='+encodeURIComponent(id)));};
    }catch{}
   }
  }
 },[records,preferences,overrides,selected]);
}
