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
            <span className="inviteAge">1 aninho</span>
            <h1 id="invite-title">Princesa <strong>Lis</strong></h1>
          </div>
          <Image
            className="inviteCharacter"
            src="/convite/lis-personagem.webp"
            alt=""
            width={362}
            height={440}
            priority
            sizes="(max-width: 700px) 126px, 180px"
          />
          <time className="inviteDate" dateTime="2026-11-28T16:00:00-03:00">28 de novembro <span aria-hidden="true">·</span> 16h</time>
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
