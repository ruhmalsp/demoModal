def runCommand(String command) {
  if (isUnix()) {
    sh command
  } else {
    bat command
  }
}

pipeline {
  agent any

  options {
    timeout(time: 30, unit: 'MINUTES')
    timestamps()
  }

  parameters {
    choice(name: 'APP_ENV', choices: ['dev', 'qa', 'staging'], description: 'Production is blocked by framework code.')
    choice(name: 'SUITE', choices: ['smoke', 'regression', 'api', 'chromium', 'ui-all', 'mobile'], description: 'Select a test suite.')
  }

  tools {
    nodejs 'Node 22'
  }

  environment {
    CI = 'true'
  }

  stages {
    stage('Install') {
      steps {
        script {
          runCommand('npm ci')
          runCommand('npx playwright install chromium firefox webkit')
        }
      }
    }
    stage('Quality') {
      steps {
        script {
          runCommand('npm run lint')
          runCommand('npm run typecheck')
        }
      }
    }
    stage('Test') {
      steps {
        script {
          def commands = [
            smoke: 'npm run test:smoke',
            regression: 'npm run test:regression',
            api: 'npm run test:api',
            chromium: 'npm run test:chromium',
            'ui-all': 'npm run test:ui:all',
            mobile: 'npm run test:mobile'
          ]
          withEnv(["APP_ENV=${params.APP_ENV}"]) {
            runCommand(commands[params.SUITE])
          }
        }
      }
    }
  }

  post {
    always {
      junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
      archiveArtifacts allowEmptyArchive: true, artifacts: 'playwright-report/**,test-results/**'
    }
  }
}
