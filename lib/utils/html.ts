/**
 * Decode HTML entities in text
 * Converts &amp; to &, &lt; to <, &gt; to >, &quot; to ", etc.
 */
export function decodeHtmlEntities(text: string): string {
  if (typeof window === 'undefined') {
    // Server-side: use basic replacements
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, ' ')
  }

  // Client-side: use textarea trick for full HTML entity decoding
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}
