# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

As this project is a user-facing application, the places in the semantic versioning number `MAJOR`.`MINOR`.`PATCH` are redefined as follows:

- `MAJOR` denotes changes that are expected to significantly disrupt the flow of a returning user with some experience of the application, _or_ that significantly affects the development workflow
- `MINOR` denotes changes that may affect the user experience _or_ the development workflow
- `PATCH` denotes changes that are insignificant to the user experience or the develpment workflow

## [Unreleased]

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

[unreleased]: https://github.com/gu-gridh/queerlit-gui/compare/v1.5.0...HEAD
[1.5.0]: https://github.com/gu-gridh/queerlit-gui/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/gu-gridh/queerlit-gui/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/gu-gridh/queerlit-gui/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/gu-gridh/queerlit-gui/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/gu-gridh/queerlit-gui/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/gu-gridh/queerlit-gui/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/gu-gridh/queerlit-gui/releases/tag/v1.0.0
