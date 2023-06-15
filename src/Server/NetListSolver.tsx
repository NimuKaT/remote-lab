
export function netListSolver(refNetList: Array<string>, targetNetList: Array<string>) {
    let refComps: Array<component> = []
    let targetComps: Array<component> = []
    let refNetMap: Map<string, number> = new Map<string, number>()
    let targetNetMap: Map<string, number> = new Map<string, number>()
    refNetMap.set('0', 0)
    targetNetMap.set('0', 0)

    refNetList.forEach((line) => {
        refComps.push(getCompFromNets(line))
    })

    targetNetList.forEach((line) => {
        targetComps.push(getCompFromNets(line))
    })
    let count = 1;
    refComps.forEach((comp) => {
        comp.nodes.forEach((netName) => {
            let num = refNetMap.get(netName)
            if (num != undefined) {
                comp.relNodes.push(num)
            } else {
                comp.relNodes.push(count)
                refNetMap.set(netName, count);
                count ++;
            }
        })
    })
    count = 1;
    targetComps.forEach((comp) => {
        comp.nodes.forEach((netName) => {
            let num = targetNetMap.get(netName)
            if (num != undefined) {
                comp.relNodes.push(num)
            } else {
                comp.relNodes.push(count)
                targetNetMap.set(netName, count);
                count ++;
            }
        })
    })

    // STRICT MODE
    if (targetComps.length !== refComps.length) {
        // console.log("Miss match in the number of components connected in the circuit.")
        return -5
    }

    // console.log(refNetMap)
    // console.log(targetNetMap)

    let matchingIndexes: Array<Array<number>> = [];
    // Find possible matching component of ref in target
    refComps.forEach((rcomp) => {
        let match : Array<number> = [];
        targetComps.forEach((tcomp, index) => {
            if (rcomp.value === tcomp.value) {
                match.push(index);
            }
        })
        if (match.length > 0) {
            matchingIndexes.push(match);
        }
    })

    if (matchingIndexes.length === refComps.length) {
        // console.log('has enough matches')
    } else {
        // console.log('not enough matches')
    }
    // console.log(matchingIndexes)
    // console.log(refComps)
    // console.log(targetComps)

    // Attempt matching nets
    let fMap: Array<number> = []
    let bMap: Array<number> = []
    refNetMap.forEach(() => {fMap.push(-1)})
    fMap[0] = 0;
    targetNetMap.forEach(() => {bMap.push(-1)})
    bMap[0] = 0;
    let targetCompMapped: Array<number> = []
    targetComps.forEach(() => {targetCompMapped.push(-1)})
    return testCompMatch(refComps, targetComps, matchingIndexes, fMap, bMap, targetCompMapped, 0)

}

function getCompFromNets(line: string): component {
        let values = line.split(' ');
        let comp: component = {
            prefix: values[0].charAt(0),
            value: '',
            // value: values[1],
            instName: values[0],
            nodes: new Array<string>(),
            relNodes: new Array<number>(),
            reversable: false
        }

        if (comp.prefix === 'R' || comp.prefix === 'C') {
            comp.reversable = true;
            if (values.length >= 4) {
                comp.nodes = [values[1], values[2]];
                comp.value = values[3];
            }
        }
        else if (comp.prefix === 'V') {
            if (values.length >= 4) {
                comp.nodes = [values[1], values[2]];
                comp.value = values[3];
            }
        }
        // else if (comp.prefix === 'X') {
        else {
            // console.log(values);
            
            let nodes: Array<string> = [];
            for (let i = 0; i < values.length - 1; i++) {
                nodes.push(values[1+i]);
            }
            comp.value = values[values.length-1];
            comp.nodes = nodes;
        }
        
        return comp
 
}

// returns -1 on failure, 0 on success and a positive integer on the ref node number that caused the failure
function testCompMatch(refComps: Array<component>, targetComps: Array<component>, matchedIndex: Array<Array<number>>, fMap: Array<number>, bMap: Array<number>, targetCompMapped: Array<number>, currComp: number): number {
    let cfMap: Array<number> = []
    let cbMap: Array<number> = []
    // console.log('testing currComp index: %d', currComp)
    
    if (currComp >= refComps.length) {
        // console.log('Reached the end of comps of length: %d', refComps.length)
        return 0
    }

    let testIndexes: Array<number> = matchedIndex[currComp];
    let testC = 0;
    let testI: number = 0;

    let changes: Map<number, number> = new Map<number, number>();
    let rchanges: Map<number, number> = new Map<number, number>();

    let refNets = refComps[currComp].relNodes;
    let isReversed = false
    // console.log(refNets)

    // console.log("Ref Comp number: %d", currComp);
    // console.log("testIndexes: ", testIndexes);
    // console.log("testIndexes.length: %d", testIndexes.length);
    

    while (testC < testIndexes.length) {
        testI = testIndexes[testC];
        while (targetCompMapped[testI] >= 0 && testC + 1 < testIndexes.length) {
            testC++;
            testI = testIndexes[testC];
        }
        // console.log("Testing target comp index: %d", testI)
        let targetNets = targetComps[testI].relNodes;
        if (isReversed) {
            let temp = targetNets;
            targetNets = [temp[1], temp[0]]
            // console.log(temp)
            // console.log(targetNets)
        }

        // Copy foward and back node maps
        cfMap = []
        cbMap = []
        fMap.forEach((num) => {cfMap.push(num)})
        bMap.forEach((num) => {cbMap.push(num)})
        changes = new Map<number, number>();
        rchanges = new Map<number, number>();
        
        // console.log(targetNets)
        for (let i = 0; i < refNets.length; i++) {
            let refMapping = cfMap[refNets[i]];
            let targetMapping = cbMap[targetNets[i]]
            // console.log(refComps[currComp].instName)
            // console.log("current Ref node: %d, current target node: %d", refNets[i], targetNets[i])
            // console.log(cfMap)
            // console.log(cbMap)
            
            if (refMapping === -1 && targetMapping === -1) {
                // If true the relative nodes have no mapping and is a possible correct mapping
                changes.set(refNets[i], targetNets[i])
                rchanges.set(targetNets[i], refNets[i])
                cfMap[refNets[i]] = targetNets[i]
                cbMap[targetNets[i]] = refNets[i]
            }
            else if (refMapping === targetNets[i] && targetMapping === refNets[i]) {
                // The current mapping of nets are still valid for this pair

            }
            else {
                // If a mapping already exists for one but not the other then there is a problem
                // If only ref is defined then the issue lies with the mapping
                // If only target is defined then the issue lies with the net of ref that maps to target
                if (targetMapping === -1 && targetNets[i] !== -1) {
                    // If only ref is defined check if ref is defined by current node
                    if (changes.has(refNets[i])) {
                        // If ref is defined by current comp mapping try new comp mapping
                        if (refComps[currComp].reversable && !isReversed) {
                            isReversed = true;
                            testI = -1;
                        }
                        else {
                            testC++;
                            isReversed = false
                        }
                        break;
                    }
                    else if(refNets[i] !== 0) {
                        if (refComps[currComp].reversable && !isReversed) {
                            isReversed = true;
                            testI = -1;
                        }
                        else {
                            // console.log("failed due to ref defeinition")
                            return refNets[i]
                        }
                        break
                    }
                    else {
                        if (refComps[currComp].reversable && !isReversed) {
                            isReversed = true;
                            testI = -1;
                        }
                        else {
                            testC++;
                            isReversed = false
                        }
                        break
                    }
                }
                else {
                    if (rchanges.has(targetNets[i])) {
                        // If target is defined by current comp mapping try new comp mapping
                        if (refComps[currComp].reversable && !isReversed) {
                            isReversed = true;
                            testI = -1;
                        }
                        else {
                            testC++;
                            isReversed = false
                        }
                        break;
                    } 
                    else if (targetNets[i] !== 0){
                        if (refComps[currComp].reversable && !isReversed) {
                            isReversed = true;
                            testI = -1;
                        }
                        else {
                            // console.log("failed due to target defeinition")
                            // console.log(refNets)
                            // console.log(targetNets);
                            // console.log(refComps[currComp])
                            // console.log(isReversed);
                            
                            testC++;
                            isReversed = false
                            // return bMap[targetNets[i]]
                        }
                        break
                    }
                    else {
                        if (refComps[currComp].reversable && !isReversed) {
                            isReversed = true;
                            testI = -1;
                        }
                        else {
                            testC++;
                            isReversed = false
                        }
                        break;
                    }
                }
            }
        }
        if (testC < testIndexes.length && testI === testIndexes[testC]) {
            // Once a mapping of nets succeds pass the current maping to the next component
            // if it fails with a change made by the current component try the next one
            // if its fails with a change made by another component return the node number

            // console.log("Guessing %d matches %d", currComp, testI)
            targetCompMapped[testI] = currComp;
            let status: number = testCompMatch(refComps, targetComps, matchedIndex, cfMap, cbMap, targetCompMapped, currComp+1);
            if (changes.has(status) || status < 0) {
                targetCompMapped[testI] = -1;
                if (refComps[currComp].reversable && !isReversed) {
                    isReversed = true;
                } else {
                    testC++;
                    isReversed = false
                }
            }
            else {
                return status;
            }
        } else {
            // console.log("Failed a match")
        }

    }

    // console.log("curr COmp: %d", currComp)
    // console.log("Exit with error with testC: %d", testC)
    // console.log("testIndex.legth: %d, testI: %d", testIndexes.length, testI)
    // console.log("match index: ")
    // console.log(matchedIndex);
    // console.log("\n")

    return -1;
}

type component = {
    prefix: string,
    value: string,
    instName: string,
    nodes: Array<string>,
    relNodes: Array<number>,
    reversable: boolean
}