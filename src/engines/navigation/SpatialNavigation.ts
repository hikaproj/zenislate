/**
 * Zenislate - TV Remote Spatial Navigation Engine (D-pad)
 * Created by Hikaproj
 * License: MIT
 */

export class SpatialNavigationEngine {
  private focusableSelector = '[data-focusable="true"]';
  private isEnabled = true;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  public enable(): void {
    if (this.isEnabled) return;
    this.isEnabled = true;
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown);
    }
  }

  public disable(): void {
    this.isEnabled = false;
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
  }

  public focusDefault(): void {
    if (typeof document === 'undefined') return;
    const focusables = Array.from(document.querySelectorAll(this.focusableSelector)) as HTMLElement[];
    if (focusables.length > 0) {
      focusables[0].focus();
    }
  }

  public handleKeyDown(event: KeyboardEvent): void {
    if (!this.isEnabled) return;
    const key = event.key;

    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(key)) {
      return;
    }

    const currentEl = document.activeElement as HTMLElement | null;
    const focusables = (Array.from(
      document.querySelectorAll(this.focusableSelector)
    ) as HTMLElement[]).filter((el) => {
      // Must be attached to DOM, visible, and enabled
      const isVisible = el.offsetParent !== null || el.isConnected;
      return (
        isVisible &&
        !el.hasAttribute('disabled') &&
        el.getAttribute('aria-hidden') !== 'true'
      );
    });

    if (focusables.length === 0) return;

    // If nothing currently focused, focus the first focusable element
    if (!currentEl || !focusables.includes(currentEl)) {
      focusables[0].focus();
      return;
    }

    // Enter key triggers click
    if (key === 'Enter') {
      currentEl.click();
      return;
    }

    // Directional move
    event.preventDefault();
    const currentRect = currentEl.getBoundingClientRect();
    let bestEl: HTMLElement | null = null;
    let minDistance = Infinity;

    for (const el of focusables) {
      if (el === currentEl) continue;
      const rect = el.getBoundingClientRect();

      // Check geometric direction
      const isMatch =
        (key === 'ArrowUp' && rect.bottom <= currentRect.top + 5) ||
        (key === 'ArrowDown' && rect.top >= currentRect.bottom - 5) ||
        (key === 'ArrowLeft' && rect.right <= currentRect.left + 5) ||
        (key === 'ArrowRight' && rect.left >= currentRect.right - 5);

      if (!isMatch) continue;

      // 2D distance calculation with primary axis weighting
      const dx = (rect.left + rect.width / 2) - (currentRect.left + currentRect.width / 2);
      const dy = (rect.top + rect.height / 2) - (currentRect.top + currentRect.height / 2);

      const distance = (key === 'ArrowLeft' || key === 'ArrowRight')
        ? Math.abs(dx) + Math.abs(dy) * 2.5
        : Math.abs(dy) + Math.abs(dx) * 2.5;

      if (distance < minDistance) {
        minDistance = distance;
        bestEl = el;
      }
    }

    if (bestEl) {
      bestEl.focus();
      if (typeof bestEl.scrollIntoView === 'function') {
        bestEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }
  }
}

export const spatialNav = new SpatialNavigationEngine();
