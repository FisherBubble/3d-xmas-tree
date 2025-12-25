
## The Prompt

**Role**: Senior Creative Technologist & WebGL Specialist.
**Task**: Build a high-fidelity, gesture-controlled 3D Christmas experience using React, Three.js, and MediaPipe.

### 1. Visual Specification (Three.js)
- **Core Entity**: A massive 3D Christmas tree built with `THREE.Points`. 
- **Particle Logic**: 
    - At least 6,000 particles.
    - Custom ShaderMaterial with a `uTransition` uniform (0 to 1).
    - Position A: A structured Fermat spiral/conical tree shape.
    - Position B: A chaotic spherical scatter (stars).
    - Vertices should have a "breathing/swaying" animation in the vertex shader using `sin(uTime)`.
- **Lighting**: Use `InstancedMesh` to create a secondary spiral of "fairy lights" that wraps around the tree. Apply a flickering animation.
- **Palette**: Deep Black (#000000), Luxury Gold (#d4af37), and Festive Crimson (#8b1e1e).

### 2. Interaction Specification (MediaPipe)
- **Configuration**: Use `HandLandmarker` from `@mediapipe/tasks-vision`. Enable `numHands: 2`.
- **Gesture Logic (Crucial)**:
    - **Fist (✊)**: All 4 fingertips within `0.8 * palmSize` of their respective MCP joints. Trigger: Rebuild Tree.
    - **Open Palm (🖐️)**: Robust "Voting System"—if at least 3 out of 4 fingers are extended beyond `2.0 * palmSize` from the wrist. Trigger: Scatter Particles.
    - **Two-Hand Heart (🫶)**: Detect two hands. Distance between both `INDEX_FINGER_TIP`s and both `THUMB_TIP`s must be less than `1.5 * averagePalmSize`. Trigger: Open Secret UI.
- **State Management**: Implement a `TRIGGER_THRESHOLD` (approx. 5-10 frames) to prevent gesture flickering.

### 3. UI/UX Specification
- **Theme**: Luxury "Digital Art" aesthetic. Use 'Cinzel' for serif headings and 'Quicksand' for clean body text.
- **Bilingual**: Support English and Simplified Chinese (EN/CN toggle).
- **The Letter System**: An animated CSS/Tailwind 3D red envelope. When opened, it reveals a "Witty/Sarcastic Blessing" (e.g., "Hope your holiday lasts longer than your productivity peaks").

### 4. Technical Stack
- React 18+ (Hooks: useRef, useEffect, useState).
- Three.js (R170+).
- MediaPipe Tasks Vision.
- Tailwind CSS for the UI overlay.

**Output Requirement**: Provide a modular React codebase. Ensure the camera access is handled gracefully with clear user instructions. The final result must look and feel like a premium interactive installation.
