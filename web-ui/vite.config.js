import {defineConfig} from 'vite';
export default defineConfig({
 define:{'process.env.NODE_ENV':JSON.stringify('production')},
 build:{
  outDir:'../static/chat-web',
  emptyOutDir:true,
  lib:{entry:'src/main.jsx',name:'TornadoChat',formats:['iife'],fileName:()=> 'tornado.js',cssFileName:'tornado'},
 },
});
