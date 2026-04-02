/**
 * Listflex (Media Brand Consulting) - Lead forwarding helper
 *
 * Two lists:
 *  - ABANDONS (7634): checkout sessions that expired without payment
 *  - BUYERS  (7635): completed purchases
 */

interface ListflexLeadData {
  email?: string;
  fname?: string;
  lname?: string;
  phone?: string;
  ip?: string;
  offer?: string;
  comments?: string;
}

export async function postLeadToListflex(
  listId: string,
  data: ListflexLeadData
): Promise<{ success: boolean; response?: string }> {
  const apiUrl = process.env.LISTFLEX_API_URL;
  const apiKey = process.env.LISTFLEX_API_KEY;

  if (!apiUrl || !apiKey) {
    console.warn("[listflex] missing LISTFLEX_API_URL or LISTFLEX_API_KEY");
    return { success: false, response: "missing config" };
  }

  const params = new URLSearchParams({
    apikey: apiKey,
    list_id: listId,
  });

  // Add non-empty fields
  for (const [key, value] of Object.entries(data)) {
    if (value) params.set(key, value);
  }

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const text = await res.text();
    const success = text.trim() === "Success";

    if (!success) {
      console.warn("[listflex] non-success response:", text);
    }

    return { success, response: text };
  } catch (err) {
    console.error("[listflex] failed to post lead:", err);
    return { success: false, response: String(err) };
  }
}

export function postBuyerLead(data: ListflexLeadData) {
  const listId = process.env.LISTFLEX_BUYERS_LIST_ID ?? "7635";
  return postLeadToListflex(listId, data);
}

export function postAbandonLead(data: ListflexLeadData) {
  const listId = process.env.LISTFLEX_ABANDONS_LIST_ID ?? "7634";
  return postLeadToListflex(listId, data);
}
