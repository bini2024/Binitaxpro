document.addEventListener("DOMContentLoaded", function() {

    // ------------------------------------------------------------------
    // !!!!!!!!!!! MAJOR SECURITY WARNING !!!!!!!!!!!
    // ------------------------------------------------------------------
    // Your API key is visible here. 
    // You must set up Firebase Firestore Security Rules to ensure only
    // the Admin User (you) can read/write to the 'clientData' and 'resources'
    // collections. Without rules, anyone can edit your site.
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
    const auth = firebase.auth();
    const db = firebase.firestore();
    const storage = firebase.storage();

    // --- 1. ADMIN AUTHENTICATION ---
    
    const loginForm = document.getElementById("admin-login-form");
    if(loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const email = document.getElementById("admin-email").value;
            const password = document.getElementById("admin-password").value;
            
            if (!email || !password) {
                alert("Please enter email and password.");
                return;
            }

            auth.signInWithEmailAndPassword(email, password)
              .then(() => {
                document.getElementById("admin-email").value = "";
                document.getElementById("admin-password").value = "";
              })
              .catch(error => {
                alert("Login Error: " + error.message);
              });
        });
    }

    const logoutBtn = document.getElementById("logout-btn");
    if(logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            auth.signOut().catch((error) => {
                console.error("Logout Error:", error);
                alert("Error logging out. Please try again.");
            });
        });
    }

    // --- 2. AUTH STATE CONTROLLER ---
    
    auth.onAuthStateChanged(user => {
        const adminAuthSection = document.getElementById("admin-auth-section");
        const adminContent = document.getElementById("admin-content");

        if (user) {
            console.log("Admin Logged In:", user.uid); 
            // User is LOGGED IN
            if(adminAuthSection) adminAuthSection.style.display = "none";
            if(adminContent) adminContent.style.display = "block";
            
            // Load all admin data
            loadClients();
            loadAdminResources();
            loadMessages();
            loadAppointments(); 
        } else {
            // User is LOGGED OUT
            if(adminAuthSection) adminAuthSection.style.display = "block";
            if(adminContent) adminContent.style.display = "none";
            
            // Clear any sensitive data from DOM
            const clientList = document.getElementById("admin-clients-list");
            if(clientList) clientList.innerHTML = "";
            
            const resList = document.getElementById("admin-resources-list");
            if(resList) resList.innerHTML = "";
            
            const msgList = document.getElementById("admin-messages-list");
            if(msgList) msgList.innerHTML = "";
            
            const apptList = document.getElementById("appointments-list");
            if(apptList) apptList.innerHTML = "";
        }
    });

    // --- 3. RESOURCES/NEWS MANAGEMENT ---
    
    const resForm = document.getElementById("resources-form");
    if(resForm) {
        resForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const titleInput = document.getElementById("resources-title");
            const contentInput = document.getElementById("resources-content");
            const title = titleInput.value;
            const content = contentInput.value;

            if (!title || !content) {
                alert("Please enter both title and content.");
                return;
            }
            
            db.collection("resources").add({
              title,
              content,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
              alert("Resource posted successfully!");
              titleInput.value = "";
              contentInput.value = "";
            })
            .catch(error => {
              alert("Error posting resource: " + error.message);
            });
        });
    }

    function loadAdminResources() {
        const adminResourcesListElement = document.getElementById("admin-resources-list");
        if(!adminResourcesListElement) return;

        adminResourcesListElement.innerHTML = '<p>Loading resources...</p>';

        db.collection("resources").orderBy("timestamp", "desc").onSnapshot(snapshot => {
         let resourcesHTML = "<ul>";
           if (snapshot.empty) {
             resourcesHTML = '<p>No resource posts found.</p>';
         } else {
             snapshot.forEach(doc => {
                 const data = doc.data();
                 let postedOn = data.timestamp
                   ? new Date(data.timestamp.seconds * 1000).toLocaleDateString()
                   : "No date available";
                 resourcesHTML += `<li>
                                       <div>
                                           <strong>${data.title}</strong> - Posted on: ${postedOn}
                                       </div>
                                       <button onclick="deleteResource('${doc.id}')">Delete</button>
                                     </li>`;
             });
             resourcesHTML += "</ul>";
         }
          adminResourcesListElement.innerHTML = resourcesHTML;
        }, error => {
            adminResourcesListElement.innerHTML = '<p style="color: red;">Error loading resources.</p>';
        });
    }

    // --- 4. CLIENT MANAGEMENT ---

    function loadClients() {
        const clientsListEl = document.getElementById("admin-clients-list");
        if(!clientsListEl) return;
        
        clientsListEl.innerHTML = '<p>Loading clients...</p>';

        db.collection("clientData").orderBy("createdAt", "desc").onSnapshot(snapshot => {
            if (snapshot.empty) {
                clientsListEl.innerHTML = '<p>No clients found.</p>';
                return;
            }
            
            clientsListEl.innerHTML = ''; 
            snapshot.forEach(doc => {
                const client = doc.data();
                const clientId = doc.id; 
                
                const clientEl = document.createElement('div');
                clientEl.className = 'client-item';
                clientEl.innerHTML = `
                    <h4>${client.name} (${client.email})</h4>
                    <p><strong>Current Status:</strong> ${client.taxStatus}</p>
                    
                    <form class="client-status-form" onsubmit="updateClientStatus(event, '${clientId}')">
                        <input type="text" name="taxStatus" placeholder="New status (e.g., Filed)" required>
                        <textarea name="adminNotes" placeholder="Notes for client...">${client.adminNotes || ''}</textarea>
                        <button type="submit">Update Status & Notes</button>
                    </form>
                    
                    <div class="client-files-admin" id="files-for-${clientId}">
                        <p>Loading files...</p>
                    </div>
                `;
                clientsListEl.appendChild(clientEl);
                
                loadClientFilesForAdmin(clientId);
            });
        }, error => {
            console.error("Error loading clients: ", error);
            clientsListEl.innerHTML = '<p style="color:red;">Error loading clients.</p>';
        });
    }

    async function loadClientFilesForAdmin(clientId) {
        const fileListEl = document.getElementById(`files-for-${clientId}`);
        // Requires Admin permissions in Firebase Storage Rules
        const userFolderRef = storage.ref(`client_files/${clientId}`);
        
        try {
            const result = await userFolderRef.listAll();
            if (result.items.length === 0) {
                fileListEl.innerHTML = '<h6>Client Documents:</h6><p>No documents uploaded yet.</p>';
                return;
            }
            
            let html = '<h6>Client Documents:</h6><ul>';
            for (const itemRef of result.items) {
                const url = await itemRef.getDownloadURL();
                html += `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${itemRef.name}</a></li>`;
            }
            html += '</ul>';
            fileListEl.innerHTML = html;
            
        } catch (error) {
            console.warn(`Could not list files for client ${clientId}: `, error.code);
            if (error.code === 'storage/unauthorized') {
                 fileListEl.innerHTML = '<h6>Client Documents:</h6><p style="color:red; font-weight: bold;">(Access Denied. Check Storage Rules.)</p>';
            } else {
                 fileListEl.innerHTML = '<h6>Client Documents:</h6><p style="color:red;">(Error loading files)</p>';
            }
        }
    }
    
    // --- 5. MESSAGES & APPOINTMENTS ---
    
    function loadMessages() {
        const messagesListElement = document.getElementById("admin-messages-list");
        if(!messagesListElement) return;

        messagesListElement.innerHTML = '<p>Loading messages...</p>';

        db.collection("messages").orderBy("timestamp", "desc").onSnapshot(snapshot => {
            if (snapshot.empty) {
                messagesListElement.innerHTML = '<p>No messages found.</p>';
                return;
            }
            
            let messagesHTML = "<ul>";
            snapshot.forEach(doc => {
                const data = doc.data();
                let receivedOn = data.timestamp
                    ? new Date(data.timestamp.seconds * 1000).toLocaleString()
                    : "No date available";
                
                messagesHTML += `
                    <li>
                        <div class="msg-header">
                            From: ${data.name} (${data.email})
                        </div>
                        <div class="msg-content">
                            ${data.message}
                        </div>
                        <small>Received on: ${receivedOn}</small>
                    </li>
                `;
            });
            messagesHTML += "</ul>";
            messagesListElement.innerHTML = messagesHTML;
        }, error => {
            messagesListElement.innerHTML = '<p style="color: red;">Error loading messages.</p>';
        });
    }

    function loadAppointments() {
         const appointmentsListElement = document.getElementById("appointments-list");
         if(!appointmentsListElement) return;

         appointmentsListElement.innerHTML = '<p>Loading appointments...</p>';
         
         db.collection("appointments").orderBy("date", "desc").orderBy("time", "asc").onSnapshot(snapshot => {
             if (snapshot.empty) {
                 appointmentsListElement.innerHTML = '<p>No appointments found.</p>';
                 return;
             }

             const appointmentsByDate = {};
             snapshot.forEach(doc => {
                 const data = doc.data();
                 const date = data.date;
                 if (!appointmentsByDate[date]) {
                     appointmentsByDate[date] = [];
                 }
                 appointmentsByDate[date].push({ id: doc.id, ...data });
             });

             let apptsHTML = "";
             const sortedDates = Object.keys(appointmentsByDate).sort((a, b) => b.localeCompare(a));

             sortedDates.forEach(date => {
                 apptsHTML += `<div class="appointment-date-group"><h4>${date}</h4><ul>`;
                 appointmentsByDate[date].forEach(appt => {
                     let requestedOn = appt.timestamp
                         ? new Date(appt.timestamp.seconds * 1000).toLocaleString()
                         : "No date available";
                     apptsHTML += `
                         <li>
                             <strong>${appt.time}</strong> - ${appt.name} - ${appt.email} - ${appt.phone}<br>
                             Service: ${appt.service}<br>
                             <small>Submitted on: ${requestedOn}</small>
                         </li>
                     `;
                 });
                 apptsHTML += `</ul></div>`;
             });
             appointmentsListElement.innerHTML = apptsHTML;
         }, error => {
             appointmentsListElement.innerHTML = '<p style="color: red;">Error loading appointments.</p>';
         });
    }

    // --- GLOBAL SCOPE FUNCTIONS (Called by HTML attributes) ---
    // These must be attached to 'window' because the script is running inside DOMContentLoaded
    
    window.updateClientStatus = function(event, clientId) {
        event.preventDefault();
        const form = event.target;
        const newStatus = form.taxStatus.value;
        const newNotes = form.adminNotes.value;

        db.collection('clientData').doc(clientId).update({
            taxStatus: newStatus,
            adminNotes: newNotes
        })
        .then(() => {
            alert('Client status updated!');
            form.taxStatus.value = ''; 
        })
        .catch(error => {
            console.error('Error updating status: ', error);
            alert('Error updating status.');
        });
    }

    window.deleteResource = function(resourceId) {
      if (confirm("Are you sure you want to delete this resource?")) {
        db.collection("resources").doc(resourceId).delete().catch(error => {
          alert("Error deleting resource: " + error.message);
        });
      }
    }

});
