import React from 'react';
import {appPath} from './api.js';
import {OutlineIcon} from './OutlineIcon.jsx';

export function PanelIcon({name}) {
 return <OutlineIcon name={name}/>;
}
export function FormError({message,id,className=''}) {
 return message?<p id={id} className={'form-error '+className} role="alert"><PanelIcon name="error"/><span>{message}</span></p>:null;
}
export function PanelSection({title,children,hint,options=false}) {
 return <section className="access-section">
  <h3>{title}</h3>
  <div className={'access-card'+(options?' option-card':'')}>{children}</div>
  {hint && <p className="access-hint">{hint}</p>}
 </section>;
}
export function PanelSwitch({label,detail,checked,onChange,disabled=false}) {
 return <label className="access-switch-row">
  <span className="access-option-copy"><strong>{label}</strong>{detail && <small>{detail}</small>}</span>
  <input type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={event=>onChange(event.target.checked)}/>
 </label>;
}
export function PanelRadio({name,checked,onChange,title,detail,icon}) {
 return <label className="access-option">
  <input type="radio" name={name} checked={checked} onChange={onChange}/>
  <span className="access-option-copy"><strong>{title}</strong>{detail && <small>{detail}</small>}</span>
  {icon && <PanelIcon name={icon}/>}
 </label>;
}
export function PanelFooter({children,icon='check',disabled,type='submit',onClick}) {
 return <footer className="access-footer">
  <button type={type} className="access-save" disabled={disabled} onClick={onClick}><PanelIcon name={icon}/>{children}</button>
 </footer>;
}
export function FloatingField({label,multiline=false,error,formatError,onChange,...props}) {
 const Control = multiline?'textarea':'input';
 const errorId=React.useId();
 const [validation,setValidation]=React.useState('');
 const message=validation || error;
 const describedBy=[props['aria-describedby'],message && errorId].filter(Boolean).join(' ');
 return <div className="floating-field-group">
  <label className="floating-field"><Control placeholder=" " {...props} aria-invalid={message?true:undefined}
   aria-describedby={describedBy || undefined} onChange={event=>{
    setValidation('');
    onChange?.(event);
   }} onInvalid={event=>{
    event.preventDefault();
    const input=event.currentTarget;
    setValidation(input.validity.valueMissing?'Заполните это поле.':formatError || 'Проверьте значение в этом поле.');
    if(input.form?.querySelector(':invalid')===input) input.focus();
   }}/><span>{label}</span></label>
  <FormError id={errorId} className="field-error" message={message}/>
 </div>;
}
export function Portrait({src,name='',className=''}) {
 return <span className={'panel-portrait '+className}>
  <span aria-hidden="true">{String(name ?? '').trim().split(/\s+/).slice(0,2).map(word=>word[0]).join('').toUpperCase() || 'T'}</span>
  {src && <img src={appPath(src)} alt="" onError={event=>{event.currentTarget.hidden=true;}}/>}
 </span>;
}
export function AvatarPicker({avatar,file,onChange,label='Выбрать фото'}) {
 const [preview,setPreview] = React.useState('');
 React.useEffect(()=>{
  if (!file) {setPreview('');return;}
  const url=URL.createObjectURL(file);
  setPreview(url);
  return ()=>URL.revokeObjectURL(url);
 },[file]);
 return <label className="panel-avatar-picker" aria-label={label}>
  {(preview || avatar) && <Portrait src={preview || avatar}/>}
  <OutlineIcon name="add_a_photo"/>
  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" aria-label={label} onChange={event=>{const value=event.target.files[0];if(value) onChange(value);}}/>
 </label>;
}
export async function uploadChatAvatar(api,id,file) {
 const body=new FormData();
 body.set('avatar',file);
 return api('/api/chats/'+id+'/avatar',{method:'POST',body});
}

export function Loader({label='Загрузка…',className=''}) {
 return <div className={'ui-loader '+className} role="status" aria-label={label}>
  <span className="loader-wheel" aria-hidden="true"/><span>{label}</span>
 </div>;
}

export function PanelSelect({label,value,options,onChange}) {
 const [open,setOpen]=React.useState(false);
 const root=React.useRef(null);
 const trigger=React.useRef(null);
 React.useEffect(()=>{
  if(!open) return;
  const dismiss=event=>{if(!root.current?.contains(event.target))setOpen(false);};
  const escape=event=>{if(event.key==='Escape'){event.stopPropagation();setOpen(false);trigger.current?.focus();}};
  const element=root.current;
  document.addEventListener('pointerdown',dismiss);
  element.addEventListener('keydown',escape);
  return ()=>{document.removeEventListener('pointerdown',dismiss);element.removeEventListener('keydown',escape);};
 },[open]);
 return <div className={'panel-select'+(open?' expanded':'')} ref={root}>
  <button className="panel-select-trigger" ref={trigger} type="button" aria-expanded={open} aria-label={label} onClick={()=>setOpen(current=>!current)}><span><small>{label}</small>{options.find(option=>option.value===value)?.label || 'Выбрать'}</span><PanelIcon name="expand_more"/></button>
  <div className="panel-select-options" inert={!open}><div>{options.map(option=><button type="button" key={option.value ?? 'none'} aria-pressed={value===option.value} onClick={()=>{onChange(option.value);setOpen(false);trigger.current?.focus();}}>{option.label}{value===option.value && <PanelIcon name="check"/>}</button>)}</div></div>
 </div>;
}
