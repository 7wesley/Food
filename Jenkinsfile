pipeline {
    //where to execute
	agent { 
        kubernetes {
            defaultContainer 'jnlp'
            yamlFile 'build.yaml'
        }
    }

    environment {
        clientImage = ''
        serverImage = ''
        clientRegistry = "7wesley/foodclient"
        serverRegistry = "7wesley/foodapi"
        registryCredential = 'dockerhub'
    }
    
	stages {
	    
		stage('Checkout') {
			steps {
                checkout scm
			}
		}

		stage('Build images') {
            steps {
                container('docker') {
                    dir('client') {
                        script {
                            clientImage = docker.build clientRegistry + ":latest"
                        }
                    }
                    dir('server') {
                        script {
                            serverImage = docker.build serverRegistry + ":latest"
                        }
                    
                    }
                }
            }
        }
    
        stage('Push images') {
            steps {
                container('docker') {
                    script {
                        docker.withRegistry( '', registryCredential ) {
                            clientImage.push()
                            serverImage.push()
                        }
                    }
                }
            }
        }

        stage('Deploy to kubernetes') {
            steps {
                container('kubectl') {
                    sh "kubectl -n default get pods"
                    sh "kubectl -n default rollout restart deployment/api"
                    sh "kubectl -n default rollout restart deployment/client"
                }
            }
	    }
	}
}
