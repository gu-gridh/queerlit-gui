# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

As this project is a user-facing application, the places in the semantic versioning number `MAJOR`.`MINOR`.`PATCH` are redefined as follows:

- `MAJOR` denotes changes that are expected to significantly disrupt the flow of a returning user with some experience of the application, _or_ that significantly affects the development workflow
- `MINOR` denotes changes that may affect the user experience _or_ the development workflow
- `PATCH` denotes changes that are insignificant to the user experience or the development workflow

## [Unreleased]

### Fixed

- Bug when erasing thesaurus search text
- Reset sort when clicking logo

### [2.5.0] (2023-12-20)

### Added

- Collapse "sidebar" (navigation panel) on mobile, except on Search/Thesaurus page with empty search
- GRIDH logo in footer
- In the year filter, click a histogram bar to select that decade (or century)
- Animate expand/collapse of certain elements

### Changed

- The search button on a term page now overwrites any current search query
- Don't show hit count when hovering histogram bar; it's misleading for bars outside selected range
- Most QLIT backend calls are cached with _memoize_, so thesaurus browsing is now faster for short-time visitors, although it can potentially drain memory on a very long visit
- Renamed single-word components to multi-word, pursuing [Vue style guide](https://vuejs.org/style-guide/rules-essential)

### Fixed

- Histogram width adjusted, last bar will match progress of current decade/century; this makes the slider properly aligned
- Scroll window to top when following links
- Add trailing slash to `/om/` links to skip redirects
- Footer less cramped, more vertical, on small screens

## [2.4.0] (2023-12-13)

### Added

- Dark mode

### Changed

- Centralized and simplified actions to run on page load: setting metadata, tracking page view, etc.

## [2.3.0] (2023-12-06)

### Added

- Docker support
- Show year tooltip when dragging year filter slider handles
- Add term/work titles ("slugs") to url
- Add structured data as JSON-LD snippets for SEO
- Add "noindex" robots meta for the 404 page
- Set `rel="canonical"` link element

### Changed

- Set maximum app width and center on large screens
- Better use of semantic HTML5 elements
- Simplify code for setting document title

### Fixed

- Ellipsis ("...") was sometimes being added to non-truncated summaries

## [2.2.7] (2023-11-29)

### Fixed

- "Bredare/Smalare" not "Bredare/Underordnade"

## [2.2.6] (2023-11-02)

### Changed

- Show SAOGF terms more prominently than others
- Set Node version (to 16) in `.nvmrc` and respect that in GitHub CI workflow

## [2.2.5] (2023-10-25)

### Added

- The test environment of Libris XL can now be used by setting the `VITE_XLAPI_QA` env flag

### Changed

- Lower-case most occurrences of "hbtqi"

### Fixed

- Added missing author "Arthur Magnusson" for the local work `magnusson`

## [2.2.4] (2023-10-13)

### Added

- GitHub Actions build workflow, to catch build errors sooner

### Fixed

- Restore route meta typing to repair build

## [2.2.3] (2023-10-13)

### Added

- Contact menu link
- About and contact links in footer

### Fixed

- Restore person name numeration (e.g. XII) to term label

## [2.2.2] (2023-10-04)

### Fixed

- Broken click handler for terms without options

## [2.2.1] (2023-10-04)

### Added

- Search button on term page for minor terms, not just major

### Fixed

- Changed some clickable elements (e.g. term buttons) into links, so they can be opened in new tab etc.
- In the freetext input, the genre/form suggestions had the whole scheme url showing, changed it back to just the scheme code
- Adjusted spacing between broader/narrower/related terms on term page

## [2.2.0] (2023-09-20)

### Changed

- Migrated from Vuex to Pinia

## [2.1.2] (2023-09-13)

### Fixed

- The back link from a term page now leads to last page if any, otherwise to the thesaurus page
- Author was not showing for a few titles, `agent` can apparently be an array

## [2.1.1] (2023-09-07)

### Fixed

- Remove stray term id printout in TermCombobox

## [2.1.0] (2023-08-31)

### Added

- Re-added Person/Organization subject headings

### Changed

- Improved TS typings for the Libris API.
- Using renamed QLIT server routes "search", "broader" and "narrower"

## [2.0.0] (2023-08-16)

### Added

- Collection buttons in thesaurus view
- A heading for the thesaurus view, indicating the view mode: tree, search or collection
- Added Runsten as a Genre/Form for some local works, using a SHM URI since there is no Libris item for this.

### Changed

- Completely rewritten to TypeScript!
- Simplified the term object used internally (e.g. `id` instead of `@id`)
- Subject headings outside the QLIT, SAO and Barn concept schemes are hidden, as well as genre/form terms outside the SAOGF and BarnGF schemes

## [1.8.0] (2023-07-05)

### Added

- Checkbox to toggle hierarchical term search
- The term search fields can be collapsed

### Changed

- Term autocomplete suggestions is limited to 10 suggestions
- The two term inputs for major and minor terms are now visually presented as one input
- Histogram bars are separated by small spaces, and the lowest are raised to a minimum height for visibility
- When enabling older works, histogram bars are by 100 years, not 10 years

### Fixed

- Title input is not being cleared when the value is changed
- Autocomplete for terms is not triggered for empty string
- Labels for minor SAO/Barn terms are guessed from their id uris and displayed
- Special works are included in the year histogram
- Various fixes for year filter (slider, histogram, inputs)

## [1.7.0] (2023-06-21)

### Added

- Find terms by collections
- A term option to remove it from search field
- Terms can be dragged and dropped into the central/peripheral search fields

### Changed

- The title, author and genre/form search fields are collapsed by default
- The introductory text is collapsed when a search query is active
- The year filter is wider
- Terms in the secondary terms field are displayed similar to in search results: brighter background and with "– perifert" appended

## [1.6.0] (2023-05-31)

### Added

- Inputs in the search form have toggleable help texts ([#142](https://github.com/gu-gridh/queerlit-gui/issues/142))

### Changed

- Most inputs in the search form now has labels instead of placeholders ([#116](https://github.com/gu-gridh/queerlit-gui/issues/116]))

### Fixed

- [#146](https://github.com/gu-gridh/queerlit-gui/issues/146) Sometimes when selecting suggested term from Freetext input, actual search uses freetext, not term
- [#143](https://github.com/gu-gridh/queerlit-gui/issues/143) Fix compound term labels in term combobox

## [1.5.0] (2023-05-24)

### Added

- Support for logging page titles to Matomo

### Changed

- Interaction with terms has changed. Hovering no longer has effect. Instead, click to show the options menu (if there are options).

## [1.4.0] - 2023-04-14

### Added

- Buttons for active search filters

### Changed

- The color of active filters was changed from yellow to blue, and local works from blue to pink

### Fixed

- Local works can now be opened again
- For local works, the genre/form labels are now also included in text search
- Typo and slight wording change in the footer

## [1.3.0] - 2023-04-05

### Added

- Support for logging basic navigation to Matomo
- Freetext autocomplete also uses the QLIT backend now

## [1.2.0] - 2023-03-29

### Added

- It is now possible to add multiple terms to the query, and they are combined with AND
- It is also possible to search by peripheral terms
- Show Queerlit motivation text and peripheral terms in search result
  - Caveat: Peripheral non-QLIT terms are not shown, because loading their labels can be slow

### Changed

- Term autocomplete now gets suggestions from QLIT backend, not from Libris
  - Suggested terms are ordered by relevance

### Fixed

- Removed `[]` from motivation text

## [1.1.1] - 2023-03-02

### Fixed

- Upgraded @vitejs/plugin-vue to fix compatibility with vite.

## [1.1.0] - 2023-03-01

### Added

- Footer with logo and links to organizations and CC0 license
- Show the loading spinner on all loading pages, not just search results
- Show genre/form in search results
- Color active search fields yellow
- Clicking the logo will reset the search
- Close buttons for suggestions and freetext help

### Changed

- Link to contact form, not email address
- Make the search button on term page more prominent
- Highligt incomplete autocomplete fields with a red background
- Hide freetext suggestions when showing help

### Fixed

- Fix menu link highlight for local work page
- Prevent race condition in term autocomplete
- Improve local works freetext search

### Security

- Upgraded some dependencies

## [1.0.0] - 2023-02-14

### Public release!

This date marks the public release of the website. It features a search interface for the Queerlit bibliography, as well as a thesaurus browser for the QLIT thesaurus. Change up until this point are not documented other than in the git commit log.

[unreleased]: https://github.com/gu-gridh/queerlit-gui/compare/v2.5.0...HEAD
[2.5.0]: https://github.com/gu-gridh/queerlit-gui/compare/v2.4.0...v2.5.0
[2.4.0]: https://github.com/gu-gridh/queerlit-gui/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/gu-gridh/queerlit-gui/compare/v2.2.7...v2.3.0
[2.2.7]: https://github.com/gu-gridh/queerlit-gui/compare/v2.2.6...v2.2.7
[2.2.6]: https://github.com/gu-gridh/queerlit-gui/compare/v2.2.5...v2.2.6
[2.2.5]: https://github.com/gu-gridh/queerlit-gui/compare/v2.2.4...v2.2.5
[2.2.4]: https://github.com/gu-gridh/queerlit-gui/compare/v2.2.3...v2.2.4
[2.2.3]: https://github.com/gu-gridh/queerlit-gui/compare/v2.2.2...v2.2.3
[2.2.2]: https://github.com/gu-gridh/queerlit-gui/compare/v2.2.1...v2.2.2
[2.2.1]: https://github.com/gu-gridh/queerlit-gui/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/gu-gridh/queerlit-gui/compare/v2.1.2...v2.2.0
[2.1.2]: https://github.com/gu-gridh/queerlit-gui/compare/v2.1.1...v2.1.2
[2.1.1]: https://github.com/gu-gridh/queerlit-gui/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/gu-gridh/queerlit-gui/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/gu-gridh/queerlit-gui/compare/v1.8.0...v2.0.0
[1.8.0]: https://github.com/gu-gridh/queerlit-gui/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/gu-gridh/queerlit-gui/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/gu-gridh/queerlit-gui/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/gu-gridh/queerlit-gui/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/gu-gridh/queerlit-gui/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/gu-gridh/queerlit-gui/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/gu-gridh/queerlit-gui/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/gu-gridh/queerlit-gui/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/gu-gridh/queerlit-gui/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/gu-gridh/queerlit-gui/releases/tag/v1.0.0
