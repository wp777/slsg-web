export interface Node {
    id: number;
    bgn: 0 | 1;
    win: 0 | 1;
    
    [key: string]: any;
    T: {
        [key: string]: any;
    };
    labelStr?: string;
}
