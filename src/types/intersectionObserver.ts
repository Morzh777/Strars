export interface IIntersectionObserverOptions {
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}
