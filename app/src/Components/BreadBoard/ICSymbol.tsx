import { BBSymbol } from "./BBSymbol";

export var ICSymbol: BBSymbol = {
    lines: [],
    rects: [],
    arcs: [],
    circles: []
}

// Upper Half Pins
ICSymbol.rects.push({x: -4, y: 0, w: 8, h: 12})
ICSymbol.rects.push({x: 20, y: 0, w: 8, h: 12})
ICSymbol.rects.push({x: 44, y: 0, w: 8, h: 12})


ICSymbol.rects.push({x: -8, y: 12, w: 64, h: 24})
ICSymbol.arcs.push({x:-8, y:24, r: 5, startAng: 90, endAng: -90, clockwise:true})

// Lower Half Pins
ICSymbol.rects.push({x: -4, y: 36, w: 8, h: 12})
ICSymbol.rects.push({x: 20, y: 36, w: 8, h: 12})
ICSymbol.rects.push({x: 44, y: 36, w: 8, h: 12})
