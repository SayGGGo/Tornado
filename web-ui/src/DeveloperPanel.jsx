import React,{useEffect,useState} from 'react';
import {api} from './api.js';
import {FloatingField,FormError,Loader,PanelIcon,PanelSection,PanelSwitch} from './panelControls.jsx';

export default function DeveloperPanel() {
 const [apps,setApps]=useState(null);
 const [name,setName]=useState('');
 const [redirect,setRedirect]=useState('');
 const [error,setError]=useState('');
 const [fieldError,setFieldError]=useState(null);
 const [creating,setCreating]=useState(false);
 const [busy,setBusy]=useState(false);
 const [confirm,setConfirm]=useState(null);
 useEffect(()=>{
  const controller=new AbortController();
  api('/api/developer/apps',{signal:controller.signal}).then(setApps).catch(reason=>{if(!controller.signal.aborted)setError(reason.message);});
  return ()=>controller.abort();
 },[]);
 async function create(event) {
  event.preventDefault();
  setError('');setFieldError(null);
  if(!name.trim()){setFieldError({field:'name',message:'Введите название приложения.'});return;}
  setBusy(true);
  try {
   const app=await api('/api/developer/apps',{method:'POST',json:{name,redirect_uri:redirect.trim()}});
   setApps(current=>[...(current ?? []),app]);setCreating(false);setName('');setRedirect('');
  }catch(reason){if(reason.field)setFieldError(reason);else setError(reason.message);}
  finally{setBusy(false);}
 }
 async function update(app,values) {
  setBusy(true);setError('');
  try {
   const updated=await api('/api/developer/apps/'+app.id,{method:'PUT',json:values});
   setApps(current=>current.map(item=>item.id===app.id?updated:item));
   setConfirm(null);
  }catch(reason){setError(reason.message);}
  finally{setBusy(false);}
 }
 return <div className="access-settings">
  <PanelSection title="Приложения" hint="OAuth даёт доступ к базовому профилю после согласия пользователя.">
   <button type="button" className="access-link-action" aria-expanded={creating} onClick={()=>setCreating(value=>!value)}><PanelIcon name={creating?'close':'add'}/>{creating?'Отмена':'Создать приложение'}</button>
  </PanelSection>
  {creating && <form className="access-card panel-fields panel-section-enter" onSubmit={create}>
   <FloatingField label="Название приложения" required value={name} maxLength={80} error={fieldError?.field==='name'?fieldError.message:''} onChange={event=>{setName(event.target.value);if(fieldError?.field==='name')setFieldError(null);}}/>
   <FloatingField label="Адрес возврата" required type="url" value={redirect} formatError="Введите полный адрес, например https://example.com/callback." error={fieldError?.field==='redirect_uri'?fieldError.message:''} onChange={event=>{setRedirect(event.target.value);if(fieldError?.field==='redirect_uri')setFieldError(null);}}/>
   <button type="submit" className="access-save" disabled={busy}><PanelIcon name="check"/>{busy?'Создаём…':'Создать'}</button>
  </form>}
  {!apps && !error && <Loader/>}
  <FormError message={error}/>
  {apps?.map(app=><PanelSection title={app.name} key={app.id}>
   <div className="panel-fields">
   <FloatingField label="Client ID" readOnly value={app.id}/>
   <FloatingField label="Адрес возврата" readOnly value={app.redirect_uri}/>
   </div>
   <PanelSwitch label="OAuth" checked={app.enabled} disabled={busy} onChange={enabled=>{
    if(enabled)update(app,{enabled:true});
    else setConfirm({app,values:{enabled:false},label:'Выключить OAuth'});
   }}/>
   {app.enabled && <button type="button" className="access-link-action renewing" onClick={()=>setConfirm({app,values:{revoke:true},label:'Отозвать токены'})}><PanelIcon name="lock"/>Отозвать все токены</button>}
   {confirm?.app.id===app.id && <div className="api-confirm"><p>Выданные токены перестанут действовать. Для доступа нужно будет снова авторизоваться.</p><div className="panel-actions">
    <button type="button" onClick={()=>setConfirm(null)}>Отмена</button><button type="button" onClick={()=>update(app,confirm.values)} disabled={busy}>{confirm.label}</button>
   </div></div>}
  </PanelSection>)}
  <PanelSection title="OAuth 2.0" hint={<>Authorization Code с PKCE S256. Область доступа <code>profile</code>.</>}>
   <dl className="panel-endpoints"><dt>Согласие</dt><dd><code>/oauth/authorize</code></dd><dt>Токен</dt><dd><code>/oauth/token</code></dd><dt>Профиль</dt><dd><code>/oauth/userinfo</code></dd></dl>
  </PanelSection>
 </div>;
}
