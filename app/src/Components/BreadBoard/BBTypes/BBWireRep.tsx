import { Vector2d } from "konva/lib/types"

export default interface BBWireRep {
    "nodePos": Array<Vector2d>,
    "anchors": Array<Vector2d>,
    "color": string
}