# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

As this project is a user-facing application, the places in the semantic versioning number `MAJOR`.`MINOR`.`PATCH` are redefined as follows:

- `MAJOR` denotes changes that are expected to significantly disrupt the flow of a returning user with some experience of the application, _or_ that significantly affects the development workflow
- `MINOR` denotes changes that may affect the user experience _or_ the development workflow
- `PATCH` denotes changes that are insignificant to the user experience or the develpment workflow

## [Unreleased]

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