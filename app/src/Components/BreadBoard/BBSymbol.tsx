import { ArcCMD } from "./Shapes/ArcCMD";
import { CircleCMD } from "./Shapes/CircleCMD";
import { LineCMD } from "./Shapes/LineCMD";
import { RectCMD } from "./Shapes/RectCMD";

export interface BBSymbol {
    lines: Array<LineCMD>,
    rects: Array<RectCMD>
    arcs: Array<ArcCMD>
    circles: Array<CircleCMD>
}