# CONTRIBUTING FAQ

This is a place to find answers to questions you may have during development.

## HELP! TypeScript says there's no types for the import.
Go to the terminal and, in the vaken directory, run `npm i -D @types/LIBRARY_NAME_HERE`

## Is there a way to login with email + password?
No, this was disabled with #261.

## How do I test an organizer's account?
Copy the 

## Is there a way to add hackers to the DB for testing purposes?
Yes, run the scripts/populateDB.ts script.
```
ts-node -r dotenv/config ./scripts/populateDb.ts
```

## How do I log in as an organizer?
To make yourself an organizer, first log in with the account you'd like to use, then run the following script:
```
ts-node -r dotenv/config ./scripts/makeOrganizer.ts -- YOUR_EMAIL_HERE [github] [google]
```
Where you specify either github or google if you use the same email for both accounts to only update one of them.

Then you may simply log in with the account as usual and you should be an organizer. 
