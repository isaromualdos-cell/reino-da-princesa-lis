import { NextResponse } from "next/server";
import { isSameOrigin } from "../../request-origin";
import { startSession, sessionSeconds } from "../../presencas/session";
export async function POST(request: Request) {
 if (!isSameOrigin(request)) return new Response(null,{status:403});
 const form=await request.formData().catch(()=>null);
 const password=form?.get("password");
 const logout=form?.get("logout")==="yes";
 const token=typeof password==="string" && password.length<=128 ? startSession(password):null;
 const response=new NextResponse(null,{status:303,headers:{Location:logout||token?"/album":"/album?erro=1","Cache-Control":"no-store"}});
 if(logout||token) response.cookies.set("lis_album",logout?"":token!,{path:"/album",httpOnly:true,secure:true,sameSite:"strict",maxAge:logout?0:sessionSeconds});
 return response;
}