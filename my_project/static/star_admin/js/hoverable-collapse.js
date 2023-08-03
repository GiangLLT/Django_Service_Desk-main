// (function($) {
//   'use strict';
  
//   $(document).ready(function() {
//     // Thêm lớp "sidebar-icon-only" vào phần tử "body" khi tải trang
//     $('body').addClass('sidebar-icon-only');
//   });

//   //Open submenu on hover in compact sidebar mode and horizontal menu mode
//   $(document).on('mouseenter mouseleave', '.sidebar .nav-item', function(ev) {
//     var body = $('body');
//     var sidebarIconOnly = body.hasClass("sidebar-icon-only");
//     var sidebarFixed = body.hasClass("sidebar-fixed");
//     if (!('ontouchstart' in document.documentElement)) {
//       if (sidebarIconOnly) {
//         if (sidebarFixed) {
//           if (ev.type === 'mouseenter') {
//             body.removeClass('sidebar-icon-only');
//           }
//         } else {
//           var $menuItem = $(this);
//           if (ev.type === 'mouseenter') {
//             $menuItem.addClass('hover-open')
//           } else {
//             $menuItem.removeClass('hover-open')
//           }
//         }
//       }
//     }
//   });
// })(jQuery);

(function($) {
  'use strict';
  //Open submenu on hover in compact sidebar mode and horizontal menu mode
  $(document).on('mouseenter mouseleave', '.sidebar .nav-item', function(ev) {
    var body = $('body');
    var sidebarIconOnly = body.hasClass("sidebar-icon-only");
    var sidebarFixed = body.hasClass("sidebar-fixed");
    if (!('ontouchstart' in document.documentElement)) {
      if (sidebarIconOnly) {
        if (sidebarFixed) {
          if (ev.type === 'mouseenter') {
            body.removeClass('sidebar-icon-only');
          }
        } else {
          var $menuItem = $(this);
          if (ev.type === 'mouseenter') {
            $menuItem.addClass('hover-open')
          } else {
            $menuItem.removeClass('hover-open')
          }
        }
      }
    }
  });
})(jQuery);