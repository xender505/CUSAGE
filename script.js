// Leaf falling animation - create multiple leaves falling randomly
function createFallingLeaf() {
  const leaf = document.createElement('div');
  leaf.classList.add('leaf-fall');
  leaf.style.left = Math.random() * window.innerWidth + 'px';
  leaf.style.animationDuration = (4 + Math.random() * 4) + 's';
  leaf.style.animationDelay = Math.random() * 5 + 's';
  const container = document.getElementById('top-bar-leaf-container');
  if (container) {
    container.appendChild(leaf);
  } else {
    document.body.appendChild(leaf);
  }

  // Remove leaf after animation ends
  leaf.addEventListener('animationend', () => {
    leaf.remove();
  });
}

function createMultipleLeaves(count, interval) {
  let created = 0;
  const intervalId = setInterval(() => {
    createFallingLeaf();
    created++;
    if (created >= count) {
      clearInterval(intervalId);
    }
  }, interval);
}

// Create 3 leaves staggered by 500ms
createMultipleLeaves(3, 500);

// New function to create falling leaves in hero section
function createHeroFallingLeaf() {
  const leaf = document.createElement('div');
  leaf.classList.add('leaf-fall');
  leaf.style.left = Math.random() * 100 + '%';
  leaf.style.top = '-20px';
  leaf.style.animationDuration = (5 + Math.random() * 5) + 's';
  leaf.style.animationDelay = '0s';
  const container = document.getElementById('hero-leaf-container');
  if (container) {
    container.appendChild(leaf);
  }

  // Remove leaf after animation ends
  leaf.addEventListener('animationend', () => {
    leaf.remove();
  });
}

// Continuously create leaves in hero section
function startHeroLeavesAnimation() {
  setInterval(() => {
    createHeroFallingLeaf();
  }, 300);
}

// Existing code below...

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const canvas = document.getElementById('hero-leaf-canvas');
const ctx = canvas.getContext('2d');

let leaves = [];
const leafCount = 50;

// Tree drawing function
function drawTree(ctx, baseX, baseY, trunkHeight, trunkWidth) {
  // Draw trunk
  ctx.fillStyle = '#5a3e1b';
  ctx.fillRect(baseX - trunkWidth / 2, baseY - trunkHeight, trunkWidth, trunkHeight);

  // Draw branches (simple)
  ctx.strokeStyle = '#5a3e1b';
  ctx.lineWidth = trunkWidth / 4;
  ctx.beginPath();
  ctx.moveTo(baseX, baseY - trunkHeight);
  ctx.lineTo(baseX - trunkWidth, baseY - trunkHeight * 1.5);
  ctx.moveTo(baseX, baseY - trunkHeight);
  ctx.lineTo(baseX + trunkWidth, baseY - trunkHeight * 1.5);
  ctx.stroke();

  // Draw leaves cluster on branches
  ctx.fillStyle = '#2e4a1f';
  ctx.beginPath();
  ctx.ellipse(baseX - trunkWidth, baseY - trunkHeight * 1.5, trunkWidth * 1.5, trunkHeight / 2, 0, 0, 2 * Math.PI);
  ctx.ellipse(baseX + trunkWidth, baseY - trunkHeight * 1.5, trunkWidth * 1.5, trunkHeight / 2, 0, 0, 2 * Math.PI);
  ctx.fill();
}

class Leaf {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height;
    this.size = 10 + Math.random() * 10;
    this.speed = 1 + Math.random() * 2;
    this.angle = Math.random() * 2 * Math.PI;
    this.angularSpeed = 0.01 + Math.random() * 0.02;
  }

  update() {
    this.y += this.speed;
    this.angle += this.angularSpeed;
    if (this.y > canvas.height) {
      this.y = -this.size;
      this.x = Math.random() * canvas.width;
      this.size = 10 + Math.random() * 10;
      this.speed = 1 + Math.random() * 2;
      this.angle = Math.random() * 2 * Math.PI;
      this.angularSpeed = 0.01 + Math.random() * 0.02;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Draw leaf with veins - more detailed
    const leafLength = this.size * 1.3;
    const leafWidth = this.size * 0.6 * 1.3;

    // Leaf body with gradient
    const gradient = ctx.createLinearGradient(0, -leafLength / 2, 0, leafLength / 2);
    gradient.addColorStop(0, '#3a6b35');
    gradient.addColorStop(1, '#6b8e23');
    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.ellipse(0, 0, leafWidth, leafLength, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Leaf veins
    ctx.strokeStyle = '#2e4a1f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -leafLength / 2);
    ctx.lineTo(0, leafLength / 2);
    ctx.stroke();

    // Side veins
    const veinCount = 7;
    for (let i = 1; i <= veinCount; i++) {
      const y = -leafLength / 2 + (i * leafLength) / (veinCount + 1);
      const xOffset = leafWidth * 0.8;

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(xOffset, y + leafWidth * 0.4);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(-xOffset, y + leafWidth * 0.4);
      ctx.stroke();
    }

    ctx.restore();
  }
}

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  leaves.forEach(leaf => {
    leaf.update();
    leaf.draw(ctx);
  });
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resizeCanvas();
});

window.addEventListener('load', async () => {
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');
  // Delay to allow loading animation to be visible longer (e.g., 4 seconds)
  await delay(4000);
  loadingScreen.style.display = 'none';
  mainContent.classList.remove('hidden');
  // Trigger fade-in animations on visible sections
  fadeInOnScroll();

  // Setup canvas and start animation
  resizeCanvas();
  leaves = [];
  for (let i = 0; i < leafCount; i++) {
    leaves.push(new Leaf());
  }
  animate();
});

// Scroll-triggered fade-in animation
function fadeInOnScroll() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      section.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', fadeInOnScroll);

// Team members data
const teamMembers = [
  { name: "Winnie Muli", role: "President", img: "images/WhatsApp Image 2025-07-17 at 4.12.40 PM.jpeg", funFact: "Loves hiking and nature photography." },
  { name: "Denis Waitage", role: "Vice President", img: "images/WhatsApp Image 2025-07-17 at 4.13.55 PM (1).jpeg", funFact: "Enjoys urban gardening." },
  { name: "Lorna Chelimo", role: "Secretary", img: "images/WhatsApp Image 2025-07-17 at 4.13.55 PM (2).jpeg", funFact: "Passionate about recycling initiatives." },
  { name: "Kennedy Munyao", role: "Treasurer", img: "images/WhatsApp Image 2025-07-17 at 4.13.55 PM (3).jpeg", funFact: "Avid bird watcher." },
  { name: "Brian Ngonge", role: "Project Coordinator", img: "images/WhatsApp Image 2025-07-17 at 4.13.55 PM (4).jpeg", funFact: "Enjoys community cleanups." },
  { name: "Vincent Rono", role: "Project Coordinator", img: "images/WhatsApp Image 2025-07-17 at 4.13.55 PM (5).jpeg", funFact: "Loves planting trees." },
  { name: "Rosalia Wanyonyi", role: "Publicity", img: "images/headerbackground.jpeg", funFact: "Creative graphic designer." },
  { name: "Nicole Seda", role: "Publicity", img: "images/headerbackground.jpeg", funFact: "Social media enthusiast." },
  { name: "Daniel Waithaka", role: "IT Support", img: "images/headerbackground.jpeg", funFact: "Tech geek and coder." },
  { name: "Alex Matheka", role: "IT Support", img: "images/headerbackground.jpeg", funFact: "Loves open source projects." },
  { name: "Dr. Eunice Marete", role: "Patron", img: "images/headerbackground.jpeg", funFact: "Environmental scientist." },
  { name: "Ms. Faith Marete", role: "Patron", img: "images/headerbackground.jpeg", funFact: "Community leader." }
];

// Populate team members section
function populateTeam() {
  const teamGrid = document.querySelector('.team-grid');
  teamMembers.forEach(member => {
    const memberDiv = document.createElement('div');
    memberDiv.classList.add('team-member');
    memberDiv.innerHTML = `
      <img src="${member.img}" alt="${member.name}" />
      <h3>${member.name}</h3>
      <p><strong>${member.role}</strong></p>
      <p><em>${member.funFact}</em></p>
    `;
    teamGrid.appendChild(memberDiv);
  });
}

// Events data
const events = [
  {
    title: "Sustainability Workshop",
    date: "2025-08-15",
    description: "Learn practical ways to live sustainably.",
    category: "training"
  },
  {
    title: "Community Cleanup",
    date: "2025-09-05",
    description: "Join us to clean local parks and streets.",
    category: "community"
  },
  {
    title: "Awareness Campaign on Climate Change",
    date: "2025-10-10",
    description: "Raising awareness about climate resilience.",
    category: "campaign"
  }
];

// Populate events section
function populateEvents(filter = 'all') {
  const eventsContainer = document.querySelector('.events-container');
  eventsContainer.innerHTML = '';
  const filteredEvents = filter === 'all' ? events : events.filter(e => e.category === filter);
  filteredEvents.forEach(event => {
    const card = document.createElement('div');
    card.classList.add('event-card');
    card.innerHTML = `
      <h3>${event.title}</h3>
      <div class="date">${new Date(event.date).toLocaleDateString()}</div>
      <div class="category">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</div>
      <p>${event.description}</p>
    `;
    eventsContainer.appendChild(card);
  });
}

// Event filter buttons
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    populateEvents(btn.getAttribute('data-filter'));
  });
});

// Gallery images data (using images folder)
const galleryImages = [
  { src: "images/WhatsApp Image 2025-07-17 at 4.12.40 PM.jpeg", caption: "SAGE Workshop 2025" },
  { src: "images/WhatsApp Image 2025-07-17 at 4.13.55 PM (1).jpeg", caption: "Community Cleanup" },
  { src: "images/WhatsApp Image 2025-07-17 at 4.13.55 PM (2).jpeg", caption: "Tree Planting Event" },
  { src: "images/WhatsApp Image 2025-07-17 at 4.13.55 PM (3).jpeg", caption: "Awareness Campaign" },
  { src: "images/WhatsApp Image 2025-07-17 at 4.13.55 PM (4).jpeg", caption: "Workshop Group Photo" },
  { src: "images/WhatsApp Image 2025-07-17 at 4.13.55 PM (5).jpeg", caption: "Publicity Team" }
];

let currentSlideIndex = 0;
let slideInterval;
let slideDirection = 1; // 1 for forward, -1 for backward

function populateGallery() {
  const sliderWrapper = document.querySelector('.slider-wrapper');
  sliderWrapper.innerHTML = '';
  galleryImages.forEach(img => {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slide');
    const imageElem = document.createElement('img');
    imageElem.src = img.src;
    imageElem.alt = img.caption;
    imageElem.tabIndex = 0;
    imageElem.addEventListener('click', () => openModal(img.src, img.caption));
    slideDiv.appendChild(imageElem);
    sliderWrapper.appendChild(slideDiv);
  });
  showSlide(currentSlideIndex);
  startSlideShow();
}

function showSlide(index) {
  const sliderWrapper = document.querySelector('.slider-wrapper');
  const slides = sliderWrapper.querySelectorAll('.slide');
  if (index >= slides.length) {
    slideDirection = -1;
    currentSlideIndex = slides.length - 2;
  } else if (index < 0) {
    slideDirection = 1;
    currentSlideIndex = 1;
  } else {
    currentSlideIndex = index;
  }
  const offset = -currentSlideIndex * 100;
  sliderWrapper.style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
  showSlide(currentSlideIndex + slideDirection);
}

function prevSlide() {
  showSlide(currentSlideIndex - slideDirection);
}

function startSlideShow() {
  clearInterval(slideInterval);
  slideInterval = setInterval(() => {
    nextSlide();
  }, 5000);
}

function stopSlideShow() {
  clearInterval(slideInterval);
}

// Event listeners for slider buttons
document.addEventListener('DOMContentLoaded', () => {
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      stopSlideShow();
      startSlideShow();
    });
    prevBtn.addEventListener('click', () => {
      prevSlide();
      stopSlideShow();
      startSlideShow();
    });
  }
});

// Modal popup
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const captionText = document.getElementById('caption');
const closeBtn = document.querySelector('.close');

function openModal(src, caption) {
  modal.classList.remove('hidden');
  modalImg.src = src;
  captionText.textContent = caption;
}

closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

  
// On page load, check if user has joined and hide Join Us button accordingly
document.addEventListener('DOMContentLoaded', () => {
  populateTeam();
  populateEvents();
  populateGallery();
});
