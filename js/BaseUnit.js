/*jslint esversion:6 */
'use strict'

import {Animation} from './Animation.js';

export class BaseUnit {
    constructor( parentDOM, width, height, posX, posY, speed, animationParamsObject ){

        this.parentDOM = parentDOM;
        this.toDestroy = false;

        this.x = posX;
        this.y = posY;
        
        this.width = width;
        this.height = height;

        this.speed = speed;

        this.animMode = 'idle';     // idle - стоит на месте (не должен отображаться дольше 1 тика)
                                    // move - двигается
                                    // остальные режимы специфичные для отдельных сущностей
                                    // att - атакует (у монстров 1 вид атаки)
                                    // у игрока есть блок и три вида атак
        this.modeChanged = false;
        this.lastShownFrameNum = 0;

        this.animation = new Animation(animationParamsObject);

        // создаем дом-элемент
        let domObj = document.createElement('div');
        domObj.classList.add('baseunit');

        // т.к. монстры умеют ходить только по горизонтали, пложение по высоте задается один раз и не обновляется
        domObj.style.top = posY + 'px';

        //сохраняем ссылку на дом-элемент в свойстве объекта
        this.obj = domObj;

        this.updateImage( this.animation.getNextFrameParams( this.animMode, this.modeChanged, this.lastShownFrameNum ) );

        this.parentDOM.append(domObj);   //помещаем дом элемент в документ
    }

    move(){
        this.x += this.speed;
        this.obj.style.left = this.x + 'px';
        this.updateImage();
    }

    destroy(){
        this.parentDOM.removeChild(this.obj); // удалить дом-объект из дом-дерева (его теперь не видно на странице)
        this.obj = null;                // удалить ссылку на сам дом-объект (его теперь вообще нет)
        this.toDestroy = true;          // пометить объект к удалению
    }
    
    /* Это нужно только стрелам и игроку, не здесь
    detectCollision(){
        //определяет, не столкнулся ли объект с чем-нибудь, занимающим то же положение на игровом поле
    }
    //*/

    changeAnimMode( newMode ) {
        this.animMode = newMode;
        this.modeChanged = true;
        this.lastShownFrameNum = 0;
    }

    updateImage(){
        let imageParams = this.animation.getNextFrameParams( this.animMode, this.modeChanged, this.lastShownFrameNum );
        
        this.modeChanged = false;   // если анимация продолжается, то эта строка ничего не делает, 
                                    // а если началась новая, то после первого кадра надо установить именно false
        
        // положение картинки с монстром на gamefield = положение монстра с точки зрения игры - отступ слева на всякие выступающие части типа дубинки
        this.obj.style.left     = this.x - imageParams.xDifferenceLeft + 'px';

        //this.obj.style.bottom   = this.y + 'px';

        this.obj.style.width    = imageParams.frameW + 'px';
        this.obj.style.height   = imageParams.frameH + 'px';
        
        this.obj.style.backgroundImage     = imageParams.url;
        this.obj.style.backgroundPositionX = imageParams.xOffset;
        this.obj.style.backgroundPositionY = imageParams.yOffset;

        
        this.lastShownFrameNum = imageParams.newFrameNum;

        if ( imageParams.animationEnded === true ) {
            this.handleAnimationEnd();
        }
    }

    handleAnimationEnd(){
        this.changeAnimMode( 'idle' )
    }
}