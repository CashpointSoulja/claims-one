"""Generate free British-English narration and scene timing, without paid APIs."""
import asyncio, json, pathlib, subprocess
import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent
async def main():
    (ROOT/"public").mkdir(parents=True,exist_ok=True)
    (ROOT/"output").mkdir(parents=True,exist_ok=True)
    scenes=json.loads((ROOT/"scenes.json").read_text())
    start=0
    captions=[]
    for s in scenes:
        audio=ROOT/"public"/f"{s['id']}.mp3"
        words=[]
        with audio.open("wb") as output:
            async for event in edge_tts.Communicate(s["text"], "en-GB-RyanNeural", rate="+8%", boundary="WordBoundary").stream():
                if event["type"]=="audio":
                    output.write(event["data"])
                elif event["type"]=="WordBoundary":
                    words.append(event)
        seconds=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",str(audio)]))
        s.update(start=round(start,3),duration=round(seconds+0.3,3),audio=f"{s['id']}.mp3")
        for offset in range(0,len(words),10):
            group=words[offset:offset+10]
            captions.append({"start":round(start+group[0]["offset"]/1e7,3),"end":round(start+(group[-1]["offset"]+group[-1]["duration"])/1e7,3),"text":" ".join(w["text"] for w in group)})
        start+=s["duration"]
    (ROOT/"public"/"timing.json").write_text(json.dumps(scenes,indent=2))
    (ROOT/"public"/"captions.json").write_text(json.dumps(captions,indent=2))
    def stamp(t):
        ms=round(t*1000);return f"{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}"
    (ROOT/"output"/"narration.srt").write_text("\n\n".join(f"{i+1}\n{stamp(s['start'])} --> {stamp(s['end'])}\n{s['text']}" for i,s in enumerate(captions))+"\n")
    print(f"Narration: {start:.2f}s")
asyncio.run(main())
