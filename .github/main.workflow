workflow "Scan for secrets" {
  on = "push"
  resolves = ["Seekret"]
}

action "Seekret" {
  uses = "docker://cdssnc/seekret-github-action"
}
