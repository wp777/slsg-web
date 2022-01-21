import { Component, OnInit } from "@angular/core";
import * as state from "../../state";
import { NumberInput } from "src/app/utils/NumberInput";

@Component({
    selector: "stv-generate-slsg-parameters",
    templateUrl: "./stv-generate-slsg-parameters.component.html",
    styleUrls: ["./stv-generate-slsg-parameters.component.less"],
})
export class StvGenerateSlsgParametersComponent implements OnInit {
    
    _model: state.models.parameters.Slsg;
    get model(): state.models.parameters.Slsg { return this._model; }
    set model(model: state.models.parameters.Slsg) { this._model = model; }
    
    constructor(private appState: state.AppState) {
        this.getGenerateState().model = new state.models.Slsg();
        this._model = this.getSlsgModelParameters();
    }

    ngOnInit(): void {}
    
    
    
    
    
    ///// BEGIN agents
    onAddAgentClick(): void {
        const agents = this.getSlsgModelParameters().agents;
        agents.push({
            id: agents.length,
            numOfLocalStates: 2,
            numOfLocalActions: 2,
            numOfLocalProps: 1,
        });
        this.getGenerateState().state$.next();
    }
    
    onDeleteAgentClick(agentId: number): void {
        const agents = this.getSlsgModelParameters().agents;
        agents.splice(agentId, 1);
        for (let i = 0; i < agents.length; ++i) {
            agents[i].id = i;
        }
        this.getGenerateState().state$.next();
    }
    
    onAgentNumOfLocalStatesInput(agentId: number, event: Event): void {
        this.refreshAgentNumOfLocalStatesFromInput(agentId, event.target as HTMLInputElement);
    }
    onAgentNumOfLocalStatesBlur(agentId: number, event: Event): void {
        NumberInput.fixIntValueFromMinMax(event.target as HTMLInputElement);
        this.refreshAgentNumOfLocalStatesFromInput(agentId, event.target as HTMLInputElement);
    }
    refreshAgentNumOfLocalStatesFromInput(agentId: number, input: HTMLInputElement) {
        this.getSlsgModelParameters().agents[agentId].numOfLocalStates = parseInt(input.value);
        this.getGenerateState().state$.next();
    }
    
    onAgentNumOfLocalActionsInput(agentId: number, event: Event): void {
        this.refreshAgentNumOfLocalActionsFromInput(agentId, event.target as HTMLInputElement);
    }
    onAgentNumOfLocalActionsBlur(agentId: number, event: Event): void {
        NumberInput.fixIntValueFromMinMax(event.target as HTMLInputElement);
        this.refreshAgentNumOfLocalActionsFromInput(agentId, event.target as HTMLInputElement);
    }
    refreshAgentNumOfLocalActionsFromInput(agentId: number, input: HTMLInputElement) {
        this.getSlsgModelParameters().agents[agentId].numOfLocalActions = parseInt(input.value);
        this.getGenerateState().state$.next();
    }
    
    onAgentNumOfLocalPropsInput(agentId: number, event: Event): void {
        this.refreshAgentNumOfLocalPropsFromInput(agentId, event.target as HTMLInputElement);
    }
    onAgentNumOfLocalPropsBlur(agentId: number, event: Event): void {
        NumberInput.fixIntValueFromMinMax(event.target as HTMLInputElement);
        this.refreshAgentNumOfLocalPropsFromInput(agentId, event.target as HTMLInputElement);
    }
    refreshAgentNumOfLocalPropsFromInput(agentId: number, input: HTMLInputElement) {
        this.getSlsgModelParameters().agents[agentId].numOfLocalProps = parseInt(input.value);
        this.getGenerateState().state$.next();
    }
    ///// END agents
    
    
    
    
    
    ///// BEGIN protocols
    onDeleteProtocolClick(index: number): void {
        const protocols = this.getSlsgModelParameters().protocols;
        protocols.splice(index, 1);
        this.getGenerateState().state$.next();
    }
    
    onProtocolAgentIdInput(index: number, event: Event): void {
        this.refreshProtocolAgentIdFromInput(index, event.target as HTMLInputElement);
    }
    onProtocolAgentIdBlur(index: number, event: Event): void {
        NumberInput.fixIntValueFromMinMax(event.target as HTMLInputElement);
        this.refreshProtocolAgentIdFromInput(index, event.target as HTMLInputElement);
    }
    refreshProtocolAgentIdFromInput(index: number, input: HTMLInputElement) {
        this.getSlsgModelParameters().protocols[index].agentId = parseInt(input.value);
        this.getGenerateState().state$.next();
    }
    
    onProtocolLocActIdInput(index: number, event: Event): void {
        this.refreshProtocolLocActIdFromInput(index, event.target as HTMLInputElement);
    }
    onProtocolLocActIdBlur(index: number, event: Event): void {
        NumberInput.fixIntValueFromMinMax(event.target as HTMLInputElement);
        this.refreshProtocolLocActIdFromInput(index, event.target as HTMLInputElement);
    }
    refreshProtocolLocActIdFromInput(index: number, input: HTMLInputElement) {
        this.getSlsgModelParameters().protocols[index].locActId = parseInt(input.value);
        this.getGenerateState().state$.next();
    }
    
    onProtocolStateClick(index: number, event: Event): void {
        this.refreshProtocolStateFromInput(index, event.target as HTMLInputElement);
    }
    refreshProtocolStateFromInput(index: number, input: HTMLInputElement) {
        this.getSlsgModelParameters().protocols[index].state = input.checked ? "enabled" : "disabled";
        this.getGenerateState().state$.next();
    }
    ///// END protocols
    
    
    
    
    
    ///// BEGIN transitions
    onDeleteTransitionClick(index: number): void {
        const transitions = this.getSlsgModelParameters().transitions;
        transitions.splice(index, 1);
        this.getGenerateState().state$.next();
    }
    
    onTransitionAgentIdInput(index: number, event: Event): void {
        this.refreshTransitionAgentIdFromInput(index, event.target as HTMLInputElement);
    }
    onTransitionAgentIdBlur(index: number, event: Event): void {
        NumberInput.fixIntValueFromMinMax(event.target as HTMLInputElement);
        this.refreshTransitionAgentIdFromInput(index, event.target as HTMLInputElement);
    }
    refreshTransitionAgentIdFromInput(index: number, input: HTMLInputElement) {
        this.getSlsgModelParameters().transitions[index].agentId = parseInt(input.value);
        this.getGenerateState().state$.next();
    }
    
    onTransitionGlobActIdInput(index: number, event: Event): void {
        this.refreshTransitionGlobActIdFromInput(index, event.target as HTMLInputElement);
    }
    onTransitionGlobActIdBlur(index: number, event: Event): void {
        NumberInput.fixIntValueFromMinMax(event.target as HTMLInputElement);
        this.refreshTransitionGlobActIdFromInput(index, event.target as HTMLInputElement);
    }
    refreshTransitionGlobActIdFromInput(index: number, input: HTMLInputElement) {
        this.getSlsgModelParameters().transitions[index].globActId = parseInt(input.value);
        this.getGenerateState().state$.next();
    }
    
    onTransitionStateClick(index: number, event: Event): void {
        this.refreshTransitionStateFromInput(index, event.target as HTMLInputElement);
    }
    refreshTransitionStateFromInput(index: number, input: HTMLInputElement) {
        this.getSlsgModelParameters().transitions[index].state = input.checked ? "enabled" : "disabled";
        this.getGenerateState().state$.next();
    }
    ///// END transitions
    
    
    
    
    
    ///// BEGIN valuations
    onDeleteValuationClick(index: number): void {
        const valuations = this.getSlsgModelParameters().valuations;
        valuations.splice(index, 1);
        this.getGenerateState().state$.next();
    }
    
    onValuationAgentIdInput(index: number, event: Event): void {
        this.refreshValuationAgentIdFromInput(index, event.target as HTMLInputElement);
    }
    onValuationAgentIdBlur(index: number, event: Event): void {
        NumberInput.fixIntValueFromMinMax(event.target as HTMLInputElement);
        this.refreshValuationAgentIdFromInput(index, event.target as HTMLInputElement);
    }
    refreshValuationAgentIdFromInput(index: number, input: HTMLInputElement) {
        this.getSlsgModelParameters().valuations[index].agentId = parseInt(input.value);
        this.getGenerateState().state$.next();
    }
    
    onValuationLocPropIdInput(index: number, event: Event): void {
        this.refreshValuationLocPropIdFromInput(index, event.target as HTMLInputElement);
    }
    onValuationLocPropIdBlur(index: number, event: Event): void {
        NumberInput.fixIntValueFromMinMax(event.target as HTMLInputElement);
        this.refreshValuationLocPropIdFromInput(index, event.target as HTMLInputElement);
    }
    refreshValuationLocPropIdFromInput(index: number, input: HTMLInputElement) {
        this.getSlsgModelParameters().valuations[index].locPropId = parseInt(input.value);
        this.getGenerateState().state$.next();
    }
    
    onValuationStateClick(index: number, event: Event): void {
        this.refreshValuationStateFromInput(index, event.target as HTMLInputElement);
    }
    refreshValuationStateFromInput(index: number, input: HTMLInputElement) {
        this.getSlsgModelParameters().valuations[index].state = input.checked ? "enabled" : "disabled";
        this.getGenerateState().state$.next();
    }
    ///// END valuations
    
    
    
    
    
    ///// BEGIN formula
    onFormulaInput(event: Event): void {
        this.refreshFormulaFromInput(event.target as HTMLInputElement);
    }
    onFormulaBlur(event: Event): void {
        this.refreshFormulaFromInput(event.target as HTMLInputElement);
    }
    refreshFormulaFromInput(input: HTMLInputElement) {
        this.getSlsgModelParameters().formula = input.value;
        this.getGenerateState().state$.next();
    }
    ///// END formula
    
    
    
    
    
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
