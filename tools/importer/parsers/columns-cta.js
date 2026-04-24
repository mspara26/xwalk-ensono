/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-cta
 * Base block: columns
 * Source: https://www.ensono.com/
 * Generated: 2026-04-23
 *
 * Source structure:
 *   .stk-block-columns > .stk-row > two .stk-block-column children
 *     Column 1: image (figure > .stk-img)
 *     Column 2: heading (h3), description (p), form/CTA
 *
 * Target structure (from block library):
 *   Columns block with 2 columns per row.
 *   Each cell can contain text, images, or inline elements.
 *   Columns blocks do NOT require field hints (xwalk exception).
 */
export default function parse(element, { document }) {
  // Find the two column containers
  const columns = element.querySelectorAll(':scope .stk-block-column');

  const cells = [];

  if (columns.length >= 2) {
    // --- Column 1: Image ---
    const col1 = columns[0];
    const image = col1.querySelector('img.stk-img, img.wp-image-23693, figure img');
    const col1Content = [];
    if (image) {
      col1Content.push(image);
    }

    // --- Column 2: Heading + Description + CTA ---
    const col2 = columns[1];
    const heading = col2.querySelector('h3.wp-block-heading, h3, h2, h1');
    const description = col2.querySelector('.stk-block-text__text, .stk-block-text p, p.has-text-color');
    const formButton = col2.querySelector('.mktoButton, button.mktoButton');

    const col2Content = [];
    if (heading) {
      // Clone the heading and extract clean text (remove the <mark> wrapper)
      const cleanHeading = document.createElement('h3');
      cleanHeading.textContent = heading.textContent.trim();
      col2Content.push(cleanHeading);
    }
    if (description) {
      col2Content.push(description);
    }
    // Include the form CTA button as a link-style element
    if (formButton) {
      const ctaLink = document.createElement('p');
      const strong = document.createElement('strong');
      const anchor = document.createElement('a');
      anchor.href = '#subscribe';
      anchor.textContent = formButton.textContent.trim();
      strong.appendChild(anchor);
      ctaLink.appendChild(strong);
      col2Content.push(ctaLink);
    }

    // Build one row with two columns
    cells.push([col1Content, col2Content]);
  } else {
    // Fallback: single column or unexpected structure
    // Gather all meaningful content into one row
    const allImages = element.querySelectorAll('img');
    const allHeadings = element.querySelectorAll('h1, h2, h3, h4');
    const allText = element.querySelectorAll('p');

    const col1Content = [];
    const col2Content = [];

    if (allImages.length > 0) {
      col1Content.push(allImages[0]);
    }
    allHeadings.forEach((h) => col2Content.push(h));
    allText.forEach((p) => col2Content.push(p));

    cells.push([col1Content.length > 0 ? col1Content : '', col2Content.length > 0 ? col2Content : '']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}
