/*jslint esversion:6 */
'use strict'

import {BaseUnit} from './BaseUnit.js';
import {LifeBar} from './LifeBar.js';
//import {AnimationsParameters} from './AnimationsParameters.js';

export class Monster extends BaseUnit {
    constructor( gameObj, parentDOM, x, y, objParams, animationParamsObject ){
        super(parentDOM, objParams.width, objParams.height, x, y, (-1 * objParams.speed), animationParamsObject); //создаем BaseUnit
        
        this.game = gameObj;    //нужно чтобы добраться до игрока (т.к. монстр может нанести урон игроку)
        this.life = objParams.life;

        //                          parentDOM, maxLife,          width,       height, posY
        this.lifeBar = new LifeBar( this.obj, objParams.life, objParams.width, 15, this.height );

        this.dmg = objParams.dmg;
        this.points = objParams.points;
    }

    update(){
        // главная функция, обрабатывает монстра

        // если по какой-то причине монстр, помечен к удалению и все еще обратбатывается, не обрабатывать его
        if ( this.toDestroy ) {
            return;
        }

        // если длится атака, просто проигрывать кадры атаки дальше + наносим урон, если кадр атаки последний, а игрок рядом
        if ( this.animMode === 'att' ) {
            //this.playAttackAnimation();
            this.updateImage();

        } else {
            // если атака не идет, проверить, не пора ли её начать (вдруг монстр подошел к игроку или наоборот)
            if ( this.isPlayerNearby() ) {
                // пора атаковать. значит, начинаем
                this.changeAnimMode('att');
                this.updateImage();

            } else {
                // не пора. значит, идем вперед
                if (this.animMode === 'move') {
                    // а мы и шли - продолжаем
                    this.move();
                } else {
                    // до этого мы не шли - начинаем идти
                    this.changeAnimMode('move');
                    this.move();
                }
                
            }
        }
    }

    // переопределяем, чтобы монстр упирался в игрока и никогда не налезал на него
    // (реализовано только для монстров, которые идут справа налево)
    move(){    
        this.x += this.speed;
        if ( this.x < (this.game.player.x + this.game.player.width) ) {
            this.x = this.game.player.x + this.game.player.width;
        }

        this.obj.style.left = this.x + 'px';
        this.updateImage();
    }

    takeDamage( dmg ){
        // если по какой-то причине монстр, помечен к удалению и все еще обратбатывается, не обрабатывать его
        if ( this.toDestroy ) {
            return;
        }

        this.life -= dmg;

        if ( this.life < 0 || this.life == 0 ) {
            this.life = 0;
            this.game.score += this.points;
            this.destroy();

        } else {
            this.lifeBar.update(this.life);
        }
    }

    isPlayerNearby(){
        /* расстояние до игрока: 
           левый край монстра минус правый край игрока
           1) если больше или равно нулю - игрок слева, а это число и есть расстояние
           2) если меньше нуля - игрок справа от монстра и расстоянием тогда 
              левый край игрока минус правый край монстра (но так быть не должно)
        */

        let playerXDiffRight = this.game.player.animation[this.game.player.animMode].frameW - this.game.player.width - this.game.player.animation[this.game.player.animMode].xDifferenceLeft,
            distance = this.x - (this.game.player.x + this.game.player.width + playerXDiffRight ),
            threshhold = 50;

        if ( distance > 0 ) {
            // игрок слева
            if ( distance < threshhold ) {
                // и близко
                return true;
            } else {
                // и далеко
                return false;
            }

        } else if ( distance == 0 ) {
            return true;

        } else {
            //игрок справа
            distance = this.game.player.x - (this.x + this.width);
            if ( distance < threshhold ) {
                // и близко
                return true;
            } else {
                // и далеко
                return false;
            }
        }
    }
    
    // в отличие от BaseUnit монстры умеют атаковать, а атаки в конце своей анимации наносят урон,
    // поэтому функцию handleAnimationEnd() надо переопределить
    handleAnimationEnd(){
        if ( this.animMode === 'att' ) {
        
            // атака закончена, сменяем режим на "бездействие"
            this.changeAnimMode( 'idle' )

            // проверяем, рядом ли игрок, если да, наносим урон
            if ( this.isPlayerNearby() ) {
                // рядом - наносим урон
                this.game.player.takeDamage(this.dmg);

            } else {
                // не рядом, ничего не происходит - т.е. игрок может отбежать от монстра и не получить урон
            }

        } else {
            // закончен другой режим анимации
            this.changeAnimMode( 'idle' )
        }
    }
}