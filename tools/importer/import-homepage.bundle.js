var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-split.js
  function parse(element, { document }) {
    const video = element.querySelector("figure.wp-block-video video, video[src]");
    const image = element.querySelector("figure img, picture img, img");
    const mediaCell = [];
    const mediaFrag = document.createDocumentFragment();
    mediaFrag.appendChild(document.createComment(" field:image "));
    if (video) {
      const videoSrc = video.getAttribute("src");
      if (videoSrc) {
        const videoLink = document.createElement("a");
        videoLink.href = videoSrc;
        videoLink.textContent = videoSrc;
        mediaFrag.appendChild(videoLink);
      }
    } else if (image) {
      mediaFrag.appendChild(image);
    }
    mediaCell.push(mediaFrag);
    const contentHalf = element.querySelector(".wp-block-ws-split-half:first-child .split-half-inner, .wp-block-ws-split-half.align-self-center .split-half-inner");
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (contentHalf) {
      const heading = contentHalf.querySelector("h1.wp-block-heading, h1, :scope > h2");
      if (heading) {
        textFrag.appendChild(heading);
      }
      const subheading = contentHalf.querySelector(".stk-block-heading__text, .stk-block-heading h2, .stk-block-heading h3");
      if (subheading) {
        const subPara = document.createElement("p");
        subPara.textContent = subheading.textContent;
        textFrag.appendChild(subPara);
      }
      const ctaLinks = Array.from(
        contentHalf.querySelectorAll(".wp-block-button__link, .wp-block-button a, a.button")
      );
      const seen = /* @__PURE__ */ new Set();
      ctaLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && !seen.has(href)) {
          seen.add(href);
          const p = document.createElement("p");
          const strong = document.createElement("strong");
          const a = document.createElement("a");
          a.href = href;
          a.textContent = link.textContent.trim();
          strong.appendChild(a);
          p.appendChild(strong);
          textFrag.appendChild(p);
        }
      });
    }
    const cells = [
      mediaCell,
      [textFrag]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-split", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icon.js
  function parse2(element, { document }) {
    const cardColumns = element.querySelectorAll(":scope > .wp-block-ws-layout-column");
    const cells = [];
    cardColumns.forEach((col) => {
      const iconTextContainer = col.querySelector(".icon-text");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      const realImg = col.querySelector('img[src^="http"], img[src^="/"]');
      if (realImg) {
        const picture = document.createElement("picture");
        const img = document.createElement("img");
        img.src = realImg.src;
        img.alt = realImg.alt || "";
        picture.appendChild(img);
        imageCell.appendChild(picture);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (iconTextContainer) {
        const paragraphs = iconTextContainer.querySelectorAll(":scope > p");
        paragraphs.forEach((p) => {
          textCell.appendChild(p);
        });
        const ctaLink = iconTextContainer.querySelector(".wp-block-button__link, .wp-block-buttons a");
        if (ctaLink) {
          const ctaParagraph = document.createElement("p");
          ctaParagraph.appendChild(ctaLink);
          textCell.appendChild(ctaParagraph);
        }
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-icon", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-service.js
  function parse3(element, { document }) {
    let cardColumns = Array.from(element.querySelectorAll(":scope > .wp-block-ws-layout-column"));
    if (cardColumns.length === 0) {
      cardColumns = Array.from(element.querySelectorAll(".wp-block-ws-layout-column"));
    }
    if (cardColumns.length === 0) return;
    const cells = [];
    cardColumns.forEach((col) => {
      let iconEl = null;
      const svgEl = col.querySelector(".stk--inner-svg svg, .stk-block-icon svg");
      if (svgEl) {
        iconEl = svgEl.cloneNode(true);
      }
      if (!iconEl) {
        const iconContainer = col.querySelector(".stk--inner-svg");
        if (iconContainer) {
          const imgs = iconContainer.querySelectorAll("img");
          const iconImg = imgs.length > 1 ? imgs[imgs.length - 1] : imgs[0] || null;
          if (iconImg) {
            iconEl = iconImg.cloneNode(true);
          }
        }
      }
      if (!iconEl) {
        const fallbackImg = col.querySelector(".stk-block-icon img, .wp-block-stackable-icon img");
        if (fallbackImg) {
          iconEl = fallbackImg.cloneNode(true);
        }
      }
      const imageFrag = document.createDocumentFragment();
      if (iconEl) {
        imageFrag.appendChild(document.createComment(" field:image "));
        imageFrag.appendChild(iconEl);
      }
      const heading = col.querySelector('h4.stk-block-heading__text, h4[class*="heading"], h3[class*="heading"]');
      const description = col.querySelector("p.stk-block-text__text, .wp-block-stackable-text p");
      const ctaLink = col.querySelector("a.wp-block-button__link, .wp-block-button a");
      const textFrag = document.createDocumentFragment();
      let hasTextContent = false;
      if (heading) {
        const h = document.createElement("h4");
        h.textContent = heading.textContent.trim();
        textFrag.appendChild(document.createComment(" field:text "));
        textFrag.appendChild(h);
        hasTextContent = true;
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        if (!hasTextContent) {
          textFrag.appendChild(document.createComment(" field:text "));
          hasTextContent = true;
        }
        textFrag.appendChild(p);
      }
      if (ctaLink) {
        const a = document.createElement("a");
        a.href = ctaLink.getAttribute("href") || ctaLink.href;
        a.textContent = ctaLink.textContent.trim();
        if (!hasTextContent) {
          textFrag.appendChild(document.createComment(" field:text "));
          hasTextContent = true;
        }
        textFrag.appendChild(a);
      }
      cells.push([imageFrag, textFrag]);
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-service", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-industry.js
  function parse4(element, { document }) {
    const bgImage = element.querySelector(".block-background-media img, .block-background img");
    const columns = Array.from(element.querySelectorAll(".wp-block-ws-layout-column.col-3"));
    const cells = [];
    columns.forEach((col) => {
      const heading = col.querySelector("h4.stk-block-heading__text, h4");
      const description = col.querySelector("p.has-white-color, p.has-text-color, p");
      const ctaLink = col.querySelector("a.wp-block-button__link, a.wp-element-button, a");
      const imageCell = document.createDocumentFragment();
      if (bgImage) {
        imageCell.appendChild(document.createComment(" field:image "));
        const imgClone = bgImage.cloneNode(true);
        imageCell.appendChild(imgClone);
      }
      const textCell = document.createDocumentFragment();
      const textComment = document.createComment(" field:text ");
      textCell.appendChild(textComment);
      if (heading) {
        const h4 = document.createElement("h4");
        h4.textContent = heading.textContent.trim();
        textCell.appendChild(h4);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textCell.appendChild(p);
      }
      if (ctaLink) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = ctaLink.href || ctaLink.getAttribute("href");
        a.textContent = ctaLink.textContent.trim();
        p.appendChild(a);
        textCell.appendChild(p);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-industry", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-casestudy.js
  function parse5(element, { document }) {
    const cardElements = element.querySelectorAll(".col-lg-6 > .card-link, .col-lg-6 > .archive-view");
    const cells = [];
    cardElements.forEach((card) => {
      const image = card.querySelector("img.archive-image, .archive-image-container img");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (image) {
        imageCell.appendChild(image);
      }
      const label = card.querySelector("p.label");
      const titleLink = card.querySelector("h3.archive-title a.post-link, h3.archive-title a");
      const excerpt = card.querySelector("p.archive-excerpt");
      const ctaSpan = card.querySelector(".archive-cta span");
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (label) {
        textCell.appendChild(label);
      }
      if (titleLink) {
        const h3 = document.createElement("h3");
        const link = document.createElement("a");
        link.href = titleLink.href || titleLink.getAttribute("href");
        link.textContent = titleLink.textContent.trim();
        h3.appendChild(link);
        textCell.appendChild(h3);
      }
      if (excerpt) {
        textCell.appendChild(excerpt);
      }
      if (ctaSpan && titleLink) {
        const ctaP = document.createElement("p");
        const ctaLink = document.createElement("a");
        ctaLink.href = titleLink.href || titleLink.getAttribute("href");
        ctaLink.textContent = ctaSpan.textContent.trim();
        ctaP.appendChild(ctaLink);
        textCell.appendChild(ctaP);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-casestudy",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse6(element, { document }) {
    const columns = element.querySelectorAll(":scope .stk-block-column");
    const cells = [];
    if (columns.length >= 2) {
      const col1 = columns[0];
      const image = col1.querySelector("img.stk-img, img.wp-image-23693, figure img");
      const col1Content = [];
      if (image) {
        col1Content.push(image);
      }
      const col2 = columns[1];
      const heading = col2.querySelector("h3.wp-block-heading, h3, h2, h1");
      const description = col2.querySelector(".stk-block-text__text, .stk-block-text p, p.has-text-color");
      const formButton = col2.querySelector(".mktoButton, button.mktoButton");
      const col2Content = [];
      if (heading) {
        const cleanHeading = document.createElement("h3");
        cleanHeading.textContent = heading.textContent.trim();
        col2Content.push(cleanHeading);
      }
      if (description) {
        col2Content.push(description);
      }
      if (formButton) {
        const ctaLink = document.createElement("p");
        const strong = document.createElement("strong");
        const anchor = document.createElement("a");
        anchor.href = "#subscribe";
        anchor.textContent = formButton.textContent.trim();
        strong.appendChild(anchor);
        ctaLink.appendChild(strong);
        col2Content.push(ctaLink);
      }
      cells.push([col1Content, col2Content]);
    } else {
      const allImages = element.querySelectorAll("img");
      const allHeadings = element.querySelectorAll("h1, h2, h3, h4");
      const allText = element.querySelectorAll("p");
      const col1Content = [];
      const col2Content = [];
      if (allImages.length > 0) {
        col1Content.push(allImages[0]);
      }
      allHeadings.forEach((h) => col2Content.push(h));
      allText.forEach((p) => col2Content.push(p));
      cells.push([col1Content.length > 0 ? col1Content : "", col2Content.length > 0 ? col2Content : ""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/ensono-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        "#onetrust-pc-sdk"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["a.screen-reader-text"]);
      WebImporter.DOMUtils.remove(element, ["header.site-header"]);
      WebImporter.DOMUtils.remove(element, ["footer.site-footer"]);
      WebImporter.DOMUtils.remove(element, ["noscript"]);
      WebImporter.DOMUtils.remove(element, ["iframe", "link"]);
    }
  }

  // tools/importer/transformers/ensono-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function findSection(element, selector) {
    let scopedSelector = selector.replace(/^main\s*>\s*/, ":scope > ").replace(/^main\s+/, ":scope ");
    const nthMatch = scopedSelector.match(/^(.+):nth-of-type\((\d+)\)$/);
    if (nthMatch) {
      const baseSelector = nthMatch[1];
      const nthIndex = parseInt(nthMatch[2], 10) - 1;
      const candidates = element.querySelectorAll(baseSelector);
      if (candidates.length > nthIndex) return candidates[nthIndex];
    }
    try {
      const result = element.querySelector(scopedSelector);
      if (result) return result;
    } catch (e) {
    }
    try {
      return element.querySelector(selector);
    } catch (e) {
      return null;
    }
  }
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const document = element.ownerDocument;
      const sections = template.sections;
      const sectionEls = sections.map((section) => findSection(element, section.selector));
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = sectionEls[i];
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Ensono corporate homepage with hero banner, service highlights, client logos, and CTAs",
    urls: [
      "https://www.ensono.com/"
    ],
    blocks: [
      {
        name: "hero-split",
        instances: [".wp-block-ws-split"]
      },
      {
        name: "cards-icon",
        instances: ["section.padding-top-0.padding-bottom-50:not(.has-background) .wp-block-ws-layout-row"]
      },
      {
        name: "cards-service",
        instances: ["section.has-background .wp-block-ws-layout-row"]
      },
      {
        name: "cards-industry",
        instances: [".wp-block-ws-card.has-background"]
      },
      {
        name: "cards-casestudy",
        instances: [".wp-block-ws-select-content"]
      },
      {
        name: "columns-cta",
        instances: [".stk-block-columns"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: "section.has-white-color",
        style: "dark-purple",
        blocks: ["hero-split"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "New Now Next",
        selector: "main > section:nth-of-type(2)",
        style: null,
        blocks: ["cards-icon"],
        defaultContent: ["h3.wp-block-heading"]
      },
      {
        id: "section-3",
        name: "Who We Are",
        selector: "main > section:nth-of-type(3)",
        style: null,
        blocks: [],
        defaultContent: ["h3.wp-block-heading", "p", ".wp-block-button"]
      },
      {
        id: "section-4",
        name: "What We Do",
        selector: "section.has-background:nth-of-type(1)",
        style: "light-grey",
        blocks: ["cards-service"],
        defaultContent: ["h3.wp-block-heading", "h4.wp-block-heading"]
      },
      {
        id: "section-5",
        name: "Who We Serve",
        selector: "main section:nth-of-type(6)",
        style: null,
        blocks: ["cards-industry"],
        defaultContent: ["h3.wp-block-heading", "h4.wp-block-heading"]
      },
      {
        id: "section-6",
        name: "Allyship In Action",
        selector: "main section:nth-of-type(8)",
        style: null,
        blocks: ["cards-casestudy"],
        defaultContent: ["h3.wp-block-heading"]
      },
      {
        id: "section-7",
        name: "Stay Ahead",
        selector: "section.has-background:last-of-type",
        style: "light-grey",
        blocks: ["columns-cta"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    "hero-split": parse,
    "cards-icon": parse2,
    "cards-service": parse3,
    "cards-industry": parse4,
    "cards-casestudy": parse5,
    "columns-cta": parse6
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path: path || "/index",
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
