'use strict';

org.ekstep.contenteditor.migration = new(Class.extend({
    migrationFlag: false,
    init: function() {
        console.log('migration task initialized');
        org.ekstep.contenteditor.api.addEventListener('content:migration:start', this.execute, this);
    },
    _startTime: undefined,
    tasks: ['mediamigration_task', 'basestage_task', 'orderstage_task', 'scribblemigration_task', 'imagemigration_task', 'readalongmigration_task', 'assessmentmigration_task', 'eventsmigration_task', 'settagmigration_task'],
    migrationErrors: [],
    execute: function(event, data) {
        var contentbody = data.body, stageIcons = data.stageIcons;

        if (!_.has(contentbody, 'theme.stage')) org.ekstep.services.telemetryService.error({ "env": "content", "stage": "", "action": "migration", "objectId": "", objectType: "", "err": "migration has errors", "type": "PORTAL", "data": "", "severity": "error" });  
        if (this.isOldContent(contentbody)) {            
            this.initLoadScreenMsg();
            this._startTime = (new Date()).getTime();
            _.forEach(this.tasks, function(task) {
                org.ekstep.contenteditor.migration[task].migrate(contentbody)
            });
            this.postMigration(contentbody, stageIcons);
        } else {
            console.info('no need for migration');
            org.ekstep.contenteditor.stageManager.fromECML(contentbody, stageIcons);
        }
    },
    postMigration: function(content, stageIcons) {
        var instance = this;
        org.ekstep.services.telemetryService.startEvent().append("loadtimes", { migration: ((new Date()).getTime() - instance._startTime) });
        instance.setNewVersion(content);
        instance.showLoadScreenMsg();        
        console.info('Migration task completed!');        
        console.log('after migration content:', _.cloneDeep(content));
        if (instance.migrationErrors.length) {            
            console.info('Migration has errors: ', instance.migrationErrors);
            org.ekstep.services.telemetryService.error({ "env": "content", "stage": "", "action": "migration", "objectId": "", objectType: "", "err": "migration has errors", "type": "PORTAL", "data": "", "severity": "error" });
        }

        org.ekstep.contenteditor.stageManager.fromECML(content, stageIcons);
    },
    isOldContent: function(contentbody) {
        var version = contentbody.theme.version || contentbody.theme.ver;
        if (typeof version == 'string') version = parseFloat(version);
        if (version < 1) return true;
        return false;
    },
    initLoadScreenMsg: function() {
        var scope = org.ekstep.contenteditor.api.getAngularScope();
        scope.appLoadMessage.push({ 'id': 2, 'message': 'Migrating Content', 'status': false });
        this.migrationFlag = true;
    },
    showLoadScreenMsg: function () {
        var scope = org.ekstep.contenteditor.api.getAngularScope();
        scope.migration.showPostMigrationMsg = true;
        scope.migration.showMigrationSuccess = true;
        var obj = _.find(org.ekstep.contenteditor.api.getAngularScope().appLoadMessage, { 'id': 2 });
        if (_.isObject(obj)) {
            obj.message = "Content migrated";
            obj.status = true;
        }
        org.ekstep.contenteditor.api.ngSafeApply(scope);
    },
    setNewVersion: function(contentbody) {
        if (_.has(contentbody, 'theme.ver')) delete contentbody.theme.ver;
        contentbody.theme.version = "1.0";
    },
    isMigratedContent: function() {
        return this.migrationFlag;
    },
    clearMigrationFlag: function() {
        this.migrationFlag = false;
    }
}));
