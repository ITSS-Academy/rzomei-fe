import { CVBlock } from "../../models/cv-block.model";

export interface CvSectionState {
    sections: CVBlock;
    sectionsForRendering: any[];

    isGenerating: boolean;
    generatingError: any;
    generatedCv: any;
}