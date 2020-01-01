/*jslint esversion:6 */
'use strict'

export const ArrowParameters = {
    arrow : {
        width: 30,
        height: 10,
        speed: 40,
        dmg: 15,
        aoeZone: 20,
        lifetime: 20
    },

    arrow2 : {
        width: 30,
        height: 30,
        speed: 40,
        dmg: 40,
        aoeZone: 0,
        lifetime: 8
    },

    arrow3 : {
        width: 30,
        height: 150,
        speed: 40,
        dmg: 100,
        aoeZone: 100,
        lifetime: 7     // не используется - перезаписывается количеством кадров анимации move
    }
};