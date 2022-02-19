import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import * as state from "../../state";
import { Subscription, interval } from "rxjs";
import { debounce } from "rxjs/operators";
import { ModelGenerator } from "../ModelGenerator";
import { SlsgModals } from "src/app/modals/SlsgModals";
import { ComputeService } from "src/app/compute.service";
import { StvGraphService } from "src/app/common/stv-graph/stv-graph.service";
import { SlsgExample, SlsgExamples } from "./Examples";
import { SimpleModals } from "src/app/modals/SimpleModals";

@Component({
    selector: "stv-generate-sidebar",
    templateUrl: "./stv-generate-sidebar.component.html",
    styleUrls: ["./stv-generate-sidebar.component.less"],
})
export class StvGenerateSidebarComponent implements OnInit, OnDestroy {
    
    _canRender: boolean = false;
    get canRender(): boolean { return this._canRender; }
    set canRender(canRender: boolean) { this._canRender = canRender; }
    
    _canGenerate: boolean = false;
    get canGenerate(): boolean { return this._canGenerate; }
    set canGenerate(canGenerate: boolean) { this._canGenerate = canGenerate; }
    
    _canExportTxt: boolean = false;
    get canExportTxt(): boolean { return this._canExportTxt; }
    set canExportTxt(canExportTxt: boolean) { this._canExportTxt = canExportTxt; }
    
    _canExportPng: boolean = false;
    get canExportPng(): boolean { return this._canExportPng; }
    set canExportPng(canExportPng: boolean) { this._canExportPng = canExportPng; }
    
    private hasAnyGraphBeenRendered: boolean = false;
    
    formula: string | null = null;
    modelType: string = "";
    
    routerSubscription: Subscription;
    appStateSubscription: Subscription;
    
    constructor(private router: Router, public appState: state.AppState, private computeService: ComputeService, private graphService: StvGraphService) {
        this.appState.action = new state.actions.Generate();
        
        this.routerSubscription = router.events.subscribe(value => {
            if (value instanceof NavigationEnd) {
                const path = router.getCurrentNavigation()?.finalUrl?.root.children.primary?.segments[1]?.path;
                
                if (path) {
                    this.loadParamsFromExample(path);
                    this.modelType = path;
                }
            }
        });
        this.appStateSubscription = appState.state$
            .pipe(debounce(() => interval(10)))
            .subscribe(() => this.onAppStateChanged());
    }

    ngOnInit(): void {}
    
    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
        this.appStateSubscription.unsubscribe();
    }
    
    onModelTypeChanged(value: string): void {
        this.router.navigate(["/generate",  value]);
    }
    
    async onRenderClick(): Promise<void> {
        await this.renderModel();
        setTimeout(() => {
            const nAgents = this.getSlsgModel().parameters.agents.length;
            for (let i = 0; i < nAgents; ++i) {
                this.graphService.updateFromSlsgModel(i, this.getSlsgModel());
            }
        }, 250);
    }
    
    async onGenerateClick(): Promise<void> {
        this.showSpinner();
        
        try {
            const modelStr = await this.generateModel(false);
            if (modelStr !== null) {
                const result = await this.computeService.generateSlsgModel(modelStr);
                
                if (result) {
                    const model = this.getSlsgModel();
                    model.globalModel = result.globalModel;
                    model.localModels = result.localModels;
                    model.localModelNames = result.localModelNames;
                    this.onAfterGraphRendered();
                    
                    SlsgModals.showInfo(result.info);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
        
        this.hideSpinner();
    }
    
    private showSpinner(): void {
        this.hideSpinner();
        
        const spinner = document.createElement("div");
        spinner.classList.add("slsg-spinner");
        spinner.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
        
        const curtain = document.createElement("div");
        curtain.classList.add("slsg-curtain");
        
        document.body.appendChild(curtain);
        document.body.appendChild(spinner);
    }
    
    private hideSpinner(): void {
        const spinner = document.querySelector(".slsg-spinner");
        const curtain = document.querySelector(".slsg-curtain");
        if (spinner) {
            spinner.remove();
        }
        if (curtain) {
            curtain.remove();
        }
    }
    
    async renderModel(): Promise<void> {
        const mg = new ModelGenerator(
            this.getSlsgModel(),
            (agentId, locStateId) => {
                SlsgModals.askProtOrVal().then(result => {
                    if (result === "protocol") {
                        this.getSlsgModel().parameters.protocols.push({
                            agentId: agentId,
                            locStateId: locStateId,
                            locActId: 0,
                            state: "disabled",
                        });
                        this.graphService.updateFromSlsgModel(agentId, this.getSlsgModel());
                        ModelGenerator.checkContradictions(this.getSlsgModel());
                    }
                    else if (result === "valuation") {
                        this.getSlsgModel().parameters.valuations.push({
                            agentId: agentId,
                            locStateId: locStateId,
                            locPropId: 0,
                            state: "disabled",
                        });
                        this.graphService.updateFromSlsgModel(agentId, this.getSlsgModel());
                        ModelGenerator.checkContradictions(this.getSlsgModel());
                    }
                })
            },
            (agentId, srcLocStateId, tgtStateId) => {
                this.getSlsgModel().parameters.transitions.push({
                    agentId: agentId,
                    srcLocStateId: srcLocStateId,
                    globActId: 0,
                    tgtLocStateId: tgtStateId,
                    state: "disabled",
                });
                this.graphService.updateFromSlsgModel(agentId, this.getSlsgModel());
                ModelGenerator.checkContradictions(this.getSlsgModel());
            },
        );
        mg.generateLocalModels();
        this.onAfterGraphRendered();
    }
    
    async generateModel(download: boolean = false): Promise<string | null> {
        const modelStr = await ModelGenerator.getModelText(this.appState);
        
        if (download && modelStr) {
            const element = document.createElement("a");
            element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(modelStr)}`);
            element.setAttribute("download", "slsg.txt");
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
        
        return modelStr;
    }
    
    async onClearClick(): Promise<void> {
        const confirmed = await SimpleModals.confirm("Clearing input", "Do you want to reset all parameters?");
        if (!confirmed) {
            return;
        }
        // @todo modal confirm
        const model = this.getSlsgModel();
        model.globalModel = null;
        model.localModels = null;
        model.localModelNames = null;
        this.onAfterGraphCleared();
        this.loadParamsFromExample(this.modelType);
    }
    
    async onImportTxtClick(): Promise<void> {
        // @todo
        const element = document.createElement("input") as HTMLInputElement;
        element.setAttribute("type", "file");
        element.setAttribute("accept", "text/plain");
        element.style.display = "none";
        document.body.appendChild(element);
        const prom = new Promise<void>(resolve => {
            element.addEventListener("change", async () => {
                if (element.files && element.files.length >= 1 && element.files[0]) {
                    const file = element.files[0];
                    const text = await file.text();
                    if (text) {
                        await this.loadModelFromText(text);
                        resolve();
                    }
                }
            });
        });
        element.click();
        document.body.removeChild(element);
        await prom;
    }
    
    async loadModelFromText(text: string): Promise<void> {
        await ModelGenerator.parseAndLoadModel(this.appState, text);
    }
    
    async onExportTxtClick(): Promise<void> {
        await this.generateModel(true);
    }
    
    async onExportPngClick(): Promise<void> {
        const cnv = document.querySelector<HTMLCanvasElement>(".graph-container.active canvas[data-id$='-node']");
        if (!cnv) {
            return;
        }
        let str = cnv.toDataURL("image/png").substr("data:image/png;".length);
        str = `data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=slsg.png;${str}`;
        const element = document.createElement("a");
        element.setAttribute("href", str);
        element.setAttribute("download", "slsg.png");
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
    }
    
    private loadParamsFromExample(exampleId: string): void {
        const example: SlsgExample | null = SlsgExamples[exampleId];
        if (example) {
            const params = this.getSlsgModel().parameters;
            params.agents.splice(0, params.agents.length, ...JSON.parse(JSON.stringify(example.agents)));
            params.protocols.splice(0, params.protocols.length, ...JSON.parse(JSON.stringify(example.protocols)));
            params.transitions.splice(0, params.transitions.length, ...JSON.parse(JSON.stringify(example.transitions)));
            params.valuations.splice(0, params.valuations.length, ...JSON.parse(JSON.stringify(example.valuations)));
            params.formula = example.formula;
        }
    }
    
    onAppStateChanged(): void {
        this.canRender = this.getGenerateState().canRenderModel();
        this.canGenerate = this.getGenerateState().canGenerateModel();
        this.canExportTxt = this.getGenerateState().canExportModelToTxt();
        this.canExportPng = this.canExportModelToPng();
        this.formula = this.getGenerateState().model.formula;
    }
    
    private getGenerateState(): state.actions.Generate {
        return this.appState.action as state.actions.Generate;
    }
    
    private getSlsgModel(): state.models.Slsg {
        return this.getGenerateState().model as state.models.Slsg;
    }
    
    private onAfterGraphRendered(): void {
        this.hasAnyGraphBeenRendered = true;
        this.canExportPng = this.canExportModelToPng();
    }
    
    private onAfterGraphCleared(): void {
        this.hasAnyGraphBeenRendered = false;
        this.canExportPng = this.canExportModelToPng();
    }
    
    private canExportModelToPng(): boolean {
        return this.hasAnyGraphBeenRendered;
    }
    
}
