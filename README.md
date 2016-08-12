Streaming Data Experiment 
=========================


Getting Started
--------------

This experiment was forked from experimentr which you can view more of below.
In order to run this experiment you must download [Node](https://github.com/codementum/experimentr/blob/master/public/experimentr.js). 
From there you must run npm install and install all the packages that this experiment requires.
You must also download Redis. 


One you have downloaded all packages and redis you can run: 

redis-server redis.conf

nodemon app.js 

and that should start the app at 'localhost:4000'. 

All of the experiment modules are located in public/modules/conditions/ and are divided into three difficulties. Within each difficulty there is a speed. 

To add or remove pages to the experimentr module go to the index.html page within public/ and add a module. They are listed by folder name. 


Pulling down results 
---------------------

In order to pull down results you should ssh into the the server by using this command 

ssh [enter Ip address here]

You will probably be prompted for a password or a pem. You go into root/StreamingData/analysis  then run the following command 

sh pull.sh 

These results will be saved in the results file. Everytime you pull it will overwrite the old file with the newest data. If you do not wipe clean the database it will contain the results of every experiment run. 

From there you must open a new terminal window and navigate to a folder where you will keep all your results from that folder run the following command 

sftp [enter ip address here]

you will be prompted for a password or a pem. Once you have accessed the server navigate to the following folder:
root/StreamingData/analysis/results 

to pull down the results file run the following command 

get results.json 

you then can exit and the file will be in the appropriate folder. 


 Redis-cli
----------
We rely on redis to save all data from the experiments.  You can download [Redis here](http://redis.io/download). The configuration file is known as redis.conf and the appendonly.aof also is a redis file. 

To start the redis server type: 

'redis-server redis.conf'

To monitor all data coming to the backend type:

'redis-cli monitor'

Look at the documentation to find out more on how to query the database. 


CommonJS
------------

We use browserfiy and watchify to make sure all the modules are loaded correctly. This allows us to keep several core javascript files that are used by all the experiments. These files include General.js and conditionsComponentents.js.

In order to use browserify and watchify you must install globally by typeing 'npm install -g browserify' and 'npm install -g watchify'

Each difficulty level should have its own d_.js and you can make a browserfiy file from that js file. 
An example of this like so: 

'browserify public/modules/conditions/d1/d1.js -o public/modules/conditions/d1/d1Bundle.js'
This command in terminal will create a browserify js file. This will not look for changes so each change you make to those files must be followed by the browserify command. 

To automatically do this you can use watchify. 

'watchify public/modules/conditions/d1/d1.js -o public/modules/conditions/d1/d1Bundle.js'

For more details on browserify check out [their website](http://browserify.org/).

Fore more details on watchify check out [their website](https://github.com/substack/watchify).

Documentation
-------------
For Documentaion we are using jsdocs. It should be installed when 'npm install' is called. The location of all the documentation is the public/out folder. In app.js this is rereouted to be localhost:4000/docs. To add or remove documenation just change it in the js files and then use the following command to load the documenation:

'./node_modules/.bin/jsdoc public/modules/conditions/General.js public/modules/conditions/conditionComponents.js public/modules/conditions/d2/d2.js public/modules/conditions/d1/d1.js'


For more details check out the [jsdocs website](http://usejsdoc.org/). 

Testing
-------------
We are currently working on creating a testing framework. We will be using tape and testling. Check back soon. 

Grunt
------------
To automatically test, bundle, and run the experiments we will be using grunt. Check back soon. 


<img src="https://raw.github.com/codementum/experimentr/master/experimentr-logo.png" title="Experimentr" alt="Experimentr" />
========

Experimentr is a hosting/data-collection backend and module-based frontend for web-based visualization studies.

This repo is a working experiment. The best way to get started is to copy this repo and edit it for your experiment.

Experimentr.js
-------

Experimentr.js is a front-end framework for experiments.

Experiment stages are defined in modules.
Modules consist of a small amount of HTML and Javascript and correspond to one stage of the experiment (such as a post-test).

Experimentr.js also contains several helper functions for experiments, such as timing.
[Check the source](https://github.com/codementum/experimentr/blob/master/public/experimentr.js) for more.

Modules
-------
Experiment modules are defined in `public/modules`.
Here is [an example questionnaire module](https://github.com/codementum/experimentr/blob/master/public/modules/nasa-tlx/).

Modules will be loaded in order using the `experimentr.sequence()` function:

    experimentr.sequence([
      'modules/consent',
      'modules/self-assessment-manikin',
      'modules/emotion-prime-story',
      'modules/demographics',
      'modules/nasa-tlx'
    ]).start();

In some modules the Next button is not needed, so it can be hidden and shown via `experimentr.hideNext()` and `experimentr.showNext()`.

Each module must be unique and cannot be loaded twice in experimentr.sequence().
For example, if you use the same questionnaire as a pre-test and post-test, the same questionnaire HTML must appear in two uniquely named files. 

For example modules, please see [public/modules/](https://github.com/codementum/experimentr/blob/master/public/modules/). 

How Experimentr Works
---
Once experimentr.js loads, it creates a div in `<body>`: `<div id="experimentr">`.
Experimentr then adds three elements to the page:

- ``#experimentr` div: to hold the module and controls
- ``#module` div: holds module content
- ``#control` div: holds controls for the modules

Running the server
--------

Start redis:

    redis-server redis.conf

Run the server:

    node app.js

Then access the page at [localhost:8000](http://localhost:8000).

Installation
-------
## Before-Clone Installation Dependencies:
### Node.js
To find installation instructions for your operating system (Linux, OSX, and Windows), please visit https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
### Redis
**Note:** Redis is _not_ installed through `npm install` and must be installed separately.
Redis can be manually downloaded at redis.io/download. Please note that Windows is not directly supported, however there is an experimental Windows port maintained by Microsoft. If you are on OSX and have `brew` installed, you can install Redis with the following: `brew install redis`.

## Clone and Post-Clone Installation:
- clone this repo
- cd to this repo and run `npm install`

Testing experiments
-------

You can use `debug` as your workerId when testing live experiments to help make sure your data doesn't end up the experiment data.
See [convert.js](https://github.com/codementum/experimentr/blob/master/analysis/src/convert.js#L24) for details.

Another useful trick is to empty the redis database. To do so, run `redis-cli` to get the redis command line prompt, then type `FLUSHDB` to delete all current keys.

More redis commands can be found at [http://redis.io/commands](http://redis.io/commands).
