import { Bisimulation } from "./Bisimulation";
import { Generate } from "./Generate";
import { Reduction } from "./Reduction";
import { Verification } from "./Verification";

export type SomeAction = Bisimulation | Generate | Reduction | Verification;
