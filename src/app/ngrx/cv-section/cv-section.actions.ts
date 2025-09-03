import { createAction, props } from "@ngrx/store";

export const addCvPersonalSection = createAction('[CV Section] Add Section', props<{ section: any }>());

export const addCvEducationSections = createAction('[CV Section] Add Education Section', props<{ section: any }>());
