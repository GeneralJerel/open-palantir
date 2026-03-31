import { useCopilotAction } from '@copilotkit/react-core';

export function useSearchEventsAction() {
  useCopilotAction({
    name: 'searchGlobalEvents',
    description:
      'Search across all data feeds (news, conflicts, markets, disasters, cyber) for events matching a query. Returns up to 10 matching results.',
    parameters: [
      {
        name: 'query',
        type: 'string',
        description: 'Search query (e.g. "Taiwan strait military", "oil price spike", "earthquake")',
        required: true,
      },
      {
        name: 'domain',
        type: 'string',
        description:
          'Optional domain filter: "all", "conflict", "market", "climate", "cyber", "aviation", "maritime"',
        required: false,
      },
    ],
    handler: async ({ query, domain }) => {
      return new Promise<string>((resolve) => {
        const handler = (e: Event) => {
          window.removeEventListener('copilot:search-results', handler);
          const results = (e as CustomEvent).detail?.results ?? [];
          if (results.length === 0) {
            resolve(`No results found for "${query}"`);
          } else {
            resolve(JSON.stringify(results.slice(0, 10), null, 2));
          }
        };
        window.addEventListener('copilot:search-results', handler);

        window.dispatchEvent(
          new CustomEvent('copilot:search', {
            detail: { query, domain: domain ?? 'all' },
          }),
        );

        // Timeout fallback
        setTimeout(() => {
          window.removeEventListener('copilot:search-results', handler);
          resolve(`Search for "${query}" timed out — the data may still be loading.`);
        }, 8000);
      });
    },
  });
}
