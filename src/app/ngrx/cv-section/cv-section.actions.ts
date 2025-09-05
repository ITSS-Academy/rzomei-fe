import { createAction, props } from "@ngrx/store";
import { Award, Certification, Course, CustomSection, CVBlock, CVBlockForRendering, Declaration, Education, Experience, Interest, Language, Organization, PersonalInfo, Project, Publication, Reference, Skill } from "../../models/cv-block.model";

export const addCvSection = createAction('[CV Section] Add Section', props<{ sectionType: string, sectionForRender: CVBlockForRendering, section: PersonalInfo | Experience | Education | Skill | Project | Award | Language | Interest | Course | Organization | Publication | Reference | Certification | Declaration | CustomSection }>());

export const updateCvSection = createAction('[CV Section] Update Section', props<{ sectionType: any, data: any }>());


export const generateCv = createAction('[CV Section] Generate CV', props<{ data: any }>());
export const generateCvSuccess = createAction('[CV Section] Generate CV Success', props<{ data: any }>());
export const generateCvFailure = createAction('[CV Section] Generate CV Failure', props<{ error: any }>());