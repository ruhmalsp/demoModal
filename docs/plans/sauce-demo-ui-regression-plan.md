# Test Plan: Sauce Demo UI Smoke and Regression Expansion

**Target environment:** Configured Dev environment; run only when `APP_PROFILE=sauce-demo` and its validated UI target is the approved Sauce Demo practice site.  
**Framework profile:** `sauce-demo`  
**Date:** 2026-10-09

## Overview

This UI-only plan adds distinct smoke, regression, negative, and boundary coverage for the existing Sauce Demo profile. The current framework already covers invalid and locked-user login, the approved inventory sample and product count, ascending price sort, and a successful demo checkout; the scenarios below focus on gaps around successful authentication, cart state, other sorting, and checkout validation.

The configured local target could not be verified from the available environment-validation interface in this planning session, so no browser exploration was performed. Scenarios are based on the checked-in Sauce Demo Page Objects, existing UI specs, and approved test data. Before execution, confirm the active non-production configuration selects the Sauce Demo profile; do not use a URL copied from this plan.

## Preconditions

- `APP_ENV` is `dev`, `qa`, or `staging`, never `production`.
- `APP_PROFILE=sauce-demo`, and the selected environment's configured UI target is an approved Sauce Demo practice environment.
- Any valid and invalid test account values are supplied by the existing environment-backed credential configuration; do not place credentials in plans, specs, or expected-data JSON.
- Each test starts with a fresh isolated browser context. Tests requiring a signed-in session use the `authenticatedPage` fixture; login-validation tests use `loginPage` without authenticating first.
- Checkout tests use only synthetic data already approved for the practice application. Do not enter real personal, payment, or account data.
- Existing catalog values and expected UI copy remain sourced from `tests/data/demo.json` where already defined. Any new expected value must be verified and approved before adding it.

## Scenarios

### Feature group 1 — Authentication

#### Scenario SD-UI-001 — Valid demo user can sign in

- **Priority:** P0
- **Tags:** `@smoke` `@regression`
- **Preconditions:** Fresh unauthenticated browser context; approved non-production demo credentials available through environment configuration.
- **Steps:**
  1. Open the login page — expected: the login form is visible.
  2. Enter the configured valid demo credentials and submit — expected: navigation reaches the authenticated inventory view.
- **Assertions:**
  - Inventory page heading is visible with the approved inventory title.
  - The inventory contains the approved number of product cards from `tests/data/demo.json`.
- **Edge cases considered:** Existing invalid-password and locked-account cases remain separate; do not emit credential values in test output.

### Feature group 2 — Cart

#### Scenario SD-UI-002 — Add two distinct products and verify cart contents

- **Priority:** P1
- **Tags:** `@regression`
- **Preconditions:** Authenticated demo user; two distinct products are present in the inventory.
- **Steps:**
  1. Add two distinct products — expected: each selected row reflects its added state and the cart count reflects two items.
  2. Open the cart — expected: both selected products appear, with no unselected product included.
- **Assertions:**
  - Cart badge/count equals the number of selected products.
  - Cart product names match the two selections, each exactly once.
- **Edge cases considered:** Do not assume item ordering unless the application contract confirms it.

#### Scenario SD-UI-003 — Removing the last cart item returns the cart to empty

- **Priority:** P1
- **Tags:** `@regression` `@boundary`
- **Preconditions:** Authenticated demo user; cart contains exactly one item added by this test.
- **Steps:**
  1. Open the cart and remove its sole item — expected: the item is no longer listed.
  2. Observe the cart indicator and available actions — expected: the cart represents zero items.
- **Assertions:**
  - Cart item count is zero.
  - The cart badge is absent or displays zero, according to the confirmed application behavior.
- **Edge cases considered:** The exact zero-count badge behavior needs live confirmation; do not encode either absence or a zero label until confirmed.

### Feature group 3 — Inventory ordering

#### Scenario SD-UI-004 — Sort inventory by product name in both directions

- **Priority:** P2
- **Tags:** `@regression`
- **Preconditions:** Authenticated demo user; the approved inventory list is visible.
- **Steps:**
  1. Select name ascending — expected: visible product names are ordered alphabetically.
  2. Select name descending — expected: visible product names are ordered in reverse alphabetical order.
- **Assertions:**
  - The displayed product-name sequence equals its independently computed ascending sequence.
  - The descending sequence equals the reverse alphabetical sequence.
- **Edge cases considered:** Use locale-aware comparison only if the existing data contains names that require it; confirm treatment of equal names before asserting tie order.

### Feature group 4 — Checkout validation

#### Scenario SD-UI-005 — Required customer details prevent continuing checkout

- **Priority:** P1
- **Tags:** `@regression` `@negative`
- **Preconditions:** Authenticated demo user; at least one item in the cart; checkout information page is open.
- **Steps:**
  1. Submit the information form with all fields blank — expected: checkout does not advance and the application displays its validation feedback.
  2. Enter only one required field and submit — expected: checkout remains on the information step and indicates the next missing required field.
- **Assertions:**
  - The URL remains on the checkout-information route after each invalid submission.
  - A visible validation message identifies the missing field or the form error state.
- **Edge cases considered:** Exact message text and validation order are not established by current approved test data; confirm them before writing exact-text assertions.

#### Scenario SD-UI-006 — Postal code boundary input is validated

- **Priority:** P2
- **Tags:** `@regression` `@negative` `@boundary`
- **Preconditions:** Authenticated demo user; cart contains an item; checkout information form is open.
- **Steps:**
  1. Submit the form with the postal-code field empty and the other required values supplied — expected: application validation is shown and checkout does not advance.
  2. Try a boundary value only after the application's accepted postal-code format and length are confirmed — expected: acceptance/rejection follows that documented rule.
- **Assertions:**
  - Empty postal code prevents progression if it is confirmed required.
  - For non-empty boundary values, assert the observed/documented validation outcome; do not infer a length, format, or character restriction.
- **Edge cases considered:** Minimum/maximum length, spaces, and non-numeric characters remain open until confirmed from the application contract.

## Not covered (and why)

- API scenarios: scope requested is UI only.
- Persistent order, payment, account creation, or real-user data: unsafe and unnecessary for this public practice target.
- Sauce Demo application-specific broken-user behavior: not part of the currently approved expected data; needs explicit expected-behavior confirmation.
- Live DOM/locator confirmation: not performed because the active local target/profile could not be verified through the available environment guard interface.

## Open questions

- Confirm that the active configured Dev target and `APP_PROFILE` select the intended Sauce Demo practice application before browser exploration or test execution.
- Confirm whether removing the last cart item hides the cart badge or shows a zero count.
- Confirm checkout validation messages, validation order, and postal-code constraints before approving exact expected strings or boundary values.
- Confirm the correct `P0`/`P1`/`P2` mapping used by the project if priority tags are added to generated test titles.
