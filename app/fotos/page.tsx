import Link from "next/link";
import Image from "next/image";
import { cameraIsOpen } from "../festa";
import Camera from "./camera";

export const dynamic = "force-dynamic";
export const metadata = { title: "Fotos da festa · Reino da Lis" };

export default function PhotosPage() {
  if (cameraIsOpen()) return <Camera />;

  return (
    <main className="royalPage gatePage">
      <section className="royalCard gateCard">
        <Image src="/royaume/crest.webp" alt="" width={85} height={66} priority />
        <p className="royalKicker">O REINO DA PRINCESA LIS</p>
        <h1>A câmera abre no dia da festa</h1>
        <p>As molduras estarão disponíveis em <strong>28 de novembro, às 16h</strong>.</p>
        <Link className="royalButton" href="/">Confirmar presença</Link>
      </section>
    </main>
  );
}
