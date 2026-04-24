/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Ensono site-wide cleanup.
 * Removes non-authorable content from https://www.ensono.com/.
 * All selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banner (OneTrust) - found: div#onetrust-consent-sdk, div#onetrust-banner-sdk, div#onetrust-pc-sdk
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '#onetrust-pc-sdk',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove skip link - found: a.screen-reader-text (line 5)
    WebImporter.DOMUtils.remove(element, ['a.screen-reader-text']);

    // Remove site header/navigation - found: header.site-header (line 6)
    WebImporter.DOMUtils.remove(element, ['header.site-header']);

    // Remove site footer - found: footer.site-footer (line 2035)
    WebImporter.DOMUtils.remove(element, ['footer.site-footer']);

    // Remove noscript elements (Google Tag Manager) - found: lines 2-3
    WebImporter.DOMUtils.remove(element, ['noscript']);

    // Remove iframes and link elements
    WebImporter.DOMUtils.remove(element, ['iframe', 'link']);
  }
}
