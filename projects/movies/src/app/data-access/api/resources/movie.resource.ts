import { map, Observable } from 'rxjs';
import { TMDBMovieModel } from '../model/movie.model';
import { getHTTP } from '../../../shared/injector/get-http-client';
import {
  TMDBPaginateResult,
} from '../paginate/paginate.interface';
import { TMDBMovieCreditsModel } from '../model/movie-credits.model';
import { baseUrlApiV3 } from './internal/base-urls.constant';
import { TMDBAppendOptions } from './model/append-options';
import { mapDocuments } from './firestore-mapper';

const base = 'https://firestore.googleapis.com/v1/projects/movies-app-mgechev/databases/(default)/documents/movie';

const URL_MOVIE_CATEGORY = (_: string) => [base].join('/');
const URL_MOVIE = (id: string) => `${[base, id].join('/')}`;
const URL_MOVIE_CREDITS = 'https://firestore.googleapis.com/v1/projects/movies-app-mgechev/databases/(default)/documents/credit';
const URL_MOVIE_RECOMMENDATIONS = (id: string) =>
  [URL_MOVIE(id), 'recommendations'].join('/');
const URL_MOVIE_QUERY = (_: string) =>
  `${baseUrlApiV3}/search/movie`;

export type MovieResponse = TMDBMovieModel;
export const getMovie = (
  id: string,
  params: TMDBAppendOptions = { append_to_response: 'videos' }
): Observable<MovieResponse> =>
  getHTTP().get<MovieResponse>(URL_MOVIE(id), { params }).pipe(map(mapDocuments));

export type CreditsResponse = TMDBMovieCreditsModel;
export const getCredits = (): Observable<CreditsResponse> =>
  getHTTP().get<CreditsResponse>(URL_MOVIE_CREDITS).pipe(map(mapDocuments));

export type CategoryResponse = TMDBPaginateResult<TMDBMovieModel>;
export const getMovieCategory = (
  category: string,
): Observable<CategoryResponse> => {
  return getHTTP().get<CategoryResponse>(URL_MOVIE_CATEGORY(category)).pipe(map(mapDocuments));
};

export type RecommendationsResponse = TMDBPaginateResult<TMDBMovieModel>;
export const getMoviesRecommendations = (
  id: string,
): Observable<RecommendationsResponse> => {
  return getHTTP().get<RecommendationsResponse>(URL_MOVIE_RECOMMENDATIONS(id)).pipe(map(mapDocuments));
};

export const queryMovie = (query: string): Observable<MovieResponse[]> =>
  getHTTP()
    .get<{ results: MovieResponse[] }>(URL_MOVIE_QUERY(query))
    .pipe(map(mapDocuments));

