import { inject } from '@angular/core';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CvService } from '../../services/cv.service';

import * as CvSectionActions from './cv-section.actions';
import { Router } from '@angular/router';

export const genCv$ = createEffect(
  (actions$ = inject(Actions), cvService = inject(CvService)) => {
    return actions$.pipe(
      ofType(CvSectionActions.generateCv),
      switchMap((data) =>
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

export const getAllCvs$ = createEffect(
  (actions$ = inject(Actions), cvService = inject(CvService)) => {
    return actions$.pipe(
      ofType(CvSectionActions.getAllCvs),
      switchMap(() =>
        cvService.getAllCvs().pipe(
          map((data) => CvSectionActions.getAllCvsSuccess({ data })),
          catchError((error: { message: string }) =>
            of(CvSectionActions.getAllCvsFailure({ error: error.message }))
          )
        )
      )
    );
  },
  { functional: true }
);

export const getCvById$ = createEffect(
  (actions$ = inject(Actions), cvService = inject(CvService)) => {
    return actions$.pipe(
      ofType(CvSectionActions.getCvById),
      switchMap((action) =>
        cvService.getCvById(action.id).pipe(
          map((data) => CvSectionActions.getCvByIdSuccess({ data })),
          catchError((error: { message: string }) =>
            of(CvSectionActions.getCvByIdFailure({ error: error.message }))
          )
        )
      )
    );
  },
  { functional: true }
);

export const updateCvById$ = createEffect(
  (actions$ = inject(Actions), cvService = inject(CvService)) => {
    return actions$.pipe(
      ofType(CvSectionActions.updateCvById),
      switchMap((action) =>
        cvService.updateCvById(action.id, action.data).pipe(
          map(() => CvSectionActions.updateCvByIdSuccess()),
          catchError((error: { message: string }) =>
            of(CvSectionActions.updateCvByIdFailure({ error: error.message }))
          )
        )
      )
    );
  },
  { functional: true }
);

export const exportCv$ = createEffect(
  (actions$ = inject(Actions), cvService = inject(CvService)) => {
    return actions$.pipe(
      ofType(CvSectionActions.exportCv),
      exhaustMap((action) =>
        cvService.exportCv(action.data).pipe(
          map((blob) => CvSectionActions.exportCvSuccess({ blob })),
          catchError((error: { message: string }) =>
            of(CvSectionActions.exportCvFailure({ error: error.message }))
          )
        )
      )
    );
  },
  { functional: true }
);

export const getBaseCVThemes$ = createEffect(
  (actions$ = inject(Actions), cvService = inject(CvService)) => {
    return actions$.pipe(
      ofType(CvSectionActions.getBaseCVThemes),
      switchMap(() =>
        cvService.getBaseCVThemes().pipe(
          map((data) => CvSectionActions.getBaseCVThemesSuccess({ data })),
          catchError((error: { message: string }) =>
            of(
              CvSectionActions.getBaseCVThemesFailure({ error: error.message })
            )
          )
        )
      )
    );
  },
  { functional: true }
);

export const createNewCv$ = createEffect(
  (
    actions$ = inject(Actions),
    cvService = inject(CvService),
    router = inject(Router)
  ) => {
    return actions$.pipe(
      ofType(CvSectionActions.createNewCv),
      exhaustMap((action) =>
        cvService.createNewCv(action.data).pipe(
          map((data) => {
            router.navigate(['builder/', data.id, 'content']);
            return CvSectionActions.createNewCvSuccess({ data });
          }),
          catchError((error: { message: string }) =>
            of(CvSectionActions.createNewCvFailure({ error: error.message }))
          )
        )
      )
    );
  },
  { functional: true }
);

export const deleteCvById$ = createEffect(
  (
    actions$ = inject(Actions),
    cvService = inject(CvService),
    router = inject(Router)
  ) => {
    return actions$.pipe(
      ofType(CvSectionActions.deleteCvById),
      switchMap((action) =>
        cvService.deleteCvById(action.id).pipe(
          map((data) => CvSectionActions.deleteCvByIdSuccess({ id: action.id })),
          catchError((error: { message: string }) =>
            of(CvSectionActions.deleteCvByIdFailure({ error: error.message }))
          )
        )
      )
    );
  },
  { functional: true }
);


export const getShareCvById$ = createEffect(
  (actions$ = inject(Actions), cvService = inject(CvService)) => {
    return actions$.pipe(
      ofType(CvSectionActions.getShareCvById),
      switchMap((action) =>
        cvService.getShareCvById(action.id).pipe(
          map((data) => CvSectionActions.getShareCvByIdSuccess({ data })),
          catchError((error: { message: string }) =>
            of(CvSectionActions.getShareCvByIdFailure({ error: error.message }))
          )
        )
      )
    );
  },
  { functional: true }
);
