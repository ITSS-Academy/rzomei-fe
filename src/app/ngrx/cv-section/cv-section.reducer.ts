import { createReducer } from '@ngrx/store';
import { CvSectionState } from './cv-section.state';

import { on } from '@ngrx/store';
import * as CvSectionActions from './cv-section.actions';
import { CVBlock } from '../../models/cv-block.model';

const initialState: CvSectionState = {
  isGenerating: false,
  generatingError: null,
  generatedCv: null,
  sectionsForRendering: [],
  sections: {
    personalInfo: {
      name: 'Tran Minh Quan',
      title: 'Software Engineer',
      email: 'gideontmq.dev@gmail.com',
      phone: '+84 999 999 999',
      summary: 'Software Engineer',
      location: '995 Quang Trung, Ho Chi Minh City',
      website: 'gideontmq.dev',
      linkedin: 'linkedin.com/in/gideontmq',
      github: 'github.com/gideontmq',
      avatar: '',
      id: ''
    },
    education: [{
      degree: '123',
      institution: '123',
      startDate: '123',
      endDate: '123',
      description: '123',
      location: '123',
      id: ''
    },
    {
      degree: '456',
      institution: '456',
      startDate: '456',
      endDate: '456',
      description: '456',
      location: '456',
      id: ''
    }
  ],
    experience: [],
    skills: [],
    projects: [],
    languages: [],
    certifications: [],
    awards: [],
    interests: [],
    courses: [],
    organizations: [],
    publications: [],
    references: [],
    declaration: null,
    customSections: null
  },
};

export const cvSectionReducer = createReducer(
  initialState,
  on(CvSectionActions.addCvSection, (state, { type, section, sectionType, sectionForRender }) => {
    console.log(type);
    // Depending on the section type, add to the appropriate array
    let newSections = {...state.sections} as CVBlock;
    
    switch(sectionType){
      case 'personalInfo':
        newSections['personalInfo'] = section as any;
        break;
      case 'education':
        newSections['education'] = [...newSections['education']!, section as any];
        break;
      case 'experience':
        newSections['experience'] = [...newSections['experience']!, section as any];
        break;
      case 'skills':
        newSections['skills'] = [...newSections['skills']!, section as any];
        break;
      case 'projects':
        newSections['projects'] = [...newSections['projects']!, section as any];
        break;
      case 'awards':
        newSections['awards'] = [...newSections['awards']!, section as any];
        break;
      case 'languages':
        newSections['languages'] = [...newSections['languages']!, section as any];
        break;
      case 'interests':
        newSections['interests'] = [...newSections['interests']!, section as any];
        break;
      case 'courses':
        newSections['courses'] = [...newSections['courses']!, section as any];
        break;
      case 'organizations':
        newSections['organizations'] = [...newSections['organizations']!, section as any];
        break;
      case 'publications':
        newSections['publications'] = [...newSections['publications']!, section as any];
        break;
      case 'references':
        newSections['references'] = [...newSections['references']!, section as any];
        break;
      case 'certifications':
        newSections['certifications'] = [...newSections['certifications']!, section as any];
        break;
      case 'declaration':
        newSections['declaration'] = section as any;
        break;
      case 'customSections':
        if (!newSections['customSections']) {
          newSections['customSections'] = [];
        }
        newSections['customSections'] = [...newSections['customSections']!, section as any];
        break;

    }

    return {
      ...state,
      sections: newSections,
      sectionsForRendering: [...state.sectionsForRendering, sectionForRender]
    };
  }),

  on(CvSectionActions.updateCvSection, (state, {type, sectionType, data }) => {
    // Handle single object sections (personalInfo, declaration)
    console.log(type, sectionType, data);
    
    let newSections = {...state.sections} as CVBlock;
    
    switch(sectionType){
      case 'personalInfo':
        newSections['personalInfo'] = {...newSections['personalInfo'], ...data};
        break;
      case 'education':
        // Handle array updates for education
        break;
      case 'experience':
        // Handle array updates for experience
        break;
      case 'skills':
        // Handle array updates for skills
        break;
      // Add more cases as needed
      default:
        console.warn(`Unhandled section type: ${sectionType}`);
        break;
    }

    return {
      ...state,
      sections: newSections
    };
  }),


  on(CvSectionActions.generateCv, (state, {type, data}) => {
    console.log(type)
    return {
      ...state,
      isGenerating: true,
      generatingError: null,
      generatedCv: null
    };
  }),
  on(CvSectionActions.generateCvSuccess, (state, {type, data}) => {
    console.log(type);
    console.log(data);
    return {
      ...state,
      isGenerating: false,
      generatingError: null,
      generatedCv: data
    };
  }),
  on(CvSectionActions.generateCvFailure, (state, {type, error}) => {
    console.log(type);
    return {
      ...state,
      isGenerating: false,
      generatingError: error,
      generatedCv: null
    };
  })
);
