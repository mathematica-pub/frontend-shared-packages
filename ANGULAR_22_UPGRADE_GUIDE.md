# Angular v22 Upgrade Guide

## Current State
- **Angular Version**: 21.2.4
- **Nx Version**: 22.0.0 (will upgrade to v23.0.0)
- **TypeScript Version**: 5.9.3

## Important: Angular v22 Requires Nx v23

**Angular v22 requires Nx v23.0.0 or higher.** Nx v22.x only supports Angular up to v21.

- **Nx v23.0.0 is now stable** (released June 16, 2026)
- You must upgrade Nx to v23 before upgrading Angular to v22
- Migration file version strings like "23.0.0-beta.10" are just internal identifiers from when those migrations were developed during the beta cycle - they're part of the stable v23.0.0 release

## Step-by-Step Upgrade Process

### 1. Pre-Upgrade Preparation
- Ensure all changes are committed to git (clean working tree)
- Run your tests to establish a baseline: `npm test` or `nx run-many -t test`
- Document any custom configurations or workarounds you have
- Create a new branch: `git checkout -b upgrade/angular-22`

### 2. Update Nx to v23.0.0 (Required for Angular v22)
```bash
nx migrate @nx/workspace@latest
```

This will generate a `migrations.json` file with Nx v23 migrations. The migration version strings (like "23.0.0-beta.10") are just internal identifiers - **Nx v23.0.0 is stable**.

**Important**: When prompted "Which packages would you like to migrate?", choose **"All (required and optional)"** to ensure all dependencies are properly aligned.

**Note about the migrations.json**: You may see version strings like "23.0.0-beta.10" or "23.0.0-beta.25" in the migrations file. These are NOT beta releases - they're just the internal version identifiers from when these migrations were developed. They are part of the stable Nx v23.0.0 release.

### 3. Install Updated Dependencies
```bash
npm install
```

If you encounter peer dependency conflicts, you may need:
```bash
npm install --legacy-peer-deps
```

This is normal during major version upgrades as some dependencies may not have updated their peer dependency ranges yet.

### 4. Run Nx Migrations
```bash
nx migrate --run-migrations
```

This executes all the Nx v23 migrations. Review the changes made.

### 5. Clean Up Nx Migrations
```bash
rm migrations.json
```

Delete the Nx migrations file before running Angular migrations.

### 6. Run Angular Migration
```bash
nx migrate @angular/core@22
```
This generates a new `migrations.json` file with Angular-specific updates.

### 7. Review Angular migrations.json
- Open `migrations.json` and review what changes will be made
- Check for any breaking changes that might affect your codebase
- Note any custom migrations specific to your packages
- See "Migration Details" section below for explanations

### 8. Install Angular Updated Dependencies
```bash
npm install
```
This installs the versions specified in the migration

### 9. Run the Angular Migrations
```bash
nx migrate --run-migrations
```
This executes all the automated code transformations

### 10. Update Angular ESLint (if needed)
Since you're on `@angular-eslint/builder@21.0.0`, you'll likely need to update to v22:
```bash
npm install --save-dev @angular-eslint/builder@^22.0.0 @angular-eslint/eslint-plugin@^22.0.0 @angular-eslint/eslint-plugin-template@^22.0.0 @angular-eslint/schematics@^22.0.0 @angular-eslint/template-parser@^22.0.0
```

### 11. Update Peer Dependencies
Check and update these related packages:
- `@angular/cdk` and `@angular/material` to v22.x
- `@schematics/angular` to v22.x
- `ng-packagr` to the version compatible with Angular 22
- `zone.js` to the recommended version (check Angular 22 docs)

### 12. Fix TypeScript Compilation Issues
```bash
nx run-many -t build
```
- Address any TypeScript errors that surface
- Common issues: stricter types, deprecated APIs, removed features

### 13. Update tsconfig.json Files
- Review `tsconfig.base.json`, `tsconfig.json`, and any lib-specific tsconfig files
- Ensure compiler options match Angular 22 requirements
- You're already on TypeScript 5.9.3, which should be compatible

### 14. Fix Linting Issues
```bash
nx run-many -t lint
```
- Address any new ESLint warnings/errors
- Update any custom lint rules if necessary

### 15. Run Tests
```bash
nx run-many -t test
```
- Fix any failing tests
- Look for deprecated testing APIs
- Update test configurations if needed

### 16. Run Cypress Tests
```bash
nx run-many -t component-test
nx run-many -t e2e
```
- Verify component tests still pass
- Check end-to-end tests

### 17. Test Your Demo Apps
```bash
npm run start:demo-app
npm run start:my-work
```
- Manually test functionality
- Look for console errors or warnings
- Verify all features work as expected

### 18. Review Breaking Changes
- Read the [Angular 22 changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- Check for any breaking changes affecting your packages:
  - `@ag-grid-data/app-kit`
  - `@ag-grid-data/ui`
  - `@ag-grid-data/viz`

### 19. Update Your Libraries' package.json
- Update peer dependency ranges in each library's `package.json`
- Typically should be `"@angular/core": "^22.0.0"` for v22

### 20. Clean Up
```bash
rm migrations.json
npm install
```
- Delete the migrations file
- Run a fresh install to ensure lock file is updated

### 21. Rebuild Everything
```bash
nx run-many -t build
```
- Ensure all libraries build successfully
- Check output for any warnings

### 22. Update Documentation
- Update README files with new Angular version requirement
- Update any installation/setup docs
- Document any breaking changes for library consumers

### 23. Commit Changes
```bash
git add .
git commit -m "chore: upgrade to Angular v22"
```

### 24. Test in CI/CD
- Push your branch
- Ensure all CI/CD pipelines pass
- Review any Slack notifications for build status

---

## Angular v22 Migration Details

Your `migrations.json` contains 8 automated migrations that will run when you execute `nx migrate --run-migrations`. Here's what each one does:

### 1. **change-detection-eager** ⚠️ IMPORTANT
**What it does:**
- Adds `ChangeDetectionStrategy.Eager` to all components that don't explicitly set a change detection strategy

**Why this exists:**
- Angular v22 changes the **default** change detection strategy from `Default` to `OnPush`
- This is a major behavioral change that could break existing components
- The migration preserves v21 behavior by explicitly setting components to use "eager" (the old default)

**Implications:**
- **Performance**: Components with `Eager` strategy check for changes on every change detection cycle (old behavior)
- **Breaking Change Prevention**: This migration prevents your app from breaking by maintaining the old behavior
- **Future Optimization Opportunity**: After the upgrade, you can gradually convert components to `OnPush` for better performance

**What you should do:**
1. Let the migration run to preserve existing behavior
2. After the upgrade, audit your components and consider converting them to `OnPush` for better performance
3. Components that would benefit most from `OnPush`:
   - Components with expensive rendering
   - Components that don't depend on external data changes
   - Pure display components

**Example of what the migration does:**
```typescript
// BEFORE (v21)
@Component({
  selector: 'app-my-component',
  template: '...'
})
export class MyComponent { }

// AFTER (v22 with migration)
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-my-component',
  template: '...',
  changeDetection: ChangeDetectionStrategy.Eager  // ← Added by migration
})
export class MyComponent { }
```

---

### 2. **http-xhr-backend**
**What it does:**
- Adds `withXhr()` to `provideHttpClient()` calls when `HttpXhrBackend` is used

**Why this exists:**
- Angular v22 changes the default HTTP backend
- If your code relies on the XMLHttpRequest (XHR) backend, this ensures it continues to work

**Implications:**
- Minimal impact unless you have custom HTTP interceptors that depend on XHR specifics
- The migration will automatically detect and update your code

**Example:**
```typescript
// BEFORE
provideHttpClient()

// AFTER (if XHR backend is detected)
provideHttpClient(withXhr())
```

---

### 3. **strict-templates-default**
**What it does:**
- Adds `strictTemplates: false` to `tsconfig.json` if not already set

**Why this exists:**
- Angular v22 enables strict template type checking by default
- This can cause compilation errors in templates that have type mismatches

**Implications:**
- **Type Safety**: Disabling this preserves v21 behavior (less strict)
- **Future Work**: You should gradually fix template type issues and enable `strictTemplates: true`
- This is a compiler setting, not a runtime behavior change

**What you should do:**
1. Let the migration disable strict templates initially
2. After the upgrade stabilizes, enable `strictTemplates: true` and fix any errors
3. This will improve type safety in your templates

---

### 4. **can-match-snapshot-required**
**What it does:**
- Adds a required third argument to `canMatch` guard function calls

**Why this exists:**
- The `canMatch` route guard signature changed in v22
- The third parameter (route snapshot) is now required

**Implications:**
- Only affects code using `canMatch` route guards
- The migration will automatically update your guard signatures

**Example:**
```typescript
// BEFORE
canMatch: (route, segments) => { ... }

// AFTER
canMatch: (route, segments, state) => { ... }
```

---

### 5. **incremental-hydration**
**What it does:**
- Adds `withNoIncrementalHydration()` to `provideClientHydration()` when incremental hydration is not enabled

**Why this exists:**
- Angular v22 enables incremental hydration by default
- This migration preserves v21 behavior (no incremental hydration)

**Implications:**
- Only affects server-side rendering (SSR) applications
- If you're not using SSR, this won't impact you
- If you are using SSR, you can explore incremental hydration benefits later

**Example:**
```typescript
// BEFORE
provideClientHydration()

// AFTER
provideClientHydration(withNoIncrementalHydration())
```

---

### 6. **strict-safe-navigation-narrow**
**What it does:**
- Disables the `nullishCoalescingNotNullable` and `optionalChainNotNullable` extended diagnostics

**Why this exists:**
- Angular v22 adds stricter null safety checks in templates
- These new diagnostics can flag false positives in existing code

**Implications:**
- Prevents compilation errors from new, stricter null checks
- You should review these warnings later and fix legitimate issues

---

### 7. **model-output**
**What it does:**
- Migrates broken duplicate outputs (related to the new `model()` API)

**Why this exists:**
- Angular v22 introduces the `model()` API for two-way binding
- This migration fixes conflicts with duplicate output declarations

**Implications:**
- Only affects code using the new `model()` API
- Likely minimal impact on existing v21 code

---

### 8. **safe-optional-chaining**
**What it does:**
- Wraps optional chaining expressions in templates with `$safeNavigationMigration()`

**Why this exists:**
- Angular v22 changes how optional chaining is handled in templates
- This ensures the behavior remains consistent with v21

**Implications:**
- Template expressions using `?.` will be wrapped for safety
- This is a compatibility shim that you can remove after thorough testing

**Example:**
```typescript
// BEFORE
{{ user?.name }}

// AFTER
{{ $safeNavigationMigration(user?.name) }}
```

---

## Important Notes

### Dependencies to Watch
- **RxJS**: Currently on `rxjs@7.5.0` - Angular 22 may require a newer version (check compatibility)
- **Zone.js**: Currently on `0.15.0` - verify this is compatible with Angular 22
- **Nx**: Will be upgraded to v23.0.0 (required for Angular 22 support)
- **TypeScript**: Angular v22 requires TypeScript 6.0+, which will be automatically upgraded

### Breaking Changes to Watch For

**Nx v23 Breaking Changes:**
- Some internal import paths changed (handled by migrations)
- Module federation imports moved to new package (handled by migrations)
- NgRx generator defaults split (handled by migrations)

**Angular v22 Breaking Changes:**
- **Default Change Detection**: Now `OnPush` instead of `Default` (handled by migration)
- **Strict Templates**: Now enabled by default (disabled by migration)
- **HTTP Backend**: May have changed defaults (handled by migration)
- **TypeScript 6.0**: Required version (will be auto-upgraded)

### Testing Strategy
1. Run all unit tests: `nx run-many -t test`
2. Run all component tests: `nx run-many -t component-test`
3. Manually test all three packages:
   - `@ag-grid-data/app-kit`
   - `@ag-grid-data/ui`
   - `@ag-grid-data/viz`
4. Test demo applications thoroughly
5. Check for console warnings/errors in browser

### Post-Upgrade Optimization Opportunities
After the upgrade is stable, consider:
1. **Converting components to OnPush**: Better performance
2. **Enabling strict templates**: Better type safety
3. **Removing migration shims**: Cleaner code once verified
4. **Updating RxJS**: Take advantage of newer features
5. **Exploring incremental hydration**: If using SSR

---

## Rollback Plan

If the upgrade fails:
```bash
git checkout main
git branch -D upgrade/angular-22
npm install
```

Then troubleshoot the specific issues before retrying.

## Quick Command Summary

```bash
# 1. Create branch
git checkout -b upgrade/angular-22

# 2. Upgrade Nx to v23
nx migrate @nx/workspace@latest

# 3. Install dependencies (choose "All" when prompted)
npm install

# 4. Run Nx migrations
nx migrate --run-migrations
rm migrations.json

# 5. Upgrade Angular to v22
nx migrate @angular/core@22

# 6. Install Angular dependencies
npm install

# 7. Run Angular migrations
nx migrate --run-migrations
rm migrations.json

# 8. Build and test
nx run-many -t build
nx run-many -t test
nx run-many -t lint

# 9. Commit
git add .
git commit -m "chore: upgrade to Nx v23 and Angular v22"
```

---

## Success Criteria

The upgrade is complete when:
- ✅ All packages build without errors
- ✅ All tests pass (unit, component, e2e)
- ✅ Demo apps run without console errors
- ✅ CI/CD pipelines pass
- ✅ No runtime errors in production-like environment

---

## Resources
- [Angular 22 Release Notes](https://github.com/angular/angular/releases)
- [Angular Update Guide](https://angular.dev/update-guide)
- [Nx Migration Guide](https://nx.dev/recipes/angular/migration)
