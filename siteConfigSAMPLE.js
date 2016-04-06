//change the name of this file to siteConfig.js

import mysql from 'mysql';
import session from 'client-sessions';

export const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'password', // enter your own mysql password here
    database: 'twinkle',
    supportBigNumbers: true,
    bigNumberStrings: true,
    debug: false
});

export const siteSession = () => session({
	cookieName: 'session',
	secret: 'secret', //enter your own session secret here.
	duration: 365 * 24 * 60 * 60 * 1000,
	activeDuration: 5 * 60 * 1000
})
