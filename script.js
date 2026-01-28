document.addEventListener("DOMContentLoaded", function() {

    // ------------------------------------------------------------------
    // !!!!!!!!!!! MAJOR SECURITY WARNING !!!!!!!!!!!
    // ------------------------------------------------------------------
    // Your API key is visible here. This is risky for a public website.
    // In a real production environment, you should use environment variables
    // or Firebase App Check to secure this.
    // ------------------------------------------------------------------
    
    const firebaseConfig = {
      apiKey: "AIzaSyB04f7lWMfmfGBVzO-cj8QY00I4OpIPmrY", 
      authDomain: "binitaxpro.firebaseapp.com",
      projectId: "binitaxpro",
      storageBucket: "binitaxpro.firebasestorage.app",
      messagingSenderId: "24434294736",
      appId: "1:24434294736:web:cb23f13957b24da13f43d5",
      measurementId: "G-XMYYJEDRPW"
    };

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();

    // -----------------------------------------------------
    // Language Translation Data
    // -----------------------------------------------------
    const translations = {
        'en': {
            navHome: "Home",
            navAbout: "About",
            navServices: "Services",
            navResources: "Resources & News",
            navAppointment: "Book Appointment",
            navTestimonials: "Testimonials",
            navFAQ: "FAQ",
            navContact: "Contact",
            navPortal: "Client Portal",
            navAdmin: "Admin",
            navPrivacy: "Privacy Policy",
            heroTitle: "Your Trusted Partner for Tax Filing Services",
            heroSubtitle: "Making tax filing simple and stress-free. Let us help you maximize your returns and stay compliant.",
            heroCTA: "Get Started Today!",
            aboutTitle: "About Us",
            aboutText: "Welcome. We are an experienced and knowledgeable team of accounting professionals based in Toronto, specializing in tax and financial services...",
            aboutCredentialsTitle: "Our Credentials",
            aboutCredential1: "Certified CPA accountants",
            servicesTitle: "Our Services",
            service1Title: "Newcomer Return",
            service1Desc: "For first-time filers in Canada. We'll help you understand Canadian tax obligations...",
            service2Title: "Self-Employed / Business Return",
            service2Desc: "For ride-share, small business, or contract workers...",
            service3Title: "Foreign Income & Assets",
            service3Desc: "Expert help for clients with property or income outside Canada...",
            service4Title: "Standard/Family Return",
            service4Desc: "Comprehensive filing for individuals and families...",
            service5Title: "Tax Consultation & Planning",
            service5Desc: "Strategic, year-round advice to minimize liabilities...",
            resourcesTitle: "Resources & News",
            appointmentTitle: "Book an Appointment",
            appointmentDesc: "We've made booking easy! Choose a time that works for you using our online scheduler.",
            testimonialsTitle: "What Our Clients Say",
            testimonial1Text: "\"Binipro Tax made my first tax return in Canada so easy to understand...\"",
            testimonial1Name: "A.A., Toronto",
            testimonial2Text: "\"As a self-employed driver, my taxes are complicated...\"",
            testimonial2Name: "S.M., Scarborough",
            testimonial3Text: "\"It's a relief to have a tax professional who speaks my language...\"",
            testimonial3Name: "F.G., Etobicoke",
            faqTitle: "Frequently Asked Questions",
            faq1Question: "What documents do I need for tax-filing?",
            faq1Answer: "You will need your income statements (T4s, T4As, etc.), receipts...",
            faq2Question: "How can I maximize my tax refund?",
            faq2Answer: "Maximizing your refund involves identifying all eligible deductions...",
            faq3Question: "What if I owe taxes?",
            faq3Answer: "If you owe taxes, it’s crucial to file your return on time...",
            faq4Question: "How long does the tax filing process take?",
            faq4Answer: "The timeline varies depending on the complexity of your return...",
            contactTitle: "Contact Us",
            contactDesc: "Have a question or need assistance? Send us a message.",
            formName: "Name:",
            formEmail: "Email:",
            formMessage: "Message:",
            formSend: "Send Message",
            contactPhone: "Phone:",
            contactEmail: "Email:",
            privacyTitle: "Privacy Policy",
            privacyText: "At Bini Tax, we protect your privacy...",
            privacySub1: "Data We Collect",
            privacySub1Text: "Contact info, appointment details...",
            footerPrivacy: "Privacy Policy",
            footerContact: "Contact Us"
        },
        'am': {
            navHome: "ዋና ገጽ",
            navAbout: "ስለ እኛ",
            navServices: "አገልግሎቶች",
            navResources: "መርጃዎች",
            navAppointment: "ቀጠሮ ይያዙ",
            navTestimonials: "ምስክርነቶች",
            navFAQ: "ተደጋጋሚ ጥያቄዎች",
            navContact: "ያግኙን",
            navPortal: "የደንበኛ ፖርታል",
            navAdmin: "Admin",
            navPrivacy: "የግላዊነት ፖሊሲ",
            heroTitle: "ለግብር ፋይል አገልግሎቶች የእርስዎ ታማኝ አጋር",
            heroSubtitle: "የግብር ፋይል ማድረግን ቀላል እና ከጭንቀት ነጻ ማድረግ።",
            heroCTA: "ዛሬውኑ ይጀምሩ!",
            aboutTitle: "ስለ እኛ",
            aboutText: "እንኳን ደህና መጡ። በቶሮንቶ የተመሰረተ ልምድ ያለው የሂሳብ ባለሙያ ቡድን ነን...",
            servicesTitle: "አገልግሎቶቻችን",
            formSend: "መልዕክት ይላኩ",
            contactPhone: "ስልክ:",
            contactEmail: "ኢሜይል:",
            footerPrivacy: "የግላዊነት ፖሊሲ",
            footerContact: "ያግኙን"
        },
        'ti': {
            navHome: "ዋና ገጽ",
            navAbout: "ብዛዕባና",
            navServices: "ኣገልግሎታት",
            navResources: "ምንጭታት",
            navAppointment: "ቆጸራ ምሓዝ",
            navTestimonials: "ምስክርነታት",
            navFAQ: "ተደጋጋሚ ሕቶታት",
            navContact: "ተወከሱና",
            navPortal: "ናይ ዓማዊል ፖርታል",
            navAdmin: "Admin",
            navPrivacy: "ናይ ግላዊነት ፖሊሲ",
            heroTitle: "ኣብ ታክስ ፋይሊንግ ኣገልግሎት እሙን መሻርኽትኹም",
            heroSubtitle: "ታክስ ፋይል ምግባር ቀሊል ምግባር።",
            heroCTA: "ሎሚ ጀምሩ!",
            aboutTitle: "ብዛዕባና",
            aboutText: "እንቋዕ ብደሓን መጻእኩም።",
            servicesTitle: "ኣገልግሎታትና",
            formSend: "መልእኽቲ ልኣኹ",
            contactPhone: "ስልኪ:",
            contactEmail: "ኢሜይል:",
            footerPrivacy: "ናይ ግላዊነት ፖሊሲ",
            footerContact: "ተወከሱና"
        }
    };

    // Global function for switchLanguage (needs to be attached to window)
    window.switchLanguage = function(lang) {
        // Set active button
        document.querySelectorAll('.lang-switcher button').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.getElementById(`lang-${lang}`);
        if(activeBtn) activeBtn.classList.add('active');

        // Iterate over all elements with a data-key
        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                elem.innerText = translations[lang][key];
            } else if (lang !== 'en' && translations['en'][key]) {
                // Fallback to English if translation is missing
                elem.innerText = translations['en'][key];
            }
        });
    }

    // -----------------------------------------------------
    // Hamburger Menu Functionality
    // -----------------------------------------------------
    const hamburgerBtn = document.querySelector('.hamburger');
    const sidePanel = document.getElementById('sidePanel');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.getElementById('overlay');
    const navLinks = document.querySelectorAll('#sidePanel nav ul li a');

    function openPanel() {
        sidePanel.classList.add('open');
        overlay.classList.add('visible');
        document.body.classList.add('panel-open');
    }

    function closePanel() {
        sidePanel.classList.remove('open');
        overlay.classList.remove('visible');
        document.body.classList.remove('panel-open');
    }

    if(hamburgerBtn) hamburgerBtn.addEventListener('click', openPanel);
    if(closeBtn) closeBtn.addEventListener('click', closePanel);
    if(overlay) overlay.addEventListener('click', closePanel);

    navLinks.forEach(link => {
        // Close panel unless it's an external link
        if (link.href && link.href.includes('.html') && !link.href.includes('#')) {
            return;
        }
        link.addEventListener('click', closePanel);
    });

    // -----------------------------------------------------
    // Public Side: Load Resources
    // -----------------------------------------------------
    function loadResources() {
        const resourcesListElement = document.getElementById("resources-list");
        if(!resourcesListElement) return;
        
        db.collection("resources").orderBy("timestamp", "desc").onSnapshot(snapshot => {
         if (snapshot.empty && resourcesListElement.children.length > 0) {
             return; 
         }
         
         if (!snapshot.empty) {
           resourcesListElement.innerHTML = ""; // Clear placeholders
           snapshot.forEach(doc => {
               const data = doc.data();
               let postedOn = data.timestamp
                 ? new Date(data.timestamp.seconds * 1000).toLocaleDateString()
                 : "No date available";
               
               const resourceHTML = `
                 <div class="resource-card" tabindex="0">
                   <h3>${data.title}</h3>
                   <p>${data.content}</p>
                   <small>Posted on: ${postedOn}</small>
                 </div>
               `;
               resourcesListElement.innerHTML += resourceHTML;
           });
         } else {
           resourcesListElement.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No news or resources available yet.</p>';
         }
        }, error => {
            resourcesListElement.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: red;">Unable to load news at this time.</p>';
            console.error("Error loading resources: ", error);
        });
    }
    loadResources();
    
    // -----------------------------------------------------
    // Contact Form
    // -----------------------------------------------------
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const contactFormMessageDiv = document.getElementById("form-message");
            contactFormMessageDiv.textContent = "Sending your message...";
            contactFormMessageDiv.className = "";

            const name = document.getElementById("contact-name").value;
            const email = document.getElementById("contact-email").value;
            const message = document.getElementById("contact-message").value;
            
            db.collection("messages").add({
                name,
                email,
                message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                contactFormMessageDiv.textContent = "Thank you for reaching out! We have received your message and will get back to you shortly.";
                contactFormMessageDiv.className = "success-message";
                contactForm.reset();
            })
            .catch(error => {
                contactFormMessageDiv.textContent = "Error sending your message. Please try again or email us directly.";
                contactFormMessageDiv.className = "error-message";
                console.error("Error adding message: ", error);
            });
        });
    }

    // -----------------------------------------------------
    // FAQ Toggle
    // -----------------------------------------------------
    document.querySelectorAll('.faq-item').forEach(function(item) {
        item.addEventListener('click', toggleFAQ);
        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ.call(this);
            }
        });
    });

    function toggleFAQ() {
      var answer = this.nextElementSibling;
      var isVisible = answer.style.display === "block";

      document.querySelectorAll('.faq-answer').forEach(function(ans) {
          if (ans !== answer && ans.style.display === "block") {
              ans.style.display = "none";
          }
      });

      answer.style.display = isVisible ? "none" : "block";
    }

});
