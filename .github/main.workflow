workflow "Scan for dependency changes" {
  on = "push"
  resolves = ["post slack message"]
}

workflow "Label approved pull requests" {
  on = "pull_request_review"
  resolves = ["Label when approved"]
}

action "Label when approved" {
  uses = "pullreminders/label-when-approved-action@master"
  secrets = ["GITHUB_TOKEN"]
  env = {
    LABEL_NAME = "approved"
    APPROVALS  = "1"
  }
}

workflow "on pull request merge, delete the branch" {
  on = "pull_request"
  resolves = ["branch cleanup"]
}

action "branch cleanup" {
  uses = "jessfraz/branch-cleanup-action@master"
  secrets = ["GITHUB_TOKEN"]
  env = {
    NO_BRANCH_DELETED_EXIT_CODE = "0"
  }
}

action "check is default branch" {
  uses = "actions/bin/filter@master"
  args = "branch dev"
}

action "detect dependency changes" {
  needs = ["check is default branch"]
  uses = "bencooper222/check-for-node-dep-changes@master"
  secrets = ["GITHUB_TOKEN"]
}

action "post slack message" {
  needs = ["detect dependency changes"]
  uses = "pullreminders/slack-github-action@master"
  secrets = [
    "SLACK_BOT_TOKEN",
  ]
  args = "{\"channel\": \"CJ67S2CSK\", \"text\": \"One or more dependencies of Vaken in the default branch have been changed; `npm i` is recommended.\"}}"
}

workflow "Make a draft PR onpush" {
  on = "push"
  resolves = ["make draft pr"]
}


action "make draft pr" {
  uses = "vsoch/pull-request-action@master"
  secrets = ["GITHUB_TOKEN"]
  env = {
    PULL_REQUEST_DRAFT = "true"
    PULL_REQUEST_BRANCH = "dev"
  }
}

workflow "Automatic Rebase" {
  on = "issue_comment"
  resolves = "Rebase"
}

action "Rebase" {
  uses = "docker://cirrusactions/rebase:latest"
  secrets = ["GITHUB_TOKEN"]
}