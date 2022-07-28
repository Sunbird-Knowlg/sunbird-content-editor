node() {
    try {
        String ANSI_GREEN = "\u001B[32m"
        String ANSI_NORMAL = "\u001B[0m"
        String ANSI_BOLD = "\u001B[1m"
        String ANSI_RED = "\u001B[31m"
        String ANSI_YELLOW = "\u001B[33m"

        ansiColor('xterm') {
            stage('Checkout') {
                cleanWs()
                def scmVars = checkout scm
                checkout scm
                commit_hash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                branch_name = params.github_release_tag.split('/')[-1]
                artifact_version = branch_name + '_' + commit_hash
                sh "git clone https://github.com/project-sunbird/sunbird-content-plugins.git plugins -b ${branch_name}"
                echo "artifact_version: " + artifact_version

                stage('Build') {
                    sh """
                        export framework_version_number=${artifact_version}
                        export editorType="contentEditor"
                        export editor_version_number=${artifact_version}
                        export build_number=${commit_hash}
                        export CHROME_BIN=google-chrome
                        rm -rf ansible/content-editor.zip
                        rm -rf content-editor
                        node -v
                        npm install --legacy-peer-deps=true
                        cd app
                        bower cache clean
                        bower prune -f 
                        bower install --force -V
                        cd ..
                        #grunt compress
                        #zip -r ce-docs.zip docs
                        gulp packageCorePlugins
                        #npm install 
                        npm run build-plugins
                        #cd ..
                        npm run build
                        #npm run test
                    """
                }
                
                //stage('Publish_test_results') {
               //cobertura autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: 'coverage/PhantomJS*/cobertura-coverage.xml', conditionalCoverageTargets: '70, 0, 0', failUnhealthy: false, failUnstable: false, lineCoverageTargets: '80, 0, 0', maxNumberOfBuilds: 0, methodCoverageTargets: '80, 0, 0', onlyStable: false, sourceEncoding: 'ASCII', zoomCoverageChart: false 
            //}
                
                stage('ArchiveArtifacts') {
                    sh """
                        mkdir content-editor-artifacts
                        cp content-editor.zip content-editor-artifacts
                        zip -j  content-editor-artifacts.zip:${artifact_version}  content-editor-artifacts/*                      
                    """
                    archiveArtifacts "content-editor-artifacts.zip:${artifact_version}"
                    sh """echo {\\"artifact_name\\" : \\"content-editor-artifacts.zip\\", \\"artifact_version\\" : \\"${artifact_version}\\", \\"node_name\\" : \\"${env.NODE_NAME}\\"} > metadata.json"""
                    archiveArtifacts artifacts: 'metadata.json', onlyIfSuccessful: true
                    currentBuild.description = "${artifact_version}"
                }
            }
        }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }

}
