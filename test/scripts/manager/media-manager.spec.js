'use strict'

describe('Media manager', function () {
	beforeEach(function () {
		org.ekstep.contenteditor.mediaManager.mediaMap = {}
		org.ekstep.contenteditor.mediaManager.migratedMediaMap = {}
	})

	it('should not fail when adding a blank media', function () {
		org.ekstep.contenteditor.mediaManager.addMedia(undefined)
		expect(_.keys(org.ekstep.contenteditor.mediaManager.mediaMap).length).toBe(0)
	})

	it('should add media to migrated media map', function () {
		org.ekstep.contenteditor.mediaManager.addToMigratedMedia(undefined)
		expect(_.keys(org.ekstep.contenteditor.mediaManager.migratedMediaMap).length).toBe(0)

		org.ekstep.contenteditor.mediaManager.addToMigratedMedia({id: 'do_12312312', src: '/assets/public/assets/test.png'})
		expect(_.keys(org.ekstep.contenteditor.mediaManager.migratedMediaMap).length).toBe(1)
	})

	it('should get media origin URL', function () {
		org.ekstep.contenteditor.api.setConfig('aws_s3_urls', ['https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/', 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/'])
		org.ekstep.contenteditor.api.setConfig('baseURL', 'https://dev.ekstep.in')
		org.ekstep.contenteditor.api.setConfig('absURL', '')
		var url = org.ekstep.contenteditor.mediaManager.getMediaOriginURL('https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/assets/test.png')
		expect(url).toBe('https://dev.ekstep.in/assets/public/assets/test.png')

		url = org.ekstep.contenteditor.mediaManager.getMediaOriginURL('https://s3.ap-southeast-1.amazonaws.com/ekstep-public-dev/assets/test.png')
		expect(url).toBe('https://s3.ap-southeast-1.amazonaws.com/ekstep-public-dev/assets/test.png')

		org.ekstep.contenteditor.api.setConfig('useProxyForURL', true)
		url = org.ekstep.contenteditor.mediaManager.getMediaOriginURL('https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/assets/test.png')
		expect(url).toBe('https://dev.ekstep.in/assets/public/assets/test.png')
	})
})
