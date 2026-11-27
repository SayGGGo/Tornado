import React from 'react';
import person from 'bootstrap-icons/icons/person-circle.svg';
import info from 'bootstrap-icons/icons/info-circle-fill.svg';
import bell from 'bootstrap-icons/icons/bell-fill.svg';
import people from 'bootstrap-icons/icons/people-fill.svg';
import envelope from 'bootstrap-icons/icons/envelope-at-fill.svg';
import chat from 'bootstrap-icons/icons/chat-fill.svg';
import lock from 'bootstrap-icons/icons/lock-fill.svg';
import shield from 'bootstrap-icons/icons/shield-lock-fill.svg';
import Heart from 'bootstrap-icons/icons/heart-fill.svg';
import clock from 'bootstrap-icons/icons/clock-fill.svg';
import globe from 'bootstrap-icons/icons/globe-americas.svg';
import link from 'bootstrap-icons/icons/link-45deg.svg';
import layout from 'bootstrap-icons/icons/grid-1x2-fill.svg';
import keyboard from 'bootstrap-icons/icons/keyboard-fill.svg';
import logout from 'bootstrap-icons/icons/door-open-fill.svg';
import qr from 'bootstrap-icons/icons/qr-code.svg';
import camera from 'bootstrap-icons/icons/camera-fill.svg';
import cameraAdd from 'bootstrap-icons/icons/camera-fill.svg';
import mic from 'bootstrap-icons/icons/mic-fill.svg';
import clip from 'bootstrap-icons/icons/paperclip.svg';
import smile from 'bootstrap-icons/icons/emoji-smile.svg';
import send from 'bootstrap-icons/icons/send-fill.svg';
import stop from 'bootstrap-icons/icons/stop-fill.svg';
import pencil from 'bootstrap-icons/icons/pencil-fill.svg';
import personPlus from 'bootstrap-icons/icons/person-plus-fill.svg';
import personX from 'bootstrap-icons/icons/person-x-fill.svg';
import personCheck from 'bootstrap-icons/icons/person-check-fill.svg';
import repeat from 'bootstrap-icons/icons/arrow-repeat.svg';
import copy from 'bootstrap-icons/icons/copy.svg';
import check from 'bootstrap-icons/icons/check-lg.svg';
import checkAll from 'bootstrap-icons/icons/check2-all.svg';
import trash from 'bootstrap-icons/icons/trash3.svg';
import forward from 'bootstrap-icons/icons/reply.svg';
import down from 'bootstrap-icons/icons/chevron-down.svg';
import telephone from 'bootstrap-icons/icons/telephone.svg';
import search from 'bootstrap-icons/icons/search.svg';
import more from 'bootstrap-icons/icons/three-dots-vertical.svg';
import back from 'bootstrap-icons/icons/arrow-left.svg';
import close from 'bootstrap-icons/icons/x-lg.svg';
const assets={account_circle:person,info,notifications:bell,groups:people,alternate_email:envelope,chat_bubble:chat,
 forum:chat,lock,admin_panel_settings:shield,privacy_tip:shield,favorite:Heart,schedule:clock,public:globe,link,
 view_compact_alt:layout,keyboard,logout,qr_code_2:qr,photo_camera:camera,add_a_photo:cameraAdd,mic,paperclip:clip,smile,send,stop,
 edit:pencil,person_add:personPlus,person_off:personX,how_to_reg:personCheck,autorenew:repeat,content_copy:copy,check,arrow_back:back,close,checkAll,trash,forward,down,telephone,search,more,
};
export function FilledIcon({name,fallback=null}) {
 const asset=assets[name];
 return asset?<img className="pack-icon" src={asset} alt="" aria-hidden="true"/>:fallback;
}
