## Coding challenge

This page documents the programming challenge sent to aspiring EHG Developers during the interview process.

### Details
You need to write a program which will produce an image in which each colour occurs exactly once -- with no repetition and no used colours. Colours are formed by combining a red, green, and blue component in the range 0..256; your program will need to break each component into 32 steps -- 8, 16,24, .. 256 -- which means you will have 32,768 discrete colours. Your image will therefore need to be sized to accommodate exactly this number of unique colours -- for example, 256x128px (although other dimensions are possible).

The result should be aesthetically pleasing (or at least interesting) and should not use any existing graphics or other files. Your submission will be evaluated in terms of good development practices followed, cleanliness of code, the elegance of the algorithm you use, and the originality of your approach.

We’re also looking to see that your app doesn’t greatly impact the browser performance.

You may write this program preferably in Reactjs & Nodejs for use on a web browser which displays its results on-screen. Feel free to submit in reply to #####@#####.###. Please push source code to a version control repository such as GitHub or Bitbucket. If you could build, deploy the app, and submit this as soon as convenient that would positively reflect on you in this application.

Here are some frequently-asked questions:

* Are third-party open source libraries such as React, Angular, etc. allowed in my submission?
    * Please use React and include any dependencies (or instructions for installation) with your submission.
* What browsers need to be supported?
    * If a web-based submission, your submission should work in all modern standards-compliant browsers.
* What version of Java/JavaScript/Python can I use? 
    * Any is fine
* What about 0 values?
    * You can safely ignore the 0 values for each colour component; they're not necessary in this task.
* Does the image have to be 256x128px in size? 
    * No -- you can use any dimensions you like, so long as the image contains each colour exactly once.
* Can I use third party css/js plotting library?
    * No

## Author's comments
My solution to this challenge involved the use of TypeScript as I am of the belief it makes for better more trustworthy code.

The foundation of this solution was built upon the TypeScript template for create-react-app: https://create-react-app.dev/docs/adding-typescript/

This solution certainly isn't perfect and can be improved in many areas, some of which I am likely to touch on if I get the time.