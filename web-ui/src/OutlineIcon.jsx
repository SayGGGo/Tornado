import React from 'react';
import {BellOff,CircleAlert,Download} from 'lucide-react';
import {Archive,ArrowLeft,ArrowRight,ArrowUp,Bell,Camera,Check,CheckCheck,ChevronDown,ChevronRight, CircleCheck, DoorOpen,EllipsisVertical, ExternalLink, Eye, Folder, Forward, Globe, Heart, Info, Keyboard, LayoutGrid, Link2, Lock, LockOpen, Menu, MessageCircle, Mic, Paperclip, Pencil, Phone, Plus, QrCode, Reply, Search, Settings, Shield, ShieldCheck, Smile, Square, Trash2, UserRound, UserRoundPlus, UserRoundX, Users, Video, X, Megaphone, Copy, RefreshCw, Pin, AtSign, CircleSlash, Code2, Clock} from 'lucide-react';

const icons={error:CircleAlert,archive:Archive,arrow_back:ArrowLeft,arrow_forward:ArrowRight,check:Check,checkAll:CheckCheck,close:X,
 edit:Pencil,search:Search,phone:Phone,telephone:Phone,more:EllipsisVertical,menu:Menu,expand_more:ChevronDown,chevron_right:ChevronRight,
 notifications:Bell,notifications_off:BellOff,privacy_tip:Shield,admin_panel_settings:ShieldCheck,account_circle:UserRound,person:UserRound,group_add:UserRoundPlus,
 person_add:UserRoundPlus,person_off:UserRoundX,how_to_reg:UserRoundPlus,groups:Users,info:Info,alternate_email:AtSign,chat_bubble:MessageCircle,
 forum:MessageCircle,lock:Lock,lock_open:LockOpen,favorite:Heart,qr_code_2:QrCode,add_a_photo:Camera,photo_camera:Camera,
 content_copy:Copy,view_compact_alt:LayoutGrid,keyboard:Keyboard,logout:DoorOpen,link:Link2,public:Globe,autorenew:RefreshCw,
 campaign:Megaphone,block:CircleSlash,videocam:Video,mark_chat_unread:MessageCircle,check_circle:CircleCheck,open_in_new:ExternalLink,
 visibility:Eye,folder:Folder,forward:Forward,reply:Reply,push_pin:Pin,delete:Trash2,trash:Trash2,paperclip:Paperclip,mic:Mic,
 send:ArrowUp,stop:Square,smile:Smile,down:ChevronDown,settings:Settings,add:Plus,code:Code2,schedule:Clock,download:Download};
export function OutlineIcon({name}) {
 const Icon=icons[name];
 return Icon?<Icon aria-hidden="true" className="outline-icon profile-symbol" size={20} strokeWidth={1.75}/>:null;
}
