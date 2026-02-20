export interface KineticGridOptions {
  spacing?: number;
  lineWidth?: number;
  damping?: number;
  attractionStrength?: number;
  attractionRadius?: number;
  maxOffset?: number;
  baseColor?: string;
  glowColor?: string;
  backgroundColor?: string;
  glowOpacity?: number;
  baseOpacity?: number;
  pixelRatioCap?: number;
  spotlightRadius?: number;
  spotlightSoftness?: number;
  spotlightOpacity?: number;
  trailRadius?: number;
  trailStrength?: number;
  trailDecay?: number;
  trailPointMinDistance?: number;
  trailMaxPoints?: number;
}

export interface KineticGridHandle {
  destroy: () => void;
  setOptions: (nextOptions: Partial<KineticGridOptions>) => void;
}

type InternalPoint = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
};

type TrailPoint = {
  x: number;
  y: number;
  life: number;
};

const DEFAULTS: Required<KineticGridOptions> = {
  spacing: 44,
  lineWidth: 1.15,
  damping: 0.84,
  attractionStrength: 0.25,
  attractionRadius: 230,
  maxOffset: 24,
  baseColor: "#2c4f79",
  glowColor: "#8ec0ff",
  backgroundColor: "#03060d",
  glowOpacity: 0.46,
  baseOpacity: 0.14,
  pixelRatioCap: 2,
  spotlightRadius: 240,
  spotlightSoftness: 0.75,
  spotlightOpacity: 0.34,
  trailRadius: 92,
  trailStrength: 1.2,
  trailDecay: 0.955,
  trailPointMinDistance: 12,
  trailMaxPoints: 42,
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const withAlpha = (hexOrRgb: string, alpha: number): string => {
  if (
    hexOrRgb.startsWith("#") &&
    (hexOrRgb.length === 7 || hexOrRgb.length === 4)
  ) {
    const hex =
      hexOrRgb.length === 4
        ? `#${hexOrRgb[1]}${hexOrRgb[1]}${hexOrRgb[2]}${hexOrRgb[2]}${hexOrRgb[3]}${hexOrRgb[3]}`
        : hexOrRgb;
    const r = Number.parseInt(hex.slice(1, 3), 16);
    const g = Number.parseInt(hex.slice(3, 5), 16);
    const b = Number.parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hexOrRgb;
};

export function mountKineticGrid(
  container: HTMLElement,
  initialOptions: Partial<KineticGridOptions> = {},
): KineticGridHandle {
  if (!(container instanceof HTMLElement)) {
    throw new Error("mountKineticGrid expects a valid HTMLElement container.");
  }

  let options: Required<KineticGridOptions> = { ...DEFAULTS, ...initialOptions };

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create 2D canvas context.");
  }

  const originalPosition = container.style.position;
  const computedPosition = window.getComputedStyle(container).position;
  if (computedPosition === "static") {
    container.style.position = "relative";
  }

  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    display: "block",
    pointerEvents: "none",
    zIndex: "0",
  });

  container.appendChild(canvas);

  let width = 0;
  let height = 0;
  let dpr = 1;
  let rafId = 0;
  let idleFrames = 0;
  let physicsFrozen = false;
  let resizeObserver: ResizeObserver | null = null;

  let cols = 0;
  let rows = 0;
  let points: InternalPoint[] = [];

  const pointer = {
    x: 0,
    y: 0,
    active: false,
  };

  const trailPoints: TrailPoint[] = [];

  const pushTrailPoint = (x: number, y: number, life = 1): void => {
    const last = trailPoints[trailPoints.length - 1];
    if (last) {
      const dist = Math.hypot(x - last.x, y - last.y);
      if (dist < options.trailPointMinDistance) {
        last.life = Math.max(last.life, life);
        return;
      }
    }

    trailPoints.push({ x, y, life });
    while (trailPoints.length > options.trailMaxPoints) {
      trailPoints.shift();
    }
  };

  const getPoint = (col: number, row: number): InternalPoint | undefined => {
    if (col < 0 || row < 0 || col >= cols || row >= rows) {
      return undefined;
    }
    return points[row * cols + col];
  };

  const rebuildPoints = (): void => {
    cols = Math.max(2, Math.floor(width / options.spacing) + 2);
    rows = Math.max(2, Math.floor(height / options.spacing) + 2);
    points = [];

    const gridWidth = (cols - 1) * options.spacing;
    const gridHeight = (rows - 1) * options.spacing;
    const offsetX = (width - gridWidth) * 0.5;
    const offsetY = (height - gridHeight) * 0.5;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const baseX = offsetX + col * options.spacing;
        const baseY = offsetY + row * options.spacing;
        points.push({ x: baseX, y: baseY, baseX, baseY, vx: 0, vy: 0 });
      }
    }
  };

  const resize = (): void => {
    width = container.clientWidth;
    height = container.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, options.pixelRatioCap);

    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rebuildPoints();
  };

  const pointerMove = (event: PointerEvent): void => {
    const bounds = container.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
    physicsFrozen = false;
    idleFrames = 0;
    pushTrailPoint(pointer.x, pointer.y, 1);
  };

  const pointerLeave = (): void => {
    pointer.active = false;
  };

  const updatePhysics = (): void => {
    const attractionRadiusSq = options.attractionRadius * options.attractionRadius;
    const maxOffsetSq = options.maxOffset * options.maxOffset;
    const canFreeze = !pointer.active && trailPoints.length === 0;
    if (canFreeze) {
      idleFrames += 1;
      if (idleFrames > 8) {
        physicsFrozen = true;
      }
    } else {
      idleFrames = 0;
      physicsFrozen = false;
    }
    if (physicsFrozen) {
      return;
    }

    for (let i = 0; i < points.length; i += 1) {
      const p = points[i];
      let totalFx = 0;
      let totalFy = 0;

      const relaxFx = (p.baseX - p.x) * 0.07;
      const relaxFy = (p.baseY - p.y) * 0.07;
      p.vx += relaxFx;
      p.vy += relaxFy;
      totalFx += relaxFx;
      totalFy += relaxFy;

      if (pointer.active) {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < attractionRadiusSq && distSq > 0.001) {
          const dist = Math.sqrt(distSq);
          const falloff = 1 - dist / options.attractionRadius;
          const force = falloff * falloff * options.attractionStrength;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          p.vx += fx;
          p.vy += fy;
          totalFx += fx;
          totalFy += fy;
        }
      }

      p.vx *= options.damping;
      p.vy *= options.damping;
      if (Math.hypot(p.vx, p.vy) < 0.012 && Math.hypot(totalFx, totalFy) < 0.008) {
        p.vx = 0;
        p.vy = 0;
      }
      p.x += p.vx;
      p.y += p.vy;

      const offsetX = p.x - p.baseX;
      const offsetY = p.y - p.baseY;
      const offsetSq = offsetX * offsetX + offsetY * offsetY;
      if (offsetSq > maxOffsetSq) {
        const scale = options.maxOffset / Math.sqrt(offsetSq);
        p.x = p.baseX + offsetX * scale;
        p.y = p.baseY + offsetY * scale;
      }
    }

    for (let i = trailPoints.length - 1; i >= 0; i -= 1) {
      trailPoints[i].life *= options.trailDecay;
      if (trailPoints[i].life < 0.03) {
        trailPoints.splice(i, 1);
      }
    }
  };

  const getTrailBoost = (x: number, y: number): number => {
    let trailBoost = 0;
    const radius = options.trailRadius;

    for (let i = trailPoints.length - 1; i >= 0; i -= 1) {
      const tp = trailPoints[i];
      const dist = Math.hypot(x - tp.x, y - tp.y);
      if (dist >= radius) {
        continue;
      }
      const p = 1 - dist / radius;
      const boost = p * p * tp.life * options.trailStrength;
      if (boost > trailBoost) {
        trailBoost = boost;
      }
      if (trailBoost > 1.35) {
        break;
      }
    }

    return clamp(trailBoost, 0, 1.5);
  };

  const drawLine = (a: InternalPoint, b: InternalPoint): void => {
    const move = Math.hypot(a.x - a.baseX, a.y - a.baseY, b.x - b.baseX, b.y - b.baseY);
    const t = clamp(move / (options.maxOffset * 2), 0, 1);
    const mx = (a.x + b.x) * 0.5;
    const my = (a.y + b.y) * 0.5;

    let pointerBoost = 0;
    if (pointer.active) {
      const dist = Math.hypot(pointer.x - mx, pointer.y - my);
      const p = clamp(1 - dist / options.spotlightRadius, 0, 1);
      pointerBoost = Math.pow(p, 1.75);
    }
    const trailBoost = getTrailBoost(mx, my);
    const interactionBoost = Math.max(pointerBoost, trailBoost);

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = withAlpha(
      options.baseColor,
      options.baseOpacity + t * 0.14 + interactionBoost * options.spotlightOpacity * 0.7,
    );
    ctx.lineWidth = options.lineWidth;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = withAlpha(
      options.glowColor,
      t * options.glowOpacity + interactionBoost * options.spotlightOpacity * 0.92,
    );
    ctx.lineWidth = options.lineWidth + 0.55 + interactionBoost * 0.45;
    ctx.stroke();
  };

  const render = (): void => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const point = getPoint(col, row);
        if (!point) {
          continue;
        }
        const right = getPoint(col + 1, row);
        const down = getPoint(col, row + 1);
        if (right) {
          drawLine(point, right);
        }
        if (down) {
          drawLine(point, down);
        }
      }
    }

    const veilAlpha = clamp(options.spotlightOpacity * 0.5, 0.04, 0.14);
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${veilAlpha})`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "destination-out";

    if (pointer.active) {
      const inner = options.spotlightRadius * (1 - clamp(options.spotlightSoftness, 0.1, 0.95));
      const reveal = ctx.createRadialGradient(
        pointer.x,
        pointer.y,
        inner,
        pointer.x,
        pointer.y,
        options.spotlightRadius,
      );
      reveal.addColorStop(0, `rgba(0, 0, 0, ${veilAlpha * 0.95})`);
      reveal.addColorStop(0.55, `rgba(0, 0, 0, ${veilAlpha * 0.28})`);
      reveal.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = reveal;
      ctx.fillRect(0, 0, width, height);
    }

    for (let i = 0; i < trailPoints.length; i += 1) {
      const tp = trailPoints[i];
      const radius = options.trailRadius * 0.9;
      const trailReveal = ctx.createRadialGradient(tp.x, tp.y, radius * 0.25, tp.x, tp.y, radius);
      trailReveal.addColorStop(0, `rgba(0, 0, 0, ${veilAlpha * tp.life * 0.65})`);
      trailReveal.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = trailReveal;
      ctx.fillRect(tp.x - radius, tp.y - radius, radius * 2, radius * 2);
    }

    ctx.restore();
  };

  const frame = (): void => {
    updatePhysics();
    render();
    rafId = window.requestAnimationFrame(frame);
  };

  resize();
  window.addEventListener("pointermove", pointerMove, { passive: true });
  window.addEventListener("pointerleave", pointerLeave, { passive: true });

  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);
  } else {
    window.addEventListener("resize", resize);
  }

  rafId = window.requestAnimationFrame(frame);

  return {
    destroy: () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerleave", pointerLeave);

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", resize);
      }

      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }

      if (computedPosition === "static") {
        container.style.position = originalPosition;
      }
    },
    setOptions: (nextOptions) => {
      options = { ...options, ...nextOptions };
      rebuildPoints();
    },
  };
}
