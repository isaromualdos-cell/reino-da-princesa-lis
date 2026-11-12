import Image from "next/image";
import Link from "next/link";
import RsvpForm from "./rsvp-form";
import { cameraIsOpen } from "./festa";

export const dynamic = "force-dynamic";

export default function Home() {
  const cameraOpen = cameraIsOpen();

  return (
    <main className="royalPage invitePage">
      <div className="inviteLayout">
        <section className="inviteCover" aria-label="Primeiro aniversário da Princesa Lis">
          <h1 className="visuallyHidden">1º aninho da Princesa Lis</h1>
          <Image
            src="/convite/princesa-lis.webp"
            alt="Ilustração do convite com a Princesa Lis, um castelo, estrelas, moedas e cogumelos. A festa é dia 28 de novembro, às 16h."
            width={900}
            height={902}
            priority
            sizes="(max-width: 760px) 100vw, 550px"
          />
        </section>
        <div className="inviteActions">
          {cameraOpen && <Link className="royalButton openCamera" href="/fotos">Abrir câmera da festa</Link>}
          <section className="royalCard rsvpCard" aria-labelledby="rsvp-title">
            <h2 id="rsvp-title">Confirme sua presença</h2>
            <p className="royalIntro">Quem vai comemorar com a Lis?</p>
            <RsvpForm />
          </section>
          {!cameraOpen && (
            <footer className="royalFooter">
              <Link href="/fotos">Câmera da festa</Link>
              <span>Disponível em 28/11, às 16h</span>
            </footer>
          )}
        </div>
      </div>
    </main>
  );
}
