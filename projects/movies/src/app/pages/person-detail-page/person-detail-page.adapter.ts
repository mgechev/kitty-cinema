import { RxState, selectSlice } from '@rx-angular/state';
import { TMDBMovieModel } from '../../data-access/api/model/movie.model';
import { Injectable } from '@angular/core';
import { infiniteScroll } from '../../shared/cdk/infinite-scroll/infiniteScroll';
import { getActions } from '../../shared/rxa-custom/actions/index';
import { RouterState } from '../../shared/state/router.state';
import { combineLatestWith, map, switchMap, withLatestFrom } from 'rxjs';
import { W780H1170 } from '../../data-access/api/constants/image-sizes';
import { ImageTag } from '../../shared/utils/image/image-tag.interface';
import { addImageTag } from '../../shared/utils/image/image-tag.transform';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';
import { TMDBPersonModel } from '../../data-access/api/model/person.model';
import { PersonState } from '../../shared/state/person.state';
import { getDiscoverMovies } from '../../data-access/api/resources/discover.resource';
import { WithContext } from '../../shared/cdk/context/context.interface';
import { MoviesSortValue } from '../../data-access/api/sort/sort.data';

export type MoviePerson = TMDBPersonModel & ImageTag;

export interface PersonDetailPageAdapterState {
  loading: boolean;
  person: MoviePerson;
  recommendations: TMDBMovieModel[];
  showSorting: boolean;
  activeSorting: string;
}

function transformToPersonDetail(_res: TMDBPersonModel): MoviePerson {
  return addImageTag(_res, { pathProp: 'profile_path', dims: W780H1170 });
}

@Injectable({
  providedIn: 'root',
})
export class PersonDetailAdapter extends RxState<PersonDetailPageAdapterState> {
  private readonly actions = getActions<{
    paginate: void;
    toggleSorting: boolean;
    sortBy: MoviesSortValue;
  }>();
  readonly paginate = this.actions.paginate;
  readonly toggleSorting = this.actions.toggleSorting;
  readonly sortBy = this.actions.sortBy;
  readonly routerPersonId$ = this.routerState.select(
    getIdentifierOfTypeAndLayout('person', 'detail')
  );
  readonly sortingModel$ = this.select(
    selectSlice(['showSorting', 'activeSorting'])
  );
  readonly routedPersonCtx$ = this.routerPersonId$.pipe(
    switchMap(this.personState.personByIdCtx),
    map((ctx) => {
      ctx.value && ((ctx as any).value = transformToPersonDetail(ctx.value));
      return ctx as unknown as WithContext<MoviePerson>;
    })
  );

  readonly movieRecommendationsById$ = this.routerPersonId$.pipe(
    combineLatestWith(this.routerState.select('sortBy')),
    switchMap(() => {
      return infiniteScroll(
        () => getDiscoverMovies(),
        this.actions.paginate$,
        getDiscoverMovies()
      );
    })
  );

  readonly sortingEvent$ = this.actions.sortBy$.pipe(
    withLatestFrom(this.routerPersonId$),
    switchMap(() => {
      return infiniteScroll(
        () =>
          getDiscoverMovies(),
        this.actions.paginate$,
        getDiscoverMovies()
      );
    })
  );

  constructor(
    private routerState: RouterState,
    private personState: PersonState
  ) {
    super();

    this.connect('showSorting', this.actions.toggleSorting$);
    this.connect(this.actions.sortBy$, (_, sortBy) => ({
      showSorting: false,
      activeSorting: sortBy.name,
    }));

    this.hold(this.routerPersonId$, this.personState.fetchPerson);
  }
}
