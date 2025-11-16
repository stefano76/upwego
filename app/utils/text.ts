import { marked } from 'marked';

// Helper function to render Markdown content safely
export const renderMarkdown = (markdownString?: string, noParagraphs: boolean = false) => {
  const safeInput = typeof markdownString === 'string' ? markdownString : '';
  
  // Create a custom renderer to replace <strong> with <b>
  const renderer = new marked.Renderer();
  renderer.strong = function(text) {
    // Extract text from the object if it's not a string
    const textContent = typeof text === 'string' ? text : text.text || String(text);
    return '<b>' + textContent + '</b>';
  };
  
  // If noParagraphs is true, use inline parsing to avoid <p> tags
  let html: string;
  if (noParagraphs) {
    // Use parseInline for content that shouldn't be wrapped in paragraphs
    html = marked.parseInline(safeInput, { renderer, async: false });
  } else {
    html = marked.parse(safeInput, { renderer, async: false });
  }
  
  return { __html: html };
};

// Helper function to parse markdown list items into an array
export const parseMarkdownListItems = (markdownString?: string): string[] => {
  if (!markdownString) return [];
  
  // Extract list items from markdown (lines starting with - or *)
  const lines = markdownString.split('\n');
  const items: string[] = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    // Match markdown list items (starting with -, *, or numbers)
    if (trimmed.match(/^[-*]\s+(.+)$/)) {
      const match = trimmed.match(/^[-*]\s+(.+)$/);
      if (match && match[1]) {
        items.push(match[1].trim());
      }
    }
  });
  
  return items;
};

