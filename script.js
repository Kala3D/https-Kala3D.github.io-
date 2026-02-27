const canvas = document.querySelector('#canvas3d');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create Starfield / Particles
const geo = new THREE.BufferGeometry();
const count = 8000;
const posArr = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++) {
    posArr[i] = (Math.random() - 0.5) * 15;
}

geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
const mat = new THREE.PointsMaterial({
    size: 0.012,
    color: 0x00f2ff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

const starField = new THREE.Points(geo, mat);
scene.add(starField);

camera.position.z = 5;

// Mouse Parallax
let mX = 0, mY = 0;
window.addEventListener('mousemove', (e) => {
    mX = (e.clientX / window.innerWidth - 0.5);
    mY = (e.clientY / window.innerHeight - 0.5);
});

// Warp Animation Trigger
const btn = document.querySelector('#enter-btn');
const content = document.querySelector('.hero-content');
let isWarping = false;

btn.addEventListener('click', () => {
    isWarping = true;
    content.classList.add('fade-out');
    
    // Play a "Swoosh" sound could be added here
});

const animate = () => {
    requestAnimationFrame(animate);

    if (!isWarping) {
        // Natural floating state
        starField.rotation.y += 0.0005;
        camera.position.x += (mX * 2 - camera.position.x) * 0.05;
        camera.position.y += (-mY * 2 - camera.position.y) * 0.05;
    } else {
        // Warp Drive: Fly forward through particles
        camera.position.z -= 0.15;
        starField.rotation.z += 0.01;
        // Fade particles out as we pass them
        mat.opacity -= 0.005;
        
        if(camera.position.z < -5) {
            // Logic to redirect to the main app or dashboard
            console.log("Welcome to Kala3D");
        }
    }

    camera.lookAt(scene.position);
    renderer.render(scene, camera);
};

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
