import {defineConfig} from 'vite';
export default defineConfig({
 define:{'process.env.NODE_ENV':JSON.stringify('production')},
 build:{
  outDir:'../static/chat-web',
  emptyOutDir:true,
  lib:{entry:'src/main.jsx',formats:['es'],fileName:()=> 'tornado.js',cssFileName:'tornado'},
 },
});
