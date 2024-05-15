Student: Sunho Kim

1. Where would you fit your automated tests in your Recipe project development pipeline? Select one of the following and explain why.

Within a Github action that runs whenever code is pushed since it can be ran automatically, it make sense to just run it as often as possible. (unless special situation where the test requires expensive computation) Running tests manually or after project is done defeats the purpose of the automatic testing.

2. Would you use an end to end test to check if a function is returning the correct output? (yes/no)

No. Unit testing would better suit for that use case.








