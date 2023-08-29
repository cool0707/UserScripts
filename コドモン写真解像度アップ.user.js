// ==UserScript==
// @name         コドモン写真解像度アップ
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  コドモンの写真解像度を上げる
// @author       Ryosuke
// @match        https://parents.codmon.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codmon.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 画像のURLを書き換え
    function replaceImageUrls() {
        for (const img of document.querySelectorAll('img')){
            if (img.src.match(/documentations/)) {
                if (img.naturalWidth > img.naturalHeight) {
                    img.src = img.src.replace('&width=500&', '&width=2150&')
                } else {
                    img.src = img.src.replace('&width=500&', '&width=1612&')
                }
            }
        }
    }

    document.querySelector('body').addEventListener('click', event => {
        const target = event.target
        // メニュー画面のカード要素の子孫要素をクリックした場合
        if (target.matches('.homeCard') || target.matches('.homeCard *')) {
            setTimeout(() => { replaceImageUrls() }, 100)
        }
        if (target.matches('.activity__card--photo') || target.matches('.activity__card--photo img')) {
            for (const child of target.children) {
                if( child.tagName == 'IMG') {
                    window.open(child.src)
                }
            }
        }
    }, false)

    replaceImageUrls()

    // 戻る無効
    // 戻る無効
    window.addEventListener('popstate', event => {
        const back = document.querySelector('.back-button')
        alert()
        if (back) {
            back.click()
            if (!window.history?.state?.hookBackBtn) {
                console.log("hook back btn.")
                window.history.pushState({hookBackBtn: true}, '')
            }
        }
    })
})()
