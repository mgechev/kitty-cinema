import { endWith, Observable, startWith } from 'rxjs';

export type LoadingState<K extends string | DefaultLoadingProp> = { [k in K]: boolean };

type DefaultLoadingProp = string & 'loading';
const defaultLoadingProp:DefaultLoadingProp = 'loading';

export function withLoadingEmission<T extends {}, K extends string = DefaultLoadingProp>(property?: K) {
  const _property = property === undefined ? defaultLoadingProp as DefaultLoadingProp : property;

  const start = { [_property]: true } as T & LoadingState<K>;
  const end = { [_property]: false } as T & LoadingState<K>;

  return (o$: Observable<T>) => (o$ as Observable<T & LoadingState<K>>).pipe(startWith(start), endWith(end));
}
