import { Vector2d } from "konva/lib/types";

export default interface BBcompRep {
    "type": string,
    "value": string,
    "nodes": Array<Vector2d>
    "mainBodyPos": Vector2d,
}