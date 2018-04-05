# Twinkle Network
https://www.twinkle.network

## About this project:

Twinkle is a small social network website used almost exclusively by students and teachers of Twinkle - an English teaching institute located in Seoul, Korea. The members of the website can share YouTube videos and educational web URLs, create discussion topics, and chat within channels or send private messages to other users.

My ultimate goal for this website is to help children all around the world to:

1. Build relationships with students of different countries, ethnicities, and cultures early on in their lives

2. Find and connect with lifelong mentors from all over the world

3. Find motivation in learning, to become active learners instead of passive ones, to be driven by their own curiosity rather than the pressure imposed on them by grownups

4. Have opportunity to teach and help other children

5. Become critical thinkers

6. Learn to discuss and debate

7. Have equal opportunity in reaching their full potentials

And to fill their minds with wonder.

I've recently made the API source code private due to security concerns, so if you are interested in accessing it, please contact me at mikey1384@gmail.com

## Setup:
0. Ensure that Node 9+ is installed
1. git clone https://github.com/mikey1384/twin-kle.git [your directory name]
2. Run `npm install` at the directory where you cloned the git repository.
3. Inside /source/constants there is a file titled "rename this to URL.js" rename it to URL.js
4. Install nodemon `sudo npm install -g nodemon`
5. Install forever `sudo npm install -g forever`

finally, run:
```shell
npm run dev
```
then access it via http://localhost:3000
