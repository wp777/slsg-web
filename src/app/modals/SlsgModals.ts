import { SlsgInfo } from "../compute.service";
import { SlsgContradictionErrorModal } from "./SlsgContradictionErrorModal";
import { SlsgDuplicateEntryWarningModal } from "./SlsgDuplicateEntryWarningModal";
import { SlsgInfoModal } from "./SlsgInfoModal";
import { SlsgProtOrValModal } from "./SlsgProtOrValModal";

export class SlsgModals {
    
    static async askProtOrVal(): Promise<"protocol" | "valuation" | false> {
        const modal = new SlsgProtOrValModal();
        modal.show();
        return modal.getPromise();
    }
    
    static showInfo(info: SlsgInfo): void {
        new SlsgInfoModal(info).show();
    }
    
    static showDuplicateEntryWarning(entryStr: string): Promise<void> {
        const modal = new SlsgDuplicateEntryWarningModal(entryStr);
        modal.show();
        return modal.getPromise();
    }
    
    static showContradictionError(entryStr: string): Promise<void> {
        const modal = new SlsgContradictionErrorModal(entryStr);
        modal.show();
        return modal.getPromise();
    }
    
}
