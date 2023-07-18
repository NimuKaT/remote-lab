import { BBResItem } from "./BBResItem";

export default class BBCompSearch {
    resItems: Array<BBResItem> = [
        {value: '1'},
        {value: '10'},
        {value: '100'},
        {value: '1k'},
        {value: '10k'},
        {value: '100k'},
        {value: '1M'},
        {value: '1.2'},
        {value: '12'},
        {value: '120'},
        {value: '1.2k'},
        {value: '12k'},
        {value: '120k'},
        {value: '1.5'},
        {value: '15'},
        {value: '150'},
        {value: '1.5k'},
        {value: '15k'},
        {value: '150k'},
        {value: '1.8'},
        {value: '18'},
        {value: '180'},
        {value: '1.8k'},
        {value: '18k'},
        {value: '180k'},
        {value: '2.2'},
        {value: '22'},
        {value: '220'},
        {value: '2.2k'},
        {value: '22k'},
        {value: '220k'},
        {value: '2.7'},
        {value: '27'},
        {value: '270'},
        {value: '2.7k'},
        {value: '27k'},
        {value: '270k'},
        {value: '3.3'},
        {value: '33'},
        {value: '330'},
        {value: '3.3k'},
        {value: '33k'},
        {value: '330k'},
        {value: '3.9'},
        {value: '39'},
        {value: '390'},
        {value: '3.9k'},
        {value: '39k'},
        {value: '390k'},
        {value: '4.7'},
        {value: '47'},
        {value: '470'},
        {value: '4.7k'},
        {value: '47k'},
        {value: '470k'},
        {value: '5.6'},
        {value: '56'},
        {value: '560'},
        {value: '5.6k'},
        {value: '56k'},
        {value: '560k'},
        {value: '6.8'},
        {value: '68'},
        {value: '680'},
        {value: '6.8k'},
        {value: '68k'},
        {value: '680k'},
        {value: '8.2'},
        {value: '82'},
        {value: '820'},
        {value: '8.2k'},
        {value: '82k'},
        {value: '820k'},

        // {value: '5'},
        // {value: '50'},
        // {value: '500'},
        // {value: '5k'},
        // {value: '50k'},
        // {value: '500k'},
    ]

    capItems: Array<string> = [
        // "1p",
        "10p",
        "100p",
        "1n",
        "10n",
        "100n",
        "1u",
        // "10u",
        // "100u",
        // "1.5p",
        "15p",
        "150p",
        "1.5n",
        "15n",
        "150n",
        // "1.5u",
        // "15u",
        // "150u",
        // "2.2p",
        "22p",
        "220p",
        "2.2n",
        "22n",
        "220n",
        // "2.2u",
        // "22u",
        "220u",
        "3.3p",
        "33p",
        "330p",
        "3.3n",
        "33n",
        "330n",
        // "3.3u",
        // "33u",
        // "330u",
        "3.9p",
        "39p",
        "4.7p",
        "47p",
        "470p",
        "4.7n",
        "47n",
        "470n",
        // "4.7u",
        // "47u",
        // "470u",
        "5.6p",
        "56p",
        "560p",
        "5.6n",
        "56n",
        "560n",
        "6.8p",
        "68p",
        "680p",
        "6.8n",
        "68n",
        "680n",
        // "6.8u",
        // "68u",
        // "680u",
        "8.2p",
        "82p",
        "820p",
        "8.2n",
        "82n",
        "820n"

        // "2p",
        // "20p",
        // "200p",
        // "2n",
        // "20n",
        // "200n",
        // "2u",
        // "20u",
        // "200u",
        // "3p",
        // "30p",
        // "300p",
        // "3n",
        // "30n",
        // "300n",
        // "3u",
        // "30u",
        // "300u",
    ]

    icItems: Map<string, number> = new Map<string, number>();

    constructor() {
        this.icItems.set("LM301", 8)
        this.icItems.set("LM741", 8)
        this.icItems.set("LM348", 14)
        this.icItems.set("CA3083", 16)
        this.icItems.set("POT", 4)
    }

    findRes(val: string) {
        let result: Array<BBResItem> = []
        this.resItems.forEach((item) => {
            if (item.value.includes(val)) {
                result.push(item)
            }
        })
        return result
    }

    findCap(val: string) {
        let result: Array<string> = [];
        this.capItems.forEach((item) => {
            if (item.includes(val)) {
                result.push(item)
            }
        })
        return result
    }
    findIC(val: string) {
        let result: Array<{name: string, pin: number}> = [];
        this.icItems.forEach((item, key) => {
            if (key.includes(val)) {
                result.push({name: key, pin: item})
            }
        })
        return result
    }
    getPinCount(val: string) {
        if (this.icItems.has(val)) {
            return this.icItems.get(val)
        }
        return 0
    }
}