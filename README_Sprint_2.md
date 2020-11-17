## Second Sprint

### Forecast [Criteria 1, 2]

We forecast 16 points this sprint.

Last sprint we forecasted to complete 20 story points and realized it was quite hard to meet. In this sprint, we will be aiming for a slightly lower forecast.

### Sprint Backlog Formation [Criteria 3, 4]

We pulled stories from the top of our product backlog into the sprint backlog. We pulled in 15 points worth of stories, which is underneath our forecast of 16. Since we are all part of the dev team (and hence some of us wear multiple hats), we all participated. We will provide a link to our sprint planning session.

`TODO`

In our retro, we found that last sprint our stories were too large. We spent time splitting our stories. This sprint, all 5 stories are 3 points. 3 points is less that 16 / 2 = 8.

### Developer Tasks [Criteria 5]

We have decomposed our stories into tasks. They are checkboxes in the content of each story (since that's how ZenHub interacts with GitHub issues).

### Kanban [Criteria 6]

Our stories are viewable in a Kanban view. Tasks do not show individually due to ZenHub limitations (Approval From Richard: https://agilesoftwarecourse.slack.com/archives/C019S0R4N8J/p1604849375110800).

https://app.zenhub.com/workspaces/moneywise2020-5f984e412accf2001e9acc9c/board?repos=307744600

### Burndown [Criteria 7]

We have a sprint burndown chart. The x-axis is daily. The y-axis is story points remaining. The line descends left-to-right starting from our commitment on day 1 to the number of story points left (ideally, 0). Here is the URL:

https://app.zenhub.com/workspaces/moneywise2020-5f984e412accf2001e9acc9c/reports/burndown?milestoneId=6045255&selectedPipelines=Z2lkOi8vcmFwdG9yL1BpcGVsaW5lLzIyNDA5NDU

### Daily Scrum [Criteria 8, 9, 10, 11]

Our Daily Scrums were conducted asynchronously over Slack. Please see https://agilesoftwarecourse.slack.com/archives/C01DC27UGJK for team member daily descriptions of accomplished and planned activities. (We had heard this worked for some other teams, I (@jamesfulford) mainly wanted to give this a try in class before trying at work). 

- "What did you do in the last 24 hours that helped the Development Team meet the Sprint Goal" -> "What did you do yesterday?"
- "What will you do in the last 24 hours to help the Development Team meet the Sprint Goal" -> "What are you planning to do today?"
- "Do you see any impediment that prevents you or the Development Team from meeting the Sprint Goal? What are the impediments? What is your impediment removal plan?" -> "Are you facing any impediments?"

### Task board and burndown [Criteria 12]

Our burndown chart updates automatically. We manually update our tasks and stories. Here are some screenshots that show changes:

`TODO`: Provide screenshots of changes

### Pair / Mob Programming [Criteria 13]

We did pair/mob programming. See links to recordings of these sessions.

`TODO`: Provide links to recordings.

### Test Driven Development [Criteria 14]

We try to build our product test-first. Evidence that we build test-first can be found in these links:

`TODO`: provide recordings of TDD

Our latest unit test counts can be seen on our CI/CD Jenkins server: 

http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/MoneyWiseCICD/lastCompletedBuild/testReport/

(Before: http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/MoneyWiseCICD/35/testReport/)

### Sprint Review [Criteria 15, 17]

`TODO`: Javier or other stakeholder should attend

`TODO`: provide link to recording

`TODO`: outline what changes we made to our backlog as a result of feedback

### Delivery [Criteria 16]

We deployed our changes. You can view our application here:

http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8080/

Our product increment was:
`TODO`: quick list of features we added

### CI [Criteria 18, 19]

We have no long-lived branches, see for yourself: https://github.com/MoneyWise2020/MoneyWise2020/branches

Our CI job is here:

http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085 (Our CICD Landing Page)
http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/MoneyWiseCICD/ (Our CICD Project Page)
http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/MoneyWiseCICD/configure (Our CICD Configuration with Configured Github integration to pull /main branch changes automatically)

It is triggered on merge to "main" branch, here is our configuration:

![Git configuration for our job](https://drive.google.com/uc?export=download&id=1mebWOSkeImMrN2MxvvZHr0_KAtomLbD2)

The job runs tests, stores a test report (see our "Test Driven Development" section for a link), and if the tests pass, triggers a deploy of our backend and our UI, and runs database migrations against our "prod" environment. Our evidence that this works properly is that the application is updated, see "Delivery" section for a link.

Passing "Green" Build deploys:

http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/MoneyWiseCICD/40/console

Failing "Red" build does not deploy:

http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/MoneyWiseCICD/41/console (UI tests fail, never goes on to deploy)

`TODO`: "prod" tests question: https://agilesoftwarecourse.slack.com/archives/C019S0R4N8J/p1605584449129100
