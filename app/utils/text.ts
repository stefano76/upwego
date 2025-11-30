import { marked } from 'marked';

/**
 * MARKDOWN RENDERING UTILITIES
 * 
 * These functions convert markdown content from content files into HTML
 * that can be safely rendered in React components using dangerouslySetInnerHTML.
 */

/**
 * Converts markdown string to HTML for React rendering
 * 
 * This function is used throughout the site to render content from markdown files.
 * It uses the 'marked' library and includes a custom renderer to convert <strong>
 * tags to <b> tags (for styling consistency).
 * 
 * @param markdownString - The markdown content to convert (can be undefined)
 * @param noParagraphs - If true, uses inline parsing (no <p> tags). Useful for titles.
 *                       If false, uses full markdown parsing (wraps in <p> tags).
 * 
 * @returns Object with __html property for use with dangerouslySetInnerHTML
 * 
 * USAGE EXAMPLE:
 * <h1 dangerouslySetInnerHTML={renderMarkdown(block.title, true)}></h1>
 * <div dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
 */
export const renderMarkdown = (markdownString?: string, noParagraphs: boolean = false) => {
  // Ensure we have a string to work with (handle undefined/null gracefully)
  const safeInput = typeof markdownString === 'string' ? markdownString : '';
  
  // Create a custom renderer to replace <strong> with <b>
  // This ensures consistent styling across the site
  const renderer = new marked.Renderer();
  renderer.strong = function(text) {
    // Extract text from the object if it's not a string
    const textContent = typeof text === 'string' ? text : text.text || String(text);
    return '<b>' + textContent + '</b>';
  };
  
  // Choose parsing method based on whether we want paragraph tags
  let html: string;
  if (noParagraphs) {
    // Use parseInline for content that shouldn't be wrapped in paragraphs
    // Example: Titles, headings, inline text
    html = marked.parseInline(safeInput, { renderer, async: false });
  } else {
    // Use full parsing for body text (wraps content in <p> tags)
    html = marked.parse(safeInput, { renderer, async: false });
  }
  
  // Return in format expected by React's dangerouslySetInnerHTML
  return { __html: html };
};

/**
 * Extracts list items from markdown text and returns them as an array
 * 
 * This is useful when you have markdown content with bullet points and want
 * to render them as a structured list rather than raw markdown HTML.
 * 
 * @param markdownString - Markdown text containing list items (lines starting with - or *)
 * @returns Array of list item text strings
 * 
 * EXAMPLE INPUT:
 * "- First item\n- Second item\n- Third item"
 * 
 * EXAMPLE OUTPUT:
 * ["First item", "Second item", "Third item"]
 */
export const parseMarkdownListItems = (markdownString?: string): string[] => {
  if (!markdownString) return [];
  
  // Extract list items from markdown (lines starting with - or *)
  const lines = markdownString.split('\n');
  const items: string[] = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    // Match markdown list items (starting with -, *, or numbers)
    // Regex matches: "- text" or "* text"
    if (trimmed.match(/^[-*]\s+(.+)$/)) {
      const match = trimmed.match(/^[-*]\s+(.+)$/);
      if (match && match[1]) {
        items.push(match[1].trim());
      }
    }
  });
  
  return items;
};

