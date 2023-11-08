
pipeline {
    agent any
    stages {
        stage('Trigger Bitbucket Pipeline') {
            steps {
                script {
                    echo 'Sending POST request to Bitbucket API'

                    def bitbucketUrl = 'https://api.bitbucket.org/2.0/repositories/atlassian/github-for-jira-deployment/pipelines/'
                    def branch = 'master'
                    def credentialsId = 'github-for-jira-deployment-pipeline-token'

                    withCredentials([string(credentialsId: 'github-for-jira-deployment-pipeline-token', variable: 'accessToken')]) {
                        def payload = """
                            {
                                "target": {
                                    "type": "pipeline_ref_target",
                                    "ref_name": "${branch}",
                                    "ref_type": "branch",
                                    "selector": {
                                        "type": "custom",
                                        "pattern": "deploy to stage"
                                    }
                                }
                            }
                        """

                        sh """
                        curl --request POST \\
                        --url '${bitbucketUrl}' \\
                        --header 'Authorization: Bearer ${accessToken}' \\
                        --header 'Accept: application/json' \\
                        --header 'Content-Type: application/json' \\
                        --data '${payload}'
                        """
                    }
                }
            }
        }
    }
}