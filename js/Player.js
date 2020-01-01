/*jslint esversion:6 */
'use strict'

import {BaseUnit} from './BaseUnit.js';
import {ArrowParameters} from './ArrowParameters.js';
import {AnimationsParameters} from './AnimationsParameters.js';

import {Arrow} from './Arrow.js';
import {Arrow2} from './Arrow2.js';
import {Arrow3} from './Arrow3.js';

import {Misc} from './Misc.js';

export class Player extends BaseUnit{
    constructor( gameObj, parentDOM, width, height, posX, posY, speed, animationParamsObject ){
        super(parentDOM, width, height, posX, posY, speed, animationParamsObject);   //создаем BaseUnit

        this.game = gameObj;
        this.life = 100;
        this.mana = 100;

        this.direction = 'right';
        
        // округляем до 3 знаков после запятой
        this.lifePerTick = Math.floor( 1+(0.002 * this.game.ticksRate)*1000) / 1000;     //2 в секунду (1000мс), т.е. за 1мс 2/1000 = 0.002
        this.manaPerTick = Math.floor( 1+(0.005 * this.game.ticksRate)*1000) / 1000;     //5 в секунду
        this.cooldownReductionPerTick = this.game.ticksRate;

        this.att1 = {
            cdCurr: 0,
            cdMax: 0,
            cost: 0
        };
        this.att2 = {
            cdCurr: 0,
            cdMax: 3000,
            cost: 10
        };
        this.att3 = {
            cdCurr: 0,
            cdMax: 15000,
            cost: 30
        };
        this.block = {
            cdCurr: 0,
            cdMax: 0,
            cost: 5
        };
    }

    update(){
        // сначала проверка входящего урона, только потом регенерация
        if (this.toDestroy) {
            // нас убили, конец игры
            this.gameOver();
        }

        // уменьшаем кулдауны на навыках, регенерируем жизнь и ману
        this.life = Math.min( this.life + this.lifePerTick, 100);
        this.mana = Math.min( this.mana + this.manaPerTick, 100);
        this.att1.cdCurr  = Math.max(0, this.att1.cdCurr - this.cooldownReductionPerTick);
        this.att2.cdCurr  = Math.max(0, this.att2.cdCurr - this.cooldownReductionPerTick);
        this.att3.cdCurr  = Math.max(0, this.att3.cdCurr - this.cooldownReductionPerTick);
        this.block.cdCurr = Math.max(0, this.block.cdCurr - this.cooldownReductionPerTick);


        // если длится атака (т.е. анимация началась, но еще не закончилась), проиграть её до конца
        if ( this.animMode === 'att1' || this.animMode === 'att2' || this.animMode === 'att3' ){
            this.updateImage();
        } else {

            // если атака не в процессе, дальнейшие действия зависят от того, какая кнопка нажата

            // идем только в какую-нибудь одну сторону - или влево, или вправо
            // если одновременно нажаты влево и вправо, никуда не идем
            // у движения приоритет над всем остальным (т.е. если мы идем, то не стреляем)
            if( this.game.pressed.left && !this.game.pressed.right ){
                // идти влево (только если нажата влево и не нажата вправо)
                this.direction = 'left';
                this.speed = (this.speed >0) ? this.speed * -1 : this.speed;
                this.obj.classList.add('face-left');

                if (this.animMode === 'move') {
                    this.move();
                } else {
                    this.changeAnimMode('move');
                    this.move();
                }

            } else if( this.game.pressed.right && !this.game.pressed.left ){
                // идти вправо (только если нажата вправо и не нажата влево)
                this.direction = 'right';
                this.speed = (this.speed >0) ? this.speed : this.speed * -1 ;
                this.obj.classList.remove('face-left');
                
                if (this.animMode === 'move') {
                    this.move();
                } else {
                    this.changeAnimMode('move');
                    this.move();
                }

            } else {
                // из остальных действий выполнится первое, у которого условие выполнилось
                // условие - нажатая кнопка И истекший кулдаун на соответствующее этой кнопке действие И хватает маны
                if( this.game.pressed.att3 && this.att3.cdCurr === 0 && this.mana > this.att3.cost ){
                    // атака 3 (дождь стрел)
                    this.att3.cdCurr = this.att3.cdMax;     // ставим кулдаун
                    this.mana -= this.att3.cost;            // отнимаем ману
                    this.game.pressed.att3 = false;         // отмечаем, что кнопка больше не нажата
                    this.changeAnimMode('att3');            // начинаем само действие

                } else if( this.game.pressed.att2 && this.att2.cdCurr === 0 && this.mana > this.att2.cost ){
                    // атака 2 (три стрелы)
                    this.att2.cdCurr = this.att2.cdMax;     // ставим кулдаун
                    this.mana -= this.att2.cost;            // отнимаем ману
                    this.game.pressed.att2 = false;         // отмечаем, что кнопка больше не нажата
                    this.changeAnimMode('att2');

                } else if( this.game.pressed.block && this.block.cdCurr === 0 && this.mana > this.block.cost ){
                    // блок
                    this.block.cdCurr = this.block.cdMax;    // ставим кулдаун
                    this.mana -= this.block.cost;            // отнимаем ману
                    this.game.pressed.block = false;         // отмечаем, что кнопка больше не нажата
                    this.changeAnimMode('block');

                } else if( this.game.pressed.att1 && this.att1.cdCurr == 0 && this.mana > this.att1.cost ){
                    // атака 1
                    this.att1.cdCurr = this.att1.cdMax;     // ставим кулдаун
                    this.mana -= this.att1.cost;            // отнимаем ману
                    //this.game.pressed.att1 = false;         // отмечаем, что кнопка больше не нажата
                    this.changeAnimMode('att1');

                } else {
                    this.changeAnimMode('idle');
                }

                this.updateImage();
            }
        }
    }
    move(){
        /*
        если мы упираемся в левую часть экрана, никуда не идем
        упираемся в левую часть: player.x == gamefield.scrolled

        если мы упираемся в "середину" видимой области, мы продолжаем идти,
        а gamefield прокручивается так, чтобы 
        gamefield.scrolled + gamefield.halfScreen == player.x

        то есть мы должны сделать
        gamefield.scrolled  = player.x - gamefield.halfScreen

        если при этом 
        gamefield.scrolled > gamefield.maxScroll
        то мы дошли до правого конца "карты" и надо дальше двигать игрока, а не прокручивать поле

        в остальных случаях просто меняем координату игрока
        //*/

        let newX = this.x + this.speed, // новая координата игрока
            gf = this.game.gameField,   // короткая ссылка на gameField для удобства
            newScrolled;

        if ( newX < gf.scrolled ) {
            // мы уперлись в левый край
            this.x = gf.scrolled;

        } else if (newX > gf.scrolled + gf.halfScreen ) {
            // мы "прошли" сквозь середину, так что прокрутить игровое поле на разницу
            this.x = newX;
            newScrolled = newX - gf.halfScreen;

            if ( newScrolled > gf.maxScroll ) {
                // мы прошли так далеко, что игровое поле уже некуда прокручивать - персонаж может идти и по правой половине
                gf.scrolled = gf.maxScroll;
                gf.scroll();

                if ( newX + this.width > gf.widthTotal ) {
                    // но по правой половине можно дойти до самого конца карты. в таком случае мы победили
                    this.x = gf.widthTotal - this.width;
                    this.gameWon();

                } else {
                    // еще не победили - просто идем по правой части
                    this.x = newX;
                }

            } else {
                // прошли еще не слишком далеко - просто прокручиваем игровое поле
                this.x = newX;
                gf.scrolled  = newX - gf.halfScreen;
                gf.scroll();
            }

        } else {
            // мы просто идем
            this.x = newX;
        }

        this.updateImage();

        // не сказано, как обрабатывать ситуации, когда игрок "налезает" на монстров (а проверки при движении на это нет),
        // поэтому просто получаем урон, как будто этот монстр нас ударил (КАЖДЫЙ ТИК - т.е. можно быстро умереть)
        this.game.monsters.forEach(element => {
            if ( Misc.detectCollision( this, element, 0 ) ) {
                this.takeDamage( element.dmg );
            }
        });
    }

    takeDamage( dmg ){
        // если игрок в состоянии блока, урон он не получает
        if (this.animMode === 'block') {
            this.changeAnimMode('idle');
            this.updateImage();
            this.game.pressed.block = false;
            return;
        }

        // получаем урон
        this.life -= dmg;
        this.checkForDeath();

    }

    checkForDeath(){
        if (this.life < 0 || this.life == 0) {
            // если здоровья стало ноль или меньше, конец игры
            this.life = 0;
            this.gameOver();

        } else {
            // мы просто получили урон
        }
    }

    gameOver(){
        // убираем таймер
        clearTimeout(this.game.timer);

        // убираем обработку нажатий
        this.game.keyListenersClear();
        alert('Поражение');
    }

    gameWon(){
        // убираем таймер
        clearTimeout(this.game.timer);

        // убираем обработку нажатий
        this.game.keyListenersClear();
        alert('Победа!');
    }
    
    // т.к. в отличие от BaseUnit  игрок умеет атаковать, а атаки в конце своей анимации создают стрелы,
    // функцию handleAnimationEnd() надо переопределить
    handleAnimationEnd(){
        let arrowX = (this.direction == 'right') ? this.x + this.width/0.66 : this.x - 20;
        if ( this.animMode === 'att1' ) {
            // простой выстрел
            //                                                             parentDOM,      posX,   posY,      ArrowParameters,       animationParameters 
            this.game.missiles.push( new Arrow( this.game, this.direction, this.parentDOM, arrowX, this.y+50, ArrowParameters.arrow, AnimationsParameters.arrow ) );

        } else if ( this.animMode === 'att2' ) {
            // создать три стрелы
            this.game.missiles.push( new Arrow2( this.game, this.direction, this.parentDOM, arrowX, this.y+40, ArrowParameters.arrow2, AnimationsParameters.arrow2 ) );

        } else if ( this.animMode === 'att3' ) {
            // запустить стрелы в воздух
            this.game.missiles.push( new Arrow3( this.game, this.direction, this.parentDOM, arrowX, this.y-90, ArrowParameters.arrow3, AnimationsParameters.arrow3  ) );
        }

        // сменяем режим на "бездействие"
        this.changeAnimMode( 'idle' )
    }


}