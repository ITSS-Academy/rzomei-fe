import { CVBlock } from '../../models/cv-block.model';

export interface CvSectionState {
  sections: CVBlock | null;

  isGenerating: boolean;
  generatingError: any;
  generatedCv: any;

  isGetAllCvsLoading: boolean;
  getAllCvsError: any;
  allCvs: any[];

  isGetSectionLoading: boolean;
  getSectionError: any;

  isUpdateSectionLoading: boolean;
  updateSectionError: any;

  isExporting: boolean;
  cvBlob: any;
  exportSuccess: boolean;
  exportingError: any;

  currentCvData: any;

//   isCopying: boolean;
//   copySuccess: boolean;
//   copyingError: any;
}
