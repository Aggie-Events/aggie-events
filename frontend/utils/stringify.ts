/**
 * Converts a string to URL-friendly format by:
 * 1. Converting to lowercase
 * 2. Replacing spaces with dashes
 * 3. Removing special characters
 * 4. Removing consecutive dashes
 * 
 * @param str - The string to convert
 * @returns The URL-friendly string
 * 
 * @example
 * stringToSlug("Hello World!") // "hello-world"
 * stringToSlug("My Cool Event (2024)") // "my-cool-event-2024"
 * stringToSlug("Web & Mobile Apps") // "web-mobile-apps"
 */
export function stringToSlug(str: string): string {
  return str
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/-+/g, "-"); // Remove consecutive dashes
}
