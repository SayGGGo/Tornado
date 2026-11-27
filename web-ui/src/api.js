const appRoot = document.querySelector('meta[name="tornado-root"]')?.content || '';
export function appPath(path) {
 return typeof path==='string' && path.startsWith('/') && !path.startsWith('//') &&
  !(appRoot && (path===appRoot || path.startsWith(appRoot+'/')))?appRoot+path:path;
}
const panelCache = new Map();
export const account = JSON.parse(document.getElementById('tornado-session').textContent);
const panelStorageKey='tornado:panels-v2:'+account.id;
const persistentPanel=path=>/^\/api\/(user\/\d+|chats\/\d+\/info)$/.test(path);
try {
 for(const [path,entry] of Object.entries(JSON.parse(sessionStorage.getItem(panelStorageKey)) || {}))
  if(persistentPanel(path) && Date.now()-entry.at<300000)panelCache.set(path,entry);
} catch {}
function persistPanels() {
 try {sessionStorage.setItem(panelStorageKey,JSON.stringify(Object.fromEntries([...panelCache].filter(([path])=>persistentPanel(path)))));}
 catch {}
}
export function cachedPanel(path) {
 const entry=panelCache.get(path);
 return entry && Date.now()-entry.at<(persistentPanel(path)?300000:30000)?entry.value:undefined;
}
export function fetchPanel(path, signal) {
 const stored=cachedPanel(path);
 if(stored!==undefined) return Promise.resolve(stored);
 return api(path,{signal}).then(value=>{
  if(!signal?.aborted) {
   if(panelCache.size>=64) panelCache.delete(panelCache.keys().next().value);
   panelCache.set(path,{at:Date.now(),value});
   if(persistentPanel(path))persistPanels();
  }
  return value;
 });
}
export const connectionMessage = "Соединение с сервером потеряно";

export async function api(path, options={}) {
 const {json,...request} = options;
 if (json!==undefined) {
  request.headers = {'Content-Type':'application/json',...request.headers};
  request.body = JSON.stringify(json);
 }
 let response;
 try {
  response = await fetch(appPath(path),request);
 } catch (error) {
  if (request.signal?.aborted) throw error;
  window.dispatchEvent(new Event('tornado:connection-lost'));
  throw new Error(connectionMessage);
 }
 if ([502,503,504].includes(response.status)) {
  window.dispatchEvent(new Event('tornado:connection-lost'));
  throw new Error(connectionMessage);
 }
 if (response.status===401) {
  location.assign(appPath('/login'));
  throw new Error('Сеанс завершён');
 }
 let result;
 try {
  result = await response.json();
 } catch (error) {
  if (request.signal?.aborted) throw error;
  if (response.status >= 500) {
   window.dispatchEvent(new Event('tornado:connection-lost'));
   throw new Error(connectionMessage);
  }
  throw new Error('Сервер вернул неожиданный ответ');
 }
 if (!response.ok || result?.error) {
  const fallback={
   400:'Проверьте введённые данные.',
   403:'У вас нет доступа к этому действию.',
   404:'Эти данные больше недоступны.',
   413:'Файл слишком большой. Выберите файл меньшего размера.',
   429:'Слишком много запросов. Подождите немного.',
  };
  const detail=[result?.error,result?.description].find(value=>typeof value==='string' && /[а-яё]/i.test(value));
  const error=new Error(detail || fallback[response.status] || 'Не удалось выполнить действие.');
  error.field=result?.field;
  throw error;
 }
 if (request.method && request.method!=='GET') {
  const relatedChat=path.match(/^\/api\/chats\/(\d+)(?:\/|\?|$)/)?.[1];
  for(const key of panelCache.keys()){
   if(!persistentPanel(key) || path.startsWith('/api/user/profile') && key==='/api/user/'+account.id ||
      relatedChat && key==='/api/chats/'+relatedChat+'/info')panelCache.delete(key);
  }
  persistPanels();
 }
 return result;
}
export const formatTime = new Intl.DateTimeFormat('ru-RU',{hour:'2-digit',minute:'2-digit'});
const formatPresenceDate = new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'short'});
export function presenceLabel(profile) {
 if(profile?.online) return 'в сети';
 const value=profile?.last_seen;
 if(!value) return '';
 const date=new Date(value.includes('T')?value:value.replace(' ','T')+'Z');
 if(!Number.isFinite(date.valueOf())) return '';
 return 'был(а) '+formatPresenceDate.format(date)+' в '+formatTime.format(date);
}
const russianPlural = new Intl.PluralRules('ru-RU');
export function participantLabel(count,channel) {
 const forms=channel?{one:'подписчик',few:'подписчика',many:'подписчиков'}:{one:'участник',few:'участника',many:'участников'};
 return count.toLocaleString('ru-RU')+' '+(forms[russianPlural.select(count)] || forms.many);
}
export function messageFromServer(row, group) {
 return {
  id:row.id, text:row.content, own:row.user_id===account.id, at:Date.parse(row.sent_at),
  sender:group && row.user_id!==account.id?(row.author_name || row.login):null, author:row.author_name || row.login, authorId:row.user_id, avatar:row.avatar, reactions:row.reactions || [],
  read:row.is_read, edited:row.is_edited, keyboard:row.reply_markup?.inline_keyboard, quote:row.reply?.text, audio:row.file_type?.startsWith('audio/')?appPath(row.file_url):null,
  file:row.file_url && !row.file_type?.startsWith('audio/')?{name:row.file_name,url:appPath(row.file_url)}:null,
 };
}
export async function sendToChat(chatId, values) {
 const content = values.forwarded?'Переслано из «'+values.forwarded+'»\n'+(values.text || ''):values.text || '';
 if (values.file || values.audio) {
  const upload = new FormData();
  upload.set('chat_id',chatId);
  upload.set('caption',content);
  if (values.forwardFrom) upload.set('forward_from',values.forwardFrom);
  if (values.replyId) upload.set('reply_to_id',values.replyId);
  if (values.audio) upload.set('msg_type','voice');
  let attachment = values.audio || values.file;
  const filename = values.file?.name || 'voice.webm';
  if (!(attachment instanceof Blob)) {
   const response = await fetch(attachment.url || attachment);
   if (!response.ok) throw new Error('Не удалось открыть вложение');
   attachment = await response.blob();
  }
  upload.append('file',attachment,filename);
  if (values.onProgress) return new Promise((resolve,reject)=>{
   const request=new XMLHttpRequest();
   request.open('POST',appPath('/api/upload'));
   request.responseType='json';
   request.upload.onprogress=event=>{if(event.lengthComputable)values.onProgress(Math.round(event.loaded/event.total*100));};
   request.upload.onload=()=>values.onProgress(100);
   request.onerror=()=>reject(new Error('Соединение прервалось во время загрузки файла.'));
   request.onload=()=>{
    if(request.status===401){location.assign(appPath('/login'));reject(new Error('Сеанс завершён.'));return;}
    if(request.status>=200 && request.status<300 && request.response?.success){resolve(request.response);return;}
    reject(new Error(request.response?.error || (request.status===413?'Файл превышает допустимый размер.':'Не удалось загрузить файл. HTTP '+request.status+'.')));
   };
   request.send(upload);
  });
  return api('/api/upload',{method:'POST',body:upload});
 }
 return api('/api/messages',{method:'POST',json:{chat_id:Number(chatId),content,reply_to_id:values.replyId,forward_from:values.forwardFrom}});
}
