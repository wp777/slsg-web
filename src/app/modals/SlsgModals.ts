import { SlsgInfo } from "../compute.service";
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
    
}
