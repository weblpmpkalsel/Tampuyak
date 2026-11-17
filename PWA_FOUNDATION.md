# TAMPUYAK OS - PWA Foundation

## Overview
Phase 1-8 implemented. The application is now a Progressive Web Application.

## Service Worker
Integrated `vite-plugin-pwa` generating an automated service worker using Workbox.
Static assets and shell are cached, business data bypassed.

## Native Experience
- `overscroll-behavior-y: none` applied.
- `-webkit-user-select: none` enabled (except for inputs/contentedible).
- `env(safe-area-inset-top/bottom)` enabled for edge-to-edge mobile feel.
- Added custom responsive CSS layers for seamless adaptation.

## Offline Foundation
The service worker ensures the application shell loads immediately even with zero connectivity. A custom offline fallback UI is ready when network fetches fail.
