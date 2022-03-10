import { select } from '@rx-angular/state/selections';
import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { map, withLatestFrom } from 'rxjs';
import { TMDBMovieCastModel } from '../../data-access/api/model/movie-credits.model';
import { TMDBMovieGenreModel } from '../../data-access/api/model/movie-genre.model';

import { MovieDetailAdapter } from './movie-detail-page.adapter';
import { getActions } from '../../shared/rxa-custom/actions';
import { RxState } from '@rx-angular/state';

@Component({
  selector: 'ct-movie',
  templateUrl: './movie-detail-page.component.html',
  styleUrls: ['./movie-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [RxState],
})
export class MovieDetailPageComponent {
  readonly ui = getActions<{ dialog: 'open' | 'close' | 'load' }>();
  readonly movieCtx$ = this.adapter.routedMovieCtx$;
  readonly movie$ = this.movieCtx$.pipe(map((ctx) => ctx?.value || null));
  readonly castList$ = this.adapter.movieCastById$;
  readonly castListLoading$ = this.adapter.movieCastById$.pipe(
    select('loading')
  );
  readonly infiniteScrollRecommendations$ =
    this.adapter.infiniteScrollRecommendations$
    .pipe(
      withLatestFrom(this.movie$, (data, movie) => ({ data, movie })),
      map(({ data, movie }) => {
        data.results = data.results.filter((r) => r.id !== movie.id);
        return data;
      })
    );

  @ViewChild('trailerDialog')
  trailerDialog: ElementRef | undefined = undefined;

  @ViewChild('castListWrapper')
  castListWrapper: ElementRef<HTMLElement> | undefined = undefined;

  constructor(
    private effects: RxState<any>,
    private location: Location,
    private adapter: MovieDetailAdapter
  ) {
    this.effects.hold(this.ui.dialog$, (trigger: string) =>
      trigger === 'open'
        ? this.trailerDialog?.nativeElement?.showModal()
        : this.trailerDialog?.nativeElement.close()
    );
  }

  move(increment: number) {
    if (this.castListWrapper) {
      const scrollLeft = this.castListWrapper.nativeElement.scrollLeft;
      const newScrollLetf = scrollLeft - increment;
      this.castListWrapper.nativeElement.scrollLeft =
        newScrollLetf > 0
          ? Math.max(0, newScrollLetf)
          : Math.min(
              newScrollLetf,
              this.castListWrapper.nativeElement.children.length * increment
            );
    }
  }

  back() {
    this.location.back();
  }

  paginateRecommendations() {
    this.adapter.paginateRecommendations();
  }

  trackByGenre: TrackByFunction<TMDBMovieGenreModel> = (_, genre) => genre.name;
  trackByCast: TrackByFunction<TMDBMovieCastModel> = (_, cast) => cast.cast_id;
}
