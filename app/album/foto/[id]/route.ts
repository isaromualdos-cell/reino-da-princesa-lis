import { cookies } from "next/headers";
import { validSession } from "../../../presencas/session";
import { get } from "@vercel/blob";
export const dynamic="force-dynamic";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!validSession((await cookies()).get("lis_album")?.value)) return new Response(null,{status:403});
 const {id}=await params;
 if(!/^[0-9a-f-]{36}$/.test(id)) return new Response(null,{status:404});
 try{
 const photo=await get("aniversario-lis/"+id+".jpg",{access:"private"});
 if(photo?.statusCode!==200)return new Response(null,{status:404});
 return new Response(photo.stream,{headers:{"Content-Type":"image/jpeg","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","Content-Disposition":(new URL(request.url).searchParams.has("download")?"attachment":"inline")+'; filename="lis-'+id+'.jpg"'}});
 }catch{return new Response(null,{status:503});}
}