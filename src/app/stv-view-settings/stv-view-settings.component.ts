import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import * as state from "../state";
import { StvGraphService } from "../common/stv-graph/stv-graph.service"

@Component({
    selector: "stv-view-settings",
    templateUrl: "./stv-view-settings.component.html",
    styleUrls: ["./stv-view-settings.component.less"],
})
export class StvViewSettingsComponent implements OnInit, OnDestroy {
    showStateLabels: boolean;
    showActionLabels: boolean;
    
    private viewSettingsSubscriptions: Subscription[] = [];
    
    constructor(private appState: state.AppState, private graphService: StvGraphService) {
        const viewSettings = appState.viewSettings;
        this.showActionLabels = viewSettings.showActions;
        this.showStateLabels = viewSettings.showStateLabels;
        this.viewSettingsSubscriptions.push(
            viewSettings.showActions$.subscribe(() => this.showActionLabels = viewSettings.showActions)
        );
        this.viewSettingsSubscriptions.push(
            viewSettings.showStateLabels$.subscribe(() => this.showStateLabels = viewSettings.showStateLabels)
        );
    }

    get stateLabels(): Array<any>{
        return this.graphService.stateLabels;
    }

    get actionLabels(): Array<any>{
        return this.graphService.actionLabels;
    }

    get allStateLabelsShown(): Boolean{
        return this.graphService.stateLabels.reduce((acc,x)=>acc&&x.display, true);
    }

    get allActionLabelsShown(): Boolean{
        return this.graphService.actionLabels.reduce((acc,x)=>acc&&x.display, true);
    }

    onShowAllStateLabelsChanged(e:Event):void{
        let _val = (<HTMLInputElement>e.target).checked;
        this.graphService.showStateLabels = _val;
        this.graphService.stateLabels.forEach(x=>x.display = _val);
        this.graphService.reloadStateLabels();
    }

    onSingleStateLabelChanged(i: any, e:Event):void{     
        let _val = (<HTMLInputElement>e.target).checked;
        this.graphService.stateLabels[i].display = _val;
        this.graphService.reloadStateLabels();
    }


    onShowAllActionLabelsChanged(e:Event):void{     
        let _val = (<HTMLInputElement>e.target).checked;
        this.graphService.showActionLabels = _val;
        this.graphService.actionLabels.forEach(x=>x.display = _val);
        this.graphService.reloadActionLabels();
    }


    onSingleActionLabelChanged(i: any, e:Event):void{
        let _val = (<HTMLInputElement>e.target).checked;
        this.graphService.actionLabels[i].display = _val;
        this.graphService.reloadActionLabels();
    }
    
    ngOnInit(): void {
    }
    
    ngOnDestroy(): void {
        for (let subscription of this.viewSettingsSubscriptions) {
            subscription.unsubscribe();
        }
    }

    
    onShowActionsChanged(): void {
        this.appState.viewSettings.showActions = !this.appState.viewSettings.showActions;
        this.graphService.actionLabels.forEach(x=>x.display=this.appState.viewSettings.showActions);
        
        // this.graphService.toggleActionLabels();
        this.graphService.reloadActionLabels();
    }
    
    onShowStateLabelsChanged(): void {
        this.appState.viewSettings.showStateLabels = !this.appState.viewSettings.showStateLabels;
        this.graphService.stateLabels.forEach(x=>x.display=this.appState.viewSettings.showStateLabels);

        // this.graphService.toggleStateLabels();
        this.graphService.reloadStateLabels();
    }
    
    onZoomInClick(): void {
        this.graphService.setZoom(1.2);
    }
    
    onZoomOutClick(): void {
        this.graphService.setZoom(1 / 1.2);
    }
    
    onZoomToFitClick(): void{
        this.graphService.zoomToFit();
    }
    
}