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