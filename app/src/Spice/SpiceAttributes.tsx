// export interface SpiceAttributes {
//     PartNum?: string;
//     InstName: string;
//     Type: string;
//     RefName?: string;
//     Value: string;
//     QArea?: string;
//     Width?: string;
// }

export type SpiceAttributes = Map<string, string>;

type SpiceAttribute = "PartNum" | "InstName" | "Type" | "RefName" |
"Value" | "QArea" | "Width";