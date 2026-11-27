import React, {useLayoutEffect, useRef, useState} from 'react';
import {PanelIcon} from './panelControls.jsx';

export const removalLabels = {
 hide:{action:'Скрыть чат',confirm:'Скрыть',done:'Чат скрыт'},
 message:{action:'Удалить сообщение', confirm:'Удалить'},
 chat:{action:'Удалить чат', confirm:'Удалить', done:'Чат удалён'},
 group:{action:'Покинуть группу', confirm:'Покинуть', done:'Вы покинули группу'},
 'owned-channel':{action:'Удалить канал',confirm:'Удалить',done:'Канал удалён'},
 channel:{action:'Покинуть канал', confirm:'Покинуть', done:'Вы покинули канал'},
};

export default function ChatRemovalDialog({name, kind, onClose, onConfirm, allowBoth=kind==='chat', count=1}) {
 const dialog = useRef(null);
 const cancel = useRef(null);
 const finishing = useRef(false);
 const timer = useRef(null);
 const [closing, setClosing] = useState(false);
 const [forBoth, setForBoth] = useState(false);
 const labels = removalLabels[kind];

 useLayoutEffect(()=>{
  const element = dialog.current;
  element.showModal();
  cancel.current.focus();
  return ()=>{
   clearTimeout(timer.current);
   element.close();
  };
 },[]);

 function finish(confirmed) {
  if (finishing.current) return;
  finishing.current = true;
  const complete = () => {
   dialog.current.close();
   if (confirmed) onConfirm(forBoth);
   else onClose();
  };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
   complete();
   return;
  }
  setClosing(true);
  timer.current = setTimeout(complete,160);
 }

 return <dialog ref={dialog} className={'delete-dialog'+(closing?' is-closing':'')}
  aria-labelledby="delete-title" aria-describedby="delete-description"
  onCancel={event=>{event.preventDefault();finish(false);}}
  onClick={event=>{if(event.target===event.currentTarget) finish(false);}}>
  <div className="delete-dialog-content">
   <h2 id="delete-title">{kind==='message' && count>1?'Удалить выбранные сообщения':labels.action}?</h2>
   <p id="delete-description">{kind==='chat'
    ? <>Переписка с «{name}» будет удалена {forBoth?'у вас и у собеседника':'только у вас'}. Восстановить её нельзя.</>
    : kind==='owned-channel' ? <>«{name}» и все публикации будут удалены у подписчиков.</>
    : kind==='hide' ? <>«{name}» исчезнет из вашего списка. Сообщения сохранятся у участников.</>
    : kind==='message' ? (count>1?'Выбранные сообщения будут удалены у всех участников. Восстановить их нельзя.':'Сообщение будет удалено у всех участников. Восстановить его нельзя.')
    : <>«{name}» исчезнет из списка чатов, и уведомления оттуда больше не будут приходить.</>}</p>
   {allowBoth && <button type="button" className="delete-for-both" role="checkbox" aria-checked={forBoth} onClick={()=>setForBoth(value=>!value)} disabled={closing}>
    <span className="delete-checkbox" aria-hidden="true"><PanelIcon name="check"/></span>
    <span>Удалить у обоих<small>{kind==='message'?(count>1?'Удалить выбранные сообщения также у собеседника.':'Удалить сообщение также у собеседника.'):'Удалить историю переписки также у собеседника.'}</small></span>
   </button>}
   <div className="delete-dialog-actions">
    <button type="button" ref={cancel} onClick={()=>finish(false)}>Отмена</button>
    <button type="button" className="danger" onClick={()=>finish(true)}>{kind==='chat'?(forBoth?'Удалить у обоих':'Удалить у себя'):labels.confirm}</button>
   </div>
  </div>
 </dialog>;
}
