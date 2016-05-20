(function($) {

    /**
     * Check a selector exist or not
     */
    $.fn.exists = function () {
        return this.length !== 0;
    }

})(jQuery);