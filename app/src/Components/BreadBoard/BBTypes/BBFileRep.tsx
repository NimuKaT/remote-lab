import BBICRep from "./BBICRep";
import BBWireRep from "./BBWireRep";
import BBcompRep from "./BBcompRep";

export default interface BBFileRep {
    "comp": Array<BBcompRep>,
    "ic": Array<BBICRep>,
    "wire": Array<BBWireRep>
}