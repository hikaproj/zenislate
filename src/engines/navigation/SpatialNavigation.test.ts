import { describe, it, expect, beforeEach } from 'vitest';
import { SpatialNavigationEngine } from './SpatialNavigation';

describe('SpatialNavigationEngine', () => {
  let navEngine: SpatialNavigationEngine;

  beforeEach(() => {
    document.body.innerHTML = '';
    navEngine = new SpatialNavigationEngine();
  });

  it('initializes and detects focusable elements', () => {
    document.body.innerHTML = `
      <button data-focusable="true" id="btn1">Button 1</button>
      <button data-focusable="true" id="btn2">Button 2</button>
    `;

    const btn1 = document.getElementById('btn1') as HTMLElement;
    btn1.focus();
    expect(document.activeElement).toBe(btn1);
  });

  it('triggers click on Enter key', () => {
    let clicked = false;
    document.body.innerHTML = `
      <button data-focusable="true" id="btn1">Button 1</button>
    `;
    const btn1 = document.getElementById('btn1') as HTMLElement;
    btn1.addEventListener('click', () => {
      clicked = true;
    });
    btn1.focus();

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    navEngine.handleKeyDown(enterEvent);

    expect(clicked).toBe(true);
  });

  it('navigates to the nearest element in direction when arrow keys are pressed', () => {
    document.body.innerHTML = `
      <div style="position: relative;">
        <button data-focusable="true" id="btn1">Button 1</button>
        <button data-focusable="true" id="btn2">Button 2</button>
      </div>
    `;

    const btn1 = document.getElementById('btn1') as HTMLElement;
    const btn2 = document.getElementById('btn2') as HTMLElement;

    // Mock getBoundingClientRect
    btn1.getBoundingClientRect = () => ({
      top: 10, bottom: 40, left: 10, right: 100, width: 90, height: 30, x: 10, y: 10, toJSON: () => {}
    });
    btn2.getBoundingClientRect = () => ({
      top: 10, bottom: 40, left: 120, right: 210, width: 90, height: 30, x: 120, y: 10, toJSON: () => {}
    });

    btn1.focus();
    const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
    navEngine.handleKeyDown(rightEvent);

    expect(document.activeElement).toBe(btn2);
  });
});
