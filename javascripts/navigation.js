// Custom Navigation System for Sailfish Documentation

document.addEventListener('DOMContentLoaded', function() {
    // Simplified navigation structure
    const navigation = {
        'home': {
            title: 'Home',
            icon: '🏠',
            content: [
                { title: 'Project Overview', url: 'index.md#sailfish-v08' },
                { title: 'Features', url: 'index.md#features' },
                { title: 'Getting Started', url: 'index.md#getting-started' },
                { title: 'Key Capabilities', url: 'index.md#key-capabilities' },
                { title: 'Quick Links', url: 'index.md#quick-links' }
            ]
        },
        'setup': {
            title: 'Setup & Installation',
            icon: '🚀',
            content: [
                { title: 'Installation & Setup', url: 'setups.md' },
                { title: 'Basic Configuration', url: 'definitions.md' },
                { title: 'Preset Configurations', url: 'presets.md' }
            ]
        },
        'configuration': {
            title: 'Configuration',
            icon: '⚙️',
            content: [
                { title: 'Complete Parameter Guide', url: 'configuration.md' },
                { title: 'Science Products & Timeseries', url: 'products-timeseries.md' }
            ]
        },
        'documentation': {
            title: 'Documentation',
            icon: '📚',
            content: [
                { title: 'Numerical Methods', url: 'numerical-methods.md' },
                { title: 'Code Examples', url: 'code-examples.md' }
            ]
        }
    };

    // Create custom navigation HTML
    function createCustomNavigation() {
        // Create top navigation bar with horizontal tabs
        const topNav = document.createElement('div');
        topNav.className = 'custom-top-nav';
        topNav.innerHTML = `
            <div class="top-nav-container">
                <div class="top-nav-header">
                    <a href="index.md" class="site-title">
                        <span class="site-icon">🐟</span>
                        <span class="site-name">Sailfish-v0.8</span>
                    </a>
                    <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">☰</button>
                </div>
                <nav class="top-nav-tabs">
                    ${Object.entries(navigation).map(([key, section]) => `
                        <button class="top-nav-tab" data-section="${key}" onclick="switchSection('${key}')">
                            <span class="tab-icon">${section.icon}</span>
                            <span class="tab-title">${section.title}</span>
                        </button>
                    `).join('')}
                </nav>
            </div>
        `;

        // Create simplified sidebar
        const sidebar = document.createElement('div');
        sidebar.className = 'custom-sidebar';
        sidebar.innerHTML = `
            <div class="sidebar-content">
                ${Object.entries(navigation).map(([key, section]) => `
                    <div class="sidebar-section" id="sidebar-${key}" style="display: ${key === 'home' ? 'block' : 'none'}">
                        <div class="sidebar-section-title">${section.title}</div>
                        <ul class="sidebar-nav">
                            ${section.content.map(item => `
                                <li class="sidebar-nav-item">
                                    <a href="${item.url}" class="sidebar-nav-link">
                                        ${item.title}
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;

        // Insert elements into the page
        document.body.insertBefore(topNav, document.body.firstChild);
        
        // Insert sidebar after the main container
        const mainContainer = document.querySelector('.md-main') || document.querySelector('main') || document.body;
        mainContainer.insertBefore(sidebar, mainContainer.firstChild);

        // Set initial active state
        setActiveSection('home');
    }

    // Switch between sections with smooth transitions
    window.switchSection = function(sectionKey) {
        // Update top navigation active state
        document.querySelectorAll('.top-nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-section="${sectionKey}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Update sidebar content with smooth transition
        document.querySelectorAll('.sidebar-section').forEach(section => {
            section.style.opacity = '0';
            setTimeout(() => {
                section.style.display = 'none';
            }, 150);
        });
        
        const targetSection = document.getElementById(`sidebar-${sectionKey}`);
        if (targetSection) {
            setTimeout(() => {
                targetSection.style.display = 'block';
                setTimeout(() => {
                    targetSection.style.opacity = '1';
                }, 10);
            }, 150);
        }

        // Update active sidebar links based on current page
        updateSidebarActiveLinks(sectionKey);
    };

    // Set active section based on current page
    function setActiveSection(sectionKey) {
        // Determine current section based on URL
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        let activeSection = 'home';

        // Check for specific pages
        if (currentPath.includes('setups.md') || currentPath.includes('definitions.md') || currentPath.includes('presets.md')) {
            activeSection = 'setup';
        } else if (currentPath.includes('configuration.md') || currentPath.includes('products-timeseries.md')) {
            activeSection = 'configuration';
        } else if (currentPath.includes('numerical-methods.md') || currentPath.includes('code-examples.md')) {
            activeSection = 'documentation';
        } else if (currentPath === '/' || currentPath.includes('index.md')) {
            activeSection = 'home';
        }

        switchSection(activeSection);
    }

    // Update active sidebar links
    function updateSidebarActiveLinks(sectionKey) {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        document.querySelectorAll('.sidebar-nav-link').forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            // Check if this link matches the current page
            if (linkHref === currentPath || 
                (currentPath === '/' && linkHref === 'index.md') ||
                (currentPath.includes(linkHref.replace('.md', '')) && linkHref !== 'index.md')) {
                link.classList.add('active');
            }
            
            // Handle hash links for index page sections
            if (currentPath === '/' || currentPath.includes('index.md')) {
                if (linkHref.includes('#') && currentHash === linkHref.split('#')[1]) {
                    link.classList.add('active');
                }
            }
        });
    }

    // Mobile menu toggle with improved animation
    window.toggleMobileMenu = function() {
        const sidebar = document.querySelector('.custom-sidebar');
        const body = document.body;
        
        sidebar.classList.toggle('open');
        body.classList.toggle('sidebar-open');
    };

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const sidebar = document.querySelector('.custom-sidebar');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (!sidebar.contains(event.target) && !mobileToggle.contains(event.target)) {
            sidebar.classList.remove('open');
            document.body.classList.remove('sidebar-open');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        const sidebar = document.querySelector('.custom-sidebar');
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
            document.body.classList.remove('sidebar-open');
        }
    });

    // Initialize navigation
    createCustomNavigation();

    // Handle navigation on page load
    setTimeout(() => {
        setActiveSection();
    }, 100);
}); 