workflow "Scan for secrets" {
  on = "push"
  resolves = ["Seekret"]
}

action "Seekret" {
  uses = "docker://cdssnc/seekret-github-action"
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