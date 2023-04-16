import { Vector2d } from "konva/lib/types";
import SPNode from "./Node";
import NodeManager from "./NodeManager";
import { pinDef } from "./pinDef";
import SPCompObject from "./SPCompObject";
import { SpiceAttributes } from "./SpiceAttributes";
import { SysAttr } from "./SysAttr";

export class SPComponent {
    pos: Vector2d;
    shift: Vector2d = {x: 0, y: 0};
    label: string;
    name: string;
    nodes: Array<SPNode>;
    orientation: string;
    values: Map<string, string>;
    manager: NodeManager;
    ref?: SPCompObject;
    rotation: number = 0;
    flip: boolean = false;
    deleted: boolean = false;
    attributes: SpiceAttributes;

    constructor(pos: Vector2d, name: string, orientation: string, manager: NodeManager, label: string) {
        this.pos = pos;
        this.name = name;
        this.nodes = [];
        this.orientation = orientation;
        this.values = new Map();
        this.manager = manager;
        this.label = label
        this.genNodes();
        this.attributes = this.getDefaultAttributes(name)
        this.attributes.set('InstName', label);
    }

    place() {
        this.pos.x = this.pos.x + this.shift.x;
        this.pos.y = this.pos.y + this.shift.y;
        this.cancelMove();
        this.nodes.forEach((node: SPNode) => {
            node.updateConnection();
        })
        this.updateRef();
    }

    cancelMove() {
        this.shift = {x: 0, y: 0}
        this.setSelected(false);
        this.setFollowing(false);

            this.nodes.forEach((node) => {
                node.setShift(0, 0)
                node.updateConnection();
            })
        this.ref?.forceUpdate();
    }

    setShift(shift: Vector2d) {
        if (this.shift.x !== shift.x || this.shift.y !== shift.y) {
            this.shift = shift;
            this.nodes.forEach((node) => {
                node.setShift(shift.x, shift.y)
                node.updateConnection();
            })
            this.ref?.forceUpdate();
            this.getCollisionBox();
        }
    }

    setSelected(selected: boolean) {
        this.ref?.setSelected(selected);
    }

    setFollowing (following: boolean) {
        this.ref?.setFollowing(following);
    }

    setRef(ref: SPCompObject) {
        this.ref = ref;
    }

    getCollisionBox() {
        return this.ref?.getCollisionBox();
    }

    updateRef() {
        this.ref?.onDragEnd();
        // this.ref?.forceUpdate();
    }

    getX() {
        return this.pos.x + this.shift.x;
    }
    getY() {
        return this.pos.y + this.shift.y;
    }

    genNodes() {
        if (pinDef.has(this.name)) {
            pinDef.get(this.name)?.split('\n').forEach((cmd: string) => {
                let node: SPNode = this.manager.newNode(this);
                node.setParent(this);
                let values: Array<string> = cmd.split(' ');
                node.setInitPos(parseInt(values[1]), parseInt(values[2]));
                this.nodes.push(node);
            })
        }
    }

    getName() {
        return this.name;
    }

    updatePos(pos: Vector2d) {
        this.pos = pos;
    }
    
    checkNodes() {
        this.nodes.forEach((node) => {
            node.updateConnection();
        })
    }

    changeOrientation(orientation: string) {
        this.orientation = orientation;
    }

    addNodes(node: SPNode) {
        this.nodes.push(node);
    }

    getNodes() {
        return this.nodes;
    }

    changeValue(key: string, value: string) {
        this.values.set(key, value);
    }

    getValue(key: string) {
        return this.values.get(key);
    }

    transform(rotation: number, flip: boolean) {
        this.rotation = rotation;
        this.flip = flip;
        this.updateRef();
    }

    delete() {
        this.deleted = true;
        this.setSelected(false);
        this.setFollowing(false);
        this.nodes.forEach((node) => {
            node.delete();
        })
        this.ref?.forceUpdate();
    }

    getDefaultAttributes(name: string) {
        this.attributes = new Map();
        let cmd = SysAttr.get(name);
        cmd.split('\n').forEach((line: string) => {
            let words = line.split(' ');
            this.attributes.set(words[1], words.splice(2).join(' ') );
        });
        return this.attributes;
    }

    getSchematic() {
        let data: Array<string> = [];
        if (!this.deleted) {
            data = ["SYMBOL " + this.name + " " + this.pos.x + " " + this.pos.y + " R0"]
            this.attributes.forEach((val, key) => {
                if (key != "Prefix" && key != "Description") {
                    data.push("SYMATTR " + key + " " + val);
                }
            })
        }
        return data
    }

    getAttribute(attr: string) {
        return this.attributes.get(attr);
    }

    getAttributeList() {
        let list: Array<string> = [];
        this.attributes.forEach((value, key) => {
            if (key != "Prefix" && key != "Description") {
                list.push(key);
            }
        })
        return list;
    }

    setAttribute(attr: string, value: string) {
        this.attributes.set(attr, value);
        this.ref?.forceUpdate();
    }
}