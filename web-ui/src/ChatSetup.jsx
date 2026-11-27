import React,{useEffect,useState,useRef} from 'react';
import {api} from './api.js';
import {AvatarPicker,FloatingField,FormError,PanelFooter,PanelIcon,PanelSection,Portrait,Loader,uploadChatAvatar} from './panelControls.jsx';

export default function ChatSetup({page,setPage,onDone}) {
 const [query,setQuery] = useState('');
 const [people,setPeople] = useState(null);
 const [chosen,setChosen] = useState([]);
 const [name,setName] = useState('');
 const [description,setDescription] = useState('');
 const [photo,setPhoto] = useState(null);
 const [error,setError] = useState('');
 const [searchError,setSearchError] = useState('');
 const [fieldError,setFieldError] = useState(null);
 const [saving,setSaving] = useState(false);
 const created = useRef(null);
 const personal = page.view==='new-chat';
 const invite = page.view==='invite';
 const channel = page.view==='new-channel';
 const details = channel || page.step===2;
 useEffect(()=>{
  if (details) return;
  const controller=new AbortController();
  setSearchError('');
  setPeople(null);
  const timer=setTimeout(()=>{
   api('/api/users/search?q='+encodeURIComponent(query.trim()),{signal:controller.signal})
    .then(result=>{if(!controller.signal.aborted)setPeople(result);})
    .catch(reason=>{if(!controller.signal.aborted)setSearchError(reason.message);});
  },query?180:0);
  return ()=>{clearTimeout(timer);controller.abort();};
 },[query,details]);
 async function submit(event) {
  event.preventDefault();
  if (saving) return;
  if (!personal && !invite && !details) {setPage({...page,step:2});return;}
  setError('');
  setFieldError(null);
  if(details && !name.trim()){setFieldError({field:'name',message:'Введите название.'});return;}
  if((personal || invite) && !chosen.length)return;
  setSaving(true);
  try {
   if (personal) {
    const data=await api('/api/chats/get_or_create',{method:'POST',json:{target_user_id:chosen[0].id}});
    await onDone(data.chat_id);
   } else if (invite) {
    await api('/api/chats/invite',{method:'POST',json:{chat_id:Number(page.id),participants:chosen.map(user=>user.id)}});
    await onDone(page.id,true);
   } else {
    if (!created.current) {
     const data=await api('/api/chats/group',{method:'POST',json:{name:name.trim(),description:description.trim(),chat_type:channel?'channel':'group',participants:chosen.map(user=>user.id)}});
     created.current=data.chat_id;
    }
    if (photo) await uploadChatAvatar(api,created.current,photo);
    await onDone(created.current,true);
   }
  } catch (reason) {if(reason.field)setFieldError(reason);else setError(reason.message);}
  finally {setSaving(false);}
 }
 const label = personal?'Написать сообщение':invite?'Добавить':details?'Создать':'Далее';
 const errorFor=key=>fieldError?.field===key?fieldError.message:'';
 function changeField(key,set,value) {
  setFieldError(current=>current?.field===key?null:current);
  set(value);
 }
 return <form className="chat-setup panel-flow" onSubmit={submit}>
  {details ? <div className="access-settings panel-section-enter" key="details">
   <AvatarPicker file={photo} onChange={value=>changeField('avatar',setPhoto,value)}/>
   <FormError message={errorFor('avatar')}/>
   <PanelSection title={channel?'Данные канала':'Данные группы'} hint={chosen.length?('Выбрано участников: '+chosen.length):undefined}><div className="panel-fields">
   <FloatingField label={channel?'Название канала':'Название группы'} required maxLength={150} error={errorFor('name')} value={name} onChange={event=>changeField('name',setName,event.target.value)}/>
   <FloatingField label="Описание (необязательно)" multiline rows={2} maxLength={250} error={errorFor('description')} value={description} onChange={event=>changeField('description',setDescription,event.target.value)}/>
   </div></PanelSection>
  </div> : <div className="access-settings panel-section-enter" key="members">
   <FloatingField label="Поиск контактов" type="search" error={searchError} value={query} onChange={event=>setQuery(event.target.value)}/>
   {chosen.length>0 && <div className="people-chips">{chosen.map(user=><button key={user.id} type="button" onClick={()=>setChosen(items=>items.filter(item=>item.id!==user.id))}>{user.fio || user.login}<PanelIcon name="close"/></button>)}</div>}
   {people===null && !searchError && <Loader label="Загрузка контактов…"/>}
   {people?.length>0 && <div className="person-list access-card">{people.map(user=>{
    const selected=chosen.some(item=>item.id===user.id);
    return <button className="profile-row person-row" key={user.id} type="button" aria-pressed={selected} onClick={()=>setChosen(items=>selected?items.filter(item=>item.id!==user.id):personal?[user]:[...items,user])}>
     <Portrait src={user.avatar} name={user.fio || user.login}/><span>{user.fio || user.login}</span><span className="person-select">{selected && <PanelIcon name="check"/>}</span>
    </button>;
   })}</div>}
   {people?.length===0 && <p className="panel-hint">{query?'Никого не найдено.':'Введите имя или никнейм.'}</p>}
  </div>}
  <FormError message={error}/>
  <PanelFooter icon={details || invite?'check':'arrow_forward'} disabled={saving || ((personal || invite) && !chosen.length)}>{saving?'Сохраняем…':label}</PanelFooter>
 </form>;
}
