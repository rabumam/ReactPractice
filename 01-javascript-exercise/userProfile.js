/**
 * USER PROFILE MODULE
 * Contains functions for user data processing, API interactions, and UI components
 */

// Part 1: Data Transformation
function processUsers(users) {
    return users
        .map(user => ({
            ...user,
            fullName: `${user.firstName} ${user.lastName}`
        }))
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
}

// Part 2: Async Data Fetching
async function fetchUserPosts(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const posts = await response.json();
        return posts.map(post => post.title);
    } catch (error) {
        throw new Error(`Failed to fetch posts: ${error.message}`);
    }
}

// Part 3: User Profile Component
function createUserProfileHTML(user) {
    return `
        <article class="user-card" id="user-${user.id}">
            <img src="${user.avatar}" 
                 alt="${user.firstName} ${user.lastName}" 
                 class="avatar"
                 loading="lazy">
            <div class="user-info">
                <h2>${user.firstName} ${user.lastName}</h2>
                <p>Email: ${user.email}</p>
                ${user.role ? `<p>Role: ${user.role}</p>` : ''}
                <p>${user.isActive 
                    ? '<span  style="color: green;">Active</span>' 
                    : '<span  style="color: brown;">Inactive</span>'}
                </p>
                <button class="btn" data-user-id="${user.id}">View Posts</button>
            </div>
        </article>
    `;
}

// Part 4: State Management
function createStateManager(initialState = {}) {
    let state = { ...initialState };
    const subscribers = new Set();

    return {
        getState() {
            return { ...state };
        },
        
        setState(newState) {
            state = { ...state, ...newState };
            subscribers.forEach(callback => callback(state));
        },
        
        subscribe(callback) {
            subscribers.add(callback);
            return () => subscribers.delete(callback);
        },
        toggleUserStatus(userId) {
            state.users = state.users.map(user => 
                user.id === userId 
                    ? { ...user, isActive: !user.isActive } 
                    : user
            );
            subscribers.forEach(callback => callback(state));
        }
    };
}