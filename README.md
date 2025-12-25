# 🎄 Ethereal Holiday 3D (灵动圣诞)

A high-performance, luxury 3D interactive installation built with **Three.js**, **MediaPipe**, and **React**. Experience a celestial Christmas tree that responds to your hand gestures in real-time.

---

## 🎮 Interactive Gestures

The system uses a **Dual-Hand Tracking** model to interpret your intentions:

| Gesture | Action | Description |
| :--- | :--- | :--- |
| **✊ Fist** | **Rebuild Tree** | Particles converge into a structured, glowing tree. |
| **🖐️ Open Palm** | **Star Scatter** | Particles explode into a chaotic, starry nebula. |
| **🫶 Two-Hand Heart** | **Celestial Secret** | Unlocks the 3D Red Envelope containing a witty blessing. |

---

## Engineering Highlights

### 1. Robust Gesture "Voting" System
To solve the common "label flickering" in computer vision, this app implements a majoritarian voting logic. Instead of requiring 4/4 fingers for an open palm, it triggers if **3/4 fingers** meet the extension threshold, making it resilient to camera tilt and finger occlusion.

### 2. Dual-Hand Topology
The "Confession" (Heart) gesture now requires **both hands** to meet in space. This significantly increases detection confidence and prevents the AI from confusing a closed fist with a single-hand heart.

### 3. Shader-Based Animation
All particle transitions and the "sway" effect are handled directly on the GPU via custom GLSL shaders, ensuring a silky-smooth 60FPS experience even on mobile devices.

---

## Prompts for Iteration

You can find the prompt here:

- **[Master Generation Prompt](./prompts/master-prompt.md)**: Use this to recreate or modify the entire core logic in [Gemini AI Studio](https://aistudio.google.com$0).


## MediaPipe Integration

The application adopts HandLandmark Detection from MediaPipe which maps your hand to 21 anatomical landmarks.  You can test it on [MediaPipe Studio](https://mediapipe-studio.webapps.google.com/demo/hand_landmarker$0)
![MediaPipe Landmarks](https://developers.google.com/static/mediapipe/images/solutions/hand-landmarks.png)

---

## Local Setup (Vite)

1.  **Install dependencies**:  
    ```bash
    npm install
    ```
2.  **Run development server**:  
    ```bash
    npm run dev
    ```
3.  **Build for production**:  
    ```bash
    npm run build
    ```


## Deployment

The project is configured for deployment to **GitHub Pages** (via included Actions) and **Google Cloud Run** (via `server.js` and `Dockerfile`).
