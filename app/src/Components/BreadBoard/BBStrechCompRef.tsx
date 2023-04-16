import { Vector2d } from "konva/lib/types";
import { BBSymbol } from "./BBSymbol";

export default class BBStretchCompRef {
    symbols: Map<string, BBSymbol> = new Map<string, BBSymbol>()
    anchors: Map<string, Array<Vector2d>> = new Map<string, Array<Vector2d>>()

    constructor() {
        // Resistor
        let anchor: Array<Vector2d> = []
        let symbol: BBSymbol = {
            lines: [],
            rects: [],
            arcs: [],
            circles: [],
        }
        symbol.rects.push({
            x: -10,
            y: -15,
            w: 20,
            h: 30
        });
        anchor.push({x:0, y: -15})
        anchor.push({x:0, y:15})
        this.symbols.set('res', symbol);
        this.anchors.set('res', anchor)


        // Capacitor
        anchor = [];
        symbol = {
            lines: [],
            rects: [],
            arcs: [],
            circles: [],
        }
        symbol.lines.push({points:[-10, -5, 10, -5]})
        symbol.lines.push({points:[-10, 5, 10, 5]})
        anchor.push({x:0, y:-5})
        anchor.push({x:0, y:5})
        this.symbols.set('cap', symbol)
        this.anchors.set('cap', anchor)
    }

    getSymbol(name: string): BBSymbol {
        let symbol = this.symbols.get(name)
        if (symbol !== undefined) {
            return symbol
        } else {
            return {
                lines: [],
                rects: [],
                arcs: [],
                circles: []
            }
        }
    }

    getAnchor(name: string): Array<Vector2d> {
        let anchors = this.anchors.get(name);
        if (anchors !== undefined) {
            return anchors
        }
        else {
            return [];
        }
    }
}