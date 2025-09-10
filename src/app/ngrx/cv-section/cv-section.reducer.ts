import { createReducer } from '@ngrx/store';
import { CvSectionState } from './cv-section.state';

import { on } from '@ngrx/store';
import * as CvSectionActions from './cv-section.actions';
import { CVBlock } from '../../models/cv-block.model';

const initialState: CvSectionState = {
  isGenerating: false,
  generatingError: null,
  generatedCv: null,
  sections: null,
  isGetAllCvsLoading: false,
  getAllCvsError: undefined,
  allCvs: [],
  isGetSectionLoading: false,
  getSectionError: undefined,
  isUpdateSectionLoading: false,
  updateSectionError: undefined,
  isExporting: false,
  exportingError: undefined
};

export const cvSectionReducer = createReducer(
  initialState,
  on(
    CvSectionActions.addCvSection,
    (state, { type, section, sectionType, sectionForRender }) => {
      console.log(type);
      // Depending on the section type, add to the appropriate array
      let newSections = { ...state.sections } as CVBlock;

      switch (sectionType) {
        case 'personalInfo':
          newSections['personalInfo'] = section as any;
          break;
        case 'education':
          newSections['education'] = [
            ...newSections['education']!,
            section as any,
          ];
          break;
        case 'experience':
          newSections['experience'] = [
            ...newSections['experience']!,
            section as any,
          ];
          break;
        case 'skills':
          newSections['skills'] = [...newSections['skills']!, section as any];
          break;
        case 'projects':
          newSections['projects'] = [
            ...newSections['projects']!,
            section as any,
          ];
          break;
        case 'awards':
          newSections['awards'] = [...newSections['awards']!, section as any];
          break;
        case 'languages':
          newSections['languages'] = [
            ...newSections['languages']!,
            section as any,
          ];
          break;
        case 'interests':
          newSections['interests'] = [
            ...newSections['interests']!,
            section as any,
          ];
          break;
        case 'courses':
          newSections['courses'] = [...newSections['courses']!, section as any];
          break;
        case 'organizations':
          newSections['organizations'] = [
            ...newSections['organizations']!,
            section as any,
          ];
          break;
        case 'publications':
          newSections['publications'] = [
            ...newSections['publications']!,
            section as any,
          ];
          break;
        case 'references':
          newSections['references'] = [
            ...newSections['references']!,
            section as any,
          ];
          break;
        case 'certifications':
          newSections['certifications'] = [
            ...newSections['certifications']!,
            section as any,
          ];
          break;
        case 'declaration':
          newSections['declaration'] = section as any;
          break;
        case 'customSections':
          if (!newSections['customSections']) {
            newSections['customSections'] = [];
          }
          newSections['customSections'] = [
            ...newSections['customSections']!,
            section as any,
          ];
          break;
      }

      return {
        ...state,
        sections: newSections,
      };
    }
  ),

  on(CvSectionActions.updateCvSection, (state, { type, sectionType, data }) => {
    // Handle single object sections (personalInfo, declaration)
    console.log(type, sectionType, data);

    let newSections = { ...state.sections } as CVBlock;

    switch (sectionType) {
      case 'personalInfo':
        newSections['personalInfo'] = {
          ...newSections['personalInfo'],
          ...data,
        };
        break;
      case 'education':
        newSections['education'] = [...data];
        // Handle array updates for education
        break;
      case 'experience':
        // Handle array updates for experience
        newSections['experience'] = [...data];
        break;
      case 'skills':
        // Handle array updates for skills
        newSections['skills'] = [...data];
        break;
      case 'projects':
        // Handle array updates for projects
        newSections['projects'] = [...data];
        break;
      case 'awards':
        newSections['awards'] = [...data];
        break;
      case 'languages':
        newSections['languages'] = [...data];
        break;
      case 'interests':
        newSections['interests'] = [...data];
        break;
      case 'courses':
        newSections['courses'] = [...data];
        break;
      case 'organizations':
        newSections['organizations'] = [...data];
        break;
      case 'publications':
        newSections['publications'] = [...data];
        break;
      case 'references':
        newSections['references'] = [...data];
        break;
      case 'certifications':
        newSections['certifications'] = [...data];
        break;
      case 'declaration':
        newSections['declaration'] = {
          ...newSections['declaration'],
          ...data,
        };
        break;
      case 'customSections':
        newSections['customSections'] = [...data];
        break;
      default:
        console.warn(`Unhandled section type: ${sectionType}`);
        break;
    }

    return {
      ...state,
      sections: newSections,
    };
  }),

  on(CvSectionActions.generateCv, (state, { type, data }) => {
    console.log(type);
    return {
      ...state,
      isGenerating: true,
      generatingError: null,
      generatedCv: null,
    };
  }),
  on(CvSectionActions.generateCvSuccess, (state, { type, data }) => {
    console.log(type);
    // console.log(data);
    return {
      ...state,
      isGenerating: false,
      generatingError: null,
      generatedCv: data,
    };
  }),
  on(CvSectionActions.generateCvFailure, (state, { type, error }) => {
    console.log(type);
    return {
      ...state,
      isGenerating: false,
      generatingError: error,
      generatedCv: null,
    };
  }),

  on(CvSectionActions.getAllCvs, (state, { type }) => {
    console.log(type);

    return <CvSectionState>{
      ...state,
      isGetAllCvsLoading: true,
      getAllCvsError: null,
      allCvs: [],
    };
  }),

  on(CvSectionActions.getAllCvsSuccess, (state, { type, data }) => {
    console.log(type);
    console.log(data);

    return <CvSectionState>{
      ...state,
      isGetAllCvsLoading: false,
      getAllCvsError: null,
      allCvs: data,
    };
  }),

  on(CvSectionActions.getAllCvsFailure, (state, { type, error }) => {
    console.log(type);
    return <CvSectionState>{
      ...state,
      isGetAllCvsLoading: false,
      getAllCvsError: error,
      allCvs: [],
    };
  }),

  on(CvSectionActions.getCvById, (state, { type }) => {
    console.log(type);
    return <CvSectionState>{
      ...state,
      isGetSectionLoading: true,
      getSectionError: null,
      sections: null,
      generatedCv: null,
    };
  }),

  on(CvSectionActions.getCvByIdSuccess, (state, { type, data }) => {
    console.log(type);
    // console.log(data);
    return <CvSectionState>{
      ...state,
      isGetSectionLoading: false,
      getSectionError: null,
      sections: data.cvData,
    };
  }),

  on(CvSectionActions.getCvByIdFailure, (state, { type, error }) => {
    console.log(type);
    return <CvSectionState>{
      ...state,
      isGetSectionLoading: false,
      getSectionError: error,
      sections: <CVBlock>{},
    };
  }),

  on(CvSectionActions.updateCvById, (state, { type }) => {
    console.log(type);
    return <CvSectionState>{
      ...state,
      isUpdateSectionLoading: true,
      updateSectionError: null,
    };
  }),

  on(CvSectionActions.updateCvByIdSuccess, (state, { type }) => {
    console.log(type);
    return <CvSectionState>{
      ...state,
      isUpdateSectionLoading: false,
      updateSectionError: null,
    };
  }),

  on(CvSectionActions.updateCvByIdFailure, (state, { type, error }) => {
    console.log(type);
    return <CvSectionState>{
      ...state,
      isUpdateSectionLoading: false,
      updateSectionError: error,
    };
  }),

  on(CvSectionActions.exportCv, (state, { type }) => {
    console.log(type);
    return <CvSectionState>{
      ...state,
      isExporting: true,
      exportingError: null,
    };
  }),
  
  on(CvSectionActions.exportCvSuccess, (state, { type }) => {
    console.log(type);
    return <CvSectionState>{
      ...state,
      isExporting: false,
      exportingError: null,
    };
  }),
  
  on(CvSectionActions.exportCvFailure, (state, { type, error }) => {
    console.log(type);
    return <CvSectionState>{
      ...state,
      isExporting: false,
      exportingError: error,
    };
  })
);
