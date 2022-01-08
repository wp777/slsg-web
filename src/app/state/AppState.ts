import { Injectable } from "@angular/core";
import * as actions from "./actions";
import { ObservableState } from "./ObservableState";
import { ViewSettings } from "./ViewSettings";

interface AppStateObservableProperties {
    action: unknown;
}

@Injectable({
    providedIn: "root",
})
export class AppState extends ObservableState<AppStateObservableProperties> {
    
    protected _action: actions.SomeAction = this.createObservedChild(new actions.Generate());
    get action(): actions.SomeAction { return this._action; }
    set action(action: actions.SomeAction) { this.setParameter("action", action); }
    
    protected _viewSettings: ViewSettings = new ViewSettings();
    get viewSettings(): ViewSettings { return this._viewSettings; }
    
}
