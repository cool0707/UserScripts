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
    function replaceImageUrl(img) {
        const matches = img.src.match(/&width=(\d+)&/)
        if (matches) {
            const width = Number(matches[1])
            let newWidth = 0

            if (width == 500) {
                if (img.naturalWidth > img.naturalHeight) {
                    newWidth = 2150
                } else {
                    newWidth = 1612
                }
                img.style.aspectRatio = img.naturalWidth / img.naturalHeight
            } else if (width > 1000 && img.naturalWidth == 0) {
                newWidth = width - 100
            }

            if (newWidth > 0) {
                img.addEventListener('error', (e) => {
                    replaceImageUrl(e.target)
                }, {once: true})
                img.src = img.src.replace('&width=' + width + '&', '&width=' + newWidth + '&')
            }
        }
    }

    // 全画像のURLを書き換え
    function replaceImageUrls() {
        for (const img of document.querySelectorAll('img')){
            if (img.src.match(/documentations/)) {
                replaceImageUrl(img)
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
    window.addEventListener('popstate', event => {
        const back = document.querySelector('.back-button')
        if (back) {
            back.click()
            if (!window.history?.state?.hookBackBtn) {
                window.history.pushState({hookBackBtn: true}, '')
            }
        }
    })
    window.history.pushState({hookBackBtn: true}, '')
})()
