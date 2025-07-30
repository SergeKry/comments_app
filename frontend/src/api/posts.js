const API = import.meta.env.VITE_API_URL;

// Helper to get stored access token
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Build query string from params object
function buildQuery(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      qs.append(key, value);
    }
  });
  const str = qs.toString();
  return str ? `?${str}` : '';
}

/**
 * Fetch paginated list of posts, with optional filters and ordering.
 * @param {Object} options
 * @param {number} options.page        - Page number
 * @param {number} options.page_size   - Items per page
 * @param {string} options.ordering    - e.g. 'created_at' or '-created_at'
 * @param {string} options.username    - filter by username
 * @param {string} options.email       - filter by email
 * @returns {Promise<Object>}          - DRF paginated response
 */
export async function fetchPosts({ page, page_size, ordering, username, email } = {}) {
  const query = buildQuery({ page, page_size, ordering, username, email });
  const resp = await fetch(`${API}/posts/${query}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });
  if (!resp.ok) {
    throw new Error('Failed to fetch posts');
  }
  return resp.json();
}

/**
 * Fetch a single post by ID
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function fetchPost(id) {
  const resp = await fetch(`${API}/posts/${id}/`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });
  if (!resp.ok) throw new Error(`Failed to fetch post ${id}`);
  return resp.json();
}

/**
 * Create a new post
 * @param {Object} data
 * @param {string} data.title
 * @param {string} data.text
 * @returns {Promise<Object>}
 */
export async function createPost(data) {
  const resp = await fetch(`${API}/posts/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error('Failed to create post');
  return resp.json();
}

/**
 * Update an existing post
 * @param {number|string} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function updatePost(id, data) {
  const resp = await fetch(`${API}/posts/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error(`Failed to update post ${id}`);
  return resp.json();
}

/**
 * Delete a post by ID
 * @param {number|string} id
 * @returns {Promise<void>}
 */
export async function deletePost(id) {
  const resp = await fetch(`${API}/posts/${id}/`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeader(),
    },
  });
  if (!resp.ok) throw new Error(`Failed to delete post ${id}`);
}
