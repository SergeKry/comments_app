import client from "./client";

// Build query string from params object
function buildQuery(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      qs.append(key, value);
    }
  });
  const str = qs.toString();
  return str ? `?${str}` : "";
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
export async function fetchPosts(options = {}) {
  const query = buildQuery(options);
  const response = await client(`/posts/${query}`);
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to fetch posts: ${errText}`);
  }
  return response.json();
}

/**
 * Fetch a single post by ID
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function fetchPost(id) {
  const response = await client(`/posts/${id}/`);
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to fetch post ${id}: ${errText}`);
  }
  return response.json();
}

/**
 * Create a new post
 * @param {Object} data
 * @param {string} data.title
 * @param {string} data.text
 * @param {File[]} [data.attachments]  – Array of File objects from <input type="file" multiple>
 * @returns {Promise<Object>}
 */

export async function createPost({ title, text, attachments = [] }) {
  const form = new FormData();
  form.append("title", title);
  form.append("text", text);
  attachments.forEach((file) => form.append("attachments", file));

  const response = await client("/posts/", {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to create post: ${errText}`);
  }
  return response.json();
}

/**
 * Update an existing post
 * @param {number|string} id
 * @param {Object} data
 * @param {string} [data.title]
 * @param {string} [data.text]
 * @param {File[]} [data.attachments]
 * @returns {Promise<Object>}
 */

export async function updatePost(id, { title, text, attachments = [] }) {
  const form = new FormData();
  if (title !== undefined) form.append("title", title);
  if (text !== undefined) form.append("text", text);
  attachments.forEach((file) => form.append("attachments", file));

  const response = await client(`/posts/${id}/`, {
    method: "PUT",
    body: form,
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to update post ${id}: ${errText}`);
  }
  return response.json();
}

/**
 * Delete a post by ID
 * @param {number|string} id
 * @returns {Promise<void>}
 */
export async function deletePost(id) {
  const response = await client(`/posts/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to delete post ${id}: ${errText}`);
  }
}
