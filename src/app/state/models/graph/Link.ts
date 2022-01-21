export interface Link {
    id: number;
    source: number;
    target: number;
    
    [key: string]: any;
    T: string[];
    labelStr?: string;
}
