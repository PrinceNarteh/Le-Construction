import {Catalog} from 'cc-floor-plan';

import * as Areas from './areas/area/planner-element.jsx';
import * as Lines from './lines/wall/planner-element.jsx';
import * as Holes from './holes/index.js';
import * as Items from './items/index.js';

let catalog = new Catalog();

for( let x in Areas ) catalog.registerElement( Areas[x] );
for( let x in Lines ) catalog.registerElement( Lines[x] );
for( let x in Holes ) catalog.registerElement( Holes[x] );
for( let x in Items ) catalog.registerElement( Items[x] );

catalog.registerCategory('windows', 'Windows', [Holes.window, Holes.sashWindow, Holes.venetianBlindWindow, Holes.windowCurtain] );
catalog.registerCategory('doors', 'Doors', [Holes.door, Holes.doorDouble, Holes.panicDoor, Holes.panicDoorDouble, Holes.slidingDoor] );

export default catalog;
