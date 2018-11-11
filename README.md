# alex93110:strava

An ES2015 Meteor OAuth handler package for Strava.

This is a fully working OAuth handler, allowing you to use Strava as your Meteor authentication method.
If you want to use it "as is" you can just `meteor add alex93110:strava` to your application, since this is a published [atmosphere package](https://atmospherejs.com/alex93110/strava).

However, the package has been written to aid in understanding the mechanics of putting together an OAuth handler for any arbitrary provider.
The trickier parts of the codebase are (hopefully) annotated well enough to comprehend what's going on in this bit of Meteor Magic, enabling you make a minimum number of changes for your chosen provider.


This was forked from [tunguska:imgur](https://github.com/robfallows/tunguska-imgur) and modified to work for Strava.
