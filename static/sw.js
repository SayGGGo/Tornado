self.addEventListener('push', event => {
 if (!event.data) return;
 let data;
 try {data=event.data.json();} catch {return;}
 event.waitUntil(self.registration.showNotification(data.title || 'Tornado', {
  body:data.body || 'Новое сообщение',
  icon:'/static/icons/logo.svg',
  tag:data.tag,
  data:{chatId:data.chatId},
 }));
});
self.addEventListener('notificationclick', event => {
 event.notification.close();
 const id=Number(event.notification.data?.chatId);
 const path='/chat'+(Number.isInteger(id) && id>0?'?chat='+id:'');
 event.waitUntil(self.clients.openWindow(path));
});
