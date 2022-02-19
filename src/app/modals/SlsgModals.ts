import * as state from "../state";
import { SlsgInfo } from "../compute.service";
import { SlsgContradictionErrorModal } from "./SlsgContradictionErrorModal";
import { SlsgDuplicateEntryWarningModal } from "./SlsgDuplicateEntryWarningModal";
import { SlsgInfoModal } from "./SlsgInfoModal";
import { SlsgProtOrValModal } from "./SlsgProtOrValModal";
import { SlsgAddProtocolModal } from "./SlsgAddProtocolModal";
import { SlsgAddTransitionModal } from "./SlsgAddTransitionModal";
import { SlsgAddValuationModal } from "./SlsgAddValuationModal";

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
    
    static async showAddProtocolModal(): Promise<state.models.parameters.SlsgProtocol | null> {
        const modal = new SlsgAddProtocolModal();
        modal.show();
        return modal.getPromise();
    }
    
    static async showAddTransitionModal(): Promise<state.models.parameters.SlsgTransition | null> {
        const modal = new SlsgAddTransitionModal();
        modal.show();
        return modal.getPromise();
    }
    
    static async showAddValuationModal(): Promise<state.models.parameters.SlsgValuation | null> {
        const modal = new SlsgAddValuationModal();
        modal.show();
        return modal.getPromise();
    }
    
}
