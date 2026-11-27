import { cookies } from "next/headers";
import { list } from "@vercel/blob";
import { validSession } from "../presencas/session";
import DownloadAll from "./download-all";
export const dynamic="force-dynamic";
export const metadata={title:"Álbum privado · Reino da Lis",robots:{index:false,follow:false}};
export default async function Album({searchParams}:{searchParams:Promise<{erro?:string}>}){
 if(!validSession((await cookies()).get("lis_album")?.value)){
 const {erro}=await searchParams;
 return <main className="royalPage gatePage"><section className="royalCard gateCard"><h1>Álbum da Princesa Lis</h1><form className="rsvpForm" method="post" action="/album/sessao"><label className="rsvpLabel">Senha do painel<input name="password" type="password" autoComplete="current-password" required maxLength={128}/></label>{erro&&<p>Senha incorreta.</p>}<button className="royalButton">Entrar</button></form></section></main>;
 }
 let photos:{id:string;date:number}[]=[];let failed=false;
 try{let cursor:string|undefined;do{const page=await list({prefix:"aniversario-lis/",limit:100,cursor});for(const blob of page.blobs){const id=blob.pathname.slice("aniversario-lis/".length,-4);if(/^[0-9a-f-]{36}$/.test(id)&&blob.pathname.endsWith(".jpg"))photos.push({id,date:blob.uploadedAt.getTime()});}cursor=page.hasMore?page.cursor:undefined;}while(cursor);photos.sort((a,b)=>b.date-a.date);}catch{failed=true;photos=[];}
 return <main className="royalPage dashboardPage"><section className="royalCard dashboardCard"><header className="dashboardHeader"><h1>Álbum da Princesa Lis</h1><form action="/album/sessao" method="post"><button className="addGuest" name="logout" value="yes">Sair</button></form></header>{failed?<p role="alert">Não foi possível consultar o armazenamento. Atualize a página.</p>:<><p>{photos.length} fotos recebidas</p><DownloadAll ids={photos.map(p=>p.id)}/><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}}>{photos.map(p=><article key={p.id}><a href={"/album/foto/"+p.id} target="_blank" rel="noreferrer"><img loading="lazy" alt="Foto da festa" src={"/album/foto/"+p.id} style={{width:"100%",aspectRatio:"3/4",objectFit:"cover",borderRadius:8}}/></a><a href={"/album/foto/"+p.id+"?download=1"}>Baixar foto</a></article>)}</div></>}</section></main>;
}