/*jslint esversion:6 */
'use strict'

export class Misc {
    constructor(){
        //нет тут ничего, нужен для хранения всяких разных функций, связанных с событиями нажатий
    }

    static pressedKey( key ){
        /*
        обрабатываться должны следующие клавиши
        клавиша          что делать при нажатиии

        стрелка влево  - игрок двигается влево
        стрелка вправо - игрок двигается вправо
         
        escape         - ставит игру на паузу

        (цифровые клавиши в основном блоке)
        1 - простой выстрел
        2 - блок
        3 - выстрел тремя стрелами, которые летят сквозь (?) монстров, пока не упадут
        4 - "град стрел"

         */
        switch (key.code) {
            // https://www.w3.org/TR/uievents-code/

            // пауза
            case 'Escape':
                return 'paused';
                
            // атаки и блок
            case 'Digit1':
                return 'att1';

            case 'Digit3':
                return 'att2';

            case 'Digit4':
                return 'att3';

            case 'Digit2':
                return 'block';
            
            // стрелки
            case 'ArrowLeft':
                return 'left';

            case 'ArrowRight':
                return 'right';
        
            default:
                return false;
        }
    }

    static updDomNode( selector, value ){
        selector.innerText(value);
    }

    static getSize( scale, current, max ){
        if ( max === 0 ) {
            return 0;
        } else {
            return Math.round( scale * current / max )

        }
    }

    static detectCollision( a, b, aAoe=0 ){
        if ( a.x > b.x ) {
            // левый край А правее левого края Б,
            // проверяем дальше левый край А
            if ( a.x < (b.x + b.width) ) {
                // и при это он левее правого края Б (т.е. А левой стороной "налезает" на Б, т.е. они пересекаются)
                return true;
            } else {
                // он правее и правого края Б (т.е. А целиком просто справа от Б, т.е. пересечения нет)
                return false;
            }

        } else {
            // левый край А левее левого края Б,
            // проверяем правый край А
            if ( (a.x + a.width + aAoe) < b.x ) {
                // правый край А левее левого края Б (т.е. А целиком слева от Б, т.е. пересечения нет)
                return false;
            } else {
                // правый край А правее левого края Б (т.е. А правой стороной "налезает" на Б, т.е. они пересекаются)
                return true;
            }
        }
    }
    
}