"use client";

import { useEffect, useState } from "react";
import { Rotate3D, ZoomIn, Maximize2 } from "lucide-react";

const ModelViewer = "model-viewer" as unknown as React.ComponentType<{
  src: string;
  alt: string;
  ar?: boolean;
  "camera-controls"?: boolean;
  "auto-rotate"?: boolean;
  "rotation-per-second"?: string;
  "shadow-intensity"?: string;
  exposure?: string;
  "environment-image"?: string;
  "interaction-prompt"?: string;
  style?: React.CSSProperties;
}>;

export function GemstoneViewer({ src, name }: { src: string; name: string }) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    import("@google/model-viewer")
      .then(() => active && setReady(true))
      .catch(() => active && setFailed(true));
    return () => { active = false; };
  }, []);

  if (failed) return <div className="gem-viewer-fallback">3D viewer could not load. Please refresh or view the product photographs.</div>;

  return <div className="gem-viewer-shell">
    {ready ? <ModelViewer
      src={src}
      alt={`Interactive 3D demonstration model of ${name}`}
      ar
      camera-controls
      auto-rotate
      rotation-per-second="18deg"
      shadow-intensity="1"
      exposure="1.15"
      environment-image="neutral"
      interaction-prompt="auto"
      style={{ width: "100%", height: "100%", minHeight: 440, background: "radial-gradient(ellipse at 50% 42%, #ffffff 0%, #eff1eb 72%, #e8ebe4 100%)" }}
    /> : <div className="gem-viewer-loading"><div className="gem-loading-stone"/><span>Preparing interactive gemstone…</span></div>}
    <div className="gem-viewer-controls"><span><Rotate3D size={14}/> Drag to rotate</span><span><ZoomIn size={14}/> Pinch / scroll to zoom</span></div>
    <div className="gem-viewer-disclaimer">3D demonstration model · Not a scan of the physical stone</div>
  </div>;
}
