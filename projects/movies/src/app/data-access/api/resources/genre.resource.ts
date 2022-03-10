import { map, Observable } from 'rxjs';
import { TMDBMovieGenreModel } from '../model/movie-genre.model';
import { getHTTP } from '../../../shared/injector/get-http-client';
import { staticRequest } from '../staticRequest';
import { toDictionary } from '@rx-angular/cdk/transformations';
import { mapDocuments } from './firestore-mapper';

export type GenresResponse = TMDBMovieGenreModel[];
type GenresServerResponse = { genres: GenresResponse };

const URL_GENRE_MOVIE_LIST = 'https://firestore.googleapis.com/v1/projects/movies-app-mgechev/databases/(default)/documents/genre';

export const getGenres = (): Observable<GenresResponse> =>
  getHTTP()
    .get<GenresServerResponse>(URL_GENRE_MOVIE_LIST)
    .pipe(map(mapDocuments));

export const getGenresCached = staticRequest(getGenres);

export const getGenresDictionaryCached = () =>
  getGenresCached().pipe(
    map((i: TMDBMovieGenreModel[]) => toDictionary(i, 'id'))
  ) as any as Observable<{
    [key: string]: TMDBMovieGenreModel;
  }>;
