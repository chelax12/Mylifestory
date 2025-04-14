// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.getElementById('loadingProgress');
    let progress = 0;

    const loadingInterval = setInterval(() => {
        progress += 1;
        loadingProgress.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 20);
});

// Audio Toggle
const audio = document.getElementById('background-music');
const audioToggle = document.getElementById('audio-toggle');
let isPlaying = false;

audioToggle.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        audioToggle.innerText = '🔈';
    } else {
        audio.play();
        audioToggle.innerText = '🔊';
    }
    isPlaying = !isPlaying;
});

// Stats Modal
function showStats(name, difficulty, image, description) {
    const modal = document.getElementById('statsModal');
    const overlay = document.getElementById('modalOverlay');
    const statsName = document.getElementById('statsName');
    const statsDifficulty = document.getElementById('statsDifficulty');
    const statsImage = document.getElementById('statsImage');
    const statsDescription = document.getElementById('statsDescription');

    statsName.textContent = name;
    statsImage.src = image;
    statsDescription.textContent = description;

    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += i < difficulty ? '★' : '☆';
    }
    statsDifficulty.textContent = stars;

    modal.style.display = 'block';
    overlay.style.display = 'block';
}

function closeStatsModal() {
    const modal = document.getElementById('statsModal');
    const overlay = document.getElementById('modalOverlay');
    modal.style.display = 'none';
    overlay.style.display = 'none';
}

// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.insertBefore(renderer.domElement, document.body.firstChild);

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.8 });
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Mouse Movement
document.addEventListener('mousemove', (event) => {
    let x = (event.clientX / window.innerWidth - 0.5) * 2;
    let y = -(event.clientY / window.innerHeight - 0.5) * 2;
    camera.position.x = x;
    camera.position.y = y;
});

camera.position.z = 10;

function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.001;
    renderer.render(scene, camera);
}
animate();

// Navigation Dots
document.addEventListener('DOMContentLoaded', () => {
    const dots = document.querySelectorAll('.dot');
    const sections = document.querySelectorAll('.section');
    
    function updateActiveDot() {
        const scrollPosition = window.scrollY;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                dots.forEach(dot => dot.classList.remove('active'));
                dots[index].classList.add('active');
            }
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            sections[index].scrollIntoView({ behavior: 'smooth' });
        });
    });

    window.addEventListener('scroll', updateActiveDot);
    updateActiveDot();
});

// Dialog functionality
function openDialog() {
    document.getElementById('dialogOverlay').style.display = 'flex';
}

function closeDialog() {
    document.getElementById('dialogOverlay').style.display = 'none';
}

// Click Sound
document.getElementById('start-button')?.addEventListener('click', function() {
    document.getElementById('clickSound').play();
});

// Gallery functionality
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('galleryModal');
const modalImg = document.getElementById('modalImage');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        modalImg.src = imgSrc;
        modal.style.display = 'flex';
    });
});

function closeModal() {
    modal.style.display = 'none';
}

// Close modal when clicking outside the image
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});