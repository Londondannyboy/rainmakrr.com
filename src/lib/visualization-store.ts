/**
 * Visualization State Store
 *
 * Zustand-like reactive store for cross-filtering between visualizations.
 * Enables synchronized filtering across Capital Flow, Geo Map, and other viz components.
 */

// Filter state type
export interface VisualizationFilters {
  // Region filters
  regions: string[];
  // LP type filters
  lpTypes: string[];
  // Fund strategy filters
  fundStrategies: string[];
  // Time range
  timeRange: {
    start: Date | null;
    end: Date | null;
  };
  // Search query
  searchQuery: string;
  // Selected entities
  selectedAgentIds: string[];
  selectedDealIds: string[];
  // View mode
  viewMode: 'all' | 'filtered';
}

// Default filters
const defaultFilters: VisualizationFilters = {
  regions: [],
  lpTypes: [],
  fundStrategies: [],
  timeRange: {
    start: null,
    end: null
  },
  searchQuery: '',
  selectedAgentIds: [],
  selectedDealIds: [],
  viewMode: 'all'
};

// Subscribers
type Subscriber = (filters: VisualizationFilters) => void;
const subscribers = new Set<Subscriber>();

// Current state
let currentFilters: VisualizationFilters = { ...defaultFilters };

/**
 * Get current filters
 */
export function getFilters(): VisualizationFilters {
  return { ...currentFilters };
}

/**
 * Update filters and notify subscribers
 */
export function setFilters(updates: Partial<VisualizationFilters>): void {
  currentFilters = {
    ...currentFilters,
    ...updates
  };
  notifySubscribers();
}

/**
 * Reset all filters to default
 */
export function resetFilters(): void {
  currentFilters = { ...defaultFilters };
  notifySubscribers();
}

/**
 * Toggle a region filter
 */
export function toggleRegion(region: string): void {
  const regions = [...currentFilters.regions];
  const index = regions.indexOf(region);
  if (index === -1) {
    regions.push(region);
  } else {
    regions.splice(index, 1);
  }
  setFilters({ regions });
}

/**
 * Toggle an LP type filter
 */
export function toggleLpType(lpType: string): void {
  const lpTypes = [...currentFilters.lpTypes];
  const index = lpTypes.indexOf(lpType);
  if (index === -1) {
    lpTypes.push(lpType);
  } else {
    lpTypes.splice(index, 1);
  }
  setFilters({ lpTypes });
}

/**
 * Toggle a fund strategy filter
 */
export function toggleFundStrategy(strategy: string): void {
  const fundStrategies = [...currentFilters.fundStrategies];
  const index = fundStrategies.indexOf(strategy);
  if (index === -1) {
    fundStrategies.push(strategy);
  } else {
    fundStrategies.splice(index, 1);
  }
  setFilters({ fundStrategies });
}

/**
 * Select an agent (for highlighting across views)
 */
export function selectAgent(agentId: string, multiSelect = false): void {
  if (multiSelect) {
    const ids = [...currentFilters.selectedAgentIds];
    const index = ids.indexOf(agentId);
    if (index === -1) {
      ids.push(agentId);
    } else {
      ids.splice(index, 1);
    }
    setFilters({ selectedAgentIds: ids });
  } else {
    setFilters({
      selectedAgentIds: currentFilters.selectedAgentIds[0] === agentId ? [] : [agentId]
    });
  }
}

/**
 * Clear agent selection
 */
export function clearAgentSelection(): void {
  setFilters({ selectedAgentIds: [] });
}

/**
 * Set search query
 */
export function setSearchQuery(query: string): void {
  setFilters({ searchQuery: query });
}

/**
 * Set time range filter
 */
export function setTimeRange(start: Date | null, end: Date | null): void {
  setFilters({
    timeRange: { start, end }
  });
}

/**
 * Subscribe to filter changes
 * Returns unsubscribe function
 */
export function subscribe(callback: Subscriber): () => void {
  subscribers.add(callback);
  // Immediately call with current state
  callback(getFilters());

  return () => {
    subscribers.delete(callback);
  };
}

/**
 * Notify all subscribers of state change
 */
function notifySubscribers(): void {
  const filters = getFilters();
  subscribers.forEach(callback => {
    try {
      callback(filters);
    } catch (e) {
      console.error('Subscriber error:', e);
    }
  });
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(): boolean {
  return (
    currentFilters.regions.length > 0 ||
    currentFilters.lpTypes.length > 0 ||
    currentFilters.fundStrategies.length > 0 ||
    currentFilters.searchQuery.length > 0 ||
    currentFilters.timeRange.start !== null ||
    currentFilters.timeRange.end !== null
  );
}

/**
 * Get filter summary for display
 */
export function getFilterSummary(): string {
  const parts: string[] = [];

  if (currentFilters.regions.length > 0) {
    parts.push(`${currentFilters.regions.length} regions`);
  }
  if (currentFilters.lpTypes.length > 0) {
    parts.push(`${currentFilters.lpTypes.length} LP types`);
  }
  if (currentFilters.fundStrategies.length > 0) {
    parts.push(`${currentFilters.fundStrategies.length} strategies`);
  }
  if (currentFilters.searchQuery) {
    parts.push(`"${currentFilters.searchQuery}"`);
  }

  return parts.length > 0 ? parts.join(', ') : 'No filters';
}

// Export available filter options for UI components
export const REGIONS = [
  'North America',
  'Europe',
  'UK',
  'Asia Pacific',
  'Middle East',
  'Latin America',
  'Africa'
];

export const LP_TYPES = [
  'Pension Funds',
  'Endowments',
  'Sovereign Wealth',
  'Insurance',
  'Family Offices',
  'Fund of Funds'
];

export const FUND_STRATEGIES = [
  'Buyout',
  'Growth Equity',
  'Private Credit',
  'Infrastructure',
  'Real Estate',
  'Venture Capital'
];
