// Capture actual local browser interactions on a 1920×1080 desktop.
// Requires ffmpeg, xdotool, and Chrome with a CDP port; no application fixtures
// or DOM content are injected. The app itself provides its labeled mock mode.
import {chromium} from 'playwright';
import {spawn,execFileSync} from 'node:child_process';
import fs from 'node:fs/promises';
await fs.mkdir('public',{recursive:true});
await fs.mkdir('output',{recursive:true});
const browser=await chromium.connectOverCDP(process.env.CDP_URL||'http://localhost:29229');
const page=browser.contexts()[0].pages()[0];
const timing=JSON.parse(await fs.readFile('public/timing.json','utf8'));
await page.goto(process.env.APP_URL||'http://localhost:5173');
await page.evaluate(()=>document.fonts.ready);await page.bringToFront();
const screen=await page.evaluate(()=>({width:innerWidth,height:innerHeight}));
if(screen.width!==1920||screen.height!==1080)throw Error('Use a fullscreen 1920×1080 browser');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const events=[];let t0=0;let last={x:1650,y:90};
const now=()=>Math.max(0,(performance.now()-t0)/1000);
function pointer(x,y,click=false){x=Math.round(x);y=Math.round(y);execFileSync('xdotool',['mousemove','--sync',String(x),String(y)]);if(click)execFileSync('xdotool',['click','1']);last={x,y};events.push({t:now(),x,y,click});}
async function moveTo(x,y,click=false){const from={...last};for(let i=1;i<=12;i++){const u=i/12;const ease=u*u*(3-2*u);pointer(from.x+(x-from.x)*ease,from.y+(y-from.y)*ease);await wait(14)}if(click)pointer(x,y,true);}
async function click(locator){const r=await locator.boundingBox();if(!r)throw Error('Missing visible control');await moveTo(r.x+r.width/2,r.y+r.height/2,true);}
async function frame(selector,top=100){await page.locator(selector).evaluate((e,top)=>scrollTo({top:e.getBoundingClientRect().top+scrollY-top,behavior:'smooth'}),top);await wait(850);}
async function at(seconds,action){await wait(Math.max(0,seconds*1000-(performance.now()-t0)));await action();}
pointer(1650,90);await wait(300);
const recorder=spawn('ffmpeg',['-y','-f','x11grab','-framerate','30','-video_size','1920x1080','-draw_mouse','1','-i',process.env.DISPLAY||':0','-an','-c:v','libx264','-preset','ultrafast','-crf','18','-pix_fmt','yuv420p','public/desktop-capture.mp4'],{stdio:['pipe','ignore','pipe']});
let logs='';recorder.stderr.on('data',d=>{logs+=d.toString()});
await wait(500);t0=performance.now();events.length=0;events.push({t:0,...last,click:false});
console.log('CAPTURE START');
await at(timing[1].start,async()=>{console.log('CLAIM');await click(page.getByRole('link',{name:'Triage',exact:true}));await wait(650);await frame('#claim-text',170)});
await at(timing[1].start+3.0,async()=>{await click(page.getByRole('button',{name:'Evaluate claim'}));await page.getByText('Demo batch complete. Six typed answers ready.').waitFor()});
await at(timing[2].start,async()=>{console.log('PROBABILITIES');await frame('.question-grid',135);await moveTo(1430,530)});
await at(timing[2].start+7,async()=>{await frame('.question-card:nth-child(4)',180)});
await at(timing[3].start,async()=>{console.log('THRESHOLD');await frame('.routing-panel',180)});
await at(timing[3].start+4.0,async()=>{
 const slider=page.locator('#triage-threshold'),r=await slider.boundingBox();
 const xFor=v=>r.x+8+(r.width-16)*(v-.5)/.49;
 await moveTo(xFor(.85),r.y+r.height/2);execFileSync('xdotool',['mousedown','1']);
 for(let i=1;i<=20;i++){pointer(xFor(.85-i*.01),r.y+r.height/2);await wait(30)}
 execFileSync('xdotool',['mouseup','1']);
 const value=await slider.inputValue();if(value!=='0.65')throw Error(`Threshold landed ${value}`);
 if(await page.locator('.routing-decision h4').innerText()!=='Simulated auto-approve')throw Error('Dental route did not flip');
 console.log('AUTO APPROVE VERIFIED');
 await moveTo(1460,365);
});
await at(timing[4].start,async()=>{console.log('ECONOMICS');await click(page.getByRole('link',{name:'Economics',exact:true}));await wait(600);await frame('.economics-layout',125);await moveTo(1570,490)});
await at(timing[5].start,async()=>{console.log('EVALUATION');await click(page.getByRole('link',{name:'Evaluation',exact:true}));await wait(600);await frame('.eval-toolbar',135);await moveTo(1590,530)});
await at(timing[6].start,async()=>{console.log('DOCS');await click(page.getByRole('link',{name:'Docs',exact:true}));await wait(600);await frame('.docs-grid',180)});
await at(timing[6].start+2.8,async()=>{await click(page.locator('.doc-link').first());await page.waitForURL('**/docs/README.html');await page.evaluate(()=>document.fonts.ready);await moveTo(1600,680)});
await at(timing[6].start+6.8,async()=>{await page.mouse.wheel(0,450)});
await at(timing.at(-1).start+timing.at(-1).duration+.25,async()=>{});
recorder.stdin.write('q\n');await new Promise(r=>recorder.once('exit',r));
await fs.writeFile('public/capture-events.json',JSON.stringify({leadIn:.5,events},null,2));
await fs.writeFile('output/capture.log',logs);
await browser.close();console.log('CAPTURE COMPLETE');
