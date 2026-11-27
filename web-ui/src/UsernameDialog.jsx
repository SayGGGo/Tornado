import React,{useState} from 'react';
import {appPath} from './api.js';
import {FormError,PanelIcon} from './panelControls.jsx';

export default function UsernameDialog({name,collectible,onClose}) {
 const dialog=React.useRef(null);
 const timer=React.useRef(null);
 const [closing,setClosing]=useState(false);
 const [copied,setCopied]=useState(false);
 const [copyError,setCopyError]=useState('');
 const link=new URL(appPath('/t/'+encodeURIComponent(name)),location.origin).href;
 React.useLayoutEffect(()=>{
  const element=dialog.current;
  element.showModal();
  return ()=>{clearTimeout(timer.current);element.close();};
 },[]);
 function close() {
  if(timer.current!==null)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){onClose();return;}
  setClosing(true);
  timer.current=setTimeout(onClose,180);
 }
 return <dialog ref={dialog} className={'username-dialog'+(closing?' closing':'')} aria-labelledby="username-title" onCancel={event=>{event.preventDefault();close();}} onClick={event=>{if(event.target===event.currentTarget)close();}}>
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
