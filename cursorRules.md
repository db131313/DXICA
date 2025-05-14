# Cursor Development Rules & Guidelines

## GENERAL PRINCIPLES

This is a web application.

- UI and UX must be fully responsive, from mobile screens (min 300px width) to large desktop displays (max 2400px width)
- Prioritize speed and performance. Loading times should never feel slow or janky

## DESIGN & STYLING

Use Tailwind CSS as the default styling framework.

Use Flexbox and CSS Grid fluidly where appropriate.

### UI Component Requirements
All UI components must:
- Look great on mobile and desktop
- Be fluid, adaptive, and pixel-perfect
- Use minimal and optimized animation

## ANIMATIONS

All animations must:
- Be smooth, non-blocking, and non-jittery
- Avoid introducing performance issues or layout shift

## PERFORMANCE

Code should:
- Be lightweight, modular, and efficient
- Defer or lazy-load where possible
- Prioritize critical rendering paths

## CORE FEATURES TO BUILD

### User Authentication
- Sign up
- Log in
- Email verification & password recovery

### User Accounts
- Every user gets a unique URL (e.g. app.com/username)

### Notifications
- Email notifications triggered by relevant user actions

### Paid Features
- Tiered pricing model (free + premium)
- Payment integration and flow (Stripe or equivalent)

### API Integration System
- App will support 100+ APIs
- Must be designed with extensibility in mind
- Expect frequent addition of new APIs
- API modules should be encapsulated and scalable

## DEVELOPMENT RULES

1. Use modular, maintainable file structures
2. Follow DRY and KISS principles
3. Document every major logic block inline
4. Version and label core changes clearly for tracking
5. Use environment variables and config files for API credentials

## CURSOR-SPECIFIC BEHAVIOR

Cursor should refer to these rules whenever interpreting:
- UI component design
- API integration structure
- Performance-related code choices
- Layout responsiveness requirements

These rules serve as persistent guidance throughout the app lifecycle.

## Implementation Checklist

### Responsive Design
- [ ] Mobile-first approach (300px minimum width)
- [ ] Tablet optimization
- [ ] Desktop optimization (up to 2400px)
- [ ] No horizontal scrolling on any viewport
- [ ] Touch-friendly on mobile devices

### Performance Metrics
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] No layout shift during loading
- [ ] Optimized asset loading
- [ ] Efficient code splitting

### Code Quality
- [ ] ESLint configuration
- [ ] Prettier configuration
- [ ] TypeScript strict mode
- [ ] Unit test coverage
- [ ] E2E test setup

### Security
- [ ] HTTPS enforcement
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Input sanitization
- [ ] Secure authentication flow

### API Integration
- [ ] Modular API architecture
- [ ] Rate limiting handling
- [ ] Error boundary implementation
- [ ] Retry mechanism
- [ ] Caching strategy

### State Management
- [ ] Centralized store setup
- [ ] Action creators defined
- [ ] Reducer implementation
- [ ] Middleware configuration
- [ ] Dev tools integration