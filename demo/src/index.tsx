import {AbsoluteFill,Audio,Composition,Easing,OffthreadVideo,Sequence,interpolate,registerRoot,staticFile,useCurrentFrame} from 'remotion';
import scenes from '../public/timing.json';
import capture from '../public/capture-events.json';
import captions from '../public/captions.json';

const fps=30;
const duration=Math.ceil((scenes.at(-1)!.start+scenes.at(-1)!.duration)*fps);
function Walkthrough(){
 const frame=useCurrentFrame(),t=frame/fps;
 const scene=scenes.find(s=>t>=s.start&&t<s.start+s.duration)||scenes.at(-1)!;
 const local=t-scene.start;
 // A single consistent eased zoom gently emphasizes the answer/route surfaces.
 const emphasized=['probabilities','threshold'].includes(scene.id);
 const z=emphasized?interpolate(local,[0,.9,scene.duration-.9,scene.duration],[1,1.1,1.1,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.inOut(Easing.cubic)}):1;
 const pointer=[...capture.events].reverse().find(e=>e.t<=t)||capture.events[0];
 const sceneCaptions=captions.filter(c=>c.start>=scene.start&&c.start<scene.start+scene.duration);
 // Cue changes use actual TTS word boundaries; hold the last cue through pauses.
 const caption=([...sceneCaptions].reverse().find(c=>c.start<=t)||sceneCaptions[0])?.text||'';
 return <AbsoluteFill style={{background:'#1e1e1e',fontFamily:'Arial, Helvetica, sans-serif'}}>
  <AbsoluteFill style={{transform:`scale(${z})`,transformOrigin:'64% 43%'}}>
   <OffthreadVideo src={staticFile('desktop-capture.mp4')} startFrom={Math.round(capture.leadIn*fps)} muted style={{width:1920,height:1080}}/>
   <div style={{position:'absolute',left:pointer.x-24,top:pointer.y-24,width:48,height:48,borderRadius:'50%',border:'3px solid #f386a1',background:'#f386a122',boxShadow:'0 0 0 2px #1e1e1e55',pointerEvents:'none'}}/>
  </AbsoluteFill>
  {scenes.map(s=><Sequence key={s.id} from={Math.round(s.start*fps)} durationInFrames={Math.ceil(s.duration*fps)}><Audio src={staticFile(s.audio)}/></Sequence>)}
  <div style={{position:'absolute',bottom:0,left:0,right:0,height:125,background:'#1e1e1ef5',borderTop:'2px solid #f386a1',padding:'18px 76px',color:'#fefefe'}}>
   <div style={{fontSize:19,color:'#f386a1',letterSpacing:1,marginBottom:12}}>{String(scenes.indexOf(scene)+1).padStart(2,'0')} / {scene.title.toUpperCase()}</div>
   <div style={{fontSize:30,lineHeight:1.3}}>{caption}</div>
  </div>
  <div style={{position:'absolute',bottom:0,left:0,height:4,width:`${frame/duration*100}%`,background:'#f386a1'}}/>
 </AbsoluteFill>
}
registerRoot(()=> <Composition id="ClaimsOne" component={Walkthrough} width={1920} height={1080} fps={fps} durationInFrames={duration}/>);
