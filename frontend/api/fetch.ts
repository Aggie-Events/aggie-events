import ToastManager from "@/components/toast/ToastManager";

interface FetchOptions extends RequestInit {
  body?: any;
}

/**
 * Fetch utility function
 * @param url - The URL to fetch
 * @param options - The options for the fetch
 * @param throwErrOnUnauthorized - Whether to throw an error if the user gets a 401 (Unauthorized) response
 * @returns The response from the fetch
 */
export const fetchUtil = async (
  url: string,
  options: FetchOptions = {},
  throwErrOnUnauthorized: boolean = true,
) => {
  const { body, ...restOptions } = options;

  const response = await fetch(url, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...restOptions.headers,
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  }).catch((error) => {
    ToastManager.addToast("Fetch Error", "error", 1000);
    console.error("Fetch error:", error);
    throw error;
  });

  if (!response.ok && response.status !== 401) {
    ToastManager.addToast(
      `Server Error ${response.status}: ${(await response.json()).message}`,
      "error",
      1000,
    );
    throw new Error(response.statusText);
  }

  if (response.status === 401 && throwErrOnUnauthorized) {
    const errorText = response.text();
    console.error("Unauthorized:", errorText);
    ToastManager.addToast("Unauthorized", "error", 1000);
    throw new Error("Unauthorized resource");
  }

  return response;
};
