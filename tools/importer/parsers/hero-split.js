/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-split
 * Base block: hero
 * Source: https://www.ensono.com/
 * Selector: .wp-block-ws-split
 * Generated: 2026-04-23
 *
 * UE Model fields:
 *   - image (reference) → Row 1: media/image content
 *   - imageAlt (text) → collapsed into image (skipped per hinting rules)
 *   - text (richtext) → Row 2: heading + subheading + CTA
 *
 * Block library structure (1 column, 3 rows):
 *   Row 1: block name (hero-split)
 *   Row 2: background image/media
 *   Row 3: title + subheading + CTA
 */
export default function parse(element, { document }) {
  // --- Extract media from the second split half ---
  // Source: .wp-block-ws-split-half:last-child figure.wp-block-video > video
  const video = element.querySelector('figure.wp-block-video video, video[src]');
  const image = element.querySelector('figure img, picture img, img');

  // Build media cell (Row 2) with field hint
  const mediaCell = [];
  const mediaFrag = document.createDocumentFragment();
  mediaFrag.appendChild(document.createComment(' field:image '));

  if (video) {
    // Convert video to a link referencing the video src (EDS handles video via link)
    const videoSrc = video.getAttribute('src');
    if (videoSrc) {
      const videoLink = document.createElement('a');
      videoLink.href = videoSrc;
      videoLink.textContent = videoSrc;
      mediaFrag.appendChild(videoLink);
    }
  } else if (image) {
    mediaFrag.appendChild(image);
  }

  mediaCell.push(mediaFrag);

  // --- Extract text content from the first split half ---
  // Source: .wp-block-ws-split-half:first-child .split-half-inner
  const contentHalf = element.querySelector('.wp-block-ws-split-half:first-child .split-half-inner, .wp-block-ws-split-half.align-self-center .split-half-inner');

  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));

  if (contentHalf) {
    // Extract heading: h1.wp-block-heading or fallback h1, h2 at top level
    const heading = contentHalf.querySelector('h1.wp-block-heading, h1, :scope > h2');
    if (heading) {
      textFrag.appendChild(heading);
    }

    // Extract subheading: .stk-block-heading__text or secondary heading
    const subheading = contentHalf.querySelector('.stk-block-heading__text, .stk-block-heading h2, .stk-block-heading h3');
    if (subheading) {
      // Wrap as a paragraph if it's a heading element to match library structure
      const subPara = document.createElement('p');
      subPara.textContent = subheading.textContent;
      textFrag.appendChild(subPara);
    }

    // Extract CTA buttons: .wp-block-button__link or fallback anchor buttons
    const ctaLinks = Array.from(
      contentHalf.querySelectorAll('.wp-block-button__link, .wp-block-button a, a.button')
    );
    // Deduplicate: .wp-block-button__link and .wp-block-button a may overlap
    const seen = new Set();
    ctaLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && !seen.has(href)) {
        seen.add(href);
        // Wrap CTA in a paragraph with strong + link for EDS button rendering
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        const a = document.createElement('a');
        a.href = href;
        a.textContent = link.textContent.trim();
        strong.appendChild(a);
        p.appendChild(strong);
        textFrag.appendChild(p);
      }
    });
  }

  // --- Build cells array matching library structure ---
  // Row 1 (image/media): background asset with field:image hint
  // Row 2 (text): heading + subheading + CTA with field:text hint
  const cells = [
    mediaCell,
    [textFrag],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-split', cells });
  element.replaceWith(block);
}
