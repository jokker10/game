/*jslint esversion:6 */
'use strict'

export const AnimationsParameters = {

/* ------------------- P L A Y E R ------------------- */

    player: {
        url: './img/player.png',
        wTotal: 300,
        /*
        общий размер картинки должен быть
        300 ширина (3 кадра по 100) 
        500 высота (5 анимаций по 100 высотой каждая)
        */

        idle: {
            startY: 0,
            totalFrames: 1,
            isCycled: true,
            frameW: 100,
            frameH: 100,
            xDifferenceLeft: 20
        },

        move: {
            startY: -100,
            totalFrames: 2,
            isCycled: true,
            frameW: 100,
            frameH: 100,
            xDifferenceLeft: 20
        },

        block: {
            startY: -200,
            totalFrames: 1,
            isCycled: true,
            frameW: 100,
            frameH: 100,
            xDifferenceLeft: 20
        },

        att1: {
            startY: -300,
            totalFrames: 3,
            isCycled: false,
            frameW: 100,
            frameH: 100,
            xDifferenceLeft: 20
        },

        att2: {
            startY: -300,
            totalFrames: 3,
            isCycled: false,
            frameW: 100,
            frameH: 100,
            xDifferenceLeft: 20
        },

        att3: {
            startY: -400,
            totalFrames: 3,
            isCycled: false,
            frameW: 100,
            frameH: 100,
            xDifferenceLeft: 20
        }
    },

/* ------------------- A R R O W 1 ------------------- */

    arrow: {
        url: './img/arrow1.png',
        wTotal: 30,
        /*
        общий размер картинки должен быть
        30 ширина (1 кадр, 30)
        20 высота (2 анимации по 10 высотой каждая)
        */

        idle: {
            startY: 0,
            totalFrames: 1,
            isCycled: true,
            frameW: 30,
            frameH: 10,
            xDifferenceLeft: 0
        },

        move: {
            startY: -10,
            totalFrames: 1,
            isCycled: true,
            frameW: 30,
            frameH: 10,
            xDifferenceLeft: 0
        },
    },

/* ------------------- A R R O W 2 ------------------- */

    arrow2: {
        url: './img/3arrows.png',
        wTotal: 30,
        /*
        общий размер картинки должен быть
        30 ширина (1 кадр, 30)
        60 высота (2 анимации по 30 высотой каждая)
        */

        idle: {
            startY: 0,
            totalFrames: 1,
            isCycled: true,
            frameW: 30,
            frameH: 30,
            xDifferenceLeft: 0
        },

        move: {
            startY: -30,
            totalFrames: 1,
            isCycled: true,
            frameW: 30,
            frameH: 30,
            xDifferenceLeft: 0
        },
    },

/* ------------------- A R R O W 3 ------------------- */
    
    arrow3: {
        url: './img/rainofarrows.png',
        wTotal: 210,
        /*
        общий размер картинки должен быть
        210 ширина (7 кадров по 30)
        300 высота (2 анимации по 150)
        */

        idle: {
            startY: 0,
            totalFrames: 1,
            isCycled: true,
            frameW: 30,
            frameH: 34,
            xDifferenceLeft: 0
        },

        move: {
            startY: -150,
            totalFrames: 7,
            isCycled: false,
            frameW: 30,
            frameH: 150,
            xDifferenceLeft: 0
        },
    },

/* ------------------- G O B L I N ------------------- */

    goblin: {

        url: './img/goblin.png',
        wTotal: 300,
        /*
        общий размер картинки должен быть
        300 ширина (3 кадра по 100 в анимации атаки)
        300 высота (3 анимации по 100 высотой каждая)
        */

        idle: {
            startY: 0,
            totalFrames: 1,
            isCycled: true,
            frameW: 100,
            frameH: 100,
            xDifferenceLeft: 40
        },

        move: {
            startY: -100,
            totalFrames: 2,
            isCycled: true,
            frameW: 100,
            frameH: 100,
            xDifferenceLeft: 40
        },

        att: {
            startY: -200,
            totalFrames: 3,
            isCycled: false,
            frameW: 100,
            frameH: 100,
            xDifferenceLeft: 40
        }
    },

/* -------------------- T R O L L -------------------- */

    troll: {

        url: './img/troll.png',
        wTotal: 300,
        /*
        общий размер картинки должен быть
        300 ширина (3 кадра по 100 в анимации атаки)
        300 высота (3 анимации по 100 высотой каждая)
        */

        idle: {
            startY: 0,
            totalFrames: 1,
            isCycled: true,
            frameW: 100,
            frameH: 100,
            xDifferenceLeft: 40
        },

        move: {
            startY: -100,
            totalFrames: 2,
            isCycled: true,
            frameW: 100,
            frameH: 100,
            xDifferenceLeft: 40
        },

        att: {
            startY: -200,
            totalFrames: 3,
            isCycled: false,
            frameW: 100,
            frameH: 100,
            xDifferenceLeft: 40
        }
    },

/* ---------------------- O R C ---------------------- */

    orc: {

        url: './img/orc.png',
        wTotal: 300,
        /*
        общий размер картинки должен быть
        300 ширина (3 кадра по 100 в анимации атаки)
        300 высота (3 анимации по 100 высотой каждая)
        */

        idle: {
            startY: 0,
            totalFrames: 1,
            isCycled: true,
            frameW: 100,
            frameH: 100,
            xDifferenceLeft: 40
        },

        move: {
            startY: -100,
            totalFrames: 2,
            isCycled: true,
            frameW: 100,
            frameH: 100,
            xDifferenceLeft: 40
        },

        att: {
            startY: -200,
            totalFrames: 3,
            isCycled: false,
            frameW: 100,
            frameH: 100,
            xDifferenceLeft: 40
        }
    }
};