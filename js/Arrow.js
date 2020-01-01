/*jslint esversion:6 */
'use strict'

import {BaseUnit} from './BaseUnit.js';
import {Misc} from './Misc.js';

export class Arrow extends BaseUnit {
    constructor( game, direction, parentDOM, posX, posY, ArrowParameters, animationParameters ){
        let speed = (direction === 'right') ? ArrowParameters.speed : -1 * ArrowParameters.speed;
        
        super( parentDOM, ArrowParameters.width, ArrowParameters.height, posX, posY, speed, animationParameters );
        
        this.game = game;
        this.dmg = ArrowParameters.dmg;
        this.aoeZone = ArrowParameters.aoeZone;
        this.lifetime = ArrowParameters.lifetime;

        this.alreadyDamaged = Array();
        this.destroyOnCollision = true;

        if (direction === 'left') {
            this.obj.classList.add( 'face-left' );
        }
    }

    update(){
        // если по какой-то причине стрела помечена к удалению и все еще обратбатывается, не обрабатывать ее
        if ( this.toDestroy ) {
            return;
        }

        // у стрелы есть время жизни, каждый тик оно уменьшается, и когда ноль, стрела пропадает
        this.lifetime--;
        if ( this.lifetime === 0 || this.lifetime < 0 ) {
            this.destroy();
        } else {

            // двигаем стрелу
            if (this.animMode === 'move') {
                this.move();
            } else {
                this.changeAnimMode('move');
                this.move();
            }
            
            // проверяем, задеты ли монстры
            let hitList = this.getHitList();

            // задеты - наносим им урон и уничтожаем стрелу
            if ( hitList !== false ) {
                hitList.forEach(element => {
                    element.takeDamage( this.dmg );
                });

                if ( this.destroyOnCollision === true ) {
                    this.destroy();
                }
            }
        }
    }

    getHitList() {
        let monsToHit = Array();      // список "задетых" (массив, где будут храниться все монстры в зоне поражения)

        this.game.monsters.forEach(element => {
            if ( !this.alreadyDamaged.includes(element) ) {
                if ( Misc.detectCollision( this, element, this.aoeZone ) ) {
                    monsToHit.push(element);
                    this.alreadyDamaged.push(element);
                }
            }
        });

        if ( monsToHit.length >0 ) {
            return monsToHit;
        } else {
            return false;
        }
    }


}