/*jslint esversion:6 */
'use strict'

import {Misc} from './Misc.js';

export class UI {
    constructor( game, parentDOM, widthVisible ){
        
        let obj = document.createElement('div');
        obj.classList.add('ui');
        obj.style.width = widthVisible + 'px';
        obj.style.left = '0px';
        
        
        obj.innerHTML = `
        <div id="player_life">
            <div class="orb"><div class="bg"></div></div>
            <div class="value"></div>
        </div>        
        <div id="attack1">
            <div class="image"></div>
            <div class="value">Выстрел - клавиша 1</div>
        </div>
        <div id="block">
            <div class="image"></div>
            <div class="value">Блок - клавиша 2</div>
        </div>
        <div id="attack2">
            <div class="image"></div>
            <div class="value">Тройной выстрел - клавиша 3</div>
        </div>
        <div id="attack3">
            <div class="image"></div>
            <div class="value">Град стрел - клавиша 4</div>
        </div>
        <div id="score">
            <div class="description">Набранный счёт:</div>
            <div class="value"></div>
        </div>
        <div id="player_mana">
            <div class="orb"><div class="bg"></div></div>
            <div class="value"></div>
        </div>`;
        
        //parentDOM.append(obj);  //помещаем дом элемент в документ
        parentDOM.insertAdjacentElement('afterend', obj);
        this.game = game;

        // сохраняем ссылки на все изменяемые элементы, чтобы не просматривать всё дерево много раз каждый кадр в поисках
        this.life = {
                orb: obj.querySelector('#player_life .orb .bg'),
                value:obj.querySelector('#player_life .value')
            };
        this.mana = {
                orb: obj.querySelector('#player_mana .orb .bg'),
                value:obj.querySelector('#player_mana .value')
            };
        this.attack1 = {
                image: obj.querySelector('#attack1 .image'),
                value:obj.querySelector('#attack1 .value')
            };
        this.attack2 = {
                image: obj.querySelector('#attack2 .image'),
                value:obj.querySelector('#attack2 .value')
            };
        this.attack3 = {
                image: obj.querySelector('#attack3 .image'),
                value:obj.querySelector('#attack3 .value')
            };
        this.block = {
                image: obj.querySelector('#block .image'),
                value:obj.querySelector('#block .value')
            };
        this.score = {
                value:obj.querySelector('#score .value')
            };

        this.obj = obj;         //сохраняем ссылку на дом-элемент в свойстве объекта
        
        // вычисляем высоту (она равна ширине одного блока грид, которая зависит от ширины экрана, поэтому заранее мы высоту не знали)
        this.elemHeight = this.life.orb.clientWidth;
        // указываем через css вычисленную высоту 
        let sheet = window.document.styleSheets[0];
        sheet.insertRule('.ui>div { height:'+ this.elemHeight +'px; }', sheet.cssRules.length);
        sheet.insertRule('.ui .orb { height:'+ this.elemHeight +'px; }', sheet.cssRules.length);
        this.update();
    }

    update(){
        // перерисовываем жизнь
        this.life.orb.style.boxShadow = 'inset 0px -' + Misc.getSize( this.elemHeight, this.game.player.life, 100 ) + 'px 0px 0px #F4593A';
        this.life.value.innerText = Math.floor( (1 + this.game.player.life*10) / 10);
        
        // перерисовываем ману
        this.mana.orb.style.boxShadow = 'inset 0px -' + Misc.getSize( this.elemHeight, this.game.player.mana, 100 ) + 'px 0px 0px #1443c5';
        this.mana.value.innerText = Math.floor( (1 + this.game.player.mana*10) / 10);

        // перерисовываем кулдауны атаками и блоку
        /* определяем размер падающей внутрь тени как
                максимальный_размер * процент
           где
                процент = текущее_значение / максимальное
           иногда максимальное равно 0 (делить нельзя), поэтому и считаем в отдельной функции с проверкой на это
        */
        this.attack1.image.style.boxShadow = 'inset 0px -' + Misc.getSize( this.elemHeight, this.game.player.att1.cdCurr, this.game.player.att1.cdMax ) + 'px 0px 0px rgba(150, 80, 60, 0.5)';

        this.attack2.image.style.boxShadow = 'inset 0px -' + Misc.getSize( this.elemHeight, this.game.player.att2.cdCurr, this.game.player.att2.cdMax ) + 'px 0px 0px rgba(150, 80, 60, 0.5)';

        this.attack3.image.style.boxShadow = 'inset 0px -' + Misc.getSize( this.elemHeight, this.game.player.att3.cdCurr, this.game.player.att3.cdMax ) + 'px 0px 0px rgba(150, 80, 60, 0.5)';

        this.block.image.style.boxShadow   = 'inset 0px -' + Misc.getSize( this.elemHeight, this.game.player.block.cdCurr, this.game.player.block.cdMax ) + 'px 0px 0px rgba(150, 80, 60, 0.5)';

        // обновляем счет
        this.score.value.innerText = this.game.score;
    }
}