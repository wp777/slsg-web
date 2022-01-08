import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subscription, interval } from "rxjs";
import { debounce } from "rxjs/operators";
import * as state from "src/app/state";
import { StvModelTabsComponent } from "src/app/common/stv-model-tabs/stv-model-tabs.component";

@Component({
    selector: "stv-generate-main",
    templateUrl: "./stv-generate-main.component.html",
    styleUrls: ["./stv-generate-main.component.less"],
})
export class StvGenerateMainComponent implements OnInit, OnDestroy, AfterViewInit {
    
    @ViewChild("modelTabs")
    modelTabsRef?: ElementRef<StvModelTabsComponent>;
    
    get modelTabs(): StvModelTabsComponent {
        return this.modelTabsRef! as unknown as StvModelTabsComponent;
    }
    
    private appStateSubscription: Subscription;
    
    constructor(private appState: state.AppState) {
        this.appStateSubscription = appState.state$
            .pipe(debounce(() => interval(10)))
            .subscribe(() => this.onAppStateChanged());
    }

    ngOnInit(): void {}
    
    ngAfterViewInit(): void {
    }
    
    ngOnDestroy(): void {
        this.appStateSubscription.unsubscribe();
    }
    
    onAppStateChanged(): void {
        const model = this.getSlsgModel();
        this.modelTabs.setModel(model);
    }
    
    private getGenerateState(): state.actions.Generate {
        return this.appState.action as state.actions.Generate;
    }
    
    private getSlsgModel(): state.models.Slsg {
        return this.getGenerateState().model as state.models.Slsg;
    }
    
    private getSlsgModelParameters(): state.models.parameters.Slsg {
        return this.getSlsgModel().parameters;
    }
    
}
