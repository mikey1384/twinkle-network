## Twinkle Website

###To run:
0. Ensure that Node 7+ is installed
1. git clone https://github.com/mikey1384/twin-kle.git [your directory name]
2. Run `npm install` at the directory where you cloned the git repository.
3. Install mysql `sudo apt-get install mysql-server` (if you haven't installed mysql already)
4. Install mysql `sudo mysql_secure_installation` (if you haven't installed mysql already)
5. Import db.sql to your mysql
6. In /api folder there is a file with filename "rename this to - siteConfig.js" change the filename to "siteConfig.js(just remove the rename this... part)" and fill in the required information
7. Do the same to /source/constants/"change this filename to ..." files
8. Install pip `sudo apt-get install python-pip` (For profile picture uploading feature / optional)
9. Install aws-cli `pip install --upgrade --user awscli` (For profile picture uploading feature / optional)
10. run `aws configure` (For profile picture uploading feature / optional)
11. Install nodemon `npm install -g nodemon`
12. Install forever `npm install -g forever`

If you want to run development version, run:
```shell
npm run dev
```
on one console instance and,
```shell
npm run devapi
```
on another.

---
If you want to run production version, run:
```shell
npm run build
```
then,
```shell
npm run startapi
npm run start
```

###About this project:

Currently this is a small social media website used almost exclusively by students and teachers of Twinkle - an English teaching institute located in Seoul, Korea. The members of the website can share YouTube videos and educational web urls, create discussion topics, and chat within channels or send private messages to other users.

Ultimately I want this website to help children all around the world to:

- build relationships with students of different countries, ethnicities and cultures early on in their lives

- find and connect with life long mentors from all over the world

- find motivation in learning, to become active learners instead of passive ones, to be driven by their own curiosity rather than the pressure imposed to them by grownups

- have opportunity to teach and help other children

- become critical thinkers

- learn to discuss and debate

- have equal opportunity in education

- be able to follow their passions and actually make sure that whichever passion they choose would deliver them the means to make living and be happy.

- have their minds filled with wonder

There's no fixed long term direction for this website other than the above missions. For the past one year since I started this project, all I focused on doing was to listen to my students and my fellow teachers' feedbacks and implementing what they wanted for this website. Now, my kids want to connect with people outside my their country, South Korea, and my primary focus at this point is to make that possible.

Feel free to use this source code anyway you want.
And join us at http://www.twin-kle.com
