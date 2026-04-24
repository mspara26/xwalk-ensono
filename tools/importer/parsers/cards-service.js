/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-service
 * Base block: cards (container block)
 * Source: https://www.ensono.com/
 * Selector: section.has-background .wp-block-ws-layout-row
 * UE Model: card items with image (reference) + text (richtext)
 * Generated: 2026-04-23
 */
export default function parse(element, { document }) {
  // Each card is inside a .wp-block-ws-layout-column within the layout row
  // Also handle .wp-block-ws-card direct children as fallback
  let cardColumns = Array.from(element.querySelectorAll(':scope > .wp-block-ws-layout-column'));
  if (cardColumns.length === 0) {
    cardColumns = Array.from(element.querySelectorAll('.wp-block-ws-layout-column'));
  }

  // If no cards found, do nothing (handles secondary empty matches)
  if (cardColumns.length === 0) return;

  const cells = [];

  cardColumns.forEach((col) => {
    // --- Image column: extract the SVG icon ---
    // The live page may render SVGs inline or as <img> with data URIs.
    // Try multiple selectors: .stk--inner-svg img, .stk-block-icon svg, or any img in the icon wrapper
    let iconEl = null;

    // Approach 1: Look for an SVG element inside the icon wrapper
    const svgEl = col.querySelector('.stk--inner-svg svg, .stk-block-icon svg');
    if (svgEl) {
      iconEl = svgEl.cloneNode(true);
    }

    // Approach 2: Look for img elements in .stk--inner-svg (data URI SVGs from cleaned HTML)
    if (!iconEl) {
      const iconContainer = col.querySelector('.stk--inner-svg');
      if (iconContainer) {
        const imgs = iconContainer.querySelectorAll('img');
        // Use the last img (the visible icon); first is often a gradient definition
        const iconImg = imgs.length > 1 ? imgs[imgs.length - 1] : (imgs[0] || null);
        if (iconImg) {
          iconEl = iconImg.cloneNode(true);
        }
      }
    }

    // Approach 3: Broader fallback - any img inside .stk-block-icon
    if (!iconEl) {
      const fallbackImg = col.querySelector('.stk-block-icon img, .wp-block-stackable-icon img');
      if (fallbackImg) {
        iconEl = fallbackImg.cloneNode(true);
      }
    }

    const imageFrag = document.createDocumentFragment();
    if (iconEl) {
      imageFrag.appendChild(document.createComment(' field:image '));
      imageFrag.appendChild(iconEl);
    }

    // --- Text column: heading + description + CTA link ---
    const heading = col.querySelector('h4.stk-block-heading__text, h4[class*="heading"], h3[class*="heading"]');
    const description = col.querySelector('p.stk-block-text__text, .wp-block-stackable-text p');
    const ctaLink = col.querySelector('a.wp-block-button__link, .wp-block-button a');

    const textFrag = document.createDocumentFragment();
    let hasTextContent = false;

    if (heading) {
      const h = document.createElement('h4');
      h.textContent = heading.textContent.trim();
      textFrag.appendChild(document.createComment(' field:text '));
      textFrag.appendChild(h);
      hasTextContent = true;
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      if (!hasTextContent) {
        textFrag.appendChild(document.createComment(' field:text '));
        hasTextContent = true;
      }
      textFrag.appendChild(p);
    }
    if (ctaLink) {
      const a = document.createElement('a');
      a.href = ctaLink.getAttribute('href') || ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      if (!hasTextContent) {
        textFrag.appendChild(document.createComment(' field:text '));
        hasTextContent = true;
      }
      textFrag.appendChild(a);
    }

    // Each card = one row with two columns: [image, text]
    cells.push([imageFrag, textFrag]);
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-service', cells });
  element.replaceWith(block);
}
