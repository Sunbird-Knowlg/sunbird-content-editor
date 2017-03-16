'use strict';

describe('stage manager', function(){

	describe('when initialized', function(){

		it('should define canvas object', function() {
			expect(EkstepEditor.stageManager.canvas).toBeDefined();
		});

		it('should initialize fabric object', function() {			
			expect(fabric.Object.prototype.transparentCorners).toBe(false);
      expect(fabric.Object.prototype.lockScalingFlip).toBe(true);
      expect(fabric.Object.prototype.hasRotatingPoint).toBe(false);
      expect(fabric.Object.prototype.cornerSize).toBe(6);
      expect(fabric.Object.prototype.padding).toBe(2);
      expect(fabric.Object.prototype.borderColor).toBe("#1A98FA");
      expect(fabric.Object.prototype.cornerColor).toBe("#1A98FA");
		});

	});
});