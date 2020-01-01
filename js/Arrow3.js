/*jslint esversion:6 */
'use strict'

//import {BaseUnit} from './BaseUnit.js';
//import {Misc} from './Misc.js';
import {Arrow} from './Arrow.js';

export class Arrow3 extends Arrow {
    constructor( game, direction, parentDOM, posX, posY, ArrowParameters, animationParameters ){
        super( game, direction, parentDOM, posX, posY, ArrowParameters, animationParameters );

        this.lifetime = this.animation.move.totalFrames;    // теперь мы уверены, что время жизни равно количеству кадров в анимации
    }

    update(){
        // если по какой-то причине стрела помечена к удалению и все еще обратбатывается, не обрабатывать ее
        if ( this.toDestroy ) {
            return;
        }

        // у стрелы есть время жизни, каждый тик оно уменьшается
        // после последнего кадра не стрела удаляется, а запускается проверка на задетых монстров
        this.lifetime--;

        if ( this.lifetime < 0 ) {
            // проверяем, задеты ли монстры
            let hitList = this.getHitList();

            // задеты - наносим им урон и уничтожаем стрелу
            if ( hitList !== false ) {
                hitList.forEach(element => {
                    element.takeDamage( this.dmg );
                });
            }
            this.destroy();

        } else {
            // двигаем стрелу
            if (this.animMode === 'move') {
                this.move();
            } else {
                this.changeAnimMode('move');
                this.move();
            }
        }
    }
}