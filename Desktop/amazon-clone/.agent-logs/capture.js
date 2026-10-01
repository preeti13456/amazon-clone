#!/usr/bin/env node
// Claude Code hook: logs prompt (UserPromptSubmit) and final response (Stop). No thinking/tool calls.
const fs=require("fs"),path=require("path");
const DIR=__dirname,AUTHOR=process.env.GITHUB_HANDLE||process.env.USER||"unknown",PROJECT=path.basename(path.resolve(DIR,".."));
let raw="";process.stdin.on("data",d=>raw+=d).on("end",()=>{try{run(JSON.parse(raw))}catch(e){fs.appendFileSync(path.join(DIR,"capture-errors.txt"),new Date().toISOString()+" "+e.stack+"\n")}});
const readT=p=>{try{return fs.readFileSync(p,"utf8").split("\n").filter(Boolean).map(l=>{try{return JSON.parse(l)}catch{}}).filter(Boolean)}catch{return[]}};
const textOf=m=>typeof m.content==="string"?m.content:(m.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("\n");
function lastModel(t){for(let i=t.length-1;i>=0;i--)if(t[i].message&&t[i].message.model&&t[i].message.model!=="<synthetic>")return t[i].message.model;return process.env.ANTHROPIC_MODEL||"unknown"}
function run(e){
 const sid=e.session_id,short=sid.slice(0,8),now=new Date().toISOString();
 let f=fs.readdirSync(DIR).find(x=>x.endsWith("_"+short+".md"));
 const T=e.transcript_path?readT(e.transcript_path):[];const model=lastModel(T);
 if(!f){f=now.slice(0,10)+"_"+now.slice(11,19).replace(/:/g,"-")+"_"+short+".md";
  fs.writeFileSync(path.join(DIR,f),`---\nsession_id: ${sid}\ndate: ${now.slice(0,10)}\nauthor: ${AUTHOR}\nmodel: ${model}\ntool: claude-code\nproject: ${PROJECT}\ntotal_exchanges: 0\nfirst_prompt_time: ${now}\nlast_prompt_time: ${now}\n---\n\n# Session Log - ${now.slice(0,10)}\n\nSession: \`${short}\` | Project: \`${PROJECT}\` | Author: \`${AUTHOR}\`\n\n---\n`)}
 const fp=path.join(DIR,f);let s=fs.readFileSync(fp,"utf8");
 const nP=(s.match(/type=PROMPT/g)||[]).length,nR=(s.match(/type=RESPONSE/g)||[]).length;
 if(e.hook_event_name==="UserPromptSubmit"){
  s+=`\n[LOG_ENTRY type=PROMPT num=${nP+1} session=${short}]\ntimestamp: ${now}\nmodel: ${model}\n\n${e.prompt}\n\n`;
  s=s.replace(/total_exchanges: \d+/,"total_exchanges: "+(nP+1)).replace(/last_prompt_time: .*/,"last_prompt_time: "+now);
 }else if(e.hook_event_name==="Stop"&&nR<nP){
  let lastUser=-1;T.forEach((x,i)=>{if(x.type==="user"&&x.message&&x.message.role==="user"&&!(Array.isArray(x.message.content)&&x.message.content.every(b=>b.type==="tool_result")))lastUser=i});
  const texts=T.slice(lastUser+1).filter(x=>x.type==="assistant").map(x=>textOf(x.message)).filter(t=>t.trim());
  const final=texts.length?texts[texts.length-1]:(e.last_assistant_message||"(no text response)");
  s+=`\n[LOG_ENTRY type=RESPONSE num=${nP} session=${short}]\ntimestamp: ${now}\nmodel: ${model}\n\n${final}\n\n`;
 }
 fs.writeFileSync(fp,s);
}
