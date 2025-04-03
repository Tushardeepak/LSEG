# LSEG UI - Chatbot

Here is the deployed link for play around: https://lseg-tushar-deepak.netlify.app/

How to run in local: 

1. Clone the respository in local by running this in local terminal "git clone https://github.com/Tushardeepak/LSEG.git"
2. Head over to cloned project floder and run "npm install"
3. After it finished run "npm start"
4. In browser the app start

Assumptions: 
1. I have made is this chat bot is for 3 stages only (1. Select stock exchange, 2. Select stock name, 3. Get price). If more steps are involved we are extend the current based on that.
2. User only have to select options what is given by bot, No input box for user is added.

Enchanments: 
Performance and scalability wise
1. We can create a current context based on the user selection, so that we will not loop everytime to find needed data.
2. Chats on screen can be optimisly loaded with visualisation technique, This is needed when chats list becomes to huge to render.
3. Cache of similar chat response can also be done, to avoid repeat operations. 

UX wise: 
1. We can show small live stock chart in bot reply messages with current live price.
2. We can save history of chats with current user, and then can categorise it date wise. 
3. We can give search option to user to search over whole chat list. 
