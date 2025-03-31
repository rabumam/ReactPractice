# JavaScript Exercise Solution

## Implementation Overview

### Part 1: Data Transformation (`processUserData`)
```javascript
function processUserData(users) {
  return users
    .filter(user => user.isActive)
    .map(user => ({
      id: user.id,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email
    }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}
```
- Filters inactive users
- Transforms objects to `{id, fullName, email}`
- Sorts alphabetically by `fullName`

### Part 2: Async Fetching (`fetchUserPosts`)
```javascript
async function fetchUserPosts(userId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return (await response.json()).map(post => post.title);
  } catch(error) {
    throw new Error(`Fetch failed: ${error.message}`);
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
    <div class="user-card" id="user-${user.id}">
      <img src="${user.avatar}" alt="${user.fullName}" class="avatar">
      <div class="user-info">
        <h2>${user.fullName}</h2>
        <p>Email: ${user.email}</p>
        ${user.role ? `<p>Role: ${user.role}</p>` : ''}
        ${user.isActive ? '<span class="badge active">Active</span>' : ''}
      </div>
    </div>
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
- Immutable state updates
- Pub/sub pattern
- Merge-based state updates

### Testing Examples
```javascript
// Part 1 Test
console.log(processUserData(users)); 

// Part 2 Test
fetchUserPosts(1).then(console.log).catch(console.error);

// Part 3 Test
console.log(createUserProfileHTML(sampleUser));

// Part 4 Test
const state = createStateManager({count: 0});
state.subscribe(console.log);
state.setState({count: 1});
