## Third Sprint

### Forecast [Criteria 1, 2]

We forecast 12 points this sprint.

Last sprint, we completed 15 points. Some of us have less availability, and the overhead increase of the rubric is another factor we considered. We took into account "Yesterday's Weather", but unlike "Yesterday's Weather", we looked at the horizon and saw rain clouds :).

### Sprint Backlog Formation [Criteria 3, 4]

We pulled stories from the top of our product backlog into the sprint backlog. We pulled in 12 points worth of stories, which is exactly our forecast of 12. Since we are all part of the dev team (and hence some of us wear multiple hats), we all participated.

We hit an interesting scenario that we would (probably) not hit outside of Agile simulations. We were part of the way through Sprint Planning (7 points so far; 5 capacity left) when we estimated an 8-pointer. Normally, we would stop the sprint there, not commit to the 8-pointer, but perhaps start work on it and commit it to next sprint. However, we do not have a next sprint, so the PO shuffled the backlog tactically. (Also, 8 points is more than half our capacity)

The largest story is 5 points. Our capacity is 12. 12/2 is 6, which is more than 5. (I know you know math, just trying to be explicit)

### Developer Tasks [Criteria 5]

We have decomposed our stories into tasks. They are checkboxes in the content of each story (since that's how ZenHub interacts with GitHub issues).

The first 2 stories were a lot more imperative rather than declarative (it was a bundle of tweaks on the UI). So, oddly enough, the tasks for those stories were pre-defined. If this is not the advised way of getting this type of imperative work done, I (jamesfulford) would like to know the proper way please. We hope this doesn't impact our points on any rubric criteria.

### Kanban [Criteria 6]

Our stories are viewable in a Kanban view. Tasks do not show individually due to ZenHub limitations (Approval From Richard: https://agilesoftwarecourse.slack.com/archives/C019S0R4N8J/p1604849375110800).

https://app.zenhub.com/workspaces/moneywise2020-5f984e412accf2001e9acc9c/board?repos=307744600

### Burndown [Criteria 7]

We have a sprint burndown chart. The x-axis is daily. The y-axis is story points remaining. The line descends left-to-right starting from our commitment on day 1 to the number of story points left (ideally, 0). Here is the URL:

https://app.zenhub.com/workspaces/moneywise2020-5f984e412accf2001e9acc9c/reports/burndown?milestoneId=6174440&selectedPipelines=Z2lkOi8vcmFwdG9yL1BpcGVsaW5lLzIyNDA5NDU

### Daily Scrum [Criteria 8, 9, 10, 11]

Our Daily Scrums were conducted asynchronously over Slack. Please see https://agilesoftwarecourse.slack.com/archives/C01DC27UGJK for team member daily descriptions of accomplished and planned activities. (We had heard this worked for some other teams, I (@jamesfulford) mainly wanted to give this a try in class before trying at work). 

- "What did you do in the last 24 hours that helped the Development Team meet the Sprint Goal" -> "What did you do yesterday?"
- "What will you do in the last 24 hours to help the Development Team meet the Sprint Goal" -> "What are you planning to do today?"
- "Do you see any impediment that prevents you or the Development Team from meeting the Sprint Goal? What are the impediments? What is your impediment removal plan?" -> "Are you facing any impediments?"

### Task board and burndown [Criteria 12]

Our burndown chart updates automatically. Developers manually update task status. When a story is completed and accepted by the PO, the PO moves the story to the "Done" state. You can see this update happen at the end of our "Demo" recordings.

https://docs.google.com/document/d/1YBYvbtzQM9F6hqz737ofrRtsPcP2D6QY708qJeZ_BDg/edit?usp=sharing

### Pair / Mob Programming [Criteria 13]

We did pair/mob programming. See links to recordings of these sessions.

Video Recordings: https://docs.google.com/document/d/1YBYvbtzQM9F6hqz737ofrRtsPcP2D6QY708qJeZ_BDg/edit?usp=sharing
Screenshots: https://drive.google.com/drive/folders/1StMb74qWFRylxCb2EP7BnhLgh-f6jX5g?usp=sharing

### Test/Behavior Driven Development [Criteria 14]

We try to build our product test-first. Evidence that we build test-first can be found in these links:

Video Recordings: https://docs.google.com/document/d/1YBYvbtzQM9F6hqz737ofrRtsPcP2D6QY708qJeZ_BDg/edit?usp=sharing

Our latest unit test counts can be seen on our CI/CD Jenkins server:

http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/MoneyWise%20-%20Unit%20Test%20(Previously%20responsible%20of%20all%20MoneyWiseCICD)/lastCompletedBuild/testReport/

(Before: http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/MoneyWise%20-%20Unit%20Test%20(Previously%20responsible%20of%20all%20MoneyWiseCICD)/60/testReport/)

#### BDD

https://github.com/MoneyWise2020/MoneyWise2020/tree/main/backend/features

Console of BDD running in pipeline: http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/Moneywise%202020%20-%20BDD%20Tests/18/console


### CI [Criteria 15]

We have no long-lived branches, see for yourself: https://github.com/MoneyWise2020/MoneyWise2020/branches

Our CI dashboard is here:

http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/view/Moneywise%202020%20-%20Pipeline/

It is triggered on merge to "main" branch, here is our configuration:

![Git configuration for our job](https://drive.google.com/uc?export=download&id=1mebWOSkeImMrN2MxvvZHr0_KAtomLbD2)

The pipeline runs tests, stores a test report (see our "Test Driven Development" section for a link), and if the tests pass, triggers a deploy of our backend and our UI, and runs database migrations against our "prod" environment. Our evidence that this works properly is that the application is updated, see "Delivery" section for a link.

###### Passing "Green" Build deploys

http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/MoneyWise%20-%20Unit%20Test%20(Previously%20responsible%20of%20all%20MoneyWiseCICD)/40/

###### Failing "Red" build does not deploy

http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/MoneyWise%20-%20Unit%20Test%20(Previously%20responsible%20of%20all%20MoneyWiseCICD)/41 (UI tests fail, never goes on to deploy)

###### Health Check on Prod

http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/Moneywise%202020%20-%20Health%20Check/

### Delivery [Criteria 16]

We deployed our changes. You can view our application here:

https://ec2-52-15-67-124.us-east-2.compute.amazonaws.com/

Our product increment was:
Our UI is more presentable and more trustworthy. You can also export transactions.

### Sprint Retro [Criteria 17]

We conducted retro. All 4 of us were there. The recording link is available in the recordings doc:

Video Recordings: https://docs.google.com/document/d/1YBYvbtzQM9F6hqz737ofrRtsPcP2D6QY708qJeZ_BDg/edit?usp=sharing

PDF of retro board: https://drive.google.com/file/d/13OzHkp1jLkXxIwIwmfM6vkCKVhoRvyIx/view?usp=sharing

One useful outcome was how painful our code duplication was for Create and Modify forms, and keeping those in sync. We created an improvement to fix this, and put it at the top of the backlog: https://github.com/MoneyWise2020/MoneyWise2020/issues/89

### In-class Sprint Review [Criteria 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]

You were there! You're asking a lot out of 10 minutes, given my "stakeholders" have never seen my product before :). Sarab (scrum master) and James (PO) will try our best.

https://docs.google.com/presentation/d/1o6PtNWxlEZAenlMDU1ym2CZie2kacu6Ee_cdcuCmBk4/edit?usp=sharing

User Persona for our Human Stakeholder

https://miro.com/app/board/o9J_lb9LhfA=/

### Prepared for Sprint Review [Criteria 28]

We demoed to our usual stakeholder, Javier. We figured this would count as a rehearsal for the in-class Sprint Review.

Video Recordings: https://docs.google.com/document/d/1YBYvbtzQM9F6hqz737ofrRtsPcP2D6QY708qJeZ_BDg/edit?usp=sharing
