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
## Phase 4

What I did: Built the stats layer with 5 computed statistics — completion rate by genre, average rating by platform, most 
abandoned genre, backlog growth rate by week, and an overall summary dashboard with total games, hours played and average 
rating.

What got me stuck: This phase went smoothly. The main thing I had to pay attention to was making sure I had actual data in my backlog before testing 

How I solved it: Added several games, updated their statuses to completed and dropped, and added personal ratings before testing the stats page.
## Phase 4 — UI Improvements

What I did: Added status and platform dropdowns to game cards on the search page, and replaced the prompt-based edit system with a real modal featuring a rating slider.

What got me stuck:
1 TypeError: Cannot read properties of null (addEventListener) → Event listeners were being attached to modal elements before the DOM finished loading. Fixed by wrapping all modal event listeners inside a DOMContentLoaded block
2 Duplicate event listeners → When fixing the DOMContentLoaded issue, old event listeners were left above the new block causing them to run twice. Fixed by removing all duplicates and keeping one clean version
3 Modal rendering unstyled at bottom of page → Modal CSS wasn't loading because backlog.css link was missing or modal HTML was in wrong place in the document
4 Dropdown options getting clipped → Game card had overflow: hidden which cut off the dropdown options list. Fixed by changing to overflow: visible
5 Phase 4 commit done late → Some UI improvements were debugged across multiple sessions and the commit came after it should have

How I solved it: 
1 TypeError addEventListener.JS ran before HTML existed. Fixed by wrapping everything in DOMContentLoaded.

2 Duplicate event listeners Old listeners weren't deleted when we added the fix. Fixed by cleaning the whole file and keeping one version.

3 Modal unstyled Missing CSS for the modal select element. Fixed by adding .modal .card-select styles to backlog.css.

4 Dropdown clipped Game card had overflow: hidden cutting off the dropdown. Fixed by changing to overflow: visible.

5 Late commit Debugging ran long across sessions. Committed phase 4 work late but history is still intact.