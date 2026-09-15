import {toPng} from 'html-to-image'
export async function exportPng(node,handle){if(!node) return;const data=await toPng(node,{cacheBust:true,pixelRatio:2,backgroundColor:'#0b0b0f'});const a=document.createElement('a');a.download=`cp-pulse-${handle||'summary'}.png`;a.href=data;a.click()}
