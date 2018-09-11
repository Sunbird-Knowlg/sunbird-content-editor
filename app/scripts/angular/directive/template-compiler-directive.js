angular.module('editorApp').directive('compilehtml', ['$compile', function ($compile) {
	return {
		restrict: 'A',
		replace: true,
		link: function (scope, ele, attrs) {
			scope.$watch(attrs.compilehtml, function (html) {
				ele.html(html)
				$compile(ele.contents())(scope)
			})
		}
	}
}])
