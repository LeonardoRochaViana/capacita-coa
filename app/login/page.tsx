"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, ShieldCheck, BookOpenCheck, BarChart3, LockKeyhole } from "lucide-react";
import { ClealcoLogo } from "@/components/brand/ClealcoLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function LoginPage() {
  const router=useRouter(); const [show,setShow]=useState(false); const [loading,setLoading]=useState(false);
  const [identifier,setIdentifier]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState("");
  async function enter(e:React.FormEvent){
    e.preventDefault();setLoading(true);setError("");
    const response=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({identifier,password})});
    const data=await response.json() as {error?:string};
    if(response.ok){router.replace("/dashboard");router.refresh();return;}
    setError(data.error||"Não foi possível entrar.");setLoading(false);
  }
  const pilares: Array<[React.ElementType,string,string]> = [
    [BookOpenCheck,"Sua mesa","conteúdo específico da sua função"],
    [ShieldCheck,"ITs e checklists","o passo a passo de cada operação"],
    [BarChart3,"Sua trilha","progresso visível, mesa por mesa"],
  ];
  return <main className="relative grid min-h-screen overflow-y-auto bg-[#f5f5f5] dark:bg-[#121214] lg:h-screen lg:min-h-0 lg:grid-cols-[55%_45%] lg:overflow-hidden">
    <ThemeToggle className="fixed right-4 top-4 z-30"/>
    <section className="relative flex min-h-[430px] overflow-hidden bg-[#252525] px-6 py-8 text-white sm:px-10 sm:py-9 lg:h-screen lg:min-h-0 lg:flex-col lg:justify-between lg:px-10 lg:py-7 xl:px-12 xl:py-8">
      <div className="absolute inset-y-0 left-0 w-1.5 bg-[#e30613]"/>
      <div className="absolute -right-32 -top-44 h-[480px] w-[480px] rounded-full border-[76px] border-white/[.025]"/>
      <div className="absolute bottom-[-240px] left-[18%] h-[430px] w-[430px] rotate-45 border-[54px] border-[#e30613]/[.055]"/>
      <div className="absolute right-[9%] top-[38%] hidden h-px w-44 bg-gradient-to-r from-transparent via-[#e30613]/50 to-transparent lg:block"/>

      <div className="relative z-10 flex w-full flex-col">
        <div className="logo-surface w-fit rounded-sm px-3 py-2 shadow-[0_12px_35px_rgba(0,0,0,.2)]">
          <ClealcoLogo priority className="w-[128px] sm:w-[140px]"/>
        </div>

        <div className="mt-9 max-w-2xl lg:mt-7 xl:mt-9">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[3px] w-10 bg-[#e30613]"/>
            <p className="text-[10px] font-bold uppercase tracking-[.26em] text-white/55">Desenvolvimento operacional</p>
          </div>
          <h1 className="text-[2.5rem] font-black leading-[.98] tracking-[-.045em] sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem]">Projeto<br/><span className="text-white">Capacita COA</span></h1>
          <h2 className="mt-4 max-w-xl text-base font-semibold leading-6 text-white/85 sm:text-lg">Cada mesa, uma função. Cada função, uma trilha.</h2>
          <p className="mt-3 max-w-xl text-sm leading-5 text-white/50">Logística, Apoio, Manutenção, GSA — sua mesa define sua trilha de capacitação. Aulas, procedimentos e simulados pensados para a função que você exerce no dia a dia.</p>
        </div>

        <div className="mt-6 hidden grid-cols-3 gap-3 sm:grid">
          {pilares.map(([Icon,a,b])=><div key={a} className="border border-white/10 bg-white/[.035] p-3.5 backdrop-blur-sm xl:p-4"><span className="mb-4 grid h-8 w-8 place-items-center rounded-sm bg-[#e30613]/15 text-[#ff4a55]"><Icon size={17}/></span><b className="block text-sm">{a}</b><span className="text-xs text-white/40">{b}</span></div>)}
        </div>
      </div>

      <div className="relative z-10 mt-auto hidden items-center justify-between pt-4 text-[9px] uppercase tracking-[.13em] text-white/30 lg:flex">
        <span>COA · Centro de Operações Agrícolas</span>
        <span>Portal interno COA</span>
      </div>
    </section>

    <section className="flex items-center justify-center bg-[#f7f7f7] px-6 py-10 dark:bg-[#121214] sm:px-10 lg:h-screen lg:min-h-0 lg:overflow-hidden lg:px-9 lg:py-5">
      <div className="w-full max-w-[430px]">
        <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-gray-200 bg-white text-[#e30613] shadow-sm dark:border-[#34343a] dark:bg-[#202024]"><LockKeyhole size={18}/></span>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#e30613]">Área do colaborador</p>
        <h2 className="text-3xl font-black tracking-[-.035em] text-[#242424] dark:text-gray-100 xl:text-4xl">Acesse sua jornada</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">Entre com seus dados para acessar o portal.</p>

        <form onSubmit={enter} className="mt-6 space-y-4">
          <label className="block text-xs font-bold text-[#2b2b2b] dark:text-gray-100">E-mail, crachá ou matrícula
            <input value={identifier} onChange={event=>setIdentifier(event.target.value)} autoComplete="username" className="field mt-2 px-4 py-3" placeholder="Informe seu identificador" required/>
          </label>
          <label className="block text-xs font-bold text-[#2b2b2b] dark:text-gray-100">Senha
            <div className="relative mt-2"><input value={password} onChange={event=>setPassword(event.target.value)} autoComplete="current-password" type={show?"text":"password"} className="field px-4 py-3 pr-12" required/><button aria-label={show?"Ocultar senha":"Mostrar senha"} type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 hover:text-[#2b2b2b] dark:hover:text-white">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>
          </label>
          <div className="flex items-center justify-between gap-3 text-xs"><span className="text-gray-500 dark:text-gray-300">Acesso individual e protegido</span><button type="button" onClick={()=>router.push("/recuperar-senha")} className="font-semibold text-[#b8000c] dark:text-red-400 hover:underline">Esqueci minha senha</button></div>
          {error&&<p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">{error}</p>}
          <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#e30613] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_25px_rgba(227,6,19,.2)] transition hover:bg-[#b8000c] disabled:cursor-not-allowed disabled:opacity-60">{loading?"Entrando...":"Entrar no portal"}<ArrowRight size={17}/></button>
        </form>

        <div className="mt-5 border-l-2 border-[#e30613] bg-white px-4 py-2.5 text-xs leading-5 text-gray-500 shadow-sm dark:bg-[#202024] dark:text-gray-300"><b className="text-[#2b2b2b] dark:text-gray-100">Acesso interno COA.</b> Este portal reúne conteúdos de capacitação, procedimentos operacionais e acompanhamento de desenvolvimento das mesas.</div>
        <p className="mt-5 text-center text-[10px] text-gray-400">Acesso exclusivo para colaboradores autorizados</p>
      </div>
    </section>
  </main>;
}
