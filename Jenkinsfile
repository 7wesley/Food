pipeline {
    //where to execute
	agent { label 'jenkins-slave'}

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
                git 'https://github.com/7wesley/Food.git'
			}
		}

		stage('Build images') {
            steps {
                dir('client') {
                    script {
                        clientImage = docker.build clientRegistry + ":$BUILD_NUMBER"
                    }
                }
                dir('server') {
                    script {
                        serverImage = docker.build serverRegistry + ":$BUILD_NUMBER"
                    }
                  
                }
            }
        }
    
        stage('Push images') {
            steps {
                script {
                    docker.withRegistry( '', registryCredential ) {
                        clientImage.push()
                        serverImage.push()
                    }
                }
            }
        }

        stage('Clean up') {
            steps {
                sh "docker rmi $clientRegistry:$BUILD_NUMBER"
                sh "docker rmi $serverRegistry:$BUILD_NUMBER"
            }
        }
	}
}