export var compList = new Map();
compList.set('res', 'LINE Normal 16 88 16 96\n' +
'LINE Normal 0 80 16 88\n' +
'LINE Normal 32 64 0 80\n' +
'LINE Normal 0 48 32 64\n' +
'LINE Normal 32 32 0 48\n' +
'LINE Normal 16 16 16 24\n' +
'LINE Normal 16 24 32 32\n' +
'WINDOW 0 36 40 Left 2\n' +
'WINDOW 3 36 76 Left 2');
compList.set('cap', 'LINE Normal 16 36 16 64\n' +
'LINE Normal 16 28 16 0\n' +
'LINE Normal 0 28 32 28\n' +
'LINE Normal 0 36 32 36\n' +
'WINDOW 0 24 8 Left 2\n' +
'WINDOW 3 24 56 Left 2')
compList.set('ind', 'ARC Normal 0 40 32 72 4 68 4 44\n' +
'ARC Normal 0 16 32 48 4 44 16 16\n' +
'ARC Normal 0 64 32 96 16 96 4 68\n' +
'WINDOW 0 36 40 Left 2\n' +
'WINDOW 3 36 80 Left 2')
compList.set('ADR4533', 'RECTANGLE Normal -128 -64 128 96\n' +
'TEXT 0 0 Center 2 ADI')
compList.set('voltage', 'LINE Normal -8 36 8 36\n' +
'LINE Normal -8 76 8 76\n' +
'LINE Normal 0 28 0 44\n' +
'LINE Normal 0 96 0 88\n' +
'LINE Normal 0 16 0 24\n' +
'CIRCLE Normal -32 24 32 88\n' +
'WINDOW 0 24 16 Left 2\n' +
'WINDOW 3 24 96 Left 2')
compList.set('AD549', 'LINE Normal -32 32 32 64\n' +
'LINE Normal -32 96 32 64\n' +
'LINE Normal -32 32 -32 96\n' +
'LINE Normal -28 48 -20 48\n' +
'LINE Normal -28 80 -20 80\n' +
'LINE Normal -24 84 -24 76\n' +
'LINE Normal 0 32 0 48\n' +
'LINE Normal 0 96 0 80\n' +
'LINE Normal 4 44 12 44\n' +
'LINE Normal 8 40 8 48\n' +
'LINE Normal 4 84 12 84\n' +
'WINDOW 0 16 32 Left 2\n' +
'WINDOW 3 16 96 Left 2')
compList.set('LM301', 'LINE Normal -32 -32 -16 -32\n' +
'LINE Normal -32 0 -16 0\n' +
'LINE Normal 32 -16 16 -16\n' +
'LINE Normal 32 16 16 16\n' +
'LINE Normal -32 16 -16 16\n' +
'LINE Normal -32 -16 -16 -16\n' +
'LINE Normal 32 0 16 0\n' +
'LINE Normal 32 -32 16 -32\n' +
'RECTANGLE Normal 16 24 -16 -40\n' +
'ARC Normal -8 -32 8 -48 -8 -40 8 -40\n' +
'WINDOW 3 0 35 Center 0\n' +
'WINDOW 0 0 60 Center 0')