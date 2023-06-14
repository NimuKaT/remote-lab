import { Vector2d } from "konva/lib/types";

export default interface BBICRep {
    "modelName": string,
    "orientation": string,
    "localPos": Vector2d,
    "pinCount": number
}