;
(function() {
    /*
    console.log($('.v2_tab_parent').get(0).getBoundingClientRect())
    console.log($('.v2_tab').children('li:eq(1)').get(0).getBoundingClientRect())
    console.log($('.v2_tab').children('li:nth-last-child(1)').get(0).getBoundingClientRect())
*/

    var holder = $('.v2_tab_parent');
    var tabHolder = $('.v2_tab');
    var rightArrow = $('#rightArrow');
    var leftArrow = $('#leftArrow');
    var sliderHolder = $('.arrowHold');

    var rects = {
        top: 18,
        left: 20
    };

    leftArrow.click(function() {
        resize.goPrevious();
    });

    rightArrow.click(function() {
        resize.goNext();
    });

    var style;

    function constructStyleCss() {
        $('#tabCss').remove();
        style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'tabCss'
        document.getElementsByTagName('head')[0].appendChild(style);
    };

    /**
     * [shrinkTabs return a single tab width ]
     * @return {[Number]} [ calculates and return single tab width ]
     *
     * step 1 : get total width of all tabs.
     * step 2 : get tabHolder width
     * step 3 : we have set margin in css we have to get them as well.
     * step 4 : we have to remove margin to get the actual width
     *          totalWidthWithoutMargin = totalTabsWidth - ( marginWidth * noOfTabs )
     *          singleTabWidth = totalWidthWithoutMargin / noOfTabs;
     *
     * step 5 : check whether tabHolderWidth is lesser than totalTabWidth
     *          if so, reduce the width to adjustable size and use em.
     *
     * step 6 : if in case, tabs are envicted, we will get more space
     *          at that time we have to increase tab size.
     */
    function shrinkTabs() {
        var dom = tabHolder.children('li:not(#1)');
        if (dom.length) {
            var tDOMWidth = resize.getTotalWidth();
            var ttabHolderWidth = tabHolder.width();
            var mWidth = resize.getMargin();
            var oneTabWidth = (tDOMWidth - (mWidth * dom.length)) / dom.length;

            if (tDOMWidth >= ttabHolderWidth) {
                return updateWidth(reduce(ttabHolderWidth, oneTabWidth, mWidth, dom.length) + (mWidth * 2))
            }
            return updateWidth(increase(ttabHolderWidth, oneTabWidth, mWidth, dom.length) + (mWidth * 2));
        }
    }


    /**
     * [updateWidth Updates the width in css style ".v2_tab"]
     * @param  {[Number]} no [updates the width property]
     * @return {[Boolean]}   [true when function executes]
     */
    function updateWidth(no) {
        if (no && (no = parseInt(no)) && style) {
            style.innerHTML = '.v2_tab li { width : ' + no + 'px; max-width: 150px; min-width: 91px; }';
            resize.check();
            return no;
        }
        throw new Error('UpdateWidth expecting a Number');
    }

    /**
     * [reduce Reduce fn, calculates the a minimal width needed to place in tabHolder ]
     * @param  {[Number]} totalWidth  [total width of tabs]
     * @param  {[Number]} oneTabWidth [single tab width]
     * @param  {[Number]} marginWidth [margin]
     * @param  {[Number]} noOfTabs    [total no of tabs]
     * @return {[Number]}             [return minimum width needed to fit tabs in tabHolder]
     *
     * we are including the margins back in calculation to compare
     * with tabHolder width, count decreased by 5;
     *
     * formula :
     *     totalTabWidthWithoutMargin = singleTabWidth * noOfTabs;
     *     totalMarginWidth = marginWidth * noOfTabs;
     *     currentTotalWidth = totalTabWidthWithoutMargin + totalMarginWidth;
     *
     *     if currentTotalWidth is lesser than tabHolder Width then we can say
     *     tabs are fitted in tabHolder.
     */
    function reduce(totalWidth, oneTabWidth, marginWidth, noOfTabs) {
        oneTabWidth = oneTabWidth - 5;
        if (((oneTabWidth * noOfTabs) + (marginWidth * noOfTabs)) <= totalWidth)
            return oneTabWidth
        return reduce(totalWidth, oneTabWidth, marginWidth, noOfTabs)
    }

    /**
     * [increase When tabs are removed or window size is adjusted we have to increase the size of tabs]
     * @param  {[Number]} totalWidth  [total width of tabs]
     * @param  {[Number]} oneTabWidth [single tab width]
     * @param  {[Number]} marginWidth [margin]
     * @param  {[Number]} noOfTabs    [total no of tabs]
     * @return {[Number]}             [return minimum width needed for tabs in tabHolder]
     *
     * We are increasing the current width of singleTab and calculating whether it fits in tabHolder
     * if it fits we are increasing it until, it doesn't fit and then we reduce it by one step
     * and return result.
     * 
     * calculation are same and reduce fn.
     */
    function increase(totalWidth, oneTabWidth, marginWidth, noOfTabs) {
        oneTabWidth = oneTabWidth + 5;
        if (((oneTabWidth * noOfTabs) + (marginWidth * noOfTabs)) >= totalWidth)
            return reduce(totalWidth, oneTabWidth, marginWidth, noOfTabs)
        return increase(totalWidth, oneTabWidth, marginWidth, noOfTabs)
    }

    /**
     * Original Code
     */
    var resize = {
        collision: function($div1, $div2) {
            var x1 = $div1.offset().left;
            var y1 = $div1.offset().top;
            var h1 = $div1.outerHeight(true);
            var w1 = $div1.outerWidth(true);
            var b1 = y1 + h1;
            var r1 = x1 + w1;
            var x2 = $div2.offset().left;
            var y2 = $div2.offset().top;
            var h2 = $div2.outerHeight(true);
            var w2 = $div2.outerWidth(true);
            var b2 = y2 + h2;
            var r2 = x2 + w2;

            if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
            return true;
        },
        getMargin: function() {
            if (!this.cachedMargin) {
                var marginArr = holder.find('li:eq(0)').css('margin').split(/[a-z]+/);
                var mWidth;
                if (marginArr && marginArr.length >= 3 && (mWidth = Math.abs(marginArr[3].trim()))) {
                    this.cachedMargin = mWidth;
                }
            }
            return this.cachedMargin;
        },
        isOverflow: function() {
            return this.getTotalWidth() > this.getHolderWidth();
        },
        isUnderflow: function() {
            return this.getTotalWidth() <= this.getHolderWidth();
        },
        getHolderWidth: function() {
            return holder.width();
        },
        moveToFirst: function() {
            return tabHolder
                .css('margin-left', rects.left + 'px');
        },
        moveNext: function() {
            var no = this.getSingleTabWidth() - this.getMargin();
            return tabHolder
                .css('margin-left', (this.getHolderMargin() - no));
        },
        compareTwoRect: function(holdRect, cTabRect) {
            holdRect = $.extend({}, holdRect);
            cTabRect = $.extend({}, cTabRect);
            cTabRect.top = cTabRect.top - rects.top;
            // console.log('compareTwoRect : ', holdRect);
            // console.log('compareTwoRect : ', cTabRect);
            if (cTabRect.top > holdRect.top) {
                // console.log('move Right we have tab by 130px');
                this.moveNext();
            } else {
                this.checkLeft(holdRect, cTabRect);
            }
            // After focusing tab, we are updating left and right arrows
            this.updateArrow();
        },
        checkLeft: function(hRect, tRect) {
            tRect.left += rects.left;
            // console.debug('checkLeft : ', hRect);
            // console.debug('checkLeft : ', tRect);
            if (hRect.left > tRect.left) {
                // console.log('we can move to first tab with 21px');
                this.moveToFirst();
            } else if (hRect.left < tRect.left && hRect.right > tRect.right) {
                // console.log('tab is in middle of banner');
            } else {
                this.moveNext();
            }
        },
        getSingleTabWidth: function() {
            return tabHolder.children('li:eq(0)').width()
        },
        getTotalWidth: function() {
            var noOfTabs = tabHolder.children('li:not(#1)').length;
            var width = this.getSingleTabWidth();
            width = (noOfTabs * width) - (noOfTabs * this.getMargin());
            return width;
        },
        getDifference: function() {
            return holder.width() - this.getTotalWidth();
        },
        setHolderMargin: function(no) {
            if (no && (no = parseInt(no))) {
                tabHolder.css('margin-left', no + 'px');
            }
            return tabHolder;
        },
        getHolderMargin: function() {
            return parseInt(
                tabHolder.css('margin-left') // ex : "-233px"
                .replace(/[^0-9\-]*/g, '') // ex : 233
            );
        },
        canMoveRight: function() {
            var holderRect = holder.get(0).getBoundingClientRect();
            var lastTab = tabHolder.children('li:nth-last-child(1)').get(0);
            if (lastTab) {
                var lastTabRect = lastTab.getBoundingClientRect();
                var isTopEqual = (holderRect.top == (lastTabRect.top - rects.top))
                return !isTopEqual || (holderRect.right < lastTabRect.right);
            }
        },
        canMoveLeft: function() {
            var holderRect = holder.get(0).getBoundingClientRect()
            var firstTab = tabHolder.children('li:eq(1)').get(0)
            if (firstTab) {
                var firstTabRect = firstTab.getBoundingClientRect();
                var isTopEqual = (holderRect.top == (firstTabRect.top - rects.top))
                return isTopEqual && (holderRect.left > (firstTabRect.left + rects.left));
            }
        },
        goPrevious: function() {
            var ret;
            if (this.canMoveLeft()) {
                var tabWithOutMargin = this.getSingleTabWidth() - this.getMargin();
                ret = this.setHolderMargin(this.getHolderMargin() + tabWithOutMargin);
                this.updateArrow();
                return ret;
            }
        },
        goNext: function() {
            var ret;
            if (this.canMoveRight()) {
                var tabWithOutMargin = this.getSingleTabWidth() - this.getMargin();
                ret = this.setHolderMargin(this.getHolderMargin() - tabWithOutMargin)
                this.updateArrow();
                return ret;
            }
        },
        updateArrow: function() {
            if (this.canMoveRight())
                rightArrow.removeClass('noActive');
            else {
                rightArrow.addClass('noActive');
                // var hRect = holder.get(0).getBoundingClientRect();
                // var tRect = tabHolder.children('li:nth-last-child(1)').get(0);
                // var rightDiff;
                // if (tRect && (rightDiff = (hRect.right - tRect.getBoundingClientRect().right))) {
                //     this.setHolderMargin(this.getHolderMargin() + rightDiff);
                // }
            }
            if (this.canMoveLeft()) {
                leftArrow.removeClass('noActive');
            } else {
                leftArrow.addClass('noActive');
                this.setHolderMargin(rects.left);
            }
        },
        check: function() {
            var ret;
            if (this.isOverflow()) {
                ret = this.setHolderMargin(this.getDifference());
                sliderHolder.removeClass('hide');
            } else {
                ret = this.setHolderMargin(rects.left);
                sliderHolder.addClass('hide');
            }
            this.updateArrow();
            return ret;
        },
        shortcutTabSwitchEvent: function() {
            var hRect = holder.get(0).getBoundingClientRect();
            var tRect = $('#' + util.tabs.getActiveTabId()).get(0).getBoundingClientRect();
            this.compareTwoRect(hRect, tRect);
        }
    }

    util.subscribe('module/controller/onload', constructStyleCss);
    util.subscribe('/tabs/resize/dynamic', shrinkTabs);

    util.subscribe('/tabs/resize/dynamic2', resize, resize.check);
    util.subscribe('/tabs/move/right', resize, resize.goNext);
    util.subscribe('/tabs/move/left', resize, resize.goPrevious);
    util.subscribe('/tabs/move/update/arrows', resize, resize.updateArrow);

    util.subscribe('/switch/tab/shortcut', resize, resize.shortcutTabSwitchEvent);

    module.exports.scroll = resize;
    module.exports.dynamic = {
        getMarginWidth : resize.getMargin,
        getTotalWidth : resize.getTotalWidth,
        getSingleTabWidth : shrinkTabs,
        updateWidth : updateWidth,
        increase : increase,
        reduce : reduce
    };
})();