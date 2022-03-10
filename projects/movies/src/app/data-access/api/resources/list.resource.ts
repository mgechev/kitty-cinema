import { map, Observable } from 'rxjs';
import { getHTTP } from '../../../shared/injector/get-http-client';
import {
  TMDBAddMovieToListParams,
  TMDBListCreateUpdateParams,
  TMDBListModel,
} from '../model/list.model';
import { mapDocuments } from './firestore-mapper';

export type ListCreateResponse = { id: number };


const URL_LIST_BASE = 'https://firestore.googleapis.com/v1/projects/movies-app-mgechev/databases/(default)/documents/movie';

export const createList = (
  params: TMDBListCreateUpdateParams
): Observable<number> =>
  getHTTP()
    .post<ListCreateResponse>(URL_LIST_BASE, params)
    .pipe(map(({ id }) => id));

export const fetchList = (): Observable<Record<string, TMDBListModel>> =>
  getHTTP()
    .get<TMDBListModel>(URL_LIST_BASE)
    .pipe(map(data => mapDocuments(data, false)));

export const updateList = (params: TMDBListCreateUpdateParams) =>
  getHTTP().put(URL_LIST_BASE, params);

export const addMovieToList = (params: TMDBAddMovieToListParams) =>
  getHTTP().post(URL_LIST_BASE, params);
export const deleteMovieFromList = (params: TMDBAddMovieToListParams) =>
  getHTTP().delete(URL_LIST_BASE, { body: params });

export const deleteList = () =>
  getHTTP().delete(URL_LIST_BASE);
