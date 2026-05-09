## Phase 1

What I did: Set up project structure, installed dependencies, 
got the server running.

What got me stuck:
1 I didnt install npm
2 cannot find module "express" 
3 couldnt push my code since they are all on main

How I solved it:
1 installed npm
2 Node.js was redirected through its path to its place of installation 
3 switched to another main branch called master
## Phase 2

What I did: Connected RAWG API, got game cards showing on screen, and styled them, built the search feature.

What got me stuck:
1 the html wasnt being read in the main page 2 global css wasnt showing on the main page 
the handlers.js uses import but the script tag in the html might be missing type="module" 

How I solved it:
1 change the dir in the server.js to use a const path instead of only app use so the Node.js takes an exact absolute path
had
2 updated the html navbar to wrap the links in a div with class="nav-links" so the css selectors could actually find them.
## Phase 3

What I did: Set up the SQLite database, built all the backend routes (add, get, update, delete), connected the data layer, service layer, and controller layer, and built the backlog page with filter tabs.

What got me stuck:
1 The path and express declarations were in the wrong order causing the server to crash
2 Routes were declared after app.listen so they were unreachable

How I solved it: 
Rewrote the entire server.js in the correct 
order — all requires at the top first, then database setup, then middleware, then all routes, then app.listen last. 
