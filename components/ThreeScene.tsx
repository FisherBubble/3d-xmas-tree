
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GestureType, HandData } from '../types';

interface Props {
  handData: HandData | null;
}

const ThreeScene: React.FC<Props> = ({ handData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const lightSpiralsRef = useRef<THREE.InstancedMesh | null>(null);
  
  const stateRef = useRef({
    transition: 0,
    targetTransition: 0,
    rotation: 0,
    time: 0,
    lastScatterTime: 0 // To help stabilize the scatter state
  });

  const particleCount = window.innerWidth < 768 ? 2500 : 6000;

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null;

    // Adjusted camera to frame the much larger tree structure
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 6, 28); 
    camera.lookAt(0, 5, 0); 
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scatterPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Massive scaling to match requested silhouette
    const treeHeight = 20;
    const treeRadius = 8.5;
    const baseOffset = -6; // Moves base lower in the view

    for (let i = 0; i < particleCount; i++) {
      const ratio = i / particleCount;
      const angle = ratio * Math.PI * 45; // Tighter spiral for more density
      const radius = (1 - ratio) * treeRadius;
      const height = ratio * treeHeight;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height + baseOffset;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Wider scatter for the larger tree
      scatterPositions[i * 3] = (Math.random() - 0.5) * 80;
      scatterPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      scatterPositions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      const type = Math.random();
      if (type > 0.95) { // Heart/Special
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.2; colors[i * 3 + 2] = 0.2;
        sizes[i] = 4.0 + Math.random() * 5;
      } else if (type > 0.8) { // Star
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 0.4;
        sizes[i] = 3.5 + Math.random() * 3;
      } else { // Leaf/Tree
        colors[i * 3] = 0.1; colors[i * 3 + 1] = 0.65; colors[i * 3 + 2] = 0.25;
        sizes[i] = 1.5 + Math.random() * 2.5;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('targetPosition', new THREE.BufferAttribute(scatterPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uTransition: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uTransition;
        uniform float uPixelRatio;
        attribute vec3 targetPosition;
        attribute vec3 color;
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec3 mixedPos = mix(position, targetPosition, uTransition);
          // Subtle swaying animation
          mixedPos.x += sin(uTime + position.y * 0.5) * 0.08;
          mixedPos.z += cos(uTime + position.x * 0.5) * 0.08;
          vec4 mvPosition = modelViewMatrix * vec4(mixedPos, 1.0);
          gl_PointSize = size * uPixelRatio * (28.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          // Softer particle look
          float alpha = smoothstep(0.5, 0.0, dist);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    const lightGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffeebb });
    const lightCount = 350; // More lights for larger tree
    const lightSpirals = new THREE.InstancedMesh(lightGeo, lightMat, lightCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < lightCount; i++) {
      const ratio = i / lightCount;
      const angle = ratio * Math.PI * 25;
      const radius = (1 - ratio) * (treeRadius * 1.04);
      dummy.position.set(Math.cos(angle) * radius, ratio * treeHeight + baseOffset, Math.sin(angle) * radius);
      dummy.updateMatrix();
      lightSpirals.setMatrixAt(i, dummy.matrix);
    }
    scene.add(lightSpirals);
    lightSpiralsRef.current = lightSpirals;

    const animate = () => {
      const state = stateRef.current;
      state.time += 0.01;
      if (particlesRef.current) {
        (particlesRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.time;
        // Smooth interpolation for the transition
        state.transition += (state.targetTransition - state.transition) * 0.045;
        (particlesRef.current.material as THREE.ShaderMaterial).uniforms.uTransition.value = state.transition;
        // Rotate the tree
        particlesRef.current.rotation.y += 0.004 * (1 - state.transition);
      }
      if (lightSpiralsRef.current) {
        lightSpiralsRef.current.rotation.y += 0.006 * (1 - state.transition);
        lightSpiralsRef.current.visible = state.transition < 0.6;
        // Breathing effect for lights
        const scale = 0.6 + Math.sin(state.time * 3) * 0.4;
        lightSpiralsRef.current.scale.set(scale, scale, scale);
      }
      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    const requestRef = { current: requestAnimationFrame(animate) };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      lightGeo.dispose();
      lightMat.dispose();
    };
  }, []);

  useEffect(() => {
    if (!handData) {
      // If hand is lost, we check if we should keep scattering or go back
      const now = performance.now();
      if (stateRef.current.targetTransition === 1 && now - stateRef.current.lastScatterTime < 800) {
        // Keep it open for a bit longer if hand lost during scatter
        return;
      }
      stateRef.current.targetTransition = 0;
      return;
    }

    const now = performance.now();
    switch (handData.gesture) {
      case GestureType.SCATTER:
        stateRef.current.targetTransition = 1;
        stateRef.current.lastScatterTime = now;
        break;
      case GestureType.TREE:
        stateRef.current.targetTransition = 0;
        break;
      case GestureType.NONE:
        // Grace period for scatter gesture to handle vision jitter
        if (stateRef.current.targetTransition === 1 && now - stateRef.current.lastScatterTime < 1000) {
          stateRef.current.targetTransition = 1;
        } else {
          stateRef.current.targetTransition = 0;
        }
        break;
      default:
        break;
    }
  }, [handData]);

  return <div ref={containerRef} className="fixed inset-0" />;
};

export default ThreeScene;
