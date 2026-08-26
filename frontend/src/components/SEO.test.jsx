import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import SEO from './SEO';

test('refreshes article timestamps when only the review date changes', async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement('div');
  const root = createRoot(container);
  const props = {title: 'Career guide', description: 'Guide description', type: 'article', path: '/blog/example', publishedTime: '2026-06-22'};
  try {
    await act(async () => root.render(<SEO {...props} modifiedTime="2026-06-22" />));
    expect(document.querySelector('meta[property="article:modified_time"]').content).toBe('2026-06-22');
    await act(async () => root.render(<SEO {...props} modifiedTime="2026-08-26" />));
    expect(document.querySelector('meta[property="article:modified_time"]').content).toBe('2026-08-26');
    expect(document.querySelector('meta[property="article:published_time"]').content).toBe('2026-06-22');
  } finally {
    await act(async () => root.unmount());
    document.head.querySelectorAll('meta[property^="article:"]').forEach(node => node.remove());
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  }
});
