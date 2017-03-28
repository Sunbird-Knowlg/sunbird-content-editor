'use strict';


describe('Media manager', function() {

    beforeEach(function() {
        EkstepEditor.mediaManager.mediaMap = {};
        EkstepEditor.mediaManager.migratedMediaMap = {};
    });

    it('should not fail when adding a blank media', function() {

        EkstepEditor.mediaManager.addMedia(undefined);
        expect(_.keys(EkstepEditor.mediaManager.mediaMap).length).toBe(0);
    });

    it('should add media to migrated media map', function() {

        EkstepEditor.mediaManager.addToMigratedMedia(undefined);
        expect(_.keys(EkstepEditor.mediaManager.migratedMediaMap).length).toBe(0);

        EkstepEditor.mediaManager.addToMigratedMedia({id: 'do_12312312', src: '/assets/public/assets/test.png'});
        expect(_.keys(EkstepEditor.mediaManager.migratedMediaMap).length).toBe(1);
    });

    it('should get media origin URL', function() {

        EkstepEditorAPI.setConfig('aws_s3_urls', ["https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/", "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/"]);
        EkstepEditorAPI.setConfig('baseURL', 'https://dev.ekstep.in');
        EkstepEditorAPI.setConfig('absURL', '');
        var url = EkstepEditor.mediaManager.getMediaOriginURL('https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/assets/test.png');
        expect(url).toBe('https://dev.ekstep.in/assets/public/assets/test.png');

        url = EkstepEditor.mediaManager.getMediaOriginURL('https://s3.ap-southeast-1.amazonaws.com/ekstep-public-dev/assets/test.png');
        expect(url).toBe('https://s3.ap-southeast-1.amazonaws.com/ekstep-public-dev/assets/test.png');

        EkstepEditorAPI.setConfig('useProxyForURL', true);
        url = EkstepEditor.mediaManager.getMediaOriginURL('https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/assets/test.png');
        expect(url).toBe('https://dev.ekstep.in/assets/public/assets/test.png');
    });

});
