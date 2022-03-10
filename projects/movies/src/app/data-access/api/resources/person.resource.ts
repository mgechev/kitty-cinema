import { map, Observable } from 'rxjs';
import { TMDBPersonModel } from '../model/person.model';
import { getHTTP } from '../../../shared/injector/get-http-client';
import { mapDocuments } from './firestore-mapper';

export type PersonResponse = TMDBPersonModel;

const URL_PERSON = (id: string) => `${['https://firestore.googleapis.com/v1/projects/movies-app-mgechev/databases/(default)/documents/credit', id].join('/')}`;

export const getPerson = (
  id: string,
): Observable<PersonResponse> => {
  return getHTTP().get<PersonResponse>(URL_PERSON(id)).pipe(map(data => mapDocuments(data)));
};
