Let me examine the current project state to build an accurate plan.# Ensono Homepage Migration Plan

## Overview

Migrate the Ensono homepage (`https://www.ensono.com/`) to AEM Edge Delivery Services. This is a **single page migration** targeting the homepage of a technology/IT services company.

## Current Project State

- **Project type**: xwalk (AEM Cloud authoring via Universal Editor)
- **Content source**: `author-p121050-e1183639.adobeaemcloud.com`
- **Repository**: `mspara26/xwalk-ensono`
- **Styles**: Default boilerplate (roboto fonts, standard EDS tokens)
- **Existing blocks**: accordion, cards, carousel, columns, embed, footer, form, fragment, header, hero, modal, quote, search, table, tabs, video
- **Font loading**: Roboto and Roboto Condensed (self-hosted woff2)

## Source Page

- **URL**: `https://www.ensono.com/`
- **Type**: Corporate homepage — likely contains hero banner, service highlights, client logos, testimonials, CTAs, and footer

## xwalk Project Considerations

This is an **xwalk project** (not DA), which means:
- Content is authored in the **Universal Editor** via AEM as a Cloud Service
- Block parsers require **field hinting** for UE compatibility
- The import generates content for the UE authoring experience
- Block models need `_*.json` files for UE field definitions

## Checklist

### Content Migration
- [ ] **1. Project Setup** — Detect xwalk project type and configure block library endpoint
- [ ] **2. Site Analysis** — Scrape Ensono homepage, create page template skeleton
- [ ] **3. Page Analysis** — Analyze page structure, identify sections, content sequences, and block variants
- [ ] **4. Block Mapping** — Map block variants to DOM selectors in page-templates.json
- [ ] **5. Import Infrastructure** — Generate parsers (with xwalk field hinting) and transformers
- [ ] **6. Content Import** — Execute import script, generate HTML content files

### Design Migration
- [ ] **7. Global Design System** — Extract Ensono design tokens (colors, typography, spacing) and update `/styles/styles.css`
- [ ] **8. Font Configuration** — Configure Ensono fonts in `/styles/fonts.css` and `/head.html`
- [ ] **9. Block CSS** — Apply block-specific styles to match Ensono visual design

### Verification
- [ ] **10. Preview & Verify** — Preview migrated page, compare against original
- [ ] **11. Fix Issues** — Address any rendering differences or content gaps

## Expected Artifacts

| Artifact | Location |
|----------|----------|
| Project config | `.migration/project.json` |
| Migration plan | `migration-work/migration-plan.md` |
| Page analysis | `migration-work/authoring-analysis.json` |
| Screenshot | `migration-work/screenshot.png` |
| Cleaned HTML | `migration-work/cleaned.html` |
| Page templates | `tools/importer/page-templates.json` |
| Block parsers | `tools/importer/parsers/*.js` |
| Transformers | `tools/importer/transformers/*.js` |
| Import script | `tools/importer/import-homepage.js` |
| Content | `content/*.plain.html` |
| Global styles | `styles/styles.css` (updated) |
| Font config | `styles/fonts.css` (updated) |
| Block styles | `blocks/*/*.css` (new variants) |

## Notes

- The existing boilerplate blocks (hero, cards, columns, carousel, etc.) will be used as base templates for new variants
- xwalk parsers have additional requirements for field hinting — see `xwalk-parser-requirements.md`
- No code will be pushed without explicit approval from the user

---

*Execution requires switching to Execute mode.*
