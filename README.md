# JavaScript Exercise Solution

## Implementation Overview
 Displays active and inactive users separately with the ability to toggle their status

### Core Functionalities include: 
- Transforming user data 
- Fetching user posts asynchronously
- Generating user profile HTML dynamically
- Managing application state with a simple state manager

### Part 1: Data Transformation (`processUserData`)
```javascript
function processUsers(users) {
    return users
        .map(user => ({
            ...user,
            fullName: `${user.firstName} ${user.lastName}`
        }))
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
}
```

- Transforms objects to `{id, fullName, email}`
- Sorts alphabetically by `fullName`

### Part 2: Async Fetching (`fetchUserPosts`)
```javascript
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
```
- Uses modern fetch API
- Handles HTTP errors
- Returns post titles array

### Part 3: User Component (`createUserProfileHTML`)
```javascript
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
                <p>${user.isActive ? '<span class="badge active">Active</span>' : '<span class="badge inactive">Inactive</span>'}</p>
                <button class="btn" data-user-id="${user.id}">View Posts</button>
            </div>
        </article>
    `;
}
```
- Uses template literals
- Conditional active badge
- Semantic HTML structure

### Part 4: State Manager (`createStateManager`)
```javascript
function createStateManager(initialState) {
  let state = {...initialState};
  const subscribers = new Set();
  
  return {
    getState: () => ({...state}),
    setState: (newState) => {
      state = {...state, ...newState};
      subscribers.forEach(cb => cb(state));
    },
    subscribe: (cb) => {
      subscribers.add(cb);
      return () => subscribers.delete(cb);
    }
  };
}
```

## Check It Out
Check it out on this link: [Your Link Here]
