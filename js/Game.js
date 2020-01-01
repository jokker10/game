/*jslint esversion:6 */
'use strict'

import {GameField} from './GameField.js';
import {UI} from './UI.js';

import {MonstersParameters} from './MonstersParameters.js';
import {AnimationsParameters} from './AnimationsParameters.js';

import {Monster} from './Monster.js';
import {Player} from './Player.js';

import {Misc} from './Misc.js';

export class Game{
    constructor( domObj ){
        this.dom = domObj;

        this.widthVisible = domObj.offsetWidth;
        this.widthTotal = 3000;
        this.gameField = new GameField( this.dom, this.widthTotal, this.widthVisible );

        this.paused = false;
        this.gameover = false;

        this.timer = 0;

        this.score = 0;
        this.ticksRate = 200;    // каждые 50мс новый тик (примерно 20 кадров в секунду)
        //this.difficulty = 0;
        //this.pointsToLife = 1000;

        this.monsters = Array();
        this.missiles = Array();

        this.pressed = {
            paused:false,
            left:false,
            right:false,
            att1:false,
            att2:false,
            att3:false,
            block:false
        }

        //                       gameObj, parentDOM,    width, height, posX, posY, speed, animationParamsObject
        this.player = new Player(this, this.gameField.obj, 50, 100, 200, 200, 40, AnimationsParameters.player);


        this.maxMonsters = 5;           // максимальное количество монстров
        this.monsterSpawnCooldown = 8;  // количество тиков между созданием монстров
        this.monsterSpawnCDleft = this.monsterSpawnCooldown;
        this.createMonster();           // но первого монстра создать при старте игры, без проверки кулдауна

        this.ui = new UI( this, this.dom, this.widthVisible );

        // bind чтобы this вел на наш объект game. без этого this будет вести на Window
        this.timer = setInterval( this.gameUpdate.bind(this), this.ticksRate );

        this.keyListenersAdd();
    }

    gameUpdate(){

        if ( this.paused ) {
            return;
        }

        if (this.monsterSpawnCDleft >0){
            this.monsterSpawnCDleft--;
        }

        //проверка всего, что надо проверять

        // 1 - сначала стрелы (т.к. они могут убить монстров и тогда их не придется считать)
        this.missiles.forEach(element => {
            element.update();
        });

        // обновить массивы
        // - стрел (пропавшие/уничтоженные стрелы из массива убираются, надо его уплотнить)
        // - монстров (если кого убили, его выкинуть из массива и не обрабатывать, а массив "уплотнить")

        this.missiles = this.missiles.filter(function (elem) { return !elem.toDestroy });
        this.monsters = this.monsters.filter(function (elem) { return !elem.toDestroy });

        // 2 - потом монстры (т.к. они могут убить игрока)
        this.monsters.forEach(element => {
            element.update();
        });


        // 3 - и только в конце игрока
        this.player.update();

        // и снова проверить массив монстров - вдруг игрок кого убил
        this.monsters = this.monsters.filter(function (elem) { return !elem.toDestroy });
        
        // если новый массив монстров меньше 10 И прошел кулдаун на появление монстров, создать нового
        if ( this.monsters.length < this.maxMonsters && this.monsterSpawnCDleft == 0 ) {
            this.createMonster();
            this.monsterSpawnCDleft = this.monsterSpawnCooldown;
        }

        // перерисовать игровой интерфейс с учетом новых параметров
        this.ui.update();
    }
    
    keyListenersAdd(){
        document.addEventListener( 'keydown', this.keyDownHandler.bind(this) );
        document.addEventListener( 'keyup', this.keyUpHandler.bind(this) );
    }

    keyListenersClear(){
        document.removeEventListener( 'keydown', this.keyDownHandler.bind(this) );
        document.removeEventListener( 'keyup', this.keyDownHandler.bind(this) );
    }

    keyDownHandler( key ){
        let targetProperty = Misc.pressedKey(key);
        switch (targetProperty) {
            case 'att2':
                if (this.player.att2.cdCurr == 0) {
                    this.pressed.att2 = true;
                }
                break;
            case 'att3':
                if (this.player.att3.cdCurr == 0) {
                    this.pressed.att3 = true;
                }
                break;
            default:
                this.pressed[targetProperty] = true;
        }
        /*
        if ( targetProperty !== false ) {
            this.pressed[targetProperty] = true;
        }//*/
    }

    keyUpHandler( key ){
        let targetProperty = Misc.pressedKey(key);
        switch (targetProperty) {
            case 'left':
                this.pressed.left = false;
                return;
            case 'right':
                this.pressed.right = false;
                return;
            case 'att1':
                this.pressed.att1 = false;
                return;

            case 'paused':
                if ( this.paused === false ) {
                    this.paused = true;
                } else {
                    this.paused = false;
                }
                return;
        
            case false:
            default:
                return;
        }
    }

    createMonster(){
        //создать случайного монстра

        // шаг 1 - выбрать, кого именно создавать
        let chanceI   = MonstersParameters.goblin.toSpawnWeight,
            chanceII  = MonstersParameters.troll.toSpawnWeight,
            chanceIII = MonstersParameters.orc.toSpawnWeight,
            rnd = Math.floor( 1+ Math.random() * (chanceI + chanceII + chanceIII) ),
            mon, anim, monXpos;


        if ( rnd > chanceI ) {
            //первый шанс не сработал, проверить второй и третий
            if ( rnd > (chanceI + chanceII) ) {
                //сработал третий шанс, т.е. монстр - орк
                mon = MonstersParameters.orc;
                anim = AnimationsParameters.orc;
            } else {
                //сработал второй шанс, т.е. монстр - тролль
                mon = MonstersParameters.troll;
                anim = AnimationsParameters.troll;
            }
        } else {
            //сработал первый шанс, т.е. монстр - гоблин
            mon = MonstersParameters.goblin;
            anim = AnimationsParameters.goblin;
        }

        // шаг 2 - создать
        /* положение нового монстра = случайное место в правой половине видимой области
           (не считая самые левые 100пикселей, чтобы не появлялись прям перед игроком)
           т.е. случ. число от 0 до (половина) + 100 + половина + на сколько прокручена область
        */
        monXpos = this.gameField.scrolled + this.widthVisible/2 + 100 + Math.floor( 1+ ( Math.random() * (this.widthVisible/2) ) );

        //                              gameObj,   parentDOM,          x, y, objParams, animationParamsObject
        this.monsters.push(new Monster( this, this.gameField.obj, monXpos, 200, mon, anim ));
    }

}