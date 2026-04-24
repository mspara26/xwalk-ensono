/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-casestudy
 * Base block: cards
 * Source: https://www.ensono.com/
 * Generated: 2026-04-23
 *
 * Extracts case study cards from .wp-block-ws-select-content containers.
 * Each card has an image, label, title (linked), excerpt, and CTA.
 * Maps to Cards block library format: 2 columns (image | text) per row.
 *
 * UE Model: container block "cards" with child items "card"
 *   - card fields: image (reference), text (richtext)
 *
 * Validated selectors (from source HTML):
 *   - Card containers: .col-lg-6 > .card-link
 *   - Card image: img.archive-image
 *   - Card label: p.label
 *   - Card title link: h3.archive-title > a.post-link, h3.archive-title a
 *   - Card excerpt: p.archive-excerpt
 *   - CTA text: .archive-cta span
 */
export default function parse(element, { document }) {
  // Select all individual card containers within the select-content block
  const cardElements = element.querySelectorAll('.col-lg-6 > .card-link, .col-lg-6 > .archive-view');

  const cells = [];

  cardElements.forEach((card) => {
    // --- Column 1: Image ---
    const image = card.querySelector('img.archive-image, .archive-image-container img');

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (image) {
      imageCell.appendChild(image);
    }

    // --- Column 2: Text content (label + title + excerpt + CTA) ---
    const label = card.querySelector('p.label');
    const titleLink = card.querySelector('h3.archive-title a.post-link, h3.archive-title a');
    const excerpt = card.querySelector('p.archive-excerpt');
    const ctaSpan = card.querySelector('.archive-cta span');

    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    // Add label as a paragraph if present
    if (label) {
      textCell.appendChild(label);
    }

    // Add title as heading with link
    if (titleLink) {
      const h3 = document.createElement('h3');
      const link = document.createElement('a');
      link.href = titleLink.href || titleLink.getAttribute('href');
      link.textContent = titleLink.textContent.trim();
      h3.appendChild(link);
      textCell.appendChild(h3);
    }

    // Add excerpt paragraph
    if (excerpt) {
      textCell.appendChild(excerpt);
    }

    // Add CTA as a linked element using the same href as the title
    if (ctaSpan && titleLink) {
      const ctaP = document.createElement('p');
      const ctaLink = document.createElement('a');
      ctaLink.href = titleLink.href || titleLink.getAttribute('href');
      ctaLink.textContent = ctaSpan.textContent.trim();
      ctaP.appendChild(ctaLink);
      textCell.appendChild(ctaP);
    }

    // Each card = one row with [image, text]
    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-casestudy',
    cells,
  });

  element.replaceWith(block);
}
