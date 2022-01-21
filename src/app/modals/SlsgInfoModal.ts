import { SlsgInfo } from "../compute.service";
import { Modal } from "./Modal";

export class SlsgInfoModal extends Modal {
    
    constructor(info: SlsgInfo) {
        super(
            "Result",
            `
                <div class="main-message">
                    Status: <strong>${info.status}</strong><br />
                    Solving time: <strong>${info.solvingTime} s</strong><br />
                    Wall time: <strong>${info.wallTimeSec} s</strong><br />
                    SGSAT CPU time: <strong>${info.sgsatCpuTime} s</strong><br />
                    Memory used: <strong>${SlsgInfoModal.formatMemory(info.memUsed * 1024 * 1024)}</strong><br />
                    Peak memory used: <strong>${SlsgInfoModal.formatMemory(info.memUsedPeak * 1024 * 1024)}</strong><br />
                </div>
            `,
        );
    }
    
    static formatMemory(bytes: number): string {
        if (bytes > 1024 * 1024 * 1024) {
            return `${this.roundBytes(bytes / (1024 * 1024 * 1024))} GiB`;
        }
        if (bytes > 1024 * 1024) {
            return `${this.roundBytes(bytes / (1024 * 1024))} MiB`;
        }
        if (bytes > 1024) {
            return `${this.roundBytes(bytes / (1024))} KiB`;
        }
        return `${this.roundBytes(bytes)} B`;
    }
    
    private static roundBytes(bytes: number): number {
        return Math.round(bytes * 100) / 100;
    }
    
}
