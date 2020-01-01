/*jslint esversion:6 */
'use strict'

import {Misc} from './Misc.js';

export class LifeBar {
    /* полоска жизни над монстром:
    
        прямоугольник с темно-серой рамкой,
        в центре текстом текущее количество жизни
        полоска красного цвета отражает процент имеющегося здоровья, серый фон - отнятое здоровье
        полоска имеющихся жизней сделана как падающая внутрь блока тень красного цвета
    */
    constructor( parentDOM, maxLife, width, height, bottom ) {
        this.maxLife = maxLife;
        this.maxWidth = width;

        //создать блок
        let bar = document.createElement('div');
        bar.classList.add('lifebar');
        bar.style.width     = width + 'px';
        bar.style.height    = height + 'px';
        bar.style.bottom    = bottom + 'px';
        bar.innerText       = maxLife;  //написать внутри числом здоровье

        parentDOM.append(bar);  // разместить в дом-дереве

        this.obj = bar;         //сохранить ссылку в свойстве объекта
        this.update(maxLife);   //нарисовать красную полоску
    }

    update(curr){
        //this.bar.style.boxShadow = 'inset ' + Math.round( this.maxWidth * curr / this.maxLife ) + 'px 0px 0px 0px #F4593A';
        this.obj.style.boxShadow = 'inset ' + Misc.getSize( this.maxWidth, curr, this.maxLife ) + 'px 0px 0px 0px #F4593A';
        this.obj.innerText = curr;
    }
}