/*jslint esversion:6 */
'use strict'

export class GameField {
    constructor( parentDOM, widthTotal, widthVisible ){
        let obj = document.createElement('div');
        obj.classList.add('gamefield');
        obj.style.width = widthTotal + 'px';
        obj.style.left = '0px';
        
        parentDOM.append(obj);  // помещаем дом элемент в документ
        
        this.obj = obj;         // сохраняем ссылку на дом-элемент в свойстве объекта
        this.scrolled = 0;
        this.halfScreen = widthVisible/2;
        this.widthTotal = widthTotal;
        this.maxScroll = widthTotal - widthVisible;
    }

    scroll(){
        //this.scrolled += value;

        if ( this.scrolled > this.maxScroll ) {
            // "карта" прокручена до конца
            this.scrolled = this.maxScroll;
            this.obj.style.left = '-' + this.scrolled + 'px';
            return false;

        } else {
            // двигать карту (она еще не до конца "прокручена")
            this.obj.style.left = '-' + this.scrolled + 'px';
            return true;
        }
    }
}