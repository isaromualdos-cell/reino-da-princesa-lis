import Link from "next/link";
import { cameraIsOpen } from "../festa";
import Camera from "./camera";

export const dynamic = "force-dynamic";
export const metadata = { title: "Fotos da festa · Reino da Lis" };

export default function PhotosPage() {
  if (cameraIsOpen()) return <div className="cameraScene"><Camera /></div>;

  return (
    <main className="royalPage gatePage">
      <section className="royalCard gateCard">
        <p className="royalKicker">O REINO DA PRINCESA LIS</p>
        <h1>A câmera abre no dia da festa</h1>
        <p>As molduras estarão disponíveis em <strong>28 de novembro, às 16h</strong>.</p>
        <Link className="royalButton" href="/">Confirmar presença</Link>
      </section>
    </main>
  );
}
