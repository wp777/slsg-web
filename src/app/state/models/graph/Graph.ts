import { Link } from "./Link";
import { Node } from "./Node";

export interface Graph {
    links: Link[];
    nodes: Node[];
    nodeClick?: (id: number) => void,
    edgeClick?: (id: number) => void,
    id: string;
}
