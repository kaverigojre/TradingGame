pipeline {

  agent any

  environment {

    AWS_ACCESS_KEY_ID = credentials('aws-key')
    DOCKER_HUB_KEY = credentials('kaveri-docker-hub')
    DOCKER_IMAGE_CLIENT = 'kaverigojare/trading-game-client'
    DOCKER_IMAGE_SERVER = 'kaverigojare/trading-game-server'
    DOCKER_IMAGE_SOCKET = 'kaverigojare/trading-game-socket'
    GITHUB_URL = 'https://github.com/kaverigojre/TradingGame.git'
    GIT_BRANCH = 'main'

  }

  stages {

    stage('Hello') {

      steps {

        echo 'Hello World'

        echo env.BUILD_ID

      }

    }

    stage('checkout') {

      steps {

        git branch: env.GIT_BRANCH, url: env.GITHUB_URL

      }

    }

        stage('build backend') {

          steps {

            script {

              docker.build("${env.DOCKER_IMAGE_SERVER}:${env.BUILD_ID}", './Server/')

            }

          }

        }

        stage('build frontend') {

          steps {

            script {

              docker.build("${env.DOCKER_IMAGE_CLIENT}:${env.BUILD_ID}", './Client/')

            }

          }

        }
        stage('build websocket') {

          steps {

            script {

              docker.build("${env.DOCKER_IMAGE_SOCKET}:${env.BUILD_ID}", './websockets/')

            }

          }

        }

      

    

    stage('push images to docker') {

      steps {

        script {

          /*sh 'docker logout'*/

          withCredentials([usernamePassword(credentialsId: 'kaveri-docker-hub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {

            sh "echo -n ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin"

          }

          withCredentials([usernamePassword(credentialsId: 'kaveri-docker-hub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {

            docker.withRegistry('https://index.docker.io/v1/', 'kaveri-docker-hub') {

              docker.image("${env.DOCKER_IMAGE_SERVER}:${env.BUILD_ID}").push()
              docker.image("${env.DOCKER_IMAGE_CLIENT}:${env.BUILD_ID}").push()
              docker.image("${env.DOCKER_IMAGE_SOCKET}:${env.BUILD_ID}").push()

             

              }

            }

          }

        }

      }

    }

}



/*pipeline {
    agent any
    environment {
        AWS_ACCESS_KEY_ID = credentials('aws-key')
        DOCKER_HUB_KEY = credentials('kaverigojare')
        DOCKER_IMAGE_CLIENT = 'kaverigojare/trading-game-client'
        DOCKER_IMAGE_SERVER = 'kaverigojare/trading-game-server'
        DOCKER_IMAGE_SOCKET = 'kaverigojare/trading-game-socket'
        GITHUB_URL = 'https://github.com/kaverigojre/TradingGame.git'
        GIT_BRANCH = 'main'
    }

    stages {
        stage('HELLO') {
            steps {
                echo 'Hello World'
                echo env.BUILD_ID
            }
        }

        stage('checkout') {
            steps {
                git branch: env.GIT_BRANCH, changelog: false, credentialsId: '2f5afe7b-5c51-4757-b8c5-70dca766f9d7', poll: false, url: env.GITHUB_URL
                echo 'Git repo for Trading Game application checked out successfully'
            }
        }

        stage('Build frontend docker image') {
            steps {
                script {
                    // Navigate to the Client directory
                    dir('Client') {
                        // Build the Docker image
                        def image = docker.build(env.DOCKER_IMAGE_CLIENT)

                        echo 'Frontend Docker build successful'

                        // Optionally, push the image to Docker Hub
                        docker.withRegistry('', 'docker-hub-credentials-id') {
                            image.push()
                        }
                    }
                }
            }
        }

        // Uncomment and modify the Deploy Frontend stage as needed
        // stage('Deploy Frontend') {
        //     steps {
        //         echo 'Deploying frontend...'
        //         // Add your deployment steps here
        //         echo 'Frontend deployed successfully'
        //     } 
        // }
    }
}
*/