describe('User service', function () {
	var activities = '{"id": "api.user.search","ver": "v1","ts": "2019-01-02 09:14:57:033+0000","params": {"resmsgid": null,"msgid": "a96b3412-3f04-415e-826f-6f37bece768d","err": null,"status": "success","errmsg": null},"responseCode": "OK","result": {"response": {"count": 1,"content": [{"lastName": "Pandith","identifier": "159e93d1-da0c-4231-be94-e75b0c226d7c","firstName": "Sunil","organisations": [{"organisationId": "0123673542904299520", "updatedBy": "781c21fc-5054-4ee0-9a02-fbb1006a4fdd", "orgName": "dev-announcement", "addedByName": "I4Z7pa6g5C7f6Wn4zJhMn9pofdS6DgF70BqDobtbBswjkbR1vQH8lHRPSMcrhie2XWI2fj83cxh6\n2Jrl8DcKRHz8M7G9aRH1EHLuQWCJz80IxYcwhIoOcIBWQgj2SZmWT6a+wzaAmCWueMEdPmZuRg==", "addedBy": "16517913-ae66-4b78-be8a-325da74e561c", "roles": [ "PUBLIC", "ANNOUNCEMENT_SENDER", "CONTENT_CREATOR", "TEACHER_BADGE_ISSUER", "COURSE_MENTOR", "BOOK_CREATOR", "BOOK_REVIEWER" ], "approvedBy": null, "updatedDate": "2018-09-06 13:36:52:515+0000", "userId": "159e93d1-da0c-4231-be94-e75b0c226d7c", "approvaldate": null, "isDeleted": false, "hashTagId": "0123673542904299520", "isRejected": false, "id": "0123673629008527360", "position": null, "isApproved": false, "orgjoindate": "2017-11-03 05:32:47:795+0000", "orgLeftDate": null }, { "organisationId": "0123673689120112640", "updatedBy": null, "orgName": "dev-announcement", "addedByName": "bD+oZDoya/tnM46jNhdcHf7UFB/BMXS2ybiIigE+CN++qb9RHUhiUtMmV82GhVrPnDnaR8OS9gSY\nhMxfj5lHMaZ5e4X7Mxt3tjrSP0zYFDk88XNaBLgXAjO6rZITNk3DT6a+wzaAmCWueMEdPmZuRg==", "addedBy": "159e93d1-da0c-4231-be94-e75b0c226d7c", "roles": [ "PUBLIC", "ANNOUNCEMENT_SENDER" ], "approvedBy": "159e93d1-da0c-4231-be94-e75b0c226d7c", "updatedDate": null, "userId": "159e93d1-da0c-4231-be94-e75b0c226d7c", "approvaldate": "2017-11-03 05:42:02:541+0000", "isDeleted": false, "hashTagId": null, "isRejected": false, "id": "0123673696439746562", "position": null, "isApproved": true, "orgjoindate": "2017-11-03 05:42:02:540+0000", "orgLeftDate": null } ] } ] } }, "responseTime": 123 }'
	beforeAll(function () {
		org.ekstep.services.config = {
			baseURL: org.ekstep.contenteditor.config.baseURL,
			apislug: org.ekstep.contenteditor.config.apislug
		}
		org.ekstep.services.userService.post = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			cb(undefined, activities)
		})
	})

	it('should return activities on search method call', function () {
		var request = '{ "request": { "query": "", "filters": { "organisations.roles": [ "BOOK_CREATOR" ], "rootOrgId": [ "ORG_001" ], "userId": [ "159e93d1-da0c-4231-be94-e75b0c226d7c", "0c383526-2677-46be-8fb0-06d41392d40b", "4a698288-5d8b-4ed1-8b21-3215d945c474", "bb4c9877-a025-44fe-aa3b-e2291fba0008" ] }, "fields": [ "email", "firstName", "identifier", "lastName", "organisations", "rootOrgName", "phone" ], "offset": 0, "limit": 200 } }'
		spyOn(org.ekstep.services.userService, 'search').and.callThrough()
		spyOn(org.ekstep.services.userService, 'postFromService').and.callThrough()

		org.ekstep.services.userService.search(request, function (err, res) {
			expect(err).toBeUndefined()
			expect(res).toBe(activities)
			expect(org.ekstep.services.userService.postFromService).toHaveBeenCalled()
			expect(org.ekstep.services.userService.postFromService.calls.count()).toBe(1)
		})
	})

	it('should return error on search method call', function () {
		org.ekstep.services.userService.post = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			var error = 'no data found'
			cb(error, undefined)
		})
		var request = '{ "request": { "query": "", "filters": { "organisations.roles": [ "BOOK_CREATOR" ], "rootOrgId": [ "ORG_001" ], "userId": [ "159e93d1-da0c-4231-be94-e75b0c226d7c", "0c383526-2677-46be-8fb0-06d41392d40b", "4a698288-5d8b-4ed1-8b21-3215d945c474", "bb4c9877-a025-44fe-aa3b-e2291fba0008" ] }, "fields": [ "email", "firstName", "identifier", "lastName", "organisations", "rootOrgName", "phone" ], "offset": 0, "limit": 200 } }'
		spyOn(org.ekstep.services.userService, 'search').and.callThrough()
		spyOn(org.ekstep.services.userService, 'postFromService').and.callThrough()
		org.ekstep.services.userService.search(request, function (err, res) {
			expect(err).toBe('no data found')
			expect(org.ekstep.services.userService.postFromService).toHaveBeenCalled()
			expect(org.ekstep.services.userService.postFromService.calls.count()).toBe(1)
		})
	})
	it('should return activities on updateCollaborators method call', function () {
		var activities = '{ "id": "api.collaborator.update", "ver": "1.0", "ts": "2019-01-02T09:42:33.526Z", "params": { "resmsgid": "bad78d60-0e72-11e9-b894-e3b4332e4dda", "msgid": "bab78240-0e72-11e9-b1db-a9d801d2948e", "status": "successful", "err": null, "errmsg": null }, "responseCode": "OK", "result": { "content_id": "do_11265256986546995213", "versionKey": "1546422153461" }, "responseTime": 369 }'
		org.ekstep.services.userService.post = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			cb(undefined, activities)
		})
		var contentId = 'do_11265256986546995213'
		var request = '{ "request": { "content": { "collaborators": [ "752e319c-b38e-4394-bf9d-f4ff97270945", "159e93d1-da0c-4231-be94-e75b0c226d7c", "0c383526-2677-46be-8fb0-06d41392d40b", "4a698288-5d8b-4ed1-8b21-3215d945c474", "bb4c9877-a025-44fe-aa3b-e2291fba0008" ] } } }'
		spyOn(org.ekstep.services.userService, 'updateCollaborators').and.callThrough()
		spyOn(org.ekstep.services.userService, 'postFromService').and.callThrough()
		org.ekstep.services.userService.updateCollaborators(contentId, request, function (err, res) {
			expect(err).toBeUndefined()
			expect(res).toBe(activities)
			expect(org.ekstep.services.userService.postFromService).toHaveBeenCalled()
			expect(org.ekstep.services.userService.postFromService.calls.count()).toBe(1)
		})
	})
	it('should return error on updateCollaborators method call', function () {
		org.ekstep.services.userService.post = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			var error = 'no collaborators found for this content'
			cb(error, undefined)
		})

		var contentId = 'do_11265256986546995213'
		var request = '{ "request": { "content": { "collaborators": [ "752e319c-b38e-4394-bf9d-f4ff97270945", "159e93d1-da0c-4231-be94-e75b0c226d7c", "0c383526-2677-46be-8fb0-06d41392d40b", "4a698288-5d8b-4ed1-8b21-3215d945c474", "bb4c9877-a025-44fe-aa3b-e2291fba0008" ] } } }'
		spyOn(org.ekstep.services.userService, 'updateCollaborators').and.callThrough()
		spyOn(org.ekstep.services.userService, 'postFromService').and.callThrough()
		org.ekstep.services.userService.updateCollaborators(contentId, request, function (err, res) {
			expect(res).toBeUndefined()
			expect(err).toBe('no collaborators found for this content')
			expect(org.ekstep.services.userService.postFromService).toHaveBeenCalled()
			expect(org.ekstep.services.userService.postFromService.calls.count()).toBe(1)
		})
	})
})
