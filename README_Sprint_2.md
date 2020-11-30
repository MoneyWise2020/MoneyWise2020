## Second Sprint

### Forecast [Criteria 1, 2]

We forecast 16 points this sprint.

Last sprint we forecasted to complete 20 story points and realized it was quite hard to meet. In this sprint, we will be aiming for a slightly lower forecast.

### Sprint Backlog Formation [Criteria 3, 4]

We pulled stories from the top of our product backlog into the sprint backlog. We pulled in 15 points worth of stories, which is underneath our forecast of 16. Since we are all part of the dev team (and hence some of us wear multiple hats), we all participated. We will provide a link to our sprint planning session.

Sprint 2 Planning: 
https://harvard.zoom.us/rec/play/S1NIMDWyHbLMCTFnGre3T-cDKiOzfL1h_PhEDcbOiIAHZUo2ec9VOHmncOGYvnSmoTduN9EWlx4wauU.Ub2Zh2JpFu9Y4UPV

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

Burndown
https://github.com/MoneyWise2020/MoneyWise2020#workspaces/moneywise2020-5f984e412accf2001e9acc9c/reports/burndown?milestoneId=6108069

![Tasks beginning of sprint](https://drive.google.com/uc?export=download&id=1FQ0xY1LWycS0dj3eTlxI6378LqifYbuT)
![Tasks end of sprint](https://drive.google.com/uc?export=download&id=1vILflfoqxgWcoz9eHepBPleNmImn03dd)

### Pair / Mob Programming [Criteria 13]

We did pair/mob programming. See links to recordings of these sessions.

Nov 19 - James Sarab Ralph MOB programming converted to James and Sarab Pair Programming
https://harvard.zoom.us/rec/play/5t8PtgPu5AG2ICgOxFS4FZyVPHWfec1fznwLq9yWys_0bpJfQjgu7LM1kv1zufYbT3S75sYkq3Dkpp40.O3d7GgcVirrtJC02

Nov 28 - MOB programming with Alex Ralph and Sarab
https://harvard.zoom.us/rec/play/wGjtVoGaALKnyHxT_LjODfyPz_K9UHMLnd2Ug9Nrj36-3wyXp34FGIFB6TmXTYC6TINWuWkcuvIfNTkL.-kiRgeP_AC6v3kPX

Nov 28 - MOB programming with Alex Ralph and Sarab
https://harvard.zoom.us/rec/play/mKrKQ0Te2aPezaHiEVwaNXjm9HdlyS5iO9FULIoS-8iiW9tJB4jal44l9GF30Xl6TK03I18ZYpenWmlk.gtRZZkAz3ae3M9pg

Nov 29 - MOB Programming with Everyone!
https://harvard.zoom.us/rec/share/h8mJO0SxTeG8cuI5ySwySpcweOhGTk2XJ12JM-MgAZJUkjD99c9liF9FjsGQUGy6.CSbPOsKT4kDysvOn

Photos of Paring and Mobbing
https://drive.google.com/drive/folders/1ZSjRYSRtsE92ZcmVKFg2VDBkSRoW6fdn

### Test Driven Development [Criteria 14]

We try to build our product test-first. Evidence that we build test-first can be found in these links:

Nov 22 - MOB Programming Backend logic and Unit Test
https://harvard.zoom.us/rec/play/DWYqwHtJjE1V1WS7Q1oaSQ6Aa4JYDR3EwzLwMY78_mYfMcuFL0iu1aNZTXp8c-H5q5KapAX1w16HK6Zb.5nOguptXvKff0xoa

Nov 22 - James and Sarab Pair Programming UI for transactions
https://harvard.zoom.us/rec/play/FXFvc8eJKH8EgrdevXjY83OJEmxudKY7C0DI8BP-lnbMY_7WNXIW3Gs0JkJLSCBM4f3KzId0TC6_ta4s.9uVadmdUj10ZjFbO

Our latest unit test counts can be seen on our CI/CD Jenkins server: 

http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/MoneyWiseCICD/lastCompletedBuild/testReport/

(Before: http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/MoneyWiseCICD/35/testReport/)

### Sprint Review [Criteria 15, 17]

You can find the sprint review video link in this document. It is titled 
Nov 29 - Sprint Review & Nov 29 - Sprint Retro respectively
https://docs.google.com/document/d/1YBYvbtzQM9F6hqz737ofrRtsPcP2D6QY708qJeZ_BDg/edit


Given the feedback of our stakeholder we may prioritize some variable transactions features a little higher. 

### Delivery [Criteria 16]

We deployed our changes. You can view our application here:

http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8080/

Our product increment was:
You can now execute rules and visualize what they mean for your future. 

### CI [Criteria 18, 19]

We have no long-lived branches, see for yourself: https://github.com/MoneyWise2020/MoneyWise2020/branches

Our CI job is here:

http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085 (Our CICD Landing Page)
http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/MoneyWiseCICD/ (Our CICD Project Page)
http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/MoneyWiseCICD/configure (Our CICD Configuration with Configured Github integration to pull /main branch changes automatically)

It is triggered on merge to "main" branch, here is our configuration:

![Git configuration for our job](https://drive.google.com/uc?export=download&id=1mebWOSkeImMrN2MxvvZHr0_KAtomLbD2)

The job runs tests, stores a test report (see our "Test Driven Development" section for a link), and if the tests pass, triggers a deploy of our backend and our UI, and runs database migrations against our "prod" environment. Our evidence that this works properly is that the application is updated, see "Delivery" section for a link.

###### Passing "Green" Build deploys

http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/MoneyWiseCICD/40/console

###### Failing "Red" build does not deploy

http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/MoneyWiseCICD/41/console (UI tests fail, never goes on to deploy)

###### Health Check 

http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/job/Moneywise%202020%20-%20Health%20Check/6/console

###### Complete Pipeline 

http://ec2-52-15-67-124.us-east-2.compute.amazonaws.com:8085/view/Moneywise%202020%20-%20Pipeline/

###### Start at 1:26:00 for Red and Green Pipeline Behavior Demostration
Nov 28 - MOB programming with Alex Ralph and Sarab_Video1
https://harvard.zoom.us/rec/play/wGjtVoGaALKnyHxT_LjODfyPz_K9UHMLnd2Ug9Nrj36-3wyXp34FGIFB6TmXTYC6TINWuWkcuvIfNTkL.-kiRgeP_AC6v3kPX
