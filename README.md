# CP3101B Learning Track

This repo tracks the progress of my CP3101B, i.e. Web Programming, learning process. 

The course consists of 7 labs on different toics + a term project. I will host all labs in this repo, and the term project in a separate repo.

## Lab 1

This lab talks about basic `HTML5`, `CSS3` and some simple `JavaScript`. The lab requires to use multiple `HTML5` tags, and some `CSS` styling. Beyond the requirement, I also added some simple `CSS3` animations and transformation. The live demo is [here](http://cp3101b.comp.nus.edu.sg/~huangda/lab1).

## Lab 2

This lab talks about more on `JavaScript`. The lab requires to develop an online puzzle game interface. In short, the puzzle contains multiple checkpoints that must be visited in a certain order, and all cells except the starting cell must be visited by at most once, while the starting cell must be visited twice. The live demo is [here](http://cp3101b.comp.nus.edu.sg/~huangda/lab2).

**Update**

Lab 2 has been revamped to MVC architecture, and more OOP design.

## Lab 3

This lab talks about `HTML5 canvas`. The lab requires to upgrade the puzzle interface in Lab 2 to a canvas. The live demo is [here](http://cp3101b.comp.nus.edu.sg/~huangda/lab3).

## Lab 4

This lab talks about `PHP` and `AJAX`. The lab requires to make the puzzle interface in Lab 3 into a server-client model. Now the puzzle instance is generated at the server side, as well as its solution. When specific event is triggered, an `Ajax` call will be fired to obtain the result. In this lab, I used `GET` request instead of `POST` since there's nothing to submit. As for security issue, I will look it up later and change the method if this leads to any severe security issue. The live demo is [here](http://cp3101b.comp.nus.edu.sg/~huangda/lab4).

**Note**

I installed `XAMPP` as my localhost. It's an open source (free) and easy-to-use local server that supports `PHP`. Also, to make deployment easier, I coded a small script, `deploy.sh`, to automate the deployment process. Currently, `deploy.sh` will copy the web folder to `xampp/htdocs` and have some necessary configs done (such as file permission change). I will use `deploy.sh` to automate the deployment process to CP3101B server.

## Lab 5

This lab talks about `DataBase`. The lab requires to make the puzzle interface in Lab 4 interacts with a MySQL database. The database should record the best step count and the best solving time for each map. For my application, this requirement is a bit meaningless, since my graph instance are all auto-generated, so it's very unlikely to get an identical graph. The live demo is [here](http://cp3101b.comp.nus.edu.sg/~huangda/lab5).