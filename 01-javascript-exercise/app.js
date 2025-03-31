/**
 * APPLICATION INITIALIZATION
 * Handles DOM interactions and initial setup
 */

// Initialize state manager with users
const appState = createStateManager({
    // Sample Data
  users:  [
     {
         id: 1,
         firstName: "John",
         lastName: "Doe",
         email: "john@example.com",
         isActive: true,
         avatar: "https://randomuser.me/api/portraits/men/1.jpg",
         role: "Admin"
     },
     {
         id: 2,
         firstName: "Jane",
         lastName: "Smith",
         email: "jane@example.com",
         isActive: false,
         avatar: "https://randomuser.me/api/portraits/women/2.jpg",
         role: "User"
     },
     {
         id: 3,
         firstName: "Bob",
         lastName: "Johnson",
         email: "bob@example.com",
         isActive: true,
         avatar: "https://randomuser.me/api/portraits/men/3.jpg",
         role: "Developer"
     },
     {
         id: 4,
         firstName: "Sara",
         lastName: "Williams",
         email: "sara@example.com",
         isActive: true,
         avatar: "https://randomuser.me/api/portraits/women/4.jpg",
         role: "Manager"
     },
     {
         id: 5,
         firstName: "Alice",
         lastName: "Brown",
         email: "alice@example.com",
         isActive: false,
         avatar: "https://randomuser.me/api/portraits/women/5.jpg",
         role: "Designer"
     },
     {
         id: 6,
         firstName: "Tom",
         lastName: "Davis",
         email: "tom@example.com",
         isActive: true,
         avatar: "https://randomuser.me/api/portraits/men/6.jpg",
         role: "Tester"
     },
     {
         id: 7,
         firstName: "Emma",
         lastName: "Wilson",
         email: "emma@example.com",
         isActive: true,
         avatar: "https://randomuser.me/api/portraits/women/7.jpg",
         role: "Product Owner"
     },
     {
         id: 8,
         firstName: "Michael",
         lastName: "Clark",
         email: "michael@example.com",
         isActive: false,
         avatar: "https://randomuser.me/api/portraits/men/8.jpg",
         role: "Scrum Master"
     }
 ],
     loading: false,
     error: null,
     selectedUser: null
 });
 
 // DOM Elements
 const activeUsersContainer = document.getElementById('active-users');
 const inactiveUsersContainer = document.getElementById('inactive-users');
 const postsContainer = document.getElementById('posts-container');
 
 // Process users with fullName and sorting
 function processUsers(users) {
     return users
         .map(user => ({
             ...user,
             fullName: `${user.firstName} ${user.lastName}`
         }))
         .sort((a, b) => a.fullName.localeCompare(b.fullName));
 }
 
 // Render all users in appropriate sections
 function renderAllUsers() {
     const { users } = appState.getState();
     const activeUsers = processUsers(users.filter(user => user.isActive));
     const inactiveUsers = processUsers(users.filter(user => !user.isActive));
 
     activeUsersContainer.innerHTML = activeUsers.map(createUserCardHTML).join('');
     inactiveUsersContainer.innerHTML = inactiveUsers.map(createUserCardHTML).join('');
 }
 
 // Create user card HTML with toggle button
 function createUserCardHTML(user) {
     return `
         <div class="user-card" id="user-${user.id}">
             <img src="${user.avatar}" alt="${user.fullName}" class="avatar">
             <div class="user-info">
                 <h2>${user.fullName}</h2>
                 <span class="status-badge ${user.isActive ? 'active' : 'inactive'}">
                     ${user.isActive ? 'Active' : 'Inactive'}
                 </span>
                 <p>Email: ${user.email}</p>
                 ${user.role ? `<p>Role: ${user.role}</p>` : ''}
                 <div class="button-group">
                     <button class="btn toggle-btn" 
                             data-user-id="${user.id}"
                             style="background-color: ${user.isActive ? '#ff4d4d' : '#4caf50'}; color: white;"
                             ${appState.getState().loading ? 'disabled' : ''}>
                         ${user.isActive ? 'Deactivate' : 'Activate'}
                     </button>
                     <button class="btn view-posts-btn" 
                             data-user-id="${user.id}"
                             ${appState.getState().loading ? 'disabled' : ''}>
                         View Posts
                     </button>
                 </div>
             </div>
         </div>
     `;
 }
 
 // Event Delegation for both buttons
 document.addEventListener('click', async (e) => {
     const userId = parseInt(e.target.dataset.userId);
     
     if (e.target.classList.contains('toggle-btn')) {
         appState.toggleUserStatus(userId);
     }
     
     if (e.target.classList.contains('view-posts-btn')) {
         appState.setState({ loading: true, selectedUser: userId });
         
         try {
             const posts = await fetchUserPosts(userId);
             const user = appState.getState().users.find(u => u.id === userId);
             postsContainer.innerHTML = `
                 <h3>Latest Posts by ${user.firstName}</h3>
                 <ul class="post-list">
                     ${posts.map(post => `<li class="post-item">${post}</li>`).join('')}
                 </ul>
             `;
         } catch (error) {
             postsContainer.innerHTML = `
                 <div class="error">
                     Error loading posts: ${error.message}
                 </div>
             `;
         } finally {
             appState.setState({ loading: false });
         }
     }
 });
 
 // State Subscriptions
 appState.subscribe((state) => {
     // Update UI when users change
     renderAllUsers();
     
     // Update button states
     document.querySelectorAll('.btn').forEach(button => {
         button.disabled = state.loading;
         if (button.classList.contains('view-posts-btn')) {
             button.textContent = state.loading ? 'Loading...' : 'View Posts';
         }
     });
 });
 
 // Initial Render
 renderAllUsers();