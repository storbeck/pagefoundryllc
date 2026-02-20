"use client";

import { useEffect, useRef } from "react";

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram | null {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) {
    if (vertexShader) gl.deleteShader(vertexShader);
    if (fragmentShader) gl.deleteShader(fragmentShader);
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = (a_position + 1.0) * 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_dark;

  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rot = mat2(1.5, 1.2, -1.2, 1.5);
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = rot * p;
      amplitude *= 0.5;
    }
    return value;
  }

  float ridge(float h) {
    h = abs(h);
    return 1.0 - h;
  }

  float shorelineAt(float x, float t) {
    float base = 1.95;
    float tide = sin(t * 0.11) * 0.28;
    float setA = pow(max(0.0, sin(t * 0.62 + x * 0.21)), 2.2) * 0.18;
    float setB = pow(max(0.0, sin(t * 0.44 - x * 0.17 + 1.7)), 2.6) * 0.12;
    float swash = sin(t * 1.55 + x * 0.46 + sin(t * 0.23) * 1.4) * 0.06;
    float longShore = sin(x * 0.24 + t * 0.07) * 0.10;
    float shortShore = sin(x * 0.92 - t * 0.16) * 0.05;
    return base + tide + setA + setB + swash + longShore + shortShore;
  }

  float gerstnerHeight(vec2 p, float t, float depthMix) {
    vec2 d1 = normalize(vec2(0.26, 1.0));
    vec2 d2 = normalize(vec2(-0.14, 1.0));
    vec2 d3 = normalize(vec2(0.05, 1.0));

    float w1 = dot(d1, p) * 3.8 + t * 1.45;
    float w2 = dot(d2, p) * 6.2 + t * 2.15;
    float w3 = dot(d3, p) * 10.5 + t * 2.95;

    float a1 = 0.06 * depthMix;
    float a2 = 0.025 * (0.45 + depthMix * 0.55);
    float a3 = 0.010 * (0.3 + depthMix * 0.7);

    float waves = sin(w1) * a1 + sin(w2) * a2 + sin(w3) * a3;
    float chop = (fbm(p * vec2(2.0, 3.2) + vec2(-t * 0.08, t * 0.14)) - 0.5) * 0.022 * depthMix;
    return waves + chop;
  }

  vec3 sandColor(vec2 p) {
    vec3 sandA = vec3(0.92, 0.84, 0.71);
    vec3 sandB = vec3(0.83, 0.72, 0.57);
    vec3 sandC = vec3(0.74, 0.63, 0.49);

    float dunes = fbm(p * vec2(0.85, 1.35));
    float bands = ridge(sin(p.y * 2.7 + fbm(p * 1.1) * 1.8)) * 0.16;
    float grainA = noise(p * 42.0);
    float grainB = noise(p * 110.0);
    float grainC = noise(p * 260.0);
    float grain = grainA * 0.45 + grainB * 0.35 + grainC * 0.20;

    float darkSpeck = smoothstep(0.955, 0.995, noise(p * 420.0));
    float brightShell = smoothstep(0.982, 0.998, noise(p * 340.0 + 17.3));

    float body = smoothstep(0.22, 0.86, dunes * 0.72 + grain * 0.28 + bands);
    vec3 sand = mix(sandA, sandB, body);
    sand = mix(sand, sandC, smoothstep(0.70, 1.0, grainA) * 0.25);
    sand *= 1.0 - darkSpeck * 0.12;
    sand += vec3(0.08, 0.07, 0.05) * brightShell * 0.08;
    return sand;
  }

  vec3 skyColor(vec3 dir) {
    vec3 horizonDay = vec3(0.67, 0.81, 0.89);
    vec3 zenithDay = vec3(0.26, 0.47, 0.67);
    vec3 horizonNight = vec3(0.07, 0.12, 0.19);
    vec3 zenithNight = vec3(0.01, 0.03, 0.08);
    float y = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 daySky = mix(horizonDay, zenithDay, pow(y, 0.65));
    vec3 nightSky = mix(horizonNight, zenithNight, pow(y, 0.70));
    return mix(daySky, nightSky, u_dark);
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 aspectUV = vec2(uv.x * aspect, uv.y);
    float t = u_time;

    vec2 world = vec2((uv.x - 0.5) * 10.0 * aspect, (1.0 - uv.y) * 6.2);
    float shoreline = shorelineAt(world.x, t);
    float depth = shoreline - world.y;
    float waterMask = smoothstep(-0.04, 0.06, depth);

    float depthNorm = clamp(depth / 2.3, 0.0, 1.0);
    float h = gerstnerHeight(world, t, depthNorm);
    float eps = 0.03;
    float hx = gerstnerHeight(world + vec2(eps, 0.0), t, depthNorm) - h;
    float hz = gerstnerHeight(world + vec2(0.0, eps), t, depthNorm) - h;
    vec3 normal = normalize(vec3(-hx / eps, 1.0, -hz / eps));

    vec3 viewDir = normalize(vec3(0.0, 1.25, 0.85));
    vec3 lightDir = normalize(vec3(-0.32, 0.88, 0.34));
    vec3 halfDir = normalize(lightDir + viewDir);

    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);
    float specular = pow(max(dot(normal, halfDir), 0.0), 180.0) * 1.15;
    float diffuse = clamp(dot(normal, lightDir), 0.0, 1.0);

    vec3 deepOceanDay = vec3(0.05, 0.25, 0.39);
    vec3 coastWaterDay = vec3(0.29, 0.66, 0.66);
    vec3 deepOceanNight = vec3(0.02, 0.08, 0.15);
    vec3 coastWaterNight = vec3(0.10, 0.27, 0.34);
    vec3 deepOcean = mix(deepOceanDay, deepOceanNight, u_dark);
    vec3 coastWater = mix(coastWaterDay, coastWaterNight, u_dark);
    vec3 waterAbsorb = mix(coastWater, deepOcean, smoothstep(0.0, 1.0, depthNorm));

    vec2 refractCoord = world + normal.xz * 0.24;
    vec3 seabed = sandColor(refractCoord * vec2(0.72, 1.45));
    float wetMask = smoothstep(-0.16, 0.24, depth);
    seabed *= mix(1.0, 0.77, wetMask);

    float extinction = exp(-max(depth, 0.0) * 1.55);
    vec3 refracted = mix(waterAbsorb, seabed, extinction);
    vec3 reflected = skyColor(reflect(-viewDir, normal));
    vec3 waterColor = mix(refracted, reflected, fresnel * 0.88);
    vec3 specTint = mix(vec3(0.95), vec3(0.62, 0.70, 0.82), u_dark);
    waterColor += specTint * specular * mix(1.0, 0.62, u_dark) * (0.22 + depthNorm * 0.78);
    waterColor += mix(vec3(0.04, 0.07, 0.07), vec3(0.01, 0.03, 0.05), u_dark) * diffuse * depthNorm;

    float slope = clamp(length(vec2(hx, hz)) * 22.0, 0.0, 1.0);
    float breakBand = smoothstep(-0.08, 0.06, depth) * smoothstep(0.72, 0.18, depth);
    float breakerPhase = sin((world.y - shoreline) * 25.0 + t * 2.15 + fbm(world * vec2(0.8, 1.0)) * 2.0);
    float breaker = smoothstep(0.58, 0.98, breakerPhase * 0.5 + 0.5);
    float foamNoise = fbm(world * vec2(2.5, 4.8) + vec2(t * 0.24, -t * 0.38));
    float foam = breakBand * (slope * 0.62 + breaker * 0.38) * smoothstep(0.30, 0.86, foamNoise);
    foam = clamp(foam, 0.0, 1.0);

    vec3 foamColor = mix(vec3(0.95, 0.98, 0.96), vec3(0.64, 0.71, 0.78), u_dark);
    waterColor = mix(waterColor, foamColor, foam * 0.85);

    vec3 sandDry = sandColor(world * vec2(0.72, 1.45));
    vec3 sand = mix(sandDry, sandDry * 0.72, wetMask);
    sand = mix(sand, sand * vec3(0.38, 0.46, 0.60), u_dark * 0.8);
    waterColor += vec3(0.03, 0.04, 0.07) * u_dark * fresnel * 0.30;

    vec3 color = mix(sand, waterColor, waterMask);

    float sparkle = pow(max(0.0, noise(world * 18.0 + vec2(t * 0.9, 0.0)) - 0.965), 2.0);
    vec3 sparkleTint = mix(vec3(0.48, 0.63, 0.62), vec3(0.25, 0.33, 0.42), u_dark);
    color += sparkleTint * sparkle * waterMask * depthNorm;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function BeachWebgl() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      return;
    }

    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    if (!program) {
      return;
    }

    const positionBuffer = gl.createBuffer();
    if (!positionBuffer) {
      gl.deleteProgram(program);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1,
      ]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const darkLocation = gl.getUniformLocation(program, "u_dark");

    if (
      positionLocation < 0 ||
      !resolutionLocation ||
      !timeLocation ||
      !darkLocation
    ) {
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");
    let darkMode = darkMedia.matches ? 1 : 0;

    const onSchemeChange = (event: MediaQueryListEvent) => {
      darkMode = event.matches ? 1 : 0;
    };

    if ("addEventListener" in darkMedia) {
      darkMedia.addEventListener("change", onSchemeChange);
    } else {
      darkMedia.addListener(onSchemeChange);
    }

    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.floor(window.innerWidth * dpr);
      const height = Math.floor(window.innerHeight * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolutionLocation, width, height);
    };

    const render = () => {
      const elapsed = (performance.now() - start) * 0.001;
      gl.uniform1f(timeLocation, elapsed);
      gl.uniform1f(darkLocation, darkMode);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if ("removeEventListener" in darkMedia) {
        darkMedia.removeEventListener("change", onSchemeChange);
      } else {
        darkMedia.removeListener(onSchemeChange);
      }
      window.cancelAnimationFrame(raf);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className="beach-gl" aria-hidden="true" />;
}
