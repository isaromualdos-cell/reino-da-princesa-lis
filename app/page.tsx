"use client";
// The image overlays and browser-local blob URLs use unmodified image sources.
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { compose, loadImage } from "./photo";

type Direction = "user" | "environment";
const frames = [
  { name: "Lis Clássica", label: "Clássica", slug: "01-lis-classica" },
  { name: "Fase da Lis", label: "Fase da Lis", slug: "02-fase-da-lis" },
  { name: "Jardim dos Cogumelos", label: "Jardim", slug: "03-jardim-dos-cogumelos" },
  { name: "Caminho das Moedas", label: "Moedas", slug: "04-caminho-das-moedas" },
  { name: "Chegada ao Castelo", label: "Castelo", slug: "05-chegada-ao-castelo" },
];
const frameUrl = (index: number) => "/molduras/" + frames[index].slug + ".png";

function ControlIcon({ name }: { name: "gallery" | "capture" | "flip" }) {
  const paths = {
    gallery: "M3 5h18v14H3z M3 16l5-5 4 4 3-3 6 5 M16 9h.01",
    capture: "M3 7h4l2-3h6l2 3h4v13H3z M15.5 13a3.5 3.5 0 1 1-7 0 3.5 3.5 0 1 1 7 0",
    flip: "M5 10a7 7 0 0 1 12-4l2 2 M19 4v4h-4 M19 14a7 7 0 0 1-12 4l-2-2 M5 20v-4h4",
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[name]} /></svg>;
}

function useObjectUrl(blob: Blob | null) {
  const [entry, setEntry] = useState<{ blob: Blob; url: string } | null>(null);
  useEffect(() => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    setEntry({ blob, url });
    return () => URL.revokeObjectURL(url);
  }, [blob]);
  return entry && entry.blob === blob ? entry.url : null;
}

export default function Home() {
  const video = useRef<HTMLVideoElement>(null);
  const gallery = useRef<HTMLInputElement>(null);
  const nativeCamera = useRef<HTMLInputElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const request = useRef(0);
  const cameraStatus = useRef<"starting" | "ready" | "idle">("idle");
  const lastDirection = useRef<Direction>("environment");
  const shouldResume = useRef(false);
  const [direction, setDirection] = useState<Direction>("environment");
  const [status, setStatus] = useState<"starting" | "ready" | "idle">("starting");
  const [frame, setFrame] = useState(0);
  const [loadedFrame, setLoadedFrame] = useState<number | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [result, setResult] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [permissionDismissed, setPermissionDismissed] = useState(false);
  const photoUrl = useObjectUrl(photo);
  const resultUrl = useObjectUrl(result);

  const stop = useCallback(() => {
    request.current++;
    stream.current?.getTracks().forEach(track => track.stop());
    stream.current = null;
    if (video.current) video.current.srcObject = null;
    cameraStatus.current = "idle";
  }, []);

  const start = useCallback(async (wanted: Direction, switching = false) => {
    stop();
    const ticket = request.current;
    cameraStatus.current = "starting";
    setStatus("starting");
    setPermissionDismissed(false);
    setError("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Câmera indisponível neste navegador. Use a câmera do celular ou escolha uma foto.");
      }
      const open = (facingMode: ConstrainDOMString) => navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode,
          width: { ideal: 3840 },
          height: { ideal: 2160 },
          frameRate: { ideal: 30 },
        },
      });
      let selectedDirection = wanted;
      let recovered = false;
      let media: MediaStream;
      try {
        media = await open(switching ? { exact: wanted } : { ideal: wanted });
      } catch (cause) {
        const name = cause instanceof Error ? cause.name : "";
        if (!switching || !["OverconstrainedError", "NotFoundError"].includes(name)) throw cause;
        if (ticket !== request.current) return;
        selectedDirection = lastDirection.current;
        media = await open({ ideal: selectedDirection });
        recovered = true;
      }
      if (ticket !== request.current || !video.current) {
        media.getTracks().forEach(track => track.stop());
        return;
      }
      stream.current = media;
      const track = media.getVideoTracks()[0];
      const facingMode = track.getSettings().facingMode;
      const actual = facingMode === "user" || facingMode === "environment" ? facingMode : selectedDirection;
      video.current.srcObject = media;
      await video.current.play();
      if (ticket !== request.current) return;
      track.addEventListener("ended", () => {
        if (ticket !== request.current) return;
        stop();
        setStatus("idle");
        setError("A câmera foi interrompida. Tente abrir novamente.");
      }, { once: true });
      lastDirection.current = actual;
      setDirection(actual);
      cameraStatus.current = "ready";
      setStatus("ready");
      if (recovered) setError("A outra câmera não está disponível neste dispositivo.");
    } catch (cause) {
      if (ticket !== request.current) return;
      const name = cause instanceof Error ? cause.name : "";
      stop();
      setStatus("idle");
      const message = name === "NotAllowedError"
        ? "Libere o acesso à câmera nas permissões do navegador ou escolha uma foto."
        : name === "NotReadableError"
          ? "A câmera está ocupada. Feche outros apps que a estejam usando e tente novamente."
          : "Câmera indisponível. Use a câmera do celular ou escolha uma foto.";
      setError(message);
    }
  }, [stop]);

  useEffect(() => {
    const resume = () => {
      if (shouldResume.current && document.visibilityState === "visible") {
        shouldResume.current = false;
        void start(lastDirection.current);
      }
    };
    const suspend = () => {
      if (cameraStatus.current === "idle") return;
      shouldResume.current = true;
      stop();
      setStatus("idle");
    };
    const onVisibility = () => document.hidden ? suspend() : resume();
    void start("environment");
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", suspend);
    window.addEventListener("pageshow", resume);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", suspend);
      window.removeEventListener("pageshow", resume);
      stop();
    };
  }, [start, stop]);

  async function choose(file: File | undefined) {
    if (!file) return;
    if ((file.type && !file.type.startsWith("image/")) || file.size > 40 * 1024 * 1024) {
      setError("Escolha uma imagem de até 40 MB.");
      return;
    }
    setBusy(true);
    setError("");
    const url = URL.createObjectURL(file);
    try {
      await loadImage(url);
      shouldResume.current = false;
      stop();
      setStatus("idle");
      setPhoto(file);
    } catch {
      setError("Não foi possível abrir essa imagem. Tente uma foto em JPEG ou PNG.");
    } finally {
      URL.revokeObjectURL(url);
      setBusy(false);
    }
  }

  async function capture() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const output = photoUrl
        ? await compose(await loadImage(photoUrl), frameUrl(frame), false)
        : await compose(video.current, frameUrl(frame), direction === "user");
      shouldResume.current = false;
      stop();
      setStatus("idle");
      setResult(output);
    } catch {
      setError("Não foi possível preparar a foto. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!resultUrl || !result) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = result.name;
    document.body.append(link);
    link.click();
    link.remove();
  }

  async function share() {
    if (!result) return;
    setError("");
    try {
      if (navigator.canShare?.({ files: [result] })) {
        await navigator.share({ files: [result] });
        return;
      }
      download();
      setError("Compartilhamento indisponível aqui. Abra a foto salva para enviá-la pelo app que preferir.");
    } catch (cause) {
      if (cause instanceof Error && cause.name === "AbortError") return;
      setError("Não foi possível compartilhar. Use Salvar foto e envie pelo app que preferir.");
    }
  }

  function reset() {
    setPhoto(null);
    setResult(null);
    void start(lastDirection.current);
  }

  const live = status === "ready" && !photo && !result;
  const awaiting = !live && !photo && !result;
  const frameReady = loadedFrame === frame;
  const showPermission = awaiting && status === "idle" && Boolean(error) && !permissionDismissed;
  return (
    <main className="cameraPage">
      <header className="cameraHeader">
        <img src="/royaume/crest.webp" alt="" width="48" height="38" />
        <div><h1>O Reino da Princesa Lis</h1><p>28.11.2026 • LEVEL 1</p></div>
      </header>
      <section className={"viewfinder" + (awaiting ? " awaiting" : "")} aria-label="Enquadramento da foto">
        <video ref={video} playsInline muted autoPlay hidden={!live}
          className={"feed" + (direction === "user" ? " mirror" : "")} />
        {photoUrl && !result && <img className="feed" src={photoUrl} alt="Enquadramento da foto escolhida" />}
        {resultUrl && <img className="feed" src={resultUrl} alt="Foto com moldura pronta" />}
        {!result && <img key={frame} className="liveFrame" src={frameUrl(frame)} alt=""
          ref={image => { if (image?.complete && image.naturalWidth) setLoadedFrame(frame); }}
          onLoad={() => setLoadedFrame(frame)} />}
        {awaiting && status === "starting" && <p className="opening" role="status">Abrindo a câmera…</p>}
        {showPermission && (
          <aside className="permission" aria-labelledby="permission-title">
            <button className="close" aria-label="Fechar aviso" onClick={() => setPermissionDismissed(true)}>×</button>
            <h2 id="permission-title">Acesso à câmera</h2>
            <p role="status">{error}</p>
            <button className="action main" disabled={busy} onClick={() => start(lastDirection.current)}>Abrir câmera</button>
            <button className="native" disabled={busy} onClick={() => nativeCamera.current?.click()}>Usar câmera do celular</button>
          </aside>
        )}
      </section>
      {!result && (
        <div className="framePicker">
          <div className="frameChoices" role="group" aria-label="Molduras">
            {frames.map(({ name, label, slug }, index) => (
              <button key={name} aria-label={name} aria-pressed={index === frame}
                disabled={busy} onClick={() => setFrame(index)}>
                <img src={"/molduras/" + slug + "-mini.webp"} alt="" />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <p aria-live="polite">{frames[frame].name}</p>
        </div>
      )}
      <div className="cameraActions">
        {result ? <>
          <button className="action" disabled={!resultUrl} onClick={download}>Salvar foto</button>
          <button className="action main" onClick={share}>Compartilhar</button>
          {photo && <button className="action" onClick={() => { setError(""); setResult(null); }}>Trocar moldura</button>}
          <button className="action" onClick={reset}>Outra foto</button>
        </> : photo ? <>
          <button className="action main" disabled={busy || !photoUrl || !frameReady} onClick={capture}>Usar esta foto</button>
          <button className="action" disabled={busy} onClick={reset}>Voltar à câmera</button>
        </> : <>
          <button className="action side" disabled={busy} onClick={() => gallery.current?.click()}><ControlIcon name="gallery" />Galeria</button>
          <button className="shutter" disabled={!live || busy || !frameReady} onClick={capture} aria-label="Fotografar"><span><ControlIcon name="capture" /></span></button>
          <button className="action side" disabled={status === "starting" || busy}
            onClick={() => live ? start(direction === "user" ? "environment" : "user", true) : start(lastDirection.current)}>
            <ControlIcon name={live ? "flip" : "capture"} />{live ? "Virar" : "Câmera"}
          </button>
        </>}
      </div>
      <input ref={gallery} type="file" accept="image/*" hidden onChange={event => {
        void choose(event.target.files?.[0]);
        event.target.value = "";
      }} />
      <input ref={nativeCamera} type="file" accept="image/*" capture="environment" hidden onChange={event => {
        void choose(event.target.files?.[0]);
        event.target.value = "";
      }} />
      {busy && <p role="status" className="notice">Preparando a foto…</p>}
      {error && !showPermission && (!awaiting || !permissionDismissed) && <p role="status" className="notice">{error}</p>}
      <p className="privacy">As fotos são processadas neste dispositivo.</p>
    </main>
  );
}
