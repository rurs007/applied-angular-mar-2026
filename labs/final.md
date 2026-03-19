(# Lab: Final — Fork, Clone, Work, PR)

This lab demonstrates the flow students should use today: fork the instructor repository, clone it into `~/student/class/final`, complete the lab work on a feature branch, then push a branch and open a Pull Request describing what you did.

Prereqs

- A GitHub account (use your real name or an easily-identifiable handle)
- Git installed on your machine
- Node.js & npm installed (to run the project)

Step-by-step (copy & paste these commands)

1. Fork the instructor repo on GitHub

- Open: https://github.com/JeffryGonzalez/applied-angular-mar-2026 and click **Fork** (top-right).

2. Configure Git (first time only)

```bash
git config --global user.name "Your Full Name"
git config --global user.email "you@school.edu"
```

3. Clone your fork into the required path

Close visual studio code, open a windows terminal ([>]) and run the following.

```bash
git clone https://github.com/<your-username>/applied-angular-mar-2026.git ~/student/class/final
cd ~/student/class/final
```

4. Add the instructor repository as `upstream`

```bash
git remote add upstream https://github.com/JeffryGonzalez/applied-angular-mar-2026.git
git fetch upstream
```

5. Create a feature branch for your lab work

```bash
git checkout -b lab/final-yourname
```

6. Install dependencies and run the app

```bash
npm ci
npm run start
# Open the app in the browser when the dev server is ready
```

7. Do the lab work

- Make small, focused commits while you work. Use clear commit messages.

8. Commit your changes

```bash
git add -A
git commit -m "lab: <short summary of what I did>"
```

9. Push your branch to your fork

```bash
git push -u origin lab/final-yourname
```

10. Create a Pull Request (PR)

- Go to your fork on GitHub and click **Compare & pull request** for your branch.
- Set the base repository to `JeffryGonzalez/applied-angular-mar-2026` branch `main`.
- In the PR description include:
  - Objective: one-sentence summary
  - What I changed: bullet list of files/behavior
  - How to run: commands needed to run your changes
  - Any notes/questions for the instructor

11. Keep your branch up to date (if needed)

```bash
# pull instructor changes into your local main
git fetch upstream
git checkout main
git merge upstream/main

# update your feature branch
git checkout lab/final-yourname
git rebase main   # or `git merge main` if you prefer
git push --force-with-lease   # only if you rebased
```

Quick troubleshooting

- See status: `git status`
- Show changes: `git diff`
- See commit history: `git log --oneline --graph --decorate`
- If merge conflicts occur: edit files to resolve, then `git add` and `git rebase --continue` or `git commit`.

PR Checklist (copy into your PR body)

- Objective: one-sentence summary
- What I changed: bullet list
- How to run: commands to build/run
- Notes/questions: anything you want the instructor to review

If you'd like, I can also add a short printable handout or a link to this file in the README.
