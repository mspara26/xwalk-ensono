/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Ensono section breaks and section metadata.
 * Inserts <hr> section breaks and Section Metadata blocks based on template sections.
 * All selectors validated against migration-work/cleaned.html.
 *
 * Template sections (from page-templates.json):
 *   1. Hero Banner - selector: section.has-white-color - style: dark-purple
 *   2. New Now Next - selector: main > section:nth-of-type(2) - style: null
 *   3. Who We Are - selector: main > section:nth-of-type(3) - style: null
 *   4. What We Do - selector: section.has-background:nth-of-type(1) - style: light-grey
 *   5. Who We Serve - selector: main section:nth-of-type(6) - style: null
 *   6. Allyship In Action - selector: main section:nth-of-type(8) - style: null
 *   7. Stay Ahead - selector: section.has-background:last-of-type - style: light-grey
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Resolve a section selector against the element (main).
 * Handles selectors that reference 'main' by replacing with ':scope'.
 * For selectors using :nth-of-type with a class filter (which CSS doesn't support
 * the way you'd expect), falls back to querySelectorAll + index matching.
 *
 * Verified selectors on live DOM at https://www.ensono.com/:
 *   - Sections are flat direct children of main (10 sections)
 *   - has-background sections are at positions 4, 5, 10
 *   - section.has-background:nth-of-type(1) fails because :nth-of-type
 *     counts ALL <section> siblings regardless of class
 */
function findSection(element, selector) {
  // Replace 'main > ' or 'main ' with ':scope > ' or ':scope ' to scope to element
  let scopedSelector = selector.replace(/^main\s*>\s*/, ':scope > ').replace(/^main\s+/, ':scope ');

  // Handle the case where :nth-of-type(N) is combined with a class selector.
  // CSS :nth-of-type ignores classes, so 'section.has-background:nth-of-type(1)'
  // matches the 1st <section> sibling only if it also has .has-background (usually fails).
  // Fix: use querySelectorAll with the base selector and pick by index.
  const nthMatch = scopedSelector.match(/^(.+):nth-of-type\((\d+)\)$/);
  if (nthMatch) {
    const baseSelector = nthMatch[1];
    const nthIndex = parseInt(nthMatch[2], 10) - 1;
    const candidates = element.querySelectorAll(baseSelector);
    if (candidates.length > nthIndex) return candidates[nthIndex];
  }

  // Try the scoped selector directly
  try {
    const result = element.querySelector(scopedSelector);
    if (result) return result;
  } catch (e) { /* fall through */ }

  // Fallback: try the original selector on element
  try {
    return element.querySelector(selector);
  } catch (e) {
    return null;
  }
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const document = element.ownerDocument;
    const sections = template.sections;

    // Resolve all section elements first (before any DOM modifications)
    const sectionEls = sections.map((section) => findSection(element, section.selector));

    // Process sections in reverse order to avoid DOM position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = sectionEls[i];

      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Insert <hr> before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
