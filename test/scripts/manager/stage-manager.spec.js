'use strict'

describe('Stage Manager', function () {
	it('should fire impression telemetry on loading stages', function () {
        var stages = [{"x":0,"y":0,"w":100,"h":100,"id":"d3319b8a-6120-40c7-842a-6a771ea437b5","rotate":null,"config":{"__cdata":"{\"opacity\":100,\"strokeWidth\":1,\"stroke\":\"rgba(255, 255, 255, 0)\",\"autoplay\":false,\"visible\":true,\"color\":\"#FFFFFF\",\"genieControls\":false,\"instructions\":\"\"}"},"param":[{"name":"next","value":"95c410b0-7470-49d6-8517-67925309ec47"}],"manifest":{"media":[]}},{"x":0,"y":0,"w":100,"h":100,"id":"95c410b0-7470-49d6-8517-67925309ec47","rotate":null,"config":{"__cdata":"{\"opacity\":100,\"strokeWidth\":1,\"stroke\":\"rgba(255, 255, 255, 0)\",\"autoplay\":false,\"visible\":true,\"color\":\"#FFFFFF\",\"genieControls\":false,\"instructions\":\"\"}"},"param":[{"name":"previous","value":"d3319b8a-6120-40c7-842a-6a771ea437b5"},{"name":"next","value":"0008553b-3403-41b2-bb0d-be6628039629"}],"manifest":{"media":[]}},{"x":0,"y":0,"w":100,"h":100,"id":"0008553b-3403-41b2-bb0d-be6628039629","rotate":null,"config":{"__cdata":"{\"opacity\":100,\"strokeWidth\":1,\"stroke\":\"rgba(255, 255, 255, 0)\",\"autoplay\":false,\"visible\":true,\"color\":\"#FFFFFF\",\"genieControls\":false,\"instructions\":\"\"}"},"param":[{"name":"previous","value":"95c410b0-7470-49d6-8517-67925309ec47"},{"name":"next","value":"212c1e51-66be-4a8b-a886-337742e109b4"}],"manifest":{"media":[]}},{"x":0,"y":0,"w":100,"h":100,"id":"212c1e51-66be-4a8b-a886-337742e109b4","rotate":null,"config":{"__cdata":"{\"opacity\":100,\"strokeWidth\":1,\"stroke\":\"rgba(255, 255, 255, 0)\",\"autoplay\":false,\"visible\":true,\"color\":\"#FFFFFF\",\"genieControls\":false,\"instructions\":\"\"}"},"param":[{"name":"previous","value":"0008553b-3403-41b2-bb0d-be6628039629"}],"manifest":{"media":[]}}];
        spyOn(org.ekstep.contenteditor.stageManager, '_loadStages').and.callThrough()
        spyOn(org.ekstep.services.telemetryService,'impression').and.callThrough()
        org.ekstep.contenteditor.stageManager._loadStages(stages,'{}',new Date().getTime())
		expect(org.ekstep.services.telemetryService.impression).toHaveBeenCalled()      
	})
})
