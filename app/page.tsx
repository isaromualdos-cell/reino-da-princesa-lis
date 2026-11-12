import Image from "next/image";
import Link from "next/link";
import RsvpForm from "./rsvp-form";
import { cameraIsOpen } from "./festa";

export const dynamic = "force-dynamic";

export default function Home() {
  const cameraOpen = cameraIsOpen();

  return (
    <main className="royalPage invitePage">
      <article className="invitePanel" aria-labelledby="invite-title">
        <header className="inviteHeader">
          <div className="inviteIdentity">
            <h1 id="invite-title">
              Princesa
              <Image className="inviteWordmark" src="/convite/letreiro-lis.webp" alt="Lis" width={361} height={191} priority />
            </h1>
            <div className="inviteDetails">
              <span className="inviteAge">1 aninho</span>
              <time className="inviteDate" dateTime="2026-11-28T16:00:00-03:00">28 de novembro · 16h</time>
            </div>
          </div>
          <Image
            className="inviteCharacter"
            src="/convite/lis-personagem.webp"
            alt=""
            width={362}
            height={440}
            priority
            sizes="(max-width: 600px) 115px, 160px"
          />
        </header>
        <div className="inviteResponse">
          <section className="inviteRsvp" aria-labelledby="rsvp-title">
            <h2 id="rsvp-title">Você vem à festa?</h2>
            <RsvpForm />
          </section>
          <footer className="royalFooter">
            <Link href="/fotos">{cameraOpen ? "Abrir câmera da festa" : "Câmera da festa"}</Link>
            {!cameraOpen && <span>Abre em 28/11, às 16h</span>}
          </footer>
        </div>
      </article>
    </main>
  );
}
