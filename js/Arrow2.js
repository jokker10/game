/*jslint esversion:6 */
'use strict'

//import {BaseUnit} from './BaseUnit.js';
//import {Misc} from './Misc.js';
import {Arrow} from './Arrow.js';

export class Arrow2 extends Arrow {
    constructor( game, direction, parentDOM, posX, posY, ArrowParameters, animationParameters ){
        super( game, direction, parentDOM, posX, posY, ArrowParameters, animationParameters );
        
        // единственное отличие в функциональности от Arrow (+ еще ArrowParameters другие могут быть)
        this.destroyOnCollision = false;
    }
}