import {api,appPath} from './api.js';

export function connectRealtime({onStatus,onChange}) {
 let socket;
 let socketReady = false;
 let socketTimeout;
 let probeTimer;
 let startFallback;
 let pollController;
 let retryTimer;
 let retryDelay = 700;
 let stopped = false;
 let connected = false;
 let cursor = {epoch:'',seq:-1};

 function setStatus(value) {
  if (connected===value) return;
  connected = value;
  onStatus(value);
 }
 function frame(data) {
  if (typeof data.epoch!=='string' || !Number.isInteger(data.seq)) return false;
  const refresh = !connected || cursor.epoch!==data.epoch || cursor.seq!==data.seq;
  cursor = {epoch:data.epoch,seq:data.seq};
  retryDelay = 700;
  setStatus(true);
  if (refresh) onChange();
  return true;
 }
 function openSocket() {
  if (stopped || socket || !navigator.onLine) return;
  let candidate;
  try {
   const url = new URL(appPath('/api/chats/socket'),location.href);
   url.protocol = location.protocol==='https:'?'wss:':'ws:';
   candidate = new WebSocket(url);
  } catch {
   beginPolling();
   return;
  }
  socket = candidate;
  socketTimeout = setTimeout(()=>candidate.close(),1800);
  candidate.onmessage = event=>{
   let data;
   try {data=JSON.parse(event.data);} catch {return;}
   if (socket!==candidate || stopped || !frame(data)) return;
   socketReady = true;
   clearTimeout(socketTimeout);
   socketTimeout = setTimeout(()=>candidate.close(),45000);
   pollController?.abort();
  };
  candidate.onclose = ()=>{
   if (socket!==candidate) return;
   socket = null;
   clearTimeout(socketTimeout);
   if (socketReady) setStatus(false);
   socketReady = false;
   beginPolling();
  };
 }
 async function beginPolling() {
  if (stopped || socketReady || pollController || retryTimer || !navigator.onLine) return;
  const controller = new AbortController();
  pollController = controller;
  try {
   while (!stopped && !socketReady && navigator.onLine) {
    const timeout = setTimeout(()=>controller.abort('timeout'),28000);
    try {
     const data = await api('/api/chats/realtime?'+new URLSearchParams(cursor),{signal:controller.signal,cache:'no-store'});
     if (stopped || socketReady) break;
     if (!frame(data)) throw new Error('Неверный ответ сервера');
    } finally {clearTimeout(timeout);}
   }
  } catch {
   if (stopped || socketReady || !navigator.onLine) return;
   setStatus(false);
   retryTimer = setTimeout(()=>{
    retryTimer = null;
    openSocket();
    beginPolling();
   },retryDelay + Math.random()*200);
   retryDelay = Math.min(retryDelay*2,10000);
  } finally {
   pollController = null;
   if (!stopped && !socketReady && !retryTimer && navigator.onLine) beginPolling();
  }
 }
 function online() {
  clearTimeout(retryTimer);
  retryTimer = null;
  retryDelay = 700;
  openSocket();
  beginPolling();
 }
 function offline() {
  setStatus(false);
  socket?.close();
  pollController?.abort();
 }
 const requestFailed = () => setStatus(false);
 window.addEventListener('tornado:connection-lost',requestFailed);
 window.addEventListener('online',online);
 window.addEventListener('offline',offline);
 openSocket();
 startFallback = setTimeout(beginPolling,650);
 probeTimer = setInterval(()=>{if (!socketReady) openSocket();},60000);
 return ()=>{
  stopped = true;
  clearTimeout(startFallback);
  clearTimeout(retryTimer);
  clearTimeout(socketTimeout);
  clearInterval(probeTimer);
  socket?.close();
  pollController?.abort();
  window.removeEventListener('tornado:connection-lost',requestFailed);
  window.removeEventListener('online',online);
  window.removeEventListener('offline',offline);
 };
}
