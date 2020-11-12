# Product Name: Money Wise

## Far Vision: Take back your financial future.

## Near Vision: API First web app for cash flow predictions.

Your business - personal or otherwise - is hard, but money is something you can nail. You, with wise guidance, can shape your financial future for the better. We have the steps, wisdom, and tools to put you back in charge.

Money Wise is a solution for seeing and shaping your financial future. Based on your expected transactions - sales, tuition, bi-weekly paychecks, monthly rent, birthdays, holidays - Money Wise can visualize your future balance, simulate decisions, and nudge you to stick to your plan.

Unlike tools like Mint or Personal Capital, Money Wise focuses you on the future instead of your past transactions and investments.

## Stakeholders

### Busy people trying to own their future

Individuals or families trying to see and shape their financial future while balancing the rest of life. Monthly budgets are both too broad an interval (managing intra-month credit) or too short a timeframe (large expenses, like tuition or vacations, can take months to pay). Existing tools spend too much time looking at past transactions, but don't make it clear how the future will look, or could look.

Not necessarily tech-savvy, or maybe familiar with spreadsheets. Regardless, predicting future balance is tedious because Excel wasn't quite built for this.

### Coders solving personal finance

Developers trying to solve the problems outlined in the previous stakeholder description. They could be solving problems for their customers, or for themselves.

Examples:
- James wrote code to limit student debt by helping him see how much and when he needs to save for big expenses.
- Alex wrote code to help organize who in his family pays what share of which bill.

Money Wise helps developers solve their specific problems by solving some common problems and making solutions available through our APIs.

### Business owners

Predicting the cashflow of your business can be tedious, but the results are important for decision-making. You don't get much time to consider possible futures of your restaurant, because it takes too long (and, honestly, it's not as fun - unless you like paperwork).

Alex's brother, Javier, runs a restaurant. He is 33 years old, married with 2 kids and 1 more on the way. He works in the service industry as a General Manager for a resturant. To calculate expenses, he uses some Excel, but it's still very manual and does not account much for holidays/seasonality or bigger irregular expenses. He needs results of finances to go about his business, but it's quite bothersome, and even then he can't simulate situations without lots of tedious recalculation.

## Concepts

- Rule: a recurring transaction. Saved in the app.
- Transaction: individual changes in your balance on specific dates. Computed by the app.

## Team Money Sages

- James Fulford (PO + Dev)
- Sarab Anand (Scrum Master + Dev)
- Ralph Scronce (Dev)
- Alejandro Suazo (Dev)

## [Product Backlog](https://app.zenhub.com/workspaces/moneywise2020-5f984e412accf2001e9acc9c/board?repos=307744600)

Full disclosure: this project starts off from a personal project James started (in a different form) in 2018. Early commits in this repo are directly from that project.

### Ordering

First, focusing on exposing 3 main resources:

- Rules #3
- Transactions #4
- Users #2

At this point, we can at least see our future. However, we want to be able to shape our future. If we can simulate what a decision would look like financially, we can make more informed decisions about our future. #5 (pure vision story)

People like Excel. That's cool. We'll let people continue analysis in Excel or other tools. #6 (strong ROI - reporting is a product black hole, we can't compete with Excel)

Opening our app for developers will let others solve problems easier and extend our app. #7 (force-multiplier - what PO doesn't want more devs?)

To stay on track with your plan, you might need a timely nudge. Some transactions are not automatic, so if you want, we can remind you ahead of time. #8 (pure vision story)

We're building a great thing here, let's make it easy for people to understand it! #11 (starting toward minimum marketable solution after decent set of features)

As a team, we cannot operate forever without financial support. We'll package this as a subscription solution. #12 (minimum marketable solution)

Our solution should not require interrupting your life to make a decision. #10 (usability)

It's hard sticking to a plan! We'll remind you of your plan and guide you to re-take control of your financial future. #17 (pure vision story)

Future stories would focus around the "wise" part of money-wise, more nudging, and reconciling your plan with your current and past finances.

### Estimating

Since all members of the scrum team are developers (with some hybrid scrum/PO), all team members participate in estimation. We did **planning poker**, one story at a time.

### A Story must: (Definition of Ready)

- Must define:
  - Title
  - User story opening sentence (As a _____, I want _____ so that _____)
  - Additional Details
  - Acceptance criteria
  - Estimate
  - Person who accepts (unless otherwise noted, assume PO)
- Have comments on:
  - Performance
  - Security
  - Testing
- Have an established demo
- Have a ready environment (can run locally and push to GitHub)

## First Sprint

- **Forecasted Sprint Story Points:** 20
- **Rational for Story Points Forecast:**  We initially decided to attempt 20 story points in the first sprint.  This number is based solely on our individual experiences with past projects like this one.  We have no history of working together as a team and thus cannot draw heavily on "yesterday's weather" to refine our forecast.  Plus, 20 is a nice round number. :)
- **Refining the User Stories:** We reviewed and decided to split our 20 point "Manage Rules" User Story into two stores.  One story for the UI (at 8 points) and one story for the API (at 8 points).  Our two stores have been decomposed into tasks.  The stories with their tasks can be view at  https://github.com/MoneyWise2020/MoneyWise2020/issues/3 and https://github.com/MoneyWise2020/MoneyWise2020/issues/25
- **Creating the Sprint Backlog:** We pulled the above two stories (totaling 16 points) into our sprint backlog durning our Sprint Planning meeting.  All team members participated in Sprint Planning since we are all developers on the project.  The meeting was recorded and can be accessed here: https://docs.google.com/document/d/1YBYvbtzQM9F6hqz737ofrRtsPcP2D6QY708qJeZ_BDg/edit
- **Our Team Kanban Board:** https://agilesoftwarecourse.slack.com/archives/C019S0R4N8J/p1604849375110800
- **Our Team Sprint Burndown Chart:** https://app.zenhub.com/workspaces/moneywise2020-5f984e412accf2001e9acc9c/reports/burndown?milestoneId=6045255
- **Our Daily Scrums:** Our Daily Scrums were conducted asynchronously over Slack.  Please see https://agilesoftwarecourse.slack.com/archives/C01DC27UGJK for team member daily descriptions of accomplished and planned activities.
- **Pair and Mob Programming:** Pair and mob programming sessions were conducted during the sprint.  Session recordings are available here: https://docs.google.com/document/d/1YBYvbtzQM9F6hqz737ofrRtsPcP2D6QY708qJeZ_BDg/edit 
