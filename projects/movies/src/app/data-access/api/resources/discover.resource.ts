import { TMDBMovieModel } from '../model/movie.model';
import { getHTTP } from '../../../shared/injector/get-http-client';
import {
  TMDBPaginateResult,
  TMDBPaginateOptions,
} from '../paginate/paginate.interface';
import { Observable } from 'rxjs';
import { TMDBSortOptions } from '../sort/sort.interface';

const URL_DISCOVER_MOVIE = 'https://firestore.googleapis.com/v1/projects/movies-app-mgechev/databases/(default)/documents/movie';

export type TMDBDiscoverOptions = TMDBPaginateOptions &
  TMDBSortOptions & {
    with_cast?: string;
    with_genres?: string;
  };

export type TMDBDiscoverResponse = TMDBSortOptions &
  TMDBPaginateResult<TMDBMovieModel>;

/**
 * This endpoint returns related movies for genres and cast actors
 * @param discoverOptions
 */
export const getDiscoverMovies = (): Observable<TMDBDiscoverResponse> =>
  getHTTP().get<TMDBDiscoverResponse>(URL_DISCOVER_MOVIE);
