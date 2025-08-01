import client from "./client";

// Helper to build query strings
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
 * Fetch top-level replies (and their nested children) for a given post.
 * @param {Object} options
 * @param {number|string} options.post     - Post ID to fetch replies for
 * @param {number|string} [options.parent] - Optional: only replies to this parent
 * @param {string}         [options.ordering] - e.g. 'created_at' or '-created_at'
 * @returns {Promise<Object[]>}            - Array of Reply objects (with `.children`)
 */
export async function fetchReplies(options = {}) {
  const query = buildQuery(options);
  const response = await client(`/replies/${query}`);
  if (!response.ok) {
    const err = await response.text().catch(() => response.statusText);
    throw new Error(`Failed to fetch replies: ${err}`);
  }
  return response.json();
}

/**
 * Fetch a single reply by ID (including its nested children).
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function fetchReply(id) {
  const response = await client(`/replies/${id}/`);
  if (!response.ok) {
    const err = await response.text().catch(() => response.statusText);
    throw new Error(`Failed to fetch reply ${id}: ${err}`);
  }
  return response.json();
}

/**
 * Create a new reply.
 * @param {Object} payload
 * @param {number|string} payload.post   - The ID of the post being replied to
 * @param {number|string} [payload.parent] - (Optional) ID of the parent reply
 * @param {string}        payload.text   - The reply’s content
 * @returns {Promise<Object>}            - The created Reply
 */
export async function createReply({ post, parent, text, attachments = [] }) {
  const form = new FormData();
  form.append("post", post);
  if (parent != null) form.append("parent", parent);
  form.append("text", text);
  attachments.forEach((file) => form.append("attachments", file));

  const response = await client("/replies/", {
    method: "POST",
    body: form,
  });
  if (!response.ok) {
    const err = await response.text().catch(() => response.statusText);
    throw new Error(`Failed to create reply: ${err}`);
  }
  return response.json();
}

/**
 * Update an existing reply’s text.
 * @param {number|string} id
 * @param {Object}        payload
 * @param {string}        payload.text
 * @returns {Promise<Object>}
 */
export async function updateReply(id, { text, attachments = [] }) {
  const form = new FormData();
  form.append("text", text);
  attachments.forEach((file) => form.append("attachments", file));

  const response = await client(`/replies/${id}/`, {
    method: "PUT",
    body: form,
  });
  if (!response.ok) {
    const err = await response.text().catch(() => response.statusText);
    throw new Error(`Failed to update reply ${id}: ${err}`);
  }
  return response.json();
}

/**
 * Delete a reply by ID.
 * @param {number|string} id
 * @returns {Promise<void>}
 */
export async function deleteReply(id) {
  const response = await client(`/replies/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const err = await response.text().catch(() => response.statusText);
    throw new Error(`Failed to delete reply ${id}: ${err}`);
  }
}
