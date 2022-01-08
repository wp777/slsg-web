import { Subject } from "rxjs";

export abstract class ObservableState<T> {
    
    state$: Subject<void> = new Subject<void>();
    
    protected setParameter<TKey extends Exclude<keyof T, "type"> & string, TValue>(parameterName: TKey, parameterValue: TValue): void {
        const privateParameterName = `_${parameterName}`;
        const parameters = this as { [key: string]: any };
        if (parameterValue === parameters[privateParameterName]) {
            return;
        }
        if (parameters[privateParameterName] instanceof ObservableState) {
            const oldObservableState = parameters[privateParameterName] as ObservableState<any>;
            oldObservableState.destroy();
        }
        if (parameterValue instanceof ObservableState) {
            const newObservableState = parameterValue as ObservableState<any>;
            this.observeChild(newObservableState);
        }
        parameters[privateParameterName] = parameterValue;
        this.state$.next();
    }
    
    protected observeChild(child: ObservableState<any>): void {
        child.state$.subscribe(() => {
            this.state$.next();
        });
    }
    
    protected createObservedChild<T extends ObservableState<any>>(child: T): T {
        this.observeChild(child);
        return child;
    }
    
    protected destroy(): void {
        this.state$.complete();
        for (let propertyName in this) {
            const propertyValue = this[propertyName];
            if (propertyValue instanceof ObservableState) {
                propertyValue.destroy();
            }
        }
    }
    
}
