
/**
 * Fetch tags
 * @param query - The query to search for
 * @returns The tags
 */
export const fetchTags = async (query: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tags/search?query=${query}`,
      {
        method: "GET",
      },
    );
    return response.json();
  } catch (error) {
    throw new Error("Error fetching tags" + error);
  }
};
