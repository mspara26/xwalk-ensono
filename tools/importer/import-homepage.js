/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroSplitParser from './parsers/hero-split.js';
import cardsIconParser from './parsers/cards-icon.js';
import cardsServiceParser from './parsers/cards-service.js';
import cardsIndustryParser from './parsers/cards-industry.js';
import cardsCasestudyParser from './parsers/cards-casestudy.js';
import columnsCtaParser from './parsers/columns-cta.js';

// TRANSFORMER IMPORTS
import ensonoCleanupTransformer from './transformers/ensono-cleanup.js';
import ensonoSectionsTransformer from './transformers/ensono-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Ensono corporate homepage with hero banner, service highlights, client logos, and CTAs',
  urls: [
    'https://www.ensono.com/',
  ],
  blocks: [
    {
      name: 'hero-split',
      instances: ['.wp-block-ws-split'],
    },
    {
      name: 'cards-icon',
      instances: ['section.padding-top-0.padding-bottom-50:not(.has-background) .wp-block-ws-layout-row'],
    },
    {
      name: 'cards-service',
      instances: ['section.has-background .wp-block-ws-layout-row'],
    },
    {
      name: 'cards-industry',
      instances: ['.wp-block-ws-card.has-background'],
    },
    {
      name: 'cards-casestudy',
      instances: ['.wp-block-ws-select-content'],
    },
    {
      name: 'columns-cta',
      instances: ['.stk-block-columns'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: 'section.has-white-color',
      style: 'dark-purple',
      blocks: ['hero-split'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'New Now Next',
      selector: 'main > section:nth-of-type(2)',
      style: null,
      blocks: ['cards-icon'],
      defaultContent: ['h3.wp-block-heading'],
    },
    {
      id: 'section-3',
      name: 'Who We Are',
      selector: 'main > section:nth-of-type(3)',
      style: null,
      blocks: [],
      defaultContent: ['h3.wp-block-heading', 'p', '.wp-block-button'],
    },
    {
      id: 'section-4',
      name: 'What We Do',
      selector: 'section.has-background:nth-of-type(1)',
      style: 'light-grey',
      blocks: ['cards-service'],
      defaultContent: ['h3.wp-block-heading', 'h4.wp-block-heading'],
    },
    {
      id: 'section-5',
      name: 'Who We Serve',
      selector: 'main section:nth-of-type(6)',
      style: null,
      blocks: ['cards-industry'],
      defaultContent: ['h3.wp-block-heading', 'h4.wp-block-heading'],
    },
    {
      id: 'section-6',
      name: 'Allyship In Action',
      selector: 'main section:nth-of-type(8)',
      style: null,
      blocks: ['cards-casestudy'],
      defaultContent: ['h3.wp-block-heading'],
    },
    {
      id: 'section-7',
      name: 'Stay Ahead',
      selector: 'section.has-background:last-of-type',
      style: 'light-grey',
      blocks: ['columns-cta'],
      defaultContent: [],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-split': heroSplitParser,
  'cards-icon': cardsIconParser,
  'cards-service': cardsServiceParser,
  'cards-industry': cardsIndustryParser,
  'cards-casestudy': cardsCasestudyParser,
  'columns-cta': columnsCtaParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  ensonoCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [ensonoSectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path: path || '/index',
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
