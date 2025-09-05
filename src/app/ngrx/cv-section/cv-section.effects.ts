import { inject } from '@angular/core';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CvService } from '../../services/cv.service';

import * as CvSectionActions from './cv-section.actions';


export const genCv$ = createEffect(
  (actions$ = inject(Actions), cvService = inject(CvService)) => {
    return actions$.pipe(
      ofType(CvSectionActions.generateCv),
      exhaustMap((data) =>
        cvService.generateCv(data).pipe(
          map((data) => CvSectionActions.generateCvSuccess({ data })),
          catchError((error: { message: string }) =>
            of(CvSectionActions.generateCvFailure({ error: error.message }))
          )
        )
      )
    );
  },
  { functional: true }
);