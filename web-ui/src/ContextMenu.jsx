import React, {useLayoutEffect, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

import {PanelIcon} from './panelControls.jsx';
const glyphs={reply:'reply',edit:'edit',profile:'person',settings:'settings',copy:'content_copy',
 pin:'push_pin',select:'check_circle',delete:'delete',tab:'open_in_new',eye:'visibility',
 archive:'archive',folder:'folder',unread:'mark_chat_unread',bell:'notifications',bellOff:'notifications_off',forward:'forward',link:'link',
 chevron:'expand_more',chats:'chat_bubble',groups:'groups',channel:'campaign',video:'videocam',block:'block'};
export const reactionChoices = ['👍','🌚','🔥','😢','🏆','😡','❤️','👏','😂','🤔','🎉','👎'];
function Icon({name}) {return <PanelIcon name={glyphs[name]}/>;}
export default function ContextMenu({menu, close}) {
 const [visible, setVisible] = useState(null);
 const [expanded, setExpanded] = useState(false);
 const root = useRef(null);
 const closeRef = useRef(close);
 closeRef.current = close;
 useLayoutEffect(()=>{
  if (menu) {
   setVisible(menu);
   setExpanded(false);
   return;
  }
  const timeout = setTimeout(()=>setVisible(null), matchMedia('(prefers-reduced-motion: reduce)').matches?0:160);
  return ()=>clearTimeout(timeout);
 },[menu]);
 useLayoutEffect(()=>{
  const element = root.current;
  if (!element || !visible || !menu) return;
  const place = () => {
   const {x,y,above,align,trigger}=visible;
   const anchor=trigger?.getBoundingClientRect();
   const left=anchor?(align==='end'?anchor.right-element.offsetWidth:anchor.left):x;
   const top=anchor?(above?anchor.top-element.offsetHeight-7:anchor.bottom+7):y;
   element.style.left = Math.max(8,Math.min(left,innerWidth-element.offsetWidth-8))+'px';
   element.style.top = Math.max(8,Math.min(top,innerHeight-element.offsetHeight-8))+'px';
  };
  place();
  const observer = new ResizeObserver(place);
  observer.observe(element);
  window.addEventListener('resize',place);
  return ()=>{
   observer.disconnect();
   window.removeEventListener('resize',place);
  };
 },[visible,menu]);
 useEffect(()=>{
  if (!menu) return;
  root.current?.querySelector('.context-card button')?.focus({preventScroll:true});
  function dismiss(event) {
   if (event.key === 'Escape') {
    closeRef.current();
    menu.trigger?.focus({preventScroll:true});
   } else if (event.type==='pointerdown' && !root.current?.contains(event.target) && !menu.trigger?.contains(event.target)) {
    closeRef.current();
   }
  }
  window.addEventListener('pointerdown',dismiss);
  window.addEventListener('keydown',dismiss);
  return ()=>{window.removeEventListener('pointerdown',dismiss);window.removeEventListener('keydown',dismiss);};
 },[menu]);
 if (!visible) return null;
 const reactions=visible.reactionChoices ?? reactionChoices;
 return createPortal(<div ref={root} className={'context-popover'+(visible.align==='end'?' align-end':'')+(visible.above?' anchored-above':'')+(visible.messageKey?' message-popover':'')+(!menu?' closing':'')} inert={!menu} aria-hidden={!menu || undefined}>
  {visible.react && <div className="context-reactions" role="group" aria-label="Реакции">
   {reactions.slice(0,7).map(emoji=><button type="button" key={emoji} aria-label={'Реакция '+emoji} onClick={()=>{close();visible.react(emoji);}}>{emoji}</button>)}
   {reactions.length>7 && <button type="button" className="reaction-expand" aria-expanded={expanded} aria-label={expanded?'Свернуть реакции':'Ещё реакции'} onClick={()=>setExpanded(value=>!value)}><Icon name="chevron"/></button>}
   <div className={'extra-reactions'+(expanded?' expanded':'')} inert={!expanded}>
    <div>
     {reactions.slice(7).map(emoji=><button type="button" key={emoji} aria-label={'Реакция '+emoji} onClick={()=>{close();visible.react(emoji);}}>{emoji}</button>)}
    </div>
   </div>
  </div>}
  <div className="context-card" role="group" aria-label={visible.label ?? 'Действия'}>
   {visible.identity && <button className="context-identity" type="button" onClick={()=>{close();visible.identity.open();}}>
    {visible.identity.avatar?<img src={visible.identity.avatar} alt=""/>:<Icon name="profile"/>}
    <span>{visible.identity.name}</span>
   </button>}
   {visible.actions.map(([icon,label,run,current])=><button key={label} type="button" aria-current={current || undefined} className={icon==='delete'?'danger':undefined} onClick={()=>{close();run();if(root.current?.contains(document.activeElement)) visible.trigger?.focus({preventScroll:true});}}><Icon name={icon}/><span>{label}</span>{current && <span className="context-current"><Icon name="select"/></span>}</button>)}
  </div>
 </div>,document.body);
}

