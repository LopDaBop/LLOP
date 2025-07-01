// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Mobile menu toggle
menuToggle?.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Smooth scrolling for navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Hide all sections
        sections.forEach(section => section.classList.remove('active'));
        
        // Show target section
        if (targetSection) {
            targetSection.classList.add('active');
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize the first section as active
window.addEventListener('DOMContentLoaded', () => {
    // Show home section by default
    document.querySelector('#home').classList.add('active');
    document.querySelector('.nav-link[href="#home"]')?.classList.add('active');
    
    // Initialize IB Tracker
    initializeIBTracker();
    
    // Initialize German Learning
    initializeGermanLearning();
    
    // Initialize Bank Section
    initializeBankSection();
    
    // Initialize Business Section
    initializeBusinessSection();
    
    // Initialize timeline animation
    initializeTimeline();
});

// Initialize IB Tracker
function initializeIBTracker() {
    const ibSubjects = [
        { name: 'Math AA', level: 'HL', points: 7 },
        { name: 'Biology', level: 'HL', points: 7 },
        { name: 'Chemistry', level: 'HL', points: 7 },
        { name: 'English', level: 'SL', points: 7 },
        { name: 'German', level: 'SL', points: 7 },
        { name: 'Geography', level: 'SL', points: 7 },
    ];
    
    const assignments = [
        { subject: 'Math AA', name: 'Math IA', points: 2, completed: false },
        { subject: 'Biology', name: 'Biology IA', points: 2, completed: false },
        { subject: 'Chemistry', name: 'Chemistry IA', points: 2, completed: false },
        { subject: 'English', name: 'English IO', points: 1, completed: false },
        { subject: 'German', name: 'German IO', points: 1, completed: false },
        { subject: 'Geography', name: 'Geography IA', points: 2, completed: false },
        { subject: 'Core', name: 'TOK Essay', points: 1, completed: false },
        { subject: 'Core', name: 'Extended Essay', points: 3, completed: false },
    ];
    
    // Render IB Points Visualization
    const pointsContainer = document.createElement('div');
    pointsContainer.className = 'ib-points';
    pointsContainer.innerHTML = `
        <h3>IB Points: <span id="ib-total-points">0</span>/45 <span id="ib-points-breakdown" class="points-breakdown"></span></h3>
        <div class="points-visualization">
            ${Array(45).fill('<div class="point"></div>').join('')}
        </div>
        <div class="points-labels">
            <span>0</span>
            <span>45</span>
        </div>
        <p class="points-note">Note: 42 points from subjects + 3 points from TOK/EE</p>
    `;
    document.querySelector('.ib-container').prepend(pointsContainer);
    
    // Render Subject Cards
    const subjectsContainer = document.createElement('div');
    subjectsContainer.className = 'subjects-container';
    
    ibSubjects.forEach(subject => {
        const subjectCard = document.createElement('div');
        subjectCard.className = 'subject-card';
        subjectCard.innerHTML = `
            <h4>${subject.name} ${subject.level}</h4>
            <div class="subject-points">
                ${Array(7).fill(0).map((_, i) => 
                    `<span class="point" data-points="${i+1}">${i+1}</span>`
                ).join('')}
            </div>
            <div class="subject-assignments">
                ${assignments
                    .filter(a => a.subject === subject.name || (a.subject === 'Core' && subject.name === 'Math AA'))
                    .map(a => `
                        <div class="assignment ${a.completed ? 'completed' : ''}" 
                             data-points="${a.points}">
                            ${a.name} (${a.points}pt${a.points > 1 ? 's' : ''})
                        </div>
                    `).join('')}
            </div>
        `;
        subjectsContainer.appendChild(subjectCard);
    });
    
    document.querySelector('.ib-container').appendChild(subjectsContainer);
    
    // Add event listeners
    document.querySelectorAll('.subject-points .point').forEach(point => {
        point.addEventListener('click', function() {
            const points = parseInt(this.getAttribute('data-points'));
            const subjectCard = this.closest('.subject-card');
            const currentPoints = subjectCard.getAttribute('data-points');
            
            // Toggle selection - if clicking the same point, deselect it
            if (currentPoints === this.getAttribute('data-points')) {
                subjectCard.removeAttribute('data-points');
                this.classList.remove('selected');
            } else {
                subjectCard.setAttribute('data-points', points);
                // Remove selected class from all points in this subject
                const allPoints = subjectCard.querySelectorAll('.subject-points .point');
                allPoints.forEach(p => p.classList.remove('selected'));
                // Add selected class to clicked point
                this.classList.add('selected');
            }
            updateIBPoints();
        });
    });
    
    document.querySelectorAll('.assignment').forEach(assignment => {
        assignment.addEventListener('click', function() {
            this.classList.toggle('completed');
            updateIBPoints();
        });
    });
    
    // Initial update
    updateIBPoints();
    
    // Initialize selected points from data attributes
    document.querySelectorAll('.subject-card').forEach(card => {
        const points = card.getAttribute('data-points');
        if (points) {
            const pointElement = card.querySelector(`.subject-points .point[data-points="${points}"]`);
            if (pointElement) {
                pointElement.classList.add('selected');
            }
        }
    });
}

function updateIBPoints() {
    let totalPoints = 0;
    let subjectCount = 0;
    
    // Calculate subject points (max 7 per subject, but scaled to fit into 42 total)
    // Each subject contributes up to 5 points from final exams and 2 points from IAs
    document.querySelectorAll('.subject-card').forEach(card => {
        const points = parseInt(card.getAttribute('data-points') || '0');
        if (!isNaN(points) && points > 0) {
            // Scale the points: 1-7 to 0-7 (but in practice max 6-7)
            // 1 = 1, 2 = 2, ..., 7 = 7
            totalPoints += Math.min(points, 7);
            subjectCount++;
        }
    });
    
    // Scale total to fit into 42 points (7 subjects * 6 points)
    // But since we're using actual IB grades, we'll just cap at 42
    let scaledPoints = Math.min(totalPoints, 42);
    
    // Add TOK/EE points (3 points max)
    let tokEePoints = 0;
    document.querySelectorAll('.assignment.completed').forEach(assignment => {
        const points = parseInt(assignment.getAttribute('data-points') || '0');
        tokEePoints = Math.min(tokEePoints + points, 3); // Cap at 3 for TOK/EE
    });
    
    // Calculate final total (max 45)
    const finalTotal = Math.min(scaledPoints + tokEePoints, 45);
    
    // Update display
    const pointsElement = document.getElementById('ib-total-points');
    if (pointsElement) {
        pointsElement.textContent = finalTotal;
        
        // Show breakdown in the UI
        const breakdownElement = document.getElementById('ib-points-breakdown');
        if (breakdownElement) {
            breakdownElement.textContent = `(Subjects: ${scaledPoints}/42 + TOK/EE: ${tokEePoints}/3)`;
        }
    }
    
    // Update points visualization
    document.querySelectorAll('.points-visualization .point').forEach((point, index) => {
        point.classList.toggle('earned', index < finalTotal);
    });
}

// Initialize German Learning Section
function initializeGermanLearning() {
    const cefrLevels = [
        {
            level: 'A1',
            title: 'Beginner',
            description: 'Can understand and use familiar everyday expressions and very basic phrases.'
        },
        {
            level: 'A2',
            title: 'Elementary',
            description: 'Can understand sentences and frequently used expressions related to areas of immediate relevance.'
        },
        {
            level: 'B1',
            title: 'Intermediate',
            description: 'Can understand the main points of clear standard input on familiar matters regularly encountered in work, school, leisure, etc.'
        },
        {
            level: 'B2',
            title: 'Upper Intermediate',
            description: 'Can understand the main ideas of complex text on both concrete and abstract topics.'
        },
        {
            level: 'C1',
            title: 'Advanced',
            description: 'Can understand a wide range of demanding, longer texts, and recognize implicit meaning.'
        },
        {
            level: 'C2',
            title: 'Mastery',
            description: 'Can understand with ease virtually everything heard or read.'
        }
    ];
    
    const learningMethods = [
        {
            title: 'Daily Practice',
            icon: 'fa-calendar-day',
            description: 'Dedicate at least 30 minutes daily to German practice.'
        },
        {
            title: 'Language Apps',
            icon: 'fa-mobile-alt',
            description: 'Use apps like Duolingo, Anki, or Memrise for vocabulary building.'
        },
        {
            title: 'Immersion',
            icon: 'fa-globe-europe',
            description: 'Watch German movies, listen to German music, and read German books.'
        },
        {
            title: 'Conversation Practice',
            icon: 'fa-comments',
            description: 'Practice speaking with native speakers or language exchange partners.'
        },
        {
            title: 'Grammar Study',
            icon: 'fa-book',
            description: 'Regularly study and practice German grammar rules.'
        },
        {
            title: 'Writing Practice',
            icon: 'fa-pen-fancy',
            description: 'Write daily journal entries or short stories in German.'
        }
    ];
    
    // Render CEFR Levels
    const levelRequirements = document.querySelector('.level-requirements');
    if (levelRequirements) {
        cefrLevels.forEach(level => {
            const levelCard = document.createElement('div');
            levelCard.className = 'requirement-card';
            levelCard.innerHTML = `
                <h4>${level.level} - ${level.title}</h4>
                <p>${level.description}</p>
            `;
            levelRequirements.appendChild(levelCard);
        });
    }
    
    // Render Learning Methods
    const methodGrid = document.querySelector('.method-grid');
    if (methodGrid) {
        learningMethods.forEach(method => {
            const methodCard = document.createElement('div');
            methodCard.className = 'method-card';
            methodCard.innerHTML = `
                <h4><i class="fas ${method.icon}"></i> ${method.title}</h4>
                <p>${method.description}</p>
            `;
            methodGrid.appendChild(methodCard);
        });
    }
    
    // Set up level progress
    updateGermanProgress();
}

// Initialize Bank Section
function initializeBankSection() {
    const opportunities = [
        {
            title: 'Roblox Game Development',
            description: 'Create and sell Roblox games and scripts on Fiverr and Discord.',
            platforms: ['Fiverr', 'Discord'],
            estimatedEarnings: '€500-2000/month',
            status: 'Active'
        },
        {
            title: 'Web Development',
            description: 'Develop simple static websites for small businesses and individuals.',
            platforms: ['Fiverr', 'Reddit', 'Discord'],
            estimatedEarnings: '€300-1500/month',
            status: 'Active'
        },
        {
            title: 'Language Tutoring',
            description: 'Teach native languages on platforms like Preply or Cambly.',
            platforms: ['Preply', 'Cambly'],
            estimatedEarnings: '€10-30/hour',
            status: 'Planning'
        },
        {
            title: 'RV Rental',
            description: 'Rent out RV for €130/day with minimum 7-day rental.',
            platforms: ['Local Listings', 'RV Share'],
            estimatedEarnings: '€910+/month',
            status: 'Planning'
        }
    ];
    
    // Render Opportunities
    const opportunitiesGrid = document.querySelector('.opportunities-grid');
    if (opportunitiesGrid) {
        opportunities.forEach(opportunity => {
            const opportunityCard = document.createElement('div');
            opportunityCard.className = 'opportunity-card';
            
            const platformsHTML = opportunity.platforms.map(platform => 
                `<span class="platform-tag">${platform}</span>`
            ).join('');
            
            opportunityCard.innerHTML = `
                <h3>${opportunity.title}</h3>
                <p>${opportunity.description}</p>
                <div class="platforms">${platformsHTML}</div>
                <p class="mt-2"><strong>Estimated:</strong> ${opportunity.estimatedEarnings}</p>
                <span class="project-status">${opportunity.status}</span>
            `;
            
            opportunitiesGrid.appendChild(opportunityCard);
        });
    }
    
    // Update money display
    updateMoneyDisplay();
}

// Initialize Business Section
function initializeBusinessSection() {
    const projects = [
        {
            emoji: '♨',
            name: 'pro.J- UnfilteredReality',
            description: 'A platform for authentic content and discussions.',
            status: 'Planning'
        },
        {
            emoji: '♨',
            name: 'pro.J- LLop [Spotify]',
            description: 'Music production and distribution on Spotify.',
            status: 'Active'
        },
        {
            emoji: '🧊',
            name: 'pro.J- LLop merch',
            description: 'Merchandise line for LLop brand.',
            status: 'Planning'
        },
        {
            emoji: '🧊',
            name: 'pro.J-Cinimatography [if god; YT]',
            description: 'YouTube channel for cinematography content.',
            status: 'Planning'
        },
        {
            emoji: '🧊',
            name: 'pro.J Live',
            description: 'Live streaming and content creation.',
            status: 'Planning'
        },
        {
            emoji: '🍯',
            name: 'ib ias essays',
            description: 'IB Internal Assessment and Extended Essay services.',
            status: 'Active'
        },
        {
            emoji: '🍯',
            name: 'ib unofficial groups',
            description: 'Community groups for IB students.',
            status: 'Active'
        },
        {
            emoji: '🍯',
            name: 'ib clubideas [game dev club]',
            description: 'Game development club for IB students.',
            status: 'Planning'
        },
        {
            emoji: '🧊',
            name: 'pro.J [Web] Online shop',
            description: 'E-commerce platform for LLOP merchandise.',
            status: 'Planning'
        },
        {
            emoji: '🧊',
            name: 'pro.J [Web] personal port',
            description: 'Personal portfolio website.',
            status: 'Active'
        }
    ];
    
    // Render Projects
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <h3>${project.emoji} ${project.name}</h3>
                <p>${project.description}</p>
                <span class="project-status">${project.status}</span>
            `;
            projectsGrid.appendChild(projectCard);
        });
    }
}

// Initialize Timeline Animation
function initializeTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    const timelineLine = document.querySelector('.timeline-line');
    const milestones = document.querySelectorAll('.milestone');
    
    // Set initial state
    timelineLine.style.height = '0';
    
    // Animate timeline on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate timeline line
                timelineLine.style.transition = 'height 2s ease-in-out';
                timelineLine.style.height = '100%';
                
                // Animate milestones
                milestones.forEach((milestone, index) => {
                    setTimeout(() => {
                        milestone.style.opacity = '1';
                        milestone.style.transform = 'translateY(0)';
                    }, index * 300);
                });
                
                // Disconnect observer after animation
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(timeline);
    
    // Set initial styles for milestones
    milestones.forEach(milestone => {
        milestone.style.opacity = '0';
        milestone.style.transform = 'translateY(20px)';
        milestone.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
}

// Update IB Progress
function updateIBProgress() {
    const progressBar = document.querySelector('#ib-progress');
    if (!progressBar) return;
    
    // Simulate progress (in a real app, this would come from user data)
    const progress = 45; // 45% progress
    progressBar.style.width = `${progress}%`;
    
    // Add shimmer effect
    setTimeout(() => {
        progressBar.style.transition = 'width 1.5s ease-in-out';
    }, 100);
}

// Update German Learning Progress
function updateGermanProgress() {
    const currentLevel = 'B1';
    const targetLevel = 'C1';
    const progress = 40; // 40% towards C1 from B1
    
    const levelCircle = document.querySelector('.level-circle');
    if (levelCircle) {
        levelCircle.style.background = `conic-gradient(
            var(--primary-color) 0% ${progress}%,
            var(--background-light) ${progress}% 100%
        )`;
    }
    
    // Update level info
    const levelInfo = document.querySelector('.level-info');
    if (levelInfo) {
        levelInfo.innerHTML = `
            <h3>Current Level: ${currentLevel}</h3>
            <p>Goal: ${targetLevel} by June 2027</p>
            <div class="progress-container mt-2">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
        `;
    }
}

// Update Money Display
function updateMoneyDisplay() {
    const amountElement = document.querySelector('.amount');
    if (!amountElement) return;
    
    // In a real app, this would come from a database or API
    const currentAmount = 'N/A'; // Replace with actual amount
    amountElement.textContent = currentAmount;
}

// Handle window resize
window.addEventListener('resize', () => {
    // Update any responsive elements here
});
