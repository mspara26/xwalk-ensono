/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-industry
 * Base block: cards
 * Source: https://www.ensono.com/
 * Selector: .wp-block-ws-card.has-background
 * Generated: 2026-04-23
 *
 * Source structure: A single card container with a shared background image
 * and 6 industry columns across two rows, each containing an h4 heading,
 * paragraph description, and CTA button link.
 *
 * UE Model (card items): image (reference), text (richtext)
 * Target: Container block - one row per industry card, two columns per row (image, text)
 */
export default function parse(element, { document }) {
  // Extract the shared background image (single image for the whole block)
  const bgImage = element.querySelector('.block-background-media img, .block-background img');

  // Extract all industry column items
  // Each column is a .wp-block-ws-layout-column.col-3 containing heading, description, CTA
  const columns = Array.from(element.querySelectorAll('.wp-block-ws-layout-column.col-3'));

  const cells = [];

  columns.forEach((col) => {
    // Extract heading (h4 with industry name)
    const heading = col.querySelector('h4.stk-block-heading__text, h4');

    // Extract description paragraph
    const description = col.querySelector('p.has-white-color, p.has-text-color, p');

    // Extract CTA link
    const ctaLink = col.querySelector('a.wp-block-button__link, a.wp-element-button, a');

    // Build image cell with field hint
    // Source has a shared background image at block level, not per-card images.
    // If a background image exists, clone it for each card; otherwise leave cell empty.
    // Per hinting rules: only add field hint when cell has content.
    const imageCell = document.createDocumentFragment();
    if (bgImage) {
      imageCell.appendChild(document.createComment(' field:image '));
      const imgClone = bgImage.cloneNode(true);
      imageCell.appendChild(imgClone);
    }

    // Build text cell with field hint (richtext: heading + description + CTA)
    const textCell = document.createDocumentFragment();
    const textComment = document.createComment(' field:text ');
    textCell.appendChild(textComment);

    if (heading) {
      const h4 = document.createElement('h4');
      h4.textContent = heading.textContent.trim();
      textCell.appendChild(h4);
    }

    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textCell.appendChild(p);
    }

    if (ctaLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = ctaLink.href || ctaLink.getAttribute('href');
      a.textContent = ctaLink.textContent.trim();
      p.appendChild(a);
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-industry', cells });
  element.replaceWith(block);
}
