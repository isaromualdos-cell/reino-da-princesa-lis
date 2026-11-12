import Image from "next/image";
import Link from "next/link";
import RsvpForm from "./rsvp-form";
import { cameraIsOpen } from "./festa";

export const dynamic = "force-dynamic";

export default function Home() {
  const cameraOpen = cameraIsOpen();

  return (
    <main className="royalPage">
      <section className="royalHero" aria-labelledby="lis-title">
        <Image className="kingdomArt" src="/royaume/kingdom.webp" alt="" fill priority sizes="100vw" />
        <div className="royalTitle">
          <Image src="/royaume/crest.webp" alt="" width={112} height={87} priority />
          <p className="royalKicker">O REINO DA PRINCESA</p>
          <h1 id="lis-title">Lis</h1>
          <div className="royalRibbon">1 aninho</div>
          <p className="royalDate"><time dateTime="2026-11-28T16:00:00-03:00">28 de novembro · 16h</time></p>
        </div>
      </section>
      {cameraOpen && <Link className="royalButton openCamera" href="/fotos">Abrir câmera da festa</Link>}
      <section className="royalCard rsvpCard" aria-labelledby="rsvp-title">
        <h2 id="rsvp-title">Confirme sua presença</h2>
        <p className="royalIntro">Quem vai comemorar o primeiro aninho da Lis com a gente?</p>
        <RsvpForm />
      </section>
      {!cameraOpen && (
        <footer className="royalFooter">
          <Link href="/fotos">Câmera da festa</Link>
          <span>Disponível em 28/11, às 16h</span>
        </footer>
      )}
    </main>
  );
}
