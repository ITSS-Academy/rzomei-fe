import { createAction, props } from "@ngrx/store";
import { Award, Certification, Course, CustomSection, CVBlock, CVBlockForRendering, Declaration, Education, Experience, Interest, Language, Organization, PersonalInfo, Project, Publication, Reference, Skill } from "../../models/cv-block.model";

export const addCvSection = createAction('[CV Section] Add Section', props<{ sectionType: string, sectionForRender: CVBlockForRendering, section: PersonalInfo | Experience | Education | Skill | Project | Award | Language | Interest | Course | Organization | Publication | Reference | Certification | Declaration | CustomSection }>());

export const updateCvSection = createAction('[CV Section] Update Section', props<{ sectionType: any, data: any }>());


export const generateCv = createAction('[CV Section] Generate CV', props<{ data: any }>());
export const generateCvSuccess = createAction('[CV Section] Generate CV Success', props<{ data: any }>());
export const generateCvFailure = createAction('[CV Section] Generate CV Failure', props<{ error: any }>());


export const getAllCvs = createAction('[CV Section] Get All CVs');
export const getAllCvsSuccess = createAction('[CV Section] Get All CVs Success', props<{ data: any }>());
export const getAllCvsFailure = createAction('[CV Section] Get All CVs Failure', props<{ error: any }>());

export const getCvById = createAction('[CV Section] Get CV By Id', props<{ id: number }>());
export const getCvByIdSuccess = createAction('[CV Section] Get CV By Id Success', props<{ data: any }>());
export const getCvByIdFailure = createAction('[CV Section] Get CV By Id Failure', props<{ error: any }>());

export const updateCvById = createAction('[CV Section] Update CV By Id', props<{ id: number, data: any }>());
export const updateCvByIdSuccess = createAction('[CV Section] Update CV By Id Success');
export const updateCvByIdFailure = createAction('[CV Section] Update CV By Id Failure', props<{ error: any }>());

export const exportCv = createAction('[CV Section] Export CV', props<{ data: any }>());
export const clearCvBlob = createAction('[CV Section] Clear CV Blob');
export const exportCvSuccess = createAction('[CV Section] Export CV Success', props<{ blob: any }>());
export const exportCvFailure = createAction('[CV Section] Export CV Failure', props<{ error: any }>());

export const copyCv = createAction('[CV Section] Copy CV', props<{ id: number }>());
export const copyCvSuccess = createAction('[CV Section] Copy CV Success');
export const copyCvFailure = createAction('[CV Section] Copy CV Failure', props<{ error: any }>());


