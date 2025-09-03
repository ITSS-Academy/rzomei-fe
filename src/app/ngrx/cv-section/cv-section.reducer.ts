import { createReducer } from '@ngrx/store';
import { CvSectionState } from './cv-section.state';

import { on } from '@ngrx/store';
import * as CvSectionActions from './cv-section.actions';

const initialState: CvSectionState = {
  sections: [],
};

export const cvSectionReducer = createReducer(
  initialState,
  on(CvSectionActions.addCvPersonalSection, (state, { type, section }) => {
    console.log(type);
    return {
      ...state,
      sections: [...state.sections, section],
    };
  }),
  on(CvSectionActions.addCvEducationSections, (state, { type, section }) => {
    console.log(type);
    const index = state.sections.findIndex(
      (sec: any) => sec.type === 'education'
    );
    if (index === -1) {
      return {
        ...state,
        sections: [...state.sections, section],
      };
    } else {
      let educationSections = { ...state.sections[index] };

      educationSections.education = [
        ...educationSections.education,
        ...section.education,
      ];
      return {
        ...state,
        sections: [...state.sections, educationSections],
      };
    }
  })
);
