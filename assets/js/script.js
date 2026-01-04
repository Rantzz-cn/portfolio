// Loader + entry animations
const pageLoader = document.getElementById('pageLoader');

window.addEventListener('load', () => {
  setTimeout(() => {
    if (pageLoader) {
      pageLoader.classList.add('hidden');
    }
  }, 1800); 
});


// Scroll progress bar
const scrollProgress = document.getElementById('scrollProgress');

const updateScrollProgress = () => {
  if (!scrollProgress) return;
  
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  
  scrollProgress.style.width = scrollPercent + '%';
};

window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);


// Back-to-top control
const backToTop = document.getElementById('backToTop');

const toggleBackToTop = () => {
  if (!backToTop) return;
  
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
};

window.addEventListener('scroll', toggleBackToTop);

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


// Mobile nav toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen.toString());
  });


  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}


// Smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// Active nav highlighting + navbar shadow
const sections = document.querySelectorAll('section');
const navLinks =
  document.querySelectorAll('.nav-menu a, .nav-links a');
const navbar = document.querySelector('.navbar');

let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;

  
  let current = '';
  sections.forEach(section => {
    if (scrollY >= section.offsetTop - 200) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === `#${current}`
    );
  });

  
  if (navbar) {
    navbar.style.boxShadow =
      scrollY > lastScrollTop
        ? '0 4px 12px rgba(0,0,0,0.15)'
        : '0 2px 8px rgba(0,0,0,0.1)';
  }

  lastScrollTop = scrollY <= 0 ? 0 : scrollY;
});


// Intersection-based reveal animations
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        setTimeout(() => {
          entry.target.classList.add('show');
        }, 100);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

reveals.forEach(el => revealObserver.observe(el));


// Contact form submit state handling
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const honeypot = form.querySelector('.hidden-field');
    if (honeypot && honeypot.value.trim()) return;
    
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    const statusEl = form.querySelector('.form-status');
    const toastEl = form.querySelector('.form-toast');

    const showToast = (type, message) => {
      if (!toastEl) return;
      toastEl.textContent = message;
      toastEl.classList.remove('success', 'error');
      toastEl.classList.add(type);
      toastEl.style.display = 'flex';
      setTimeout(() => {
        toastEl.style.display = 'none';
      }, 3200);
    };
    

    btnText.textContent = 'Sending...';
    submitBtn.disabled = true;
    btnIcon.style.display = 'none';
    submitBtn.setAttribute('aria-busy', 'true');
    submitBtn.classList.add('loading');
    if (statusEl) {
      statusEl.textContent = 'Sending your message...';
    }
    
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {

        btnText.textContent = 'Message Sent! ✓';
        submitBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
        form.reset();
        if (statusEl) {
          statusEl.textContent = 'Thanks for reaching out! I will reply within 24-48 hours.';
        }
        showToast('success', 'Message sent! I will reply within 24-48 hours.');
        

        setTimeout(() => {
          btnText.textContent = 'Send Message';
          btnIcon.style.display = 'flex';
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.removeAttribute('aria-busy');
          submitBtn.classList.remove('loading');
        }, 3000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {

      btnText.textContent = 'Error - Try Again';
      submitBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      if (statusEl) {
        statusEl.textContent = 'Something went wrong. Please try again or email me directly at teraldicoranier@gmail.com.';
      }
      showToast('error', 'Something went wrong. Please try again.');
      
      setTimeout(() => {
        btnText.textContent = 'Send Message';
        btnIcon.style.display = 'flex';
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        submitBtn.removeAttribute('aria-busy');
        submitBtn.classList.remove('loading');
      }, 3000);
    }
  });
}


// GitHub stats fetch
async function fetchGitHubStats() {
  const username = 'Rantzz-cn';
  
  try {

    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    const userData = await userResponse.json();
    

    const reposEl = document.getElementById('github-repos');
    const followersEl = document.getElementById('github-followers');
    
    if (reposEl) reposEl.textContent = userData.public_repos || 0;
    if (followersEl) followersEl.textContent = userData.followers || 0;
    

    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    const repos = await reposResponse.json();
    
    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const starsEl = document.getElementById('github-stars');
    if (starsEl) starsEl.textContent = totalStars;
    
  } catch (error) {
    console.log('GitHub API error:', error);
  }
}


fetchGitHubStats();


// Hero typewriter headline
const typewriterElement = document.getElementById('typewriter');
const roles = [
  'Backend Developer',
  'System Developer', 
  'Web Developer',
  'IT Student',
  'Problem Solver'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWriter() {
  if (!typewriterElement) return;
  
  const currentRole = roles[roleIndex];
  
  if (isDeleting) {

    typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50;
  } else {

    typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 100;
  }
  

  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true;
    typeSpeed = 2000; 
  }
  

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typeSpeed = 500; 
  }
  
  setTimeout(typeWriter, typeSpeed);
}


setTimeout(typeWriter, 1500);



// Gallery assets for lightbox
const galleryImages = [
  'assets/queueproj/queue1 (1).png',
  'assets/queueproj/queue1 (2).png',
  'assets/queueproj/queue1 (3).png',
  'assets/queueproj/queue1 (4).png',
  'assets/queueproj/queue1 (5).png',
  'assets/queueproj/queue1 (6).png',
  'assets/queueproj/queue1 (7).png',
  'assets/queueproj/queue1 (8).png',
  'assets/queueproj/queue1 (9).png',
  'assets/queueproj/queue1 (10).png',
  'assets/queueproj/queue1 (11).png',
  'assets/queueproj/queue1 (12).png',
  'assets/queueproj/queue1 (13).png',
  'assets/queueproj/queu (1).png',
  'assets/queueproj/queu (2).png',
  'assets/queueproj/queu (3).png',
  'assets/queueproj/queu (4).png',
  'assets/queueproj/queu (5).png',
  'assets/queueproj/phone1.jpg',
  'assets/queueproj/phone.jpg'
];

let currentLightboxIndex = 0;

function changeGalleryImage(thumb, imageSrc) {

  const mainImg = document.querySelector('.gallery-main-img');
  if (mainImg) {
    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = imageSrc;
      mainImg.style.opacity = '1';
    }, 200);
  }
  

  const thumbs = document.querySelectorAll('.gallery-thumb');
  thumbs.forEach(thumb => thumb.classList.remove('active'));
  thumb.classList.add('active');
  

  currentLightboxIndex = galleryImages.indexOf(imageSrc);
}

function openLightbox(imageSrc) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const mainImg = document.querySelector('.gallery-main-img');
  
  if (lightbox && lightboxImg) {

    const currentImage = imageSrc || (mainImg ? mainImg.src : galleryImages[0]);
    

    const imageName = currentImage.split('/').pop();
    currentLightboxIndex = galleryImages.findIndex(img => img.includes(imageName));
    
    if (currentLightboxIndex === -1) {


      lightboxImg.src = currentImage;
    } else {
      lightboxImg.src = galleryImages[currentLightboxIndex];
    }
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function changeLightboxImage(direction, event) {
  if (event) event.stopPropagation();
  
  currentLightboxIndex += direction;
  
  if (currentLightboxIndex < 0) {
    currentLightboxIndex = galleryImages.length - 1;
  } else if (currentLightboxIndex >= galleryImages.length) {
    currentLightboxIndex = 0;
  }
  
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightboxImg) {
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = galleryImages[currentLightboxIndex];
      lightboxImg.style.opacity = '1';
    }, 200);
  }
}


document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('lightbox');
  if (lightbox && lightbox.classList.contains('active')) {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      changeLightboxImage(-1, null);
    } else if (e.key === 'ArrowRight') {
      changeLightboxImage(1, null);
    }
  }
});


