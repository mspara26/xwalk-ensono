/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-icon variant.
 * Base block: cards
 * Source: https://www.ensono.com/
 * Generated: 2026-04-23
 *
 * Source structure: .wp-block-ws-layout-row containing multiple
 * .wp-block-ws-layout-column children, each with a card featuring
 * an inline SVG icon, category label, title text, and CTA link.
 *
 * UE Model (xwalk): Container block with "card" items.
 * Each card has fields: image (reference), text (richtext).
 * Collapsed fields (imageAlt, imageTitle) are skipped per hinting rules.
 *
 * Target table: One row per card, two columns:
 *   Column 1: image (icon) - icons are inline SVGs on the source page,
 *             not DAM-referenceable assets. The image cell is left empty
 *             with the field hint so authors can assign a DAM image later.
 *             If a real img element is found (fallback for variations),
 *             it will be included.
 *   Column 2: text (category label + title + CTA link as richtext)
 */
export default function parse(element, { document }) {
  // Select all card columns within the layout row
  const cardColumns = element.querySelectorAll(':scope > .wp-block-ws-layout-column');

  const cells = [];

  cardColumns.forEach((col) => {
    // Extract text content from .icon-text
    const iconTextContainer = col.querySelector('.icon-text');

    // Build the image cell with field hint
    // Source icons are inline SVGs which cannot be imported as DAM references.
    // Include a real img if found (handles variations with actual image files).
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    const realImg = col.querySelector('img[src^="http"], img[src^="/"]');
    if (realImg) {
      const picture = document.createElement('picture');
      const img = document.createElement('img');
      img.src = realImg.src;
      img.alt = realImg.alt || '';
      picture.appendChild(img);
      imageCell.appendChild(picture);
    }

    // Build the text cell with field hint - combine category, title, and CTA
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    if (iconTextContainer) {
      // Extract all paragraphs (category label + title)
      const paragraphs = iconTextContainer.querySelectorAll(':scope > p');
      paragraphs.forEach((p) => {
        textCell.appendChild(p);
      });

      // Extract CTA button link
      const ctaLink = iconTextContainer.querySelector('.wp-block-button__link, .wp-block-buttons a');
      if (ctaLink) {
        const ctaParagraph = document.createElement('p');
        ctaParagraph.appendChild(ctaLink);
        textCell.appendChild(ctaParagraph);
      }
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icon', cells });
  element.replaceWith(block);
}
