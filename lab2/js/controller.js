(function (controller, $, undefined) {
  $(function () {
    graph.init();

    console.log('best step is ' + graph.bestCount);
  });
} (window.controller = window.controller || {}, jQuery));